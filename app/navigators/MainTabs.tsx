export type MainNavParamList = {
  Ratings: undefined;
  Beeps: undefined;
  Ride: undefined;
  Beep: undefined;
  PickBeepScreen:
    | {
        handlePick: (id: string) => Promise<void>;
      }
    | undefined;
  Report: { userId: string; beepId: string } | undefined;
  Rate: { userId: string; beepId: string } | undefined;
  Profile: { id: string; beepId?: string };
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
  Cars: any;
  "Add Car": any;
  Changelog: undefined;
  Feedback: undefined;
  Premium: undefined;
};
