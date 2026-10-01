import React, { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { orpc } from "../utils/orpc";
import { Person } from "@gravity-ui/icons";
import { ORPCError } from "@orpc/client";
import {
  Link as RouterLink,
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";
import { Alert, Avatar, Button, Description, FieldError, Form, Input, Label, TextField, Typography } from "@heroui/react";

export const Route = createFileRoute("/signup")({
  component: SignUp,
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

function SignUp() {
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    watch,
    setError,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    mode: "onChange",
    defaultValues: {
      first: "",
      last: "",
      username: "",
      password: "",
      email: "",
      phone: "",
    },
  });

  const { mutate, isPending } = useMutation(
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
      onSuccess(data) {
        localStorage.setItem("user", JSON.stringify(data));

        queryClient.setQueryData(orpc.user.me.queryKey(), data.user);

        navigate({ to: "/" });
      },
    }),
  );

  const queryClient = useQueryClient();

  const photo = watch("photo");

  const onSubmit = handleSubmit(async (variables) => {
    mutate(variables);
  });

  const Image = useMemo(
    () =>
       (
      <Avatar size="lg" variant="soft" className="w-32 h-32 cursor-pointer rounded-full">
        <Avatar.Image src={photo ? URL.createObjectURL(photo) : undefined} />
        <Avatar.Fallback>
          <Person width={32} height={32} />
        </Avatar.Fallback>
      </Avatar>
    ),
    [photo],
  );

  return (
    <div className="flex flex-grow items-center justify-center">
      <Form className="flex w-full max-w-xl flex-col gap-5" onSubmit={onSubmit}>
        <Typography type="h1">Sign Up</Typography>
        <Alert status="accent">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Agreements and Policies</Alert.Title>
            <Alert.Description>
              By signing up, you agree to our{" "}
              <RouterLink className="underline underline-offset-2" preload="intent" to="/terms">
                Terms of Service
              </RouterLink>{" "}
              and{" "}
              <RouterLink className="underline underline-offset-2" to="/privacy">
                Privacy Policy
              </RouterLink>
              .
            </Alert.Description>
          </Alert.Content>
        </Alert>
        {errors.root?.message && (
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{errors.root.message}</Alert.Title>
            </Alert.Content>
          </Alert>
        )}
        <div className="flex flex-row gap-6 items-center">
          <div className="flex flex-col gap-4 flex-grow">
            <Controller
              control={control}
              name="first"
              render={({ field, fieldState }) => (
                <TextField {...field} isRequired isInvalid={fieldState.error ? true : undefined}>
                  <Label>First Name</Label>
                  <Input type="text" />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </TextField>
              )}
            />
            <Controller
              control={control}
              name="last"
              render={({ field, fieldState }) => (
                <TextField {...field} isRequired isInvalid={fieldState.error ? true : undefined}>
                  <Label>Last Name</Label>
                  <Input type="text" />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </TextField>
              )}
            />
          </div>
          <Controller
            control={control}
            name="photo"
            render={({ field, fieldState }) => (
              <div className="flex flex-col items-center gap-2">
                <input
                  accept="image/*"
                  className="sr-only"
                  id="photo"
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={(event) => field.onChange(event.target.files?.item(0))}
                  ref={field.ref}
                  type="file"
                />
                <label htmlFor="photo">{Image}</label>
                <FieldError>{fieldState.error?.message}</FieldError>
              </div>
            )}
          />
        </div>
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <TextField type="email" isRequired isInvalid={fieldState.error ? true : undefined}>
              <Label>Email</Label>
              <Input />
              <Description>
                You must use a .edu to be eligible to use the Beep App
              </Description>
              <FieldError>
                {fieldState.error?.message}
              </FieldError>
            </TextField>
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field, fieldState }) => (
            <TextField {...field} isRequired isInvalid={fieldState.error ? true : undefined}>
              <Label>Phone Number</Label>
              <Input type="tel" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />
        <Controller
          control={control}
          name="username"
          render={({ field, fieldState }) => (
            <TextField {...field} isRequired isInvalid={fieldState.error ? true : undefined}>
              <Label>Username</Label>
              <Input type="text" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <TextField {...field} minLength={6} isRequired isInvalid={fieldState.error ? true : undefined}>
              <Label>Password</Label>
              <Input type="password" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" isPending={isPending}>
            Sign Up
          </Button>
        </div>
      </Form>
    </div>
  );
}
