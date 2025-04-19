import React, { useMemo } from "react";
import { trpc } from "../utils/trpc";
import { useForm, Controller } from "react-hook-form";
import {
  Link as RouterLink,
  createRoute,
  useNavigate,
} from "@tanstack/react-router";
import { rootRoute } from "../utils/root";
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
  photo: FileList;
}

export function SignUp() {
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    watch,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({ mode: "onChange" });

  const { mutateAsync } = trpc.auth.signup.useMutation({
    onError(errors) {
      if (errors.data?.zodError?.fieldErrors) {
        for (const field in errors.data?.zodError?.fieldErrors) {
          setError(field as keyof SignUpFormValues, {
            message: errors.data?.zodError?.fieldErrors[field]?.[0],
          });
        }
      } else {
        setError("root", { message: errors.message });
      }
    },
  });

  const utils = trpc.useUtils();

  const photo = watch("photo");

  const onSubmit = handleSubmit(async (variables, e) => {
    const formData = new FormData();
    for (const key in variables) {
      if (key === "photo") {
        formData.set(
          key,
          (variables[key as keyof typeof variables] as FileList)[0],
        );
      } else {
        formData.set(key, variables[key as keyof typeof variables] as string);
      }
    }

    const data = await mutateAsync(formData);

    localStorage.setItem("user", JSON.stringify(data));

    utils.user.me.setData(undefined, data.user);

    navigate({ to: "/" });
  });

  const Image = useMemo(
    () => (
      <Avatar
        src={photo?.[0] ? URL.createObjectURL(photo?.[0]) : undefined}
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
          {errors.root?.message && (
            <Alert severity="error">{errors.root.message}</Alert>
          )}
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
                  />
                )}
              />
            </Stack>
            <Stack>
              <label htmlFor="photo">{Image}</label>
              <input hidden id="photo" type="file" {...register("photo")} />
              {errors.photo?.message && (
                <Alert severity="error">{errors.photo.message}</Alert>
              )}
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
              />
            )}
          />
          <Controller
            control={control}
            name="venmo"
            render={({ field, fieldState }) => (
              <TextField
                label="Venmo"
                type="text"
                onChange={field.onChange}
                helperText={fieldState.error?.message}
                error={Boolean(fieldState.error?.message)}
                value={field.value}
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
