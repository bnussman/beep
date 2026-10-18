import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useMutation } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { FieldError, TextField } from "heroui-native";

export default function ChangePasswordScreen() {
  const {
    control,
    handleSubmit,
    reset,
    setFocus,
    getValues,
    formState: { isValid },
  } = useForm({
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const { mutateAsync: changePassword, isPending } = useMutation(
    orpc.auth.changePassword.mutationOptions({
      onSuccess() {
        alert("Successfully changed password.");
        reset();
      },
      onError(error) {
        alert(error.message);
      },
    }),
  );

  const onSubmit = handleSubmit(({ password }) => changePassword({ password }));

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ padding: 16, gap: 8 }}
      scrollEnabled={false}
    >
      <Controller
        control={control}
        name="password"
        rules={{ required: "Password is required" }}
        render={({ field: { onBlur, onChange, ref, value }, fieldState }) => (
          <TextField isInvalid={!!fieldState.error}>
            <Label htmlFor="password1">New Password</Label>
            <Input
              id="password1"
              ref={ref}
              secureTextEntry
              textContentType="newPassword"
              placeholder="New Password"
              onBlur={onBlur}
              onChangeText={onChange}
              onSubmitEditing={() => setFocus("confirmPassword")}
              returnKeyType="next"
              value={value}
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          required: "Please repeat your password",
          validate: (value) =>
            value === getValues("password") || "Passwords did not match.",
        }}
        render={({ field: { onBlur, onChange, ref, value }, fieldState }) => (
          <TextField isInvalid={!!fieldState.error}>
            <Label htmlFor="password2">Repeat Password</Label>
            <Input
              id="password2"
              ref={ref}
              secureTextEntry
              textContentType="newPassword"
              placeholder="Confirm Password"
              onBlur={onBlur}
              onChangeText={onChange}
              onSubmitEditing={() => onSubmit()}
              returnKeyType="go"
              value={value}
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />
      <Button
        onPress={() => onSubmit()}
        isDisabled={!isValid}
        isLoading={isPending}
      >
        Change Password
      </Button>
    </KeyboardAwareScrollView>
  );
}
