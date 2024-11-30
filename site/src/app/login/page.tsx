'use client';
import Form from 'next/form'
import { login } from './actions';
import { useActionState } from 'react';
import { Alert, Button, Card, Stack, TextField } from '@mui/material';

export default function Login() {
  const [error, formAction] = useActionState(login, { message: '' });

  return (
    <Card sx={{ p: 2 }}>
      <Form action={formAction}>
        <Stack spacing={2}>
          {error?.message && <Alert severity="error">{error.message}</Alert>}
          <TextField label="Username or Email" name="username" />
          <TextField label="Password" name="password" type="password" />
          <Button variant="contained" type="submit">Login</Button>
        </Stack>
      </Form>
    </Card>
  );
}