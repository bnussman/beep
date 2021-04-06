import { useContext, useEffect } from 'react';
import {gql, useMutation} from '@apollo/client';
import {Error} from '../components/Error';
import {Success} from '../components/Success';
import {UserContext} from '../UserContext';
import {VerifyAccountMutation} from '../generated/graphql';

const VerifyAccountGraphQL = gql`
    mutation VerifyAccount($id: String!) {
        verifyAccount(id: $id)
    }
`;

function VerifyAccount({ match }) {
    const user = useContext(UserContext);
    const id = match.params.id;
    const [verify, {data, loading, error}] = useMutation<VerifyAccountMutation>(VerifyAccountGraphQL);
    
    async function handleVerify(): Promise<void> {
        try {
            await verify({ variables: {
                id: id
            }});
        }
        catch(error) {
            console.error(error);
        }
    }

    useEffect(() => {
        handleVerify();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="px-4 mx-auto lg:container">
            {loading && "Loading"}
            {data && <Success message="Successfully verified email" />}
            {error && <Error error={error}/>}
        </div>
    );
}

export default VerifyAccount;
