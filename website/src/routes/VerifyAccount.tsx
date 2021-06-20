import { useEffect } from 'react';
import {gql, useMutation} from '@apollo/client';
import {Error} from '../components/Error';
import {Success} from '../components/Success';
import {VerifyAccountMutation} from '../generated/graphql';
import React from 'react';

const VerifyAccountGraphQL = gql`
    mutation VerifyAccount($id: String!) {
        verifyAccount(id: $id)
    }
`;

function VerifyAccount({ match }) {
    const id = match.params.id;
    const [verify, {data, loading, error}] = useMutation<VerifyAccountMutation>(VerifyAccountGraphQL);
    
    async function handleVerify(): Promise<void> {
        try {
            await verify({
                variables: {
                    id: id
                },
                refetchQueries: () => ["GetUserData"]
            });
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
        <div>
            {loading && "Loading"}
            {data && <Success message="Successfully verified email" />}
            {error && <Error error={error}/>}
        </div>
    );
}

export default VerifyAccount;
