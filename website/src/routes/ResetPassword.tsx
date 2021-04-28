import { gql, useMutation } from '@apollo/client';
import React, { FormEvent, useState } from 'react';
import { TextInput } from '../components/Input';
import {ResetPasswordMutation} from '../generated/graphql';
import { Error } from '../components/Error';
import {Success} from '../components/Success';

const Reset = gql`
    mutation ResetPassword($id: String!, $password: String!) {
        resetPassword(id: $id, password: $password)
    }
`;

function ResetPassword({ match }) {
    const id = match.params.id;
    const [password, setPassword] = useState<string>("");
    const [reset, {data, loading, error}] = useMutation<ResetPasswordMutation>(Reset);
    
    async function handleResetPassword(e: FormEvent): Promise<void> {
        e.preventDefault();
        try {
            await reset({ variables: { id: id, password: password }});
        }
        catch (error) {
            //...
        }
    }

    return (
        <div className="px-4 mx-auto lg:container">
            {loading && <p>Loading</p>}
            {error && <Error error={error}/>}
            {data && <Success message="Successfully changed password"/>}
            <form onSubmit={handleResetPassword}>
                <label className="font-bold text-gray-500" htmlFor="password">
                    New Password
                </label>
                <TextInput
                    className="mb-4"
                    id="password"
                    type="password"
                    autoComplete="password"
                    placeholder="Password"
                    onChange={(value: any) => setPassword(value.target.value)}
                    disabled={data?.resetPassword}
                />
                <button 
                    type="submit"
                    disabled={data?.resetPassword}
                    className={data?.resetPassword ? "px-4 py-2 mb-4 font-bold text-white bg-gray-700 rounded shadow hover:bg-gray-700 focus:shadow-outline focus:outline-none" : "px-4 py-2 mb-4 font-bold text-white bg-yellow-400 rounded shadow hover:bg-yellow-400 focus:shadow-outline focus:outline-none"}
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
}

export default ResetPassword;
