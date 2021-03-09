import React, { useEffect } from 'react';
import { Heading1 } from '../components/Typography';
import {gql, useMutation} from '@apollo/client';

const VerifyAccountGraphQL = gql`
    mutation VerifyAccount($id: String!) {
        verifyAccount(id: $id)
    }
`;

function VerifyAccount({ match }) {
    const id = match.params.id;
    const [verify, {data, loading, error}] = useMutation(VerifyAccountGraphQL);
    
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
            {data ? 
                <div role="alert" className={data ? "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" : "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" }>
                    {data && "Success"}
                    {error && error}
                </div>
                :
                <Heading1>Loading</Heading1>
            }
        </div>
    );
}

export default VerifyAccount;
