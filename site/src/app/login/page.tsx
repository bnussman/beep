'use client';
import Form from 'next/form'
import { login } from './actions';
import { useActionState } from 'react';
import { Button, Card, Stack, TextField } from '@mui/material';

export default function Login() {
  const [error, formAction] = useActionState(login, { message: '' });

  return (
    <Card sx={{ p: 2 }}>
      <Form action={formAction}>
        <Stack spacing={2}>
          {error?.message && <p>{error.message}</p>}
          <TextField label="Username or Email" name="username" />
          <TextField label="Password" name="password" type="password" />
          <Button variant="contained" type="submit">Login</Button>
        </Stack>
      </Form>
    </Card>
  );
}