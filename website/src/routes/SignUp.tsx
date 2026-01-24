import React, { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { rootRoute } from "../utils/root";
import { orpc } from "../utils/orpc";
import { ORPCError } from "@orpc/client";
import {
  Link as RouterLink,
  createRoute,
  useNavigate,
} from "@tanstack/react-router";
import {
  Alert,
  Avatar,
  Card,
  TextField,
  Link,
  Typography,
  Button,
  Stack,
  Box,
} from "@mui/material";

export const signupRoute = createRoute({
  component: SignUp,
  path: "/signup",
  getParentRoute: () => rootRoute,
});

interface SignUpFormValues {
  first: string;
  last: string;
  username: string;
  password: string;
  email: string;
  venmo: string;
  phone: string;
  photo: File;
}

export function SignUp() {
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({ mode: "onChange" });

  const { mutateAsync } = useMutation(
    orpc.auth.signup.mutationOptions({
      onError(error) {
        if (error instanceof ORPCError && error.data?.issues) {
          for (const issue of error.data?.issues) {
            setError(issue.path[0], {
              message: issue.message,
            });
          }
        } else {
          setError("root", { message: error.message });
        }
      },
    }),
  );

  const queryClient = useQueryClient();

  const photo = watch("photo");

  const onSubmit = handleSubmit(async (variables, e) => {
    const data = await mutateAsync(variables);

    localStorage.setItem("user", JSON.stringify(data));

    queryClient.setQueryData(orpc.user.updates.experimental_liveKey(), data.user);

    navigate({ to: "/" });
  });

  const Image = useMemo(
    () => (
      <Avatar
        src={photo ? URL.createObjectURL(photo) : undefined}
        sx={{ cursor: "pointer", width: 128, height: 128 }}
      />
    ),
    [photo],
  );

  return (
    <Card sx={{ p: 3 }}>
      <form onSubmit={onSubmit}>
        <Stack spacing={2}>
          <Typography variant="h4" fontWeight="bold">
            Sign Up
          </Typography>
          <Stack spacing={1}>
            <Alert severity="info">
              By signing up, you agree to our{" "}
              <Link component={RouterLink} preload="intent" to="/terms">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link component={RouterLink} to="/privacy">
                Privacy Policy
              </Link>
            </Alert>
            {errors.root?.message && (
              <Alert severity="error">{errors.root.message}</Alert>
            )}
            {errors.photo?.message && (
              <Alert severity="error">{errors.photo.message}</Alert>
            )}
          </Stack>
          <Stack direction="row" spacing={2}>
            <Stack spacing={2} flexGrow={1}>
              <Controller
                control={control}
                name="first"
                render={({ field, fieldState }) => (
                  <TextField
                    label="First Name"
                    onChange={field.onChange}
                    helperText={fieldState.error?.message}
                    error={Boolean(fieldState.error?.message)}
                    value={field.value}
                    required
                  />
                )}
              />
              <Controller
                control={control}
                name="last"
                render={({ field, fieldState }) => (
                  <TextField
                    label="Last Name"
                    onChange={field.onChange}
                    helperText={fieldState.error?.message}
                    error={Boolean(fieldState.error?.message)}
                    value={field.value}
                    required
                  />
                )}
              />
            </Stack>
            <Stack>
              <label htmlFor="photo">{Image}</label>
              <Controller
                control={control}
                name="photo"
                render={({ field, fieldState }) =>
                  <input hidden id="photo" type="file" onChange={e => field.onChange(e.target.files?.item(0))} />
                }
              />
            </Stack>
          </Stack>
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <TextField
                label="Email"
                type="email"
                onChange={field.onChange}
                helperText={
                  fieldState.error?.message ??
                  "You must use a .edu to be eligible to use the Beep App"
                }
                error={Boolean(fieldState.error?.message)}
                value={field.value}
                required
              />
            )}
          />
          <Controller
            control={control}
            name="phone"
            render={({ field, fieldState }) => (
              <TextField
                label="Phone Number"
                type="tel"
                onChange={field.onChange}
                helperText={fieldState.error?.message}
                error={Boolean(fieldState.error?.message)}
                value={field.value}
                required
              />
            )}
          />
          <Controller
            control={control}
            name="username"
            render={({ field, fieldState }) => (
              <TextField
                label="Username"
                type="text"
                onChange={field.onChange}
                helperText={fieldState.error?.message}
                error={Boolean(fieldState.error?.message)}
                value={field.value}
                required
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <TextField
                label="Password"
                type="password"
                onChange={field.onChange}
                helperText={fieldState.error?.message}
                error={Boolean(fieldState.error?.message)}
                value={field.value}
                required
              />
            )}
          />
          <Box display="flex" justifyContent="flex-end">
            <Button type="submit" loading={isSubmitting} variant="contained">
              Sign Up
            </Button>
          </Box>
        </Stack>
      </form>
    </Card>
  );
}
