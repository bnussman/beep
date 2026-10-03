import React from "react";
import { RouterInputs } from "../../../api/src";
import { orpc } from "../utils/orpc";
import { ORPCError } from "@orpc/client";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { createFileRoute } from "@tanstack/react-router";
import {
  Alert,
  Avatar,
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  Spinner,
  toast,
  TextField,
  Typography,
} from "@heroui/react";

type Values = RouterInputs["user"]["edit"];

export const Route = createFileRoute('/profile/edit')({
  component: EditProfile,
});

function EditProfile() {
  const { data: user } = useQuery(orpc.user.me.queryOptions({ enabled: false }));

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<Values>({
    defaultValues: {
      first: user?.first,
      last: user?.last,
      email: user?.email,
      phone: user?.phone,
      venmo: user?.venmo,
      cashapp: user?.cashapp,
    },
    values: user
      ? {
          first: user.first,
          last: user.last,
          email: user.email,
          phone: user.phone,
          venmo: user.venmo,
          cashapp: user.cashapp,
        }
      : undefined,
  });

  const { mutateAsync } = useMutation(orpc.user.edit.mutationOptions({
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
  }));

  const {
    mutateAsync: uploadPicture,
    isPending: isUploadPending,
    error: uploadError,
  } = useMutation(orpc.user.updatePicture.mutationOptions({
    onSuccess() {
      toast.success("Successfully updated profile picture", { timeout: 5_000 });
    },
    onError(error) {
      toast.danger(error.message, { timeout: 5_000 });
    }
  }));

  const onSubmit = handleSubmit(async (variables) => {
    await mutateAsync(variables);

    toast.success("Successfully updated profile", { timeout: 5_000 });
  });

  const uploadPhoto = async (picture: File | undefined) => {
    if (picture) {
      uploadPicture(picture);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex grow items-center justify-center">
      <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <Typography type="h1">Edit Profile</Typography>
        {errors.root?.message && (
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{errors.root.message}</Alert.Title>
            </Alert.Content>
          </Alert>
        )}
        {isUploadPending && (
          <div className="flex items-center gap-2 text-sm" role="status">
            <Spinner size="sm" />
            Uploading profile picture
          </div>
        )}
        {uploadError && (
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{uploadError.message}</Alert.Title>
            </Alert.Content>
          </Alert>
        )}
        <div className="flex flex-row items-center gap-4">
          <div className="flex grow flex-col gap-4">
            <Controller
              control={control}
              name="first"
              render={({ field, fieldState }) => (
                <TextField {...field} isInvalid={fieldState.error ? true : undefined}>
                  <Label>First Name</Label>
                  <Input />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </TextField>
              )}
            />
            <Controller
              control={control}
              name="last"
              render={({ field, fieldState }) => (
                <TextField {...field} isInvalid={fieldState.error ? true : undefined}>
                  <Label>Last Name</Label>
                  <Input />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </TextField>
              )}
            />
          </div>
          <input
            accept="image/*"
            className="sr-only"
            id="photo"
            onChange={(event) => uploadPhoto(event.target.files?.[0])}
            type="file"
          />
          <label htmlFor="photo" className="cursor-pointer">
            <Avatar size="lg" variant="soft" className="size-32 rounded-full">
              <Avatar.Image alt={`${user.first} ${user.last}`} src={user.photo ?? undefined} className="object-contain" />
              <Avatar.Fallback>{user.first.at(0)?.toUpperCase()}{user.last.at(0)?.toUpperCase()}</Avatar.Fallback>
            </Avatar>
          </label>
        </div>
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <TextField {...field} type="email" isInvalid={fieldState.error ? true : undefined}>
              <Label>Email</Label>
              <Input />
              <Description>
                {(fieldState.error?.message ?? user.isEmailVerified)
                  ? user.isStudent
                    ? "Your email is verified and you are a student"
                    : "Your email is verified"
                  : "Your email is not verified"}
              </Description>
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field, fieldState }) => (
            <TextField {...field} type="tel" isInvalid={fieldState.error ? true : undefined}>
              <Label>Phone</Label>
              <Input />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />
        <Controller
          control={control}
          name="venmo"
          render={({ field, fieldState }) => (
            <TextField {...field} value={field.value ?? ""} isInvalid={fieldState.error ? true : undefined}>
              <Label>Venmo</Label>
              <Input />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />
        <Controller
          control={control}
          name="cashapp"
          render={({ field, fieldState }) => (
            <TextField {...field} value={field.value ?? ""} isInvalid={fieldState.error ? true : undefined}>
              <Label>Cash App</Label>
              <Input />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" isPending={isSubmitting} isDisabled={!isDirty}>
            Save Profile
          </Button>
        </div>
      </Form>
    </div>
  );
}
