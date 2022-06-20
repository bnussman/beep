import { User } from "../generated/graphql";

export type MainNavParamList = {
  Ride: undefined;
  Beep: undefined;
  Settings: undefined;
  MainFindBeepScreen: undefined;
  PickBeepScreen:
    | {
        handlePick: (id: string) => Promise<void>;
        latitude: number;
        longitude: number;
      }
    | undefined;
  Report:
    | {
        id: string;
        name: string;
        beep: string;
      }
    | undefined;
  Rate:
    | {
        id?: string;
        user?: User;
        beep?: string;
      }
    | undefined;
  Profile: { id: string | undefined; beep?: string } | undefined;
  EditProfileScreen: undefined;
  ProfilePhotoScreen: undefined;
  ChangePasswordScreen: undefined;
  RideLogScreen: undefined;
  Register: undefined;
  Main: undefined;
  ForgotPassword: undefined;
  "Choose Beeper": any;
  "Forgot Password": any;
  "Sign Up": any;
};
