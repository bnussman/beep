import { NavLink, useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Card } from '../../../components/Card';
import { gql, useMutation, useQuery } from '@apollo/client';
import { DeleteRatingMutation, GetRatingQuery } from '../../../generated/graphql';
import React from "react";
import { Avatar, Heading, Text, Box, Button } from "@chakra-ui/react";
import { printStars } from ".";

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
    const { id } = useParams<{ id: string }>();
    const { data, loading, error } = useQuery<GetRatingQuery>(GetRating, { variables: { id: id } });
    const [deleteRating, { loading: deleteLoading }] = useMutation<DeleteRatingMutation>(DeleteRating);
    const history = useHistory();

    async function doDeleteRating() {
        await deleteRating({ variables: { id: id } });
        history.goBack();
    }

    return (
        <Box>
            <Heading>Rating</Heading>
            {loading && <p>Loading</p>}
            {error && error.message}

            {data?.getRating ?
                <>
                    <div>
                        <Card>
                            <div>
                                <Heading>Rater</Heading>
                                <div>
                                    <Avatar src={data.getRating.rater.photoUrl} name={data.getRating.rater.name} />
                                    <NavLink to={`/admin/users/${data.getRating.rater.id}`}>
                                        {data.getRating.rater.name}
                                    </NavLink>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div>
                                <Heading>Rated</Heading>
                                <div>
                                    <Avatar src={data.getRating.rated.photoUrl} name={data.getRating.rated.name} />
                                    <NavLink to={`/admin/users/${data.getRating.rated.id}`}>
                                        {data.getRating.rated.name}
                                    </NavLink>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <Card>
                        <div>
                            <Heading>Stars</Heading>
                            <Text>{printStars(data.getRating.stars)} {data.getRating.stars}</Text>
                        </div>
                    </Card>
                    <Card>
                        <Heading>Message</Heading>
                        <Text>{data.getRating.message}</Text>
                    </Card>
                    <Card>
                        <Heading>Created</Heading>
                        <Text>{dayjs().to(data.getRating.timestamp)}</Text>
                    </Card>
                    {data.getRating.beep &&
                        <Card>
                            <Heading>Associated Beep Event</Heading>
                            <NavLink to={`/admin/beeps/${data.getRating.beep.id}`}>
                                {data.getRating.beep.id}
                            </NavLink>
                        </Card>
                    }
                    <Button onClick={() => doDeleteRating()}>{!deleteLoading ? "Delete Rating" : "Deleteing..."}</Button>
                </>
                :
                <Heading>Loading</Heading>
            }
        </Box>
    );
}

export default RatingPage;
