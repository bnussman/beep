import { User } from "../generated/graphql";

export type MainNavParamList = {
  Ratings: undefined;
  Beeps: undefined;
  Ride: undefined;
  Beep: undefined;
  PickBeepScreen: { handlePick: (id: string) => Promise<void>; latitude: number; longitude: number; } | undefined;
  Report: { id: string; user?: User; name: string; beep: string; } | undefined;
  Rate: { id?: string; user?: User; beep?: string; } | undefined;
  Profile: { id: string | undefined; beep?: string } | undefined;
  EditProfileScreen: undefined;
  ProfilePhotoScreen: undefined;
  "Edit Profile": undefined;
  "Change Password": undefined;
  Register: undefined;
  Main: undefined;
  ForgotPassword: undefined;
  "Choose Beeper": any;
  "Forgot Password": any;
  "Sign Up": any;
};
