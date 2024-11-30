'use client';
import Form from 'next/form'
import { login } from './actions';
import { useActionState } from 'react';

export default function Login() {
    const [error, formAction] = useActionState(login, { message: '' });

    return (
        <Form action={formAction}>
          {error?.message && <p>{error.message}</p>}
          <input name="username" />
          <input name="password" type="password" />
          <button type="submit">Login</button>
        </Form>
    );
}