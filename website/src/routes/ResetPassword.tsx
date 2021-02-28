import { gql, useMutation } from '@apollo/client';
import React, { FormEvent, useState } from 'react';
import {ResetPasswordMutation} from '../generated/graphql';

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
        await reset({ variables: { id: id, password: password }});
    }

    return (
        <div className="lg:container px-4 mx-auto">
            {loading && <p>Loading</p>}
            {error && error.message}
            {data && <p>Success</p>}
            <form onSubmit={handleResetPassword}>
                <label className="text-gray-500 font-bold" htmlFor="password">
                    New Password
                </label>
                <input
                    className="mb-4 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
                    id="password"
                    type="password"
                    autoComplete="password"
                    placeholder="Password"
                    onChange={(value) => setPassword(value.target.value)}
                    disabled={data?.resetPassword}
                />
                <button 
                    type="submit"
                    disabled={data?.resetPassword}
                    className={data?.resetPassword ? "mb-4 shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed" : "mb-4 shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" }
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
}

export default ResetPassword;
