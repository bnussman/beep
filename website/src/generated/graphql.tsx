import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Auth = {
  __typename?: 'Auth';
  user: User;
  tokens: TokenEntry;
};

export type Beep = {
  __typename?: 'Beep';
  id: Scalars['String'];
  beeper: User;
  rider: User;
  origin: Scalars['String'];
  destination: Scalars['String'];
  groupSize: Scalars['Float'];
  start: Scalars['DateTime'];
  end: Scalars['DateTime'];
};

export type BeepHistoryResponse = {
  __typename?: 'BeepHistoryResponse';
  items: Array<Beep>;
  count: Scalars['Int'];
};

export type BeeperSettingsInput = {
  singlesRate?: Maybe<Scalars['Float']>;
  groupRate?: Maybe<Scalars['Float']>;
  capacity?: Maybe<Scalars['Float']>;
  isBeeping?: Maybe<Scalars['Boolean']>;
  masksRequired?: Maybe<Scalars['Boolean']>;
};

export type BeepsResponse = {
  __typename?: 'BeepsResponse';
  items: Array<Beep>;
  count: Scalars['Int'];
};


export type EditAccountInput = {
  first: Scalars['String'];
  last: Scalars['String'];
  email: Scalars['String'];
  phone: Scalars['String'];
  venmo?: Maybe<Scalars['String']>;
  cashapp?: Maybe<Scalars['String']>;
};

export type EditUserValidator = {
  first?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  venmo?: Maybe<Scalars['String']>;
  cashapp?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  isBeeping?: Maybe<Scalars['Boolean']>;
  isEmailVerified?: Maybe<Scalars['Boolean']>;
  isStudent?: Maybe<Scalars['Boolean']>;
  groupRate?: Maybe<Scalars['Float']>;
  singlesRate?: Maybe<Scalars['Float']>;
  capacity?: Maybe<Scalars['Float']>;
  masksRequired?: Maybe<Scalars['Boolean']>;
  queueSize?: Maybe<Scalars['Float']>;
  role?: Maybe<Scalars['String']>;
  pushToken?: Maybe<Scalars['String']>;
  photoUrl?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

export type ForgotPassword = {
  __typename?: 'ForgotPassword';
  id: Scalars['String'];
  user: User;
  time: Scalars['DateTime'];
};

export type GetBeepInput = {
  origin: Scalars['String'];
  destination: Scalars['String'];
  groupSize: Scalars['Float'];
};

export type Location = {
  __typename?: 'Location';
  id: Scalars['String'];
  user: User;
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  altitude: Scalars['Float'];
  accuracy?: Maybe<Scalars['Float']>;
  altitudeAccuracy?: Maybe<Scalars['Float']>;
  heading: Scalars['Float'];
  speed: Scalars['Float'];
  timestamp: Scalars['DateTime'];
};

export type LocationInput = {
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  altitude: Scalars['Float'];
  accuracy?: Maybe<Scalars['Float']>;
  altitideAccuracy?: Maybe<Scalars['Float']>;
  heading: Scalars['Float'];
  speed: Scalars['Float'];
};

export type LoginInput = {
  username: Scalars['String'];
  password: Scalars['String'];
  pushToken?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  editAccount: User;
  changePassword: Scalars['Boolean'];
  updatePushToken: Scalars['Boolean'];
  verifyAccount: Scalars['Boolean'];
  resendEmailVarification: Scalars['Boolean'];
  deleteAccount: Scalars['Boolean'];
  addProfilePicture: User;
  login: Auth;
  signup: Auth;
  logout: Scalars['Boolean'];
  removeToken: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  resetPassword: Scalars['Boolean'];
  setBeeperStatus: Scalars['Boolean'];
  setBeeperQueue: Scalars['Boolean'];
  deleteBeep: Scalars['Boolean'];
  insertLocation: Scalars['Boolean'];
  rateUser: Scalars['Boolean'];
  deleteRating: Scalars['Boolean'];
  reportUser: Scalars['Boolean'];
  updateReport: Report;
  deleteReport: Scalars['Boolean'];
  chooseBeep: QueueEntry;
  riderLeaveQueue: Scalars['Boolean'];
  removeUser: Scalars['Boolean'];
  editUser: User;
};


export type MutationEditAccountArgs = {
  input: EditAccountInput;
};


export type MutationChangePasswordArgs = {
  password: Scalars['String'];
};


export type MutationUpdatePushTokenArgs = {
  pushToken: Scalars['String'];
};


export type MutationVerifyAccountArgs = {
  id: Scalars['String'];
};


export type MutationAddProfilePictureArgs = {
  picture: Scalars['Upload'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationSignupArgs = {
  input: SignUpInput;
};


export type MutationLogoutArgs = {
  isApp?: Maybe<Scalars['Boolean']>;
};


export type MutationRemoveTokenArgs = {
  token: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  password: Scalars['String'];
  id: Scalars['String'];
};


export type MutationSetBeeperStatusArgs = {
  input: BeeperSettingsInput;
};


export type MutationSetBeeperQueueArgs = {
  input: UpdateQueueEntryInput;
};


export type MutationDeleteBeepArgs = {
  id: Scalars['String'];
};


export type MutationInsertLocationArgs = {
  location: LocationInput;
};


export type MutationRateUserArgs = {
  input: RatingInput;
};


export type MutationDeleteRatingArgs = {
  id: Scalars['String'];
};


export type MutationReportUserArgs = {
  input: ReportInput;
};


export type MutationUpdateReportArgs = {
  input: UpdateReportInput;
  id: Scalars['String'];
};


export type MutationDeleteReportArgs = {
  id: Scalars['String'];
};


export type MutationChooseBeepArgs = {
  input: GetBeepInput;
  beeperId: Scalars['String'];
};


export type MutationRemoveUserArgs = {
  id: Scalars['String'];
};


export type MutationEditUserArgs = {
  data: EditUserValidator;
  id: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getBeeps: BeepsResponse;
  getBeep: Beep;
  getETA: Scalars['String'];
  getLocationSuggestions: Array<Suggestion>;
  getRatings: RatingsResponse;
  getRating: Rating;
  getReports: ReportsResponse;
  getReport: Report;
  findBeep: User;
  getRiderStatus?: Maybe<QueueEntry>;
  getBeeperList: Array<User>;
  getLastBeepToRate?: Maybe<Beep>;
  getUser: User;
  getUsers: UsersResponse;
  getRideHistory: RideHistoryResponse;
  getBeepHistory: BeepHistoryResponse;
  getQueue: Array<QueueEntry>;
};


export type QueryGetBeepsArgs = {
  offset?: Maybe<Scalars['Int']>;
  show?: Maybe<Scalars['Int']>;
};


export type QueryGetBeepArgs = {
  id: Scalars['String'];
};


export type QueryGetEtaArgs = {
  end: Scalars['String'];
  start: Scalars['String'];
};


export type QueryGetLocationSuggestionsArgs = {
  sessiontoken: Scalars['String'];
  location: Scalars['String'];
};


export type QueryGetRatingsArgs = {
  me?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['String']>;
  offset?: Maybe<Scalars['Int']>;
  show?: Maybe<Scalars['Int']>;
};


export type QueryGetRatingArgs = {
  id: Scalars['String'];
};


export type QueryGetReportsArgs = {
  offset?: Maybe<Scalars['Int']>;
  show?: Maybe<Scalars['Int']>;
};


export type QueryGetReportArgs = {
  id: Scalars['String'];
};


export type QueryGetUserArgs = {
  id?: Maybe<Scalars['String']>;
};


export type QueryGetUsersArgs = {
  offset?: Maybe<Scalars['Int']>;
  show?: Maybe<Scalars['Int']>;
};


export type QueryGetRideHistoryArgs = {
  id?: Maybe<Scalars['String']>;
  offset?: Maybe<Scalars['Int']>;
  show?: Maybe<Scalars['Int']>;
};


export type QueryGetBeepHistoryArgs = {
  id?: Maybe<Scalars['String']>;
  offset?: Maybe<Scalars['Int']>;
  show?: Maybe<Scalars['Int']>;
};


export type QueryGetQueueArgs = {
  id?: Maybe<Scalars['String']>;
};

export type QueueEntry = {
  __typename?: 'QueueEntry';
  id: Scalars['String'];
  origin: Scalars['String'];
  destination: Scalars['String'];
  state: Scalars['Float'];
  isAccepted: Scalars['Boolean'];
  groupSize: Scalars['Float'];
  start: Scalars['Float'];
  beeper: User;
  rider: User;
  ridersQueuePosition: Scalars['Float'];
  location?: Maybe<Location>;
};

export type Rating = {
  __typename?: 'Rating';
  id: Scalars['String'];
  rater: User;
  rated: User;
  stars: Scalars['Float'];
  message?: Maybe<Scalars['String']>;
  timestamp: Scalars['DateTime'];
  beep: Beep;
};

export type RatingInput = {
  userId: Scalars['String'];
  stars: Scalars['Float'];
  message?: Maybe<Scalars['String']>;
  beepId?: Maybe<Scalars['String']>;
};

export type RatingsResponse = {
  __typename?: 'RatingsResponse';
  items: Array<Rating>;
  count: Scalars['Int'];
};

export type Report = {
  __typename?: 'Report';
  id: Scalars['String'];
  reporter: User;
  reported: User;
  handledBy?: Maybe<User>;
  reason: Scalars['String'];
  notes?: Maybe<Scalars['String']>;
  timestamp: Scalars['DateTime'];
  handled: Scalars['Boolean'];
  beep?: Maybe<Beep>;
};

export type ReportInput = {
  userId: Scalars['String'];
  reason: Scalars['String'];
  beepId?: Maybe<Scalars['String']>;
};

export type ReportsResponse = {
  __typename?: 'ReportsResponse';
  items: Array<Report>;
  count: Scalars['Int'];
};

export type RideHistoryResponse = {
  __typename?: 'RideHistoryResponse';
  items: Array<Beep>;
  count: Scalars['Int'];
};

export type SignUpInput = {
  username: Scalars['String'];
  first: Scalars['String'];
  last: Scalars['String'];
  phone: Scalars['String'];
  email: Scalars['String'];
  venmo?: Maybe<Scalars['String']>;
  cashapp?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  pushToken?: Maybe<Scalars['String']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  getBeeperUpdates: Array<QueueEntry>;
  getLocationUpdates?: Maybe<Location>;
  getRiderUpdates?: Maybe<QueueEntry>;
  getUserUpdates: User;
};


export type SubscriptionGetBeeperUpdatesArgs = {
  topic: Scalars['String'];
};


export type SubscriptionGetLocationUpdatesArgs = {
  topic: Scalars['String'];
};


export type SubscriptionGetRiderUpdatesArgs = {
  topic: Scalars['String'];
};


export type SubscriptionGetUserUpdatesArgs = {
  topic: Scalars['String'];
};

export type Suggestion = {
  __typename?: 'Suggestion';
  title: Scalars['String'];
};

export type TokenEntry = {
  __typename?: 'TokenEntry';
  id: Scalars['String'];
  tokenid: Scalars['String'];
  user: User;
};

export type UpdateQueueEntryInput = {
  value: Scalars['String'];
  riderId: Scalars['String'];
  queueId: Scalars['String'];
};

export type UpdateReportInput = {
  handled?: Maybe<Scalars['Boolean']>;
  notes?: Maybe<Scalars['String']>;
};


export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  first: Scalars['String'];
  last: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
  phone: Scalars['String'];
  venmo?: Maybe<Scalars['String']>;
  cashapp?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  isBeeping: Scalars['Boolean'];
  isEmailVerified: Scalars['Boolean'];
  isStudent: Scalars['Boolean'];
  groupRate: Scalars['Float'];
  singlesRate: Scalars['Float'];
  capacity: Scalars['Float'];
  masksRequired: Scalars['Boolean'];
  queueSize: Scalars['Float'];
  rating?: Maybe<Scalars['Float']>;
  role: Scalars['String'];
  pushToken?: Maybe<Scalars['String']>;
  photoUrl?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  location?: Maybe<Location>;
  queue: Array<QueueEntry>;
  ratings: Array<Rating>;
};

export type UsersResponse = {
  __typename?: 'UsersResponse';
  items: Array<User>;
  count: Scalars['Int'];
};

export type VerifyEmail = {
  __typename?: 'VerifyEmail';
  id: Scalars['String'];
  user: User;
  time: Scalars['DateTime'];
  email: Scalars['String'];
};

export type GetUserDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserDataQuery = (
  { __typename?: 'Query' }
  & { getUser: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name' | 'first' | 'last' | 'email' | 'phone' | 'venmo' | 'isBeeping' | 'isEmailVerified' | 'isStudent' | 'groupRate' | 'singlesRate' | 'photoUrl' | 'capacity' | 'masksRequired' | 'username' | 'role' | 'cashapp'>
  ) }
);

export type UserUpdatesSubscriptionVariables = Exact<{
  topic: Scalars['String'];
}>;


export type UserUpdatesSubscription = (
  { __typename?: 'Subscription' }
  & { getUserUpdates: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name' | 'first' | 'last' | 'email' | 'phone' | 'venmo' | 'isBeeping' | 'isEmailVerified' | 'isStudent' | 'groupRate' | 'singlesRate' | 'photoUrl' | 'capacity' | 'masksRequired' | 'username' | 'role' | 'cashapp'>
  ) }
);

export type ResendEmailMutationVariables = Exact<{ [key: string]: never; }>;


export type ResendEmailMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'resendEmailVarification'>
);

export type GetBeeperHistoryQueryVariables = Exact<{
  show?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
}>;


export type GetBeeperHistoryQuery = (
  { __typename?: 'Query' }
  & { getBeepHistory: (
    { __typename?: 'BeepHistoryResponse' }
    & Pick<BeepHistoryResponse, 'count'>
    & { items: Array<(
      { __typename?: 'Beep' }
      & Pick<Beep, 'id' | 'origin' | 'destination' | 'start' | 'end' | 'groupSize'>
      & { rider: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'photoUrl' | 'username' | 'first' | 'last' | 'name'>
      ) }
    )> }
  ) }
);

export type GetQueueQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetQueueQuery = (
  { __typename?: 'Query' }
  & { getQueue: Array<(
    { __typename?: 'QueueEntry' }
    & Pick<QueueEntry, 'id' | 'origin' | 'destination' | 'start' | 'groupSize' | 'isAccepted' | 'state'>
    & { rider: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'photoUrl' | 'username' | 'first' | 'last' | 'name'>
    ) }
  )> }
);

export type GetRideHistoryQueryVariables = Exact<{
  id: Scalars['String'];
  show?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
}>;


export type GetRideHistoryQuery = (
  { __typename?: 'Query' }
  & { getRideHistory: (
    { __typename?: 'RideHistoryResponse' }
    & Pick<RideHistoryResponse, 'count'>
    & { items: Array<(
      { __typename?: 'Beep' }
      & Pick<Beep, 'id' | 'origin' | 'destination' | 'start' | 'end' | 'groupSize'>
      & { beeper: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'photoUrl' | 'username' | 'first' | 'last' | 'name'>
      ) }
    )> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RemoveUserMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type RemoveUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'removeUser'>
);

export type ChangePasswordMutationVariables = Exact<{
  password: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'changePassword'>
);

export type EditAccountMutationVariables = Exact<{
  first: Scalars['String'];
  last: Scalars['String'];
  email: Scalars['String'];
  phone: Scalars['String'];
  venmo?: Maybe<Scalars['String']>;
  cashapp?: Maybe<Scalars['String']>;
}>;


export type EditAccountMutation = (
  { __typename?: 'Mutation' }
  & { editAccount: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name'>
  ) }
);

export type AddProfilePictureMutationVariables = Exact<{
  picture: Scalars['Upload'];
}>;


export type AddProfilePictureMutation = (
  { __typename?: 'Mutation' }
  & { addProfilePicture: (
    { __typename?: 'User' }
    & Pick<User, 'photoUrl'>
  ) }
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'Auth' }
    & { tokens: (
      { __typename?: 'TokenEntry' }
      & Pick<TokenEntry, 'id' | 'tokenid'>
    ) }
  ) }
);

export type ResetPasswordMutationVariables = Exact<{
  id: Scalars['String'];
  password: Scalars['String'];
}>;


export type ResetPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'resetPassword'>
);

export type SignUpMutationVariables = Exact<{
  first: Scalars['String'];
  last: Scalars['String'];
  email: Scalars['String'];
  phone: Scalars['String'];
  venmo?: Maybe<Scalars['String']>;
  cashapp?: Maybe<Scalars['String']>;
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignUpMutation = (
  { __typename?: 'Mutation' }
  & { signup: (
    { __typename?: 'Auth' }
    & { tokens: (
      { __typename?: 'TokenEntry' }
      & Pick<TokenEntry, 'id' | 'tokenid'>
    ) }
  ) }
);

export type VerifyAccountMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type VerifyAccountMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'verifyAccount'>
);

export type GetBeepersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBeepersQuery = (
  { __typename?: 'Query' }
  & { getBeeperList: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'photoUrl' | 'singlesRate' | 'groupRate' | 'capacity' | 'isStudent' | 'first' | 'last' | 'queueSize' | 'masksRequired'>
  )> }
);

export type DeleteBeepMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteBeepMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteBeep'>
);

export type GetBeepQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetBeepQuery = (
  { __typename?: 'Query' }
  & { getBeep: (
    { __typename?: 'Beep' }
    & Pick<Beep, 'id' | 'origin' | 'destination' | 'start' | 'end' | 'groupSize'>
    & { beeper: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'first' | 'last' | 'photoUrl' | 'username'>
    ), rider: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'first' | 'last' | 'photoUrl' | 'username'>
    ) }
  ) }
);

export type GetBeepsQueryVariables = Exact<{
  show?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
}>;


export type GetBeepsQuery = (
  { __typename?: 'Query' }
  & { getBeeps: (
    { __typename?: 'BeepsResponse' }
    & Pick<BeepsResponse, 'count'>
    & { items: Array<(
      { __typename?: 'Beep' }
      & Pick<Beep, 'id' | 'origin' | 'destination' | 'start' | 'end' | 'groupSize'>
      & { beeper: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'first' | 'last' | 'photoUrl' | 'username'>
      ), rider: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'first' | 'last' | 'photoUrl' | 'username'>
      ) }
    )> }
  ) }
);

export type DeleteRatingMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteRatingMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteRating'>
);

export type GetRatingQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetRatingQuery = (
  { __typename?: 'Query' }
  & { getRating: (
    { __typename?: 'Rating' }
    & Pick<Rating, 'id' | 'message' | 'stars' | 'timestamp'>
    & { beep: (
      { __typename?: 'Beep' }
      & Pick<Beep, 'id'>
    ), rater: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'name' | 'photoUrl' | 'username'>
    ), rated: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'name' | 'photoUrl' | 'username'>
    ) }
  ) }
);

export type GetRatingsQueryVariables = Exact<{
  show?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
}>;


export type GetRatingsQuery = (
  { __typename?: 'Query' }
  & { getRatings: (
    { __typename?: 'RatingsResponse' }
    & Pick<RatingsResponse, 'count'>
    & { items: Array<(
      { __typename?: 'Rating' }
      & Pick<Rating, 'id' | 'timestamp' | 'message' | 'stars'>
      & { rater: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'first' | 'last' | 'photoUrl' | 'username'>
      ), rated: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'first' | 'last' | 'photoUrl' | 'username'>
      ) }
    )> }
  ) }
);

export type DeleteReportMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteReportMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteReport'>
);

export type UpdateReportMutationVariables = Exact<{
  id: Scalars['String'];
  notes?: Maybe<Scalars['String']>;
  handled?: Maybe<Scalars['Boolean']>;
}>;


export type UpdateReportMutation = (
  { __typename?: 'Mutation' }
  & { updateReport: (
    { __typename?: 'Report' }
    & Pick<Report, 'id'>
  ) }
);

export type GetReportQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetReportQuery = (
  { __typename?: 'Query' }
  & { getReport: (
    { __typename?: 'Report' }
    & Pick<Report, 'id' | 'reason' | 'timestamp' | 'handled' | 'notes'>
    & { beep?: Maybe<(
      { __typename?: 'Beep' }
      & Pick<Beep, 'id'>
    )>, reporter: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'first' | 'last' | 'photoUrl' | 'username'>
    ), reported: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'first' | 'last' | 'photoUrl' | 'username'>
    ), handledBy?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'first' | 'last' | 'photoUrl' | 'username'>
    )> }
  ) }
);

export type GetReportsQueryVariables = Exact<{
  show?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
}>;


export type GetReportsQuery = (
  { __typename?: 'Query' }
  & { getReports: (
    { __typename?: 'ReportsResponse' }
    & Pick<ReportsResponse, 'count'>
    & { items: Array<(
      { __typename?: 'Report' }
      & Pick<Report, 'id' | 'timestamp' | 'reason' | 'notes' | 'handled'>
      & { reporter: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'first' | 'last' | 'photoUrl' | 'username'>
      ), reported: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'first' | 'last' | 'photoUrl' | 'username'>
      ) }
    )> }
  ) }
);

export type GetEditableUserQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetEditableUserQuery = (
  { __typename?: 'Query' }
  & { getUser: (
    { __typename?: 'User' }
    & Pick<User, 'first' | 'last' | 'isBeeping' | 'isStudent' | 'isEmailVerified' | 'role' | 'venmo' | 'singlesRate' | 'groupRate' | 'capacity' | 'masksRequired' | 'photoUrl' | 'queueSize' | 'phone' | 'username' | 'email' | 'cashapp' | 'pushToken'>
  ) }
);

export type EditUserMutationVariables = Exact<{
  id: Scalars['String'];
  data: EditUserValidator;
}>;


export type EditUserMutation = (
  { __typename?: 'Mutation' }
  & { editUser: (
    { __typename?: 'User' }
    & Pick<User, 'username'>
  ) }
);

export type GetUserQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetUserQuery = (
  { __typename?: 'Query' }
  & { getUser: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'first' | 'last' | 'isBeeping' | 'isStudent' | 'role' | 'venmo' | 'singlesRate' | 'groupRate' | 'capacity' | 'masksRequired' | 'photoUrl' | 'queueSize' | 'phone' | 'username' | 'rating'>
  ) }
);

export type GetUsersQueryVariables = Exact<{
  show?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
}>;


export type GetUsersQuery = (
  { __typename?: 'Query' }
  & { getUsers: (
    { __typename?: 'UsersResponse' }
    & Pick<UsersResponse, 'count'>
    & { items: Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'photoUrl' | 'first' | 'last' | 'email' | 'isStudent' | 'isEmailVerified' | 'username' | 'phone' | 'isBeeping'>
    )> }
  ) }
);


export const GetUserDataDocument = gql`
    query GetUserData {
  getUser {
    id
    name
    first
    last
    email
    phone
    venmo
    isBeeping
    isEmailVerified
    isStudent
    groupRate
    singlesRate
    photoUrl
    capacity
    masksRequired
    username
    role
    cashapp
  }
}
    `;

/**
 * __useGetUserDataQuery__
 *
 * To run a query within a React component, call `useGetUserDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserDataQuery(baseOptions?: Apollo.QueryHookOptions<GetUserDataQuery, GetUserDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserDataQuery, GetUserDataQueryVariables>(GetUserDataDocument, options);
      }
export function useGetUserDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserDataQuery, GetUserDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserDataQuery, GetUserDataQueryVariables>(GetUserDataDocument, options);
        }
export type GetUserDataQueryHookResult = ReturnType<typeof useGetUserDataQuery>;
export type GetUserDataLazyQueryHookResult = ReturnType<typeof useGetUserDataLazyQuery>;
export type GetUserDataQueryResult = Apollo.QueryResult<GetUserDataQuery, GetUserDataQueryVariables>;
export const UserUpdatesDocument = gql`
    subscription UserUpdates($topic: String!) {
  getUserUpdates(topic: $topic) {
    id
    name
    first
    last
    email
    phone
    venmo
    isBeeping
    isEmailVerified
    isStudent
    groupRate
    singlesRate
    photoUrl
    capacity
    masksRequired
    username
    role
    cashapp
  }
}
    `;

/**
 * __useUserUpdatesSubscription__
 *
 * To run a query within a React component, call `useUserUpdatesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useUserUpdatesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserUpdatesSubscription({
 *   variables: {
 *      topic: // value for 'topic'
 *   },
 * });
 */
export function useUserUpdatesSubscription(baseOptions: Apollo.SubscriptionHookOptions<UserUpdatesSubscription, UserUpdatesSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<UserUpdatesSubscription, UserUpdatesSubscriptionVariables>(UserUpdatesDocument, options);
      }
export type UserUpdatesSubscriptionHookResult = ReturnType<typeof useUserUpdatesSubscription>;
export type UserUpdatesSubscriptionResult = Apollo.SubscriptionResult<UserUpdatesSubscription>;
export const ResendEmailDocument = gql`
    mutation ResendEmail {
  resendEmailVarification
}
    `;
export type ResendEmailMutationFn = Apollo.MutationFunction<ResendEmailMutation, ResendEmailMutationVariables>;

/**
 * __useResendEmailMutation__
 *
 * To run a mutation, you first call `useResendEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResendEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resendEmailMutation, { data, loading, error }] = useResendEmailMutation({
 *   variables: {
 *   },
 * });
 */
export function useResendEmailMutation(baseOptions?: Apollo.MutationHookOptions<ResendEmailMutation, ResendEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResendEmailMutation, ResendEmailMutationVariables>(ResendEmailDocument, options);
      }
export type ResendEmailMutationHookResult = ReturnType<typeof useResendEmailMutation>;
export type ResendEmailMutationResult = Apollo.MutationResult<ResendEmailMutation>;
export type ResendEmailMutationOptions = Apollo.BaseMutationOptions<ResendEmailMutation, ResendEmailMutationVariables>;
export const GetBeeperHistoryDocument = gql`
    query GetBeeperHistory($show: Int, $offset: Int, $id: String!) {
  getBeepHistory(show: $show, offset: $offset, id: $id) {
    items {
      id
      origin
      destination
      start
      end
      groupSize
      rider {
        id
        photoUrl
        username
        first
        last
        name
      }
    }
    count
  }
}
    `;

/**
 * __useGetBeeperHistoryQuery__
 *
 * To run a query within a React component, call `useGetBeeperHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBeeperHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBeeperHistoryQuery({
 *   variables: {
 *      show: // value for 'show'
 *      offset: // value for 'offset'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetBeeperHistoryQuery(baseOptions: Apollo.QueryHookOptions<GetBeeperHistoryQuery, GetBeeperHistoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBeeperHistoryQuery, GetBeeperHistoryQueryVariables>(GetBeeperHistoryDocument, options);
      }
export function useGetBeeperHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBeeperHistoryQuery, GetBeeperHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBeeperHistoryQuery, GetBeeperHistoryQueryVariables>(GetBeeperHistoryDocument, options);
        }
export type GetBeeperHistoryQueryHookResult = ReturnType<typeof useGetBeeperHistoryQuery>;
export type GetBeeperHistoryLazyQueryHookResult = ReturnType<typeof useGetBeeperHistoryLazyQuery>;
export type GetBeeperHistoryQueryResult = Apollo.QueryResult<GetBeeperHistoryQuery, GetBeeperHistoryQueryVariables>;
export const GetQueueDocument = gql`
    query GetQueue($id: String!) {
  getQueue(id: $id) {
    id
    origin
    destination
    start
    groupSize
    isAccepted
    state
    rider {
      id
      photoUrl
      username
      first
      last
      name
    }
  }
}
    `;

/**
 * __useGetQueueQuery__
 *
 * To run a query within a React component, call `useGetQueueQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetQueueQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetQueueQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetQueueQuery(baseOptions: Apollo.QueryHookOptions<GetQueueQuery, GetQueueQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetQueueQuery, GetQueueQueryVariables>(GetQueueDocument, options);
      }
export function useGetQueueLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetQueueQuery, GetQueueQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetQueueQuery, GetQueueQueryVariables>(GetQueueDocument, options);
        }
export type GetQueueQueryHookResult = ReturnType<typeof useGetQueueQuery>;
export type GetQueueLazyQueryHookResult = ReturnType<typeof useGetQueueLazyQuery>;
export type GetQueueQueryResult = Apollo.QueryResult<GetQueueQuery, GetQueueQueryVariables>;
export const GetRideHistoryDocument = gql`
    query GetRideHistory($id: String!, $show: Int, $offset: Int) {
  getRideHistory(id: $id, show: $show, offset: $offset) {
    items {
      id
      origin
      destination
      start
      end
      groupSize
      beeper {
        id
        photoUrl
        username
        first
        last
        name
      }
    }
    count
  }
}
    `;

/**
 * __useGetRideHistoryQuery__
 *
 * To run a query within a React component, call `useGetRideHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRideHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRideHistoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *      show: // value for 'show'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetRideHistoryQuery(baseOptions: Apollo.QueryHookOptions<GetRideHistoryQuery, GetRideHistoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRideHistoryQuery, GetRideHistoryQueryVariables>(GetRideHistoryDocument, options);
      }
export function useGetRideHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRideHistoryQuery, GetRideHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRideHistoryQuery, GetRideHistoryQueryVariables>(GetRideHistoryDocument, options);
        }
export type GetRideHistoryQueryHookResult = ReturnType<typeof useGetRideHistoryQuery>;
export type GetRideHistoryLazyQueryHookResult = ReturnType<typeof useGetRideHistoryLazyQuery>;
export type GetRideHistoryQueryResult = Apollo.QueryResult<GetRideHistoryQuery, GetRideHistoryQueryVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout(isApp: false)
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RemoveUserDocument = gql`
    mutation RemoveUser($id: String!) {
  removeUser(id: $id)
}
    `;
export type RemoveUserMutationFn = Apollo.MutationFunction<RemoveUserMutation, RemoveUserMutationVariables>;

/**
 * __useRemoveUserMutation__
 *
 * To run a mutation, you first call `useRemoveUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeUserMutation, { data, loading, error }] = useRemoveUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveUserMutation(baseOptions?: Apollo.MutationHookOptions<RemoveUserMutation, RemoveUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveUserMutation, RemoveUserMutationVariables>(RemoveUserDocument, options);
      }
export type RemoveUserMutationHookResult = ReturnType<typeof useRemoveUserMutation>;
export type RemoveUserMutationResult = Apollo.MutationResult<RemoveUserMutation>;
export type RemoveUserMutationOptions = Apollo.BaseMutationOptions<RemoveUserMutation, RemoveUserMutationVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($password: String!) {
  changePassword(password: $password)
}
    `;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      password: // value for 'password'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const EditAccountDocument = gql`
    mutation EditAccount($first: String!, $last: String!, $email: String!, $phone: String!, $venmo: String, $cashapp: String) {
  editAccount(
    input: {first: $first, last: $last, email: $email, phone: $phone, venmo: $venmo, cashapp: $cashapp}
  ) {
    id
    name
  }
}
    `;
export type EditAccountMutationFn = Apollo.MutationFunction<EditAccountMutation, EditAccountMutationVariables>;

/**
 * __useEditAccountMutation__
 *
 * To run a mutation, you first call `useEditAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editAccountMutation, { data, loading, error }] = useEditAccountMutation({
 *   variables: {
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      email: // value for 'email'
 *      phone: // value for 'phone'
 *      venmo: // value for 'venmo'
 *      cashapp: // value for 'cashapp'
 *   },
 * });
 */
export function useEditAccountMutation(baseOptions?: Apollo.MutationHookOptions<EditAccountMutation, EditAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditAccountMutation, EditAccountMutationVariables>(EditAccountDocument, options);
      }
export type EditAccountMutationHookResult = ReturnType<typeof useEditAccountMutation>;
export type EditAccountMutationResult = Apollo.MutationResult<EditAccountMutation>;
export type EditAccountMutationOptions = Apollo.BaseMutationOptions<EditAccountMutation, EditAccountMutationVariables>;
export const AddProfilePictureDocument = gql`
    mutation AddProfilePicture($picture: Upload!) {
  addProfilePicture(picture: $picture) {
    photoUrl
  }
}
    `;
export type AddProfilePictureMutationFn = Apollo.MutationFunction<AddProfilePictureMutation, AddProfilePictureMutationVariables>;

/**
 * __useAddProfilePictureMutation__
 *
 * To run a mutation, you first call `useAddProfilePictureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddProfilePictureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addProfilePictureMutation, { data, loading, error }] = useAddProfilePictureMutation({
 *   variables: {
 *      picture: // value for 'picture'
 *   },
 * });
 */
export function useAddProfilePictureMutation(baseOptions?: Apollo.MutationHookOptions<AddProfilePictureMutation, AddProfilePictureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddProfilePictureMutation, AddProfilePictureMutationVariables>(AddProfilePictureDocument, options);
      }
export type AddProfilePictureMutationHookResult = ReturnType<typeof useAddProfilePictureMutation>;
export type AddProfilePictureMutationResult = Apollo.MutationResult<AddProfilePictureMutation>;
export type AddProfilePictureMutationOptions = Apollo.BaseMutationOptions<AddProfilePictureMutation, AddProfilePictureMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, options);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(input: {username: $username, password: $password}) {
    tokens {
      id
      tokenid
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation ResetPassword($id: String!, $password: String!) {
  resetPassword(id: $id, password: $password)
}
    `;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      id: // value for 'id'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const SignUpDocument = gql`
    mutation SignUp($first: String!, $last: String!, $email: String!, $phone: String!, $venmo: String, $cashapp: String, $username: String!, $password: String!) {
  signup(
    input: {first: $first, last: $last, email: $email, phone: $phone, venmo: $venmo, cashapp: $cashapp, username: $username, password: $password}
  ) {
    tokens {
      id
      tokenid
    }
  }
}
    `;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      email: // value for 'email'
 *      phone: // value for 'phone'
 *      venmo: // value for 'venmo'
 *      cashapp: // value for 'cashapp'
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const VerifyAccountDocument = gql`
    mutation VerifyAccount($id: String!) {
  verifyAccount(id: $id)
}
    `;
export type VerifyAccountMutationFn = Apollo.MutationFunction<VerifyAccountMutation, VerifyAccountMutationVariables>;

/**
 * __useVerifyAccountMutation__
 *
 * To run a mutation, you first call `useVerifyAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyAccountMutation, { data, loading, error }] = useVerifyAccountMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useVerifyAccountMutation(baseOptions?: Apollo.MutationHookOptions<VerifyAccountMutation, VerifyAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifyAccountMutation, VerifyAccountMutationVariables>(VerifyAccountDocument, options);
      }
export type VerifyAccountMutationHookResult = ReturnType<typeof useVerifyAccountMutation>;
export type VerifyAccountMutationResult = Apollo.MutationResult<VerifyAccountMutation>;
export type VerifyAccountMutationOptions = Apollo.BaseMutationOptions<VerifyAccountMutation, VerifyAccountMutationVariables>;
export const GetBeepersDocument = gql`
    query GetBeepers {
  getBeeperList {
    id
    username
    photoUrl
    singlesRate
    groupRate
    capacity
    isStudent
    first
    last
    queueSize
    masksRequired
  }
}
    `;

/**
 * __useGetBeepersQuery__
 *
 * To run a query within a React component, call `useGetBeepersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBeepersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBeepersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBeepersQuery(baseOptions?: Apollo.QueryHookOptions<GetBeepersQuery, GetBeepersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBeepersQuery, GetBeepersQueryVariables>(GetBeepersDocument, options);
      }
export function useGetBeepersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBeepersQuery, GetBeepersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBeepersQuery, GetBeepersQueryVariables>(GetBeepersDocument, options);
        }
export type GetBeepersQueryHookResult = ReturnType<typeof useGetBeepersQuery>;
export type GetBeepersLazyQueryHookResult = ReturnType<typeof useGetBeepersLazyQuery>;
export type GetBeepersQueryResult = Apollo.QueryResult<GetBeepersQuery, GetBeepersQueryVariables>;
export const DeleteBeepDocument = gql`
    mutation DeleteBeep($id: String!) {
  deleteBeep(id: $id)
}
    `;
export type DeleteBeepMutationFn = Apollo.MutationFunction<DeleteBeepMutation, DeleteBeepMutationVariables>;

/**
 * __useDeleteBeepMutation__
 *
 * To run a mutation, you first call `useDeleteBeepMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBeepMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBeepMutation, { data, loading, error }] = useDeleteBeepMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteBeepMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBeepMutation, DeleteBeepMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBeepMutation, DeleteBeepMutationVariables>(DeleteBeepDocument, options);
      }
export type DeleteBeepMutationHookResult = ReturnType<typeof useDeleteBeepMutation>;
export type DeleteBeepMutationResult = Apollo.MutationResult<DeleteBeepMutation>;
export type DeleteBeepMutationOptions = Apollo.BaseMutationOptions<DeleteBeepMutation, DeleteBeepMutationVariables>;
export const GetBeepDocument = gql`
    query GetBeep($id: String!) {
  getBeep(id: $id) {
    id
    origin
    destination
    start
    end
    groupSize
    beeper {
      id
      first
      last
      photoUrl
      username
    }
    rider {
      id
      first
      last
      photoUrl
      username
    }
  }
}
    `;

/**
 * __useGetBeepQuery__
 *
 * To run a query within a React component, call `useGetBeepQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBeepQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBeepQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetBeepQuery(baseOptions: Apollo.QueryHookOptions<GetBeepQuery, GetBeepQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBeepQuery, GetBeepQueryVariables>(GetBeepDocument, options);
      }
export function useGetBeepLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBeepQuery, GetBeepQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBeepQuery, GetBeepQueryVariables>(GetBeepDocument, options);
        }
export type GetBeepQueryHookResult = ReturnType<typeof useGetBeepQuery>;
export type GetBeepLazyQueryHookResult = ReturnType<typeof useGetBeepLazyQuery>;
export type GetBeepQueryResult = Apollo.QueryResult<GetBeepQuery, GetBeepQueryVariables>;
export const GetBeepsDocument = gql`
    query getBeeps($show: Int, $offset: Int) {
  getBeeps(show: $show, offset: $offset) {
    items {
      id
      origin
      destination
      start
      end
      groupSize
      beeper {
        id
        first
        last
        photoUrl
        username
      }
      rider {
        id
        first
        last
        photoUrl
        username
      }
    }
    count
  }
}
    `;

/**
 * __useGetBeepsQuery__
 *
 * To run a query within a React component, call `useGetBeepsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBeepsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBeepsQuery({
 *   variables: {
 *      show: // value for 'show'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetBeepsQuery(baseOptions?: Apollo.QueryHookOptions<GetBeepsQuery, GetBeepsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBeepsQuery, GetBeepsQueryVariables>(GetBeepsDocument, options);
      }
export function useGetBeepsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBeepsQuery, GetBeepsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBeepsQuery, GetBeepsQueryVariables>(GetBeepsDocument, options);
        }
export type GetBeepsQueryHookResult = ReturnType<typeof useGetBeepsQuery>;
export type GetBeepsLazyQueryHookResult = ReturnType<typeof useGetBeepsLazyQuery>;
export type GetBeepsQueryResult = Apollo.QueryResult<GetBeepsQuery, GetBeepsQueryVariables>;
export const DeleteRatingDocument = gql`
    mutation DeleteRating($id: String!) {
  deleteRating(id: $id)
}
    `;
export type DeleteRatingMutationFn = Apollo.MutationFunction<DeleteRatingMutation, DeleteRatingMutationVariables>;

/**
 * __useDeleteRatingMutation__
 *
 * To run a mutation, you first call `useDeleteRatingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRatingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRatingMutation, { data, loading, error }] = useDeleteRatingMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteRatingMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRatingMutation, DeleteRatingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteRatingMutation, DeleteRatingMutationVariables>(DeleteRatingDocument, options);
      }
export type DeleteRatingMutationHookResult = ReturnType<typeof useDeleteRatingMutation>;
export type DeleteRatingMutationResult = Apollo.MutationResult<DeleteRatingMutation>;
export type DeleteRatingMutationOptions = Apollo.BaseMutationOptions<DeleteRatingMutation, DeleteRatingMutationVariables>;
export const GetRatingDocument = gql`
    query GetRating($id: String!) {
  getRating(id: $id) {
    id
    message
    stars
    timestamp
    beep {
      id
    }
    rater {
      id
      name
      photoUrl
      username
    }
    rated {
      id
      name
      photoUrl
      username
    }
  }
}
    `;

/**
 * __useGetRatingQuery__
 *
 * To run a query within a React component, call `useGetRatingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRatingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRatingQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetRatingQuery(baseOptions: Apollo.QueryHookOptions<GetRatingQuery, GetRatingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRatingQuery, GetRatingQueryVariables>(GetRatingDocument, options);
      }
export function useGetRatingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRatingQuery, GetRatingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRatingQuery, GetRatingQueryVariables>(GetRatingDocument, options);
        }
export type GetRatingQueryHookResult = ReturnType<typeof useGetRatingQuery>;
export type GetRatingLazyQueryHookResult = ReturnType<typeof useGetRatingLazyQuery>;
export type GetRatingQueryResult = Apollo.QueryResult<GetRatingQuery, GetRatingQueryVariables>;
export const GetRatingsDocument = gql`
    query getRatings($show: Int, $offset: Int) {
  getRatings(show: $show, offset: $offset) {
    items {
      id
      timestamp
      message
      stars
      rater {
        id
        first
        last
        photoUrl
        username
      }
      rated {
        id
        first
        last
        photoUrl
        username
      }
    }
    count
  }
}
    `;

/**
 * __useGetRatingsQuery__
 *
 * To run a query within a React component, call `useGetRatingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRatingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRatingsQuery({
 *   variables: {
 *      show: // value for 'show'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetRatingsQuery(baseOptions?: Apollo.QueryHookOptions<GetRatingsQuery, GetRatingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRatingsQuery, GetRatingsQueryVariables>(GetRatingsDocument, options);
      }
export function useGetRatingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRatingsQuery, GetRatingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRatingsQuery, GetRatingsQueryVariables>(GetRatingsDocument, options);
        }
export type GetRatingsQueryHookResult = ReturnType<typeof useGetRatingsQuery>;
export type GetRatingsLazyQueryHookResult = ReturnType<typeof useGetRatingsLazyQuery>;
export type GetRatingsQueryResult = Apollo.QueryResult<GetRatingsQuery, GetRatingsQueryVariables>;
export const DeleteReportDocument = gql`
    mutation DeleteReport($id: String!) {
  deleteReport(id: $id)
}
    `;
export type DeleteReportMutationFn = Apollo.MutationFunction<DeleteReportMutation, DeleteReportMutationVariables>;

/**
 * __useDeleteReportMutation__
 *
 * To run a mutation, you first call `useDeleteReportMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteReportMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteReportMutation, { data, loading, error }] = useDeleteReportMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteReportMutation(baseOptions?: Apollo.MutationHookOptions<DeleteReportMutation, DeleteReportMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteReportMutation, DeleteReportMutationVariables>(DeleteReportDocument, options);
      }
export type DeleteReportMutationHookResult = ReturnType<typeof useDeleteReportMutation>;
export type DeleteReportMutationResult = Apollo.MutationResult<DeleteReportMutation>;
export type DeleteReportMutationOptions = Apollo.BaseMutationOptions<DeleteReportMutation, DeleteReportMutationVariables>;
export const UpdateReportDocument = gql`
    mutation UpdateReport($id: String!, $notes: String, $handled: Boolean) {
  updateReport(id: $id, input: {notes: $notes, handled: $handled}) {
    id
  }
}
    `;
export type UpdateReportMutationFn = Apollo.MutationFunction<UpdateReportMutation, UpdateReportMutationVariables>;

/**
 * __useUpdateReportMutation__
 *
 * To run a mutation, you first call `useUpdateReportMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateReportMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateReportMutation, { data, loading, error }] = useUpdateReportMutation({
 *   variables: {
 *      id: // value for 'id'
 *      notes: // value for 'notes'
 *      handled: // value for 'handled'
 *   },
 * });
 */
export function useUpdateReportMutation(baseOptions?: Apollo.MutationHookOptions<UpdateReportMutation, UpdateReportMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateReportMutation, UpdateReportMutationVariables>(UpdateReportDocument, options);
      }
export type UpdateReportMutationHookResult = ReturnType<typeof useUpdateReportMutation>;
export type UpdateReportMutationResult = Apollo.MutationResult<UpdateReportMutation>;
export type UpdateReportMutationOptions = Apollo.BaseMutationOptions<UpdateReportMutation, UpdateReportMutationVariables>;
export const GetReportDocument = gql`
    query GetReport($id: String!) {
  getReport(id: $id) {
    id
    reason
    timestamp
    handled
    notes
    beep {
      id
    }
    reporter {
      id
      first
      last
      photoUrl
      username
    }
    reported {
      id
      first
      last
      photoUrl
      username
    }
    handledBy {
      id
      first
      last
      photoUrl
      username
    }
  }
}
    `;

/**
 * __useGetReportQuery__
 *
 * To run a query within a React component, call `useGetReportQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReportQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetReportQuery(baseOptions: Apollo.QueryHookOptions<GetReportQuery, GetReportQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetReportQuery, GetReportQueryVariables>(GetReportDocument, options);
      }
export function useGetReportLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetReportQuery, GetReportQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetReportQuery, GetReportQueryVariables>(GetReportDocument, options);
        }
export type GetReportQueryHookResult = ReturnType<typeof useGetReportQuery>;
export type GetReportLazyQueryHookResult = ReturnType<typeof useGetReportLazyQuery>;
export type GetReportQueryResult = Apollo.QueryResult<GetReportQuery, GetReportQueryVariables>;
export const GetReportsDocument = gql`
    query getReports($show: Int, $offset: Int) {
  getReports(show: $show, offset: $offset) {
    items {
      id
      timestamp
      reason
      notes
      handled
      reporter {
        id
        first
        last
        photoUrl
        username
      }
      reported {
        id
        first
        last
        photoUrl
        username
      }
    }
    count
  }
}
    `;

/**
 * __useGetReportsQuery__
 *
 * To run a query within a React component, call `useGetReportsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReportsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReportsQuery({
 *   variables: {
 *      show: // value for 'show'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetReportsQuery(baseOptions?: Apollo.QueryHookOptions<GetReportsQuery, GetReportsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetReportsQuery, GetReportsQueryVariables>(GetReportsDocument, options);
      }
export function useGetReportsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetReportsQuery, GetReportsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetReportsQuery, GetReportsQueryVariables>(GetReportsDocument, options);
        }
export type GetReportsQueryHookResult = ReturnType<typeof useGetReportsQuery>;
export type GetReportsLazyQueryHookResult = ReturnType<typeof useGetReportsLazyQuery>;
export type GetReportsQueryResult = Apollo.QueryResult<GetReportsQuery, GetReportsQueryVariables>;
export const GetEditableUserDocument = gql`
    query GetEditableUser($id: String!) {
  getUser(id: $id) {
    first
    last
    isBeeping
    isStudent
    isEmailVerified
    role
    venmo
    singlesRate
    groupRate
    capacity
    masksRequired
    photoUrl
    queueSize
    phone
    username
    email
    cashapp
    pushToken
  }
}
    `;

/**
 * __useGetEditableUserQuery__
 *
 * To run a query within a React component, call `useGetEditableUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEditableUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEditableUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetEditableUserQuery(baseOptions: Apollo.QueryHookOptions<GetEditableUserQuery, GetEditableUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEditableUserQuery, GetEditableUserQueryVariables>(GetEditableUserDocument, options);
      }
export function useGetEditableUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEditableUserQuery, GetEditableUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEditableUserQuery, GetEditableUserQueryVariables>(GetEditableUserDocument, options);
        }
export type GetEditableUserQueryHookResult = ReturnType<typeof useGetEditableUserQuery>;
export type GetEditableUserLazyQueryHookResult = ReturnType<typeof useGetEditableUserLazyQuery>;
export type GetEditableUserQueryResult = Apollo.QueryResult<GetEditableUserQuery, GetEditableUserQueryVariables>;
export const EditUserDocument = gql`
    mutation EditUser($id: String!, $data: EditUserValidator!) {
  editUser(id: $id, data: $data) {
    username
  }
}
    `;
export type EditUserMutationFn = Apollo.MutationFunction<EditUserMutation, EditUserMutationVariables>;

/**
 * __useEditUserMutation__
 *
 * To run a mutation, you first call `useEditUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editUserMutation, { data, loading, error }] = useEditUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useEditUserMutation(baseOptions?: Apollo.MutationHookOptions<EditUserMutation, EditUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditUserMutation, EditUserMutationVariables>(EditUserDocument, options);
      }
export type EditUserMutationHookResult = ReturnType<typeof useEditUserMutation>;
export type EditUserMutationResult = Apollo.MutationResult<EditUserMutation>;
export type EditUserMutationOptions = Apollo.BaseMutationOptions<EditUserMutation, EditUserMutationVariables>;
export const GetUserDocument = gql`
    query GetUser($id: String!) {
  getUser(id: $id) {
    id
    first
    last
    isBeeping
    isStudent
    role
    venmo
    singlesRate
    groupRate
    capacity
    masksRequired
    photoUrl
    queueSize
    phone
    username
    rating
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const GetUsersDocument = gql`
    query getUsers($show: Int, $offset: Int) {
  getUsers(show: $show, offset: $offset) {
    items {
      id
      photoUrl
      first
      last
      email
      isStudent
      isEmailVerified
      username
      phone
      isBeeping
    }
    count
  }
}
    `;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *      show: // value for 'show'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;