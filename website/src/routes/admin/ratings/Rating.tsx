import { NavLink, useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Heading3, Body1, Heading5, Heading1 } from '../../../components/Typography';
import { Button } from '../../../components/Input';
import {Card} from '../../../components/Card';
import {gql, useMutation, useQuery} from '@apollo/client';
import {DeleteRatingMutation, GetRatingQuery} from '../../../generated/graphql';
import {printStars} from ".";

dayjs.extend(relativeTime);

const DeleteRating = gql`
    mutation DeleteRating($id: String!) {
        deleteRating(id: $id)
    }
`;

const GetRating = gql`
    query GetRating($id: String!) {
        getRating(id: $id) {
            id
            message
            stars
            timestamp
            beep {
                id
            }
            rater {
                id
                name
                photoUrl
                username
            }
            rated {
                id
                name
                photoUrl
                username
            }
        }
    }
`;

function RatingPage() {
    const { id } = useParams<{id: string}>();
    const { data, loading, error } = useQuery<GetRatingQuery>(GetRating, { variables: { id: id }});
    const [deleteRating, { loading: deleteLoading }] = useMutation<DeleteRatingMutation>(DeleteRating);
    const history = useHistory();

    async function doDeleteRating() {
        await deleteRating({ variables: { id: id } });
        history.goBack();
    }

    return (
        <>
        <Heading3>Rating</Heading3>
        {loading && <p>Loading</p>}
        {error && error.message}

        {data?.getRating ?
            <>
                <div className="flex flex-wrap">
                    <Card>
                        <div className="m-4">
                            <Heading5>Rater</Heading5>
                            <div className="flex flex-row items-center">
                                {data.getRating.rater.photoUrl && (
                                    <div className="flex mr-3">
                                        <img className="w-10 h-10 rounded-full shadow-lg" src={data.getRating.rater.photoUrl} alt={`${data.getRating.rater.name}`}></img>
                                    </div>
                                )}
                                <NavLink to={`/admin/users/${data.getRating.rater.id}`}>
                                    {data.getRating.rater.name}
                                </NavLink>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="m-4">
                            <Heading5>Rated</Heading5>
                            <div className="flex flex-row items-center">
                                {data.getRating.rated.photoUrl && (
                                    <div className="flex mr-3">
                                        <img className="w-10 h-10 rounded-full shadow-lg" src={data.getRating.rated.photoUrl} alt={`${data.getRating.rated.name}`}></img>
                                    </div>
                                )}
                                <NavLink to={`/admin/users/${data.getRating.rated.id}`}>
                                    {data.getRating.rated.name}
                                </NavLink>
                            </div>
                        </div>
                    </Card>
                </div>
                <Card>
                    <div className="m-4">
                        <Heading5>Stars</Heading5>
                        <Body1>{printStars(data.getRating.stars)} {data.getRating.stars}</Body1>  
                    </div>
                </Card>
                <Card>
                    <div className="m-4">
                        <Heading5>Message</Heading5>
                        <Body1>{data.getRating.message}</Body1>  
                    </div>
                </Card>
                <Card>
                    <div className="m-4">
                        <Heading5>Created</Heading5>
                        <Body1>{dayjs().to(data.getRating.timestamp)}</Body1>  
                    </div>
                </Card>
                {data.getRating.beep &&
                <Card>
                    <div className="m-4">
                        <Heading5>Associated Beep Event</Heading5>
                        <NavLink to={`/admin/beeps/${data.getRating.beep.id}`}>
                            {data.getRating.beep.id}  
                        </NavLink>
                    </div>
                </Card>
                }
                <div className="mt-8">
                    <Button onClick={() => doDeleteRating()} className="text-white bg-red-500 hover:bg-red-700">{!deleteLoading ? "Delete Rating" : "Deleteing..."}</Button>
                </div>
        </>
        :
        <Heading1>Loading</Heading1>
        }
    </>
)}

export default RatingPage;
