import { gql } from '@apollo/client';
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
  tokens: TokenEntry;
  user: User;
};

export type Beep = {
  __typename?: 'Beep';
  beeper: User;
  destination: Scalars['String'];
  end: Scalars['DateTime'];
  groupSize: Scalars['Float'];
  id: Scalars['String'];
  origin: Scalars['String'];
  rider: User;
  start: Scalars['DateTime'];
};

export type BeeperSettingsInput = {
  capacity?: InputMaybe<Scalars['Float']>;
  groupRate?: InputMaybe<Scalars['Float']>;
  isBeeping?: InputMaybe<Scalars['Boolean']>;
  masksRequired?: InputMaybe<Scalars['Boolean']>;
  singlesRate?: InputMaybe<Scalars['Float']>;
};

export type BeepsInProgressResponse = {
  __typename?: 'BeepsInProgressResponse';
  count: Scalars['Int'];
  items: Array<QueueEntry>;
};

export type BeepsResponse = {
  __typename?: 'BeepsResponse';
  count: Scalars['Int'];
  items: Array<Beep>;
};

export type ChangePasswordInput = {
  password: Scalars['String'];
};

export type EditAccountInput = {
  cashapp?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  first: Scalars['String'];
  last: Scalars['String'];
  phone: Scalars['String'];
  venmo?: InputMaybe<Scalars['String']>;
};

export type EditUserValidator = {
  capacity?: InputMaybe<Scalars['Float']>;
  cashapp?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['String']>;
  groupRate?: InputMaybe<Scalars['Float']>;
  isBeeping?: InputMaybe<Scalars['Boolean']>;
  isEmailVerified?: InputMaybe<Scalars['Boolean']>;
  isStudent?: InputMaybe<Scalars['Boolean']>;
  last?: InputMaybe<Scalars['String']>;
  masksRequired?: InputMaybe<Scalars['Boolean']>;
  phone?: InputMaybe<Scalars['String']>;
  photoUrl?: InputMaybe<Scalars['String']>;
  pushToken?: InputMaybe<Scalars['String']>;
  queueSize?: InputMaybe<Scalars['Float']>;
  role?: InputMaybe<Scalars['String']>;
  singlesRate?: InputMaybe<Scalars['Float']>;
  username?: InputMaybe<Scalars['String']>;
  venmo?: InputMaybe<Scalars['String']>;
};

export type FindBeepInput = {
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  radius?: InputMaybe<Scalars['Float']>;
};

export type ForgotPassword = {
  __typename?: 'ForgotPassword';
  id: Scalars['String'];
  time: Scalars['DateTime'];
  user: User;
};

export type GetBeepInput = {
  destination: Scalars['String'];
  groupSize: Scalars['Float'];
  origin: Scalars['String'];
};

export type LocationInput = {
  accuracy?: InputMaybe<Scalars['Float']>;
  altitideAccuracy?: InputMaybe<Scalars['Float']>;
  altitude?: InputMaybe<Scalars['Float']>;
  heading?: InputMaybe<Scalars['Float']>;
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  speed?: InputMaybe<Scalars['Float']>;
};

export type LoginInput = {
  password: Scalars['String'];
  pushToken?: InputMaybe<Scalars['String']>;
  username: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addProfilePicture: User;
  cancelBeep: Scalars['Boolean'];
  changePassword: Scalars['Boolean'];
  chooseBeep: QueueEntry;
  clearQueue: Scalars['Boolean'];
  deleteAccount: Scalars['Boolean'];
  deleteBeep: Scalars['Boolean'];
  deleteRating: Scalars['Boolean'];
  deleteReport: Scalars['Boolean'];
  editAccount: User;
  editUser: User;
  forgotPassword: Scalars['Boolean'];
  login: Auth;
  logout: Scalars['Boolean'];
  rateUser: Scalars['Boolean'];
  removeToken: Scalars['Boolean'];
  removeUser: Scalars['Boolean'];
  reportUser: Scalars['Boolean'];
  resendEmailVarification: Scalars['Boolean'];
  resetPassword: Scalars['Boolean'];
  riderLeaveQueue: Scalars['Boolean'];
  setBeeperQueue: Scalars['Boolean'];
  setBeeperStatus: Scalars['Boolean'];
  setLocation: Scalars['Boolean'];
  signup: Auth;
  updatePushToken: Scalars['Boolean'];
  updateReport: Report;
  verifyAccount: Scalars['Boolean'];
};


export type MutationAddProfilePictureArgs = {
  picture: Scalars['Upload'];
};


export type MutationCancelBeepArgs = {
  id: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationChooseBeepArgs = {
  beeperId: Scalars['String'];
  input: GetBeepInput;
};


export type MutationClearQueueArgs = {
  id: Scalars['String'];
  stopBeeping: Scalars['Boolean'];
};


export type MutationDeleteBeepArgs = {
  id: Scalars['String'];
};


export type MutationDeleteRatingArgs = {
  id: Scalars['String'];
};


export type MutationDeleteReportArgs = {
  id: Scalars['String'];
};


export type MutationEditAccountArgs = {
  input: EditAccountInput;
};


export type MutationEditUserArgs = {
  data: EditUserValidator;
  id: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationLogoutArgs = {
  isApp?: InputMaybe<Scalars['Boolean']>;
};


export type MutationRateUserArgs = {
  input: RatingInput;
};


export type MutationRemoveTokenArgs = {
  token: Scalars['String'];
};


export type MutationRemoveUserArgs = {
  id: Scalars['String'];
};


export type MutationReportUserArgs = {
  input: ReportInput;
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationRiderLeaveQueueArgs = {
  id: Scalars['String'];
};


export type MutationSetBeeperQueueArgs = {
  input: UpdateQueueEntryInput;
};


export type MutationSetBeeperStatusArgs = {
  input: BeeperSettingsInput;
};


export type MutationSetLocationArgs = {
  id?: InputMaybe<Scalars['String']>;
  location: LocationInput;
};


export type MutationSignupArgs = {
  input: SignUpInput;
};


export type MutationUpdatePushTokenArgs = {
  pushToken: Scalars['String'];
};


export type MutationUpdateReportArgs = {
  id: Scalars['String'];
  input: UpdateReportInput;
};


export type MutationVerifyAccountArgs = {
  id: Scalars['String'];
};

export type Point = {
  __typename?: 'Point';
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  findBeep: User;
  getBeep: Beep;
  getBeeperList: Array<User>;
  getBeeps: BeepsResponse;
  getETA: Scalars['String'];
  getInProgressBeeps: BeepsInProgressResponse;
  getLastBeepToRate?: Maybe<Beep>;
  getLocationSuggestions: Array<Suggestion>;
  getQueue: Array<QueueEntry>;
  getRating: Rating;
  getRatings: RatingsResponse;
  getReport: Report;
  getReports: ReportsResponse;
  getRiderStatus?: Maybe<QueueEntry>;
  getUser: User;
  getUsers: UsersResponse;
};


export type QueryGetBeepArgs = {
  id: Scalars['String'];
};


export type QueryGetBeeperListArgs = {
  input: FindBeepInput;
};


export type QueryGetBeepsArgs = {
  id?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
  show?: InputMaybe<Scalars['Int']>;
};


export type QueryGetEtaArgs = {
  end: Scalars['String'];
  start: Scalars['String'];
};


export type QueryGetInProgressBeepsArgs = {
  offset?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
  show?: InputMaybe<Scalars['Int']>;
};


export type QueryGetLocationSuggestionsArgs = {
  location: Scalars['String'];
  sessiontoken: Scalars['String'];
};


export type QueryGetQueueArgs = {
  id?: InputMaybe<Scalars['String']>;
};


export type QueryGetRatingArgs = {
  id: Scalars['String'];
};


export type QueryGetRatingsArgs = {
  id?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
  show?: InputMaybe<Scalars['Int']>;
};


export type QueryGetReportArgs = {
  id: Scalars['String'];
};


export type QueryGetReportsArgs = {
  id?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
  show?: InputMaybe<Scalars['Int']>;
};


export type QueryGetUserArgs = {
  id?: InputMaybe<Scalars['String']>;
};


export type QueryGetUsersArgs = {
  offset?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
  show?: InputMaybe<Scalars['Int']>;
};

export type QueueEntry = {
  __typename?: 'QueueEntry';
  beeper: User;
  destination: Scalars['String'];
  groupSize: Scalars['Float'];
  id: Scalars['String'];
  isAccepted: Scalars['Boolean'];
  origin: Scalars['String'];
  position: Scalars['Float'];
  rider: User;
  start: Scalars['Float'];
  state: Scalars['Float'];
};

export type Rating = {
  __typename?: 'Rating';
  beep: Beep;
  id: Scalars['String'];
  message?: Maybe<Scalars['String']>;
  rated: User;
  rater: User;
  stars: Scalars['Float'];
  timestamp: Scalars['DateTime'];
};

export type RatingInput = {
  beepId: Scalars['String'];
  message?: InputMaybe<Scalars['String']>;
  stars: Scalars['Float'];
  userId: Scalars['String'];
};

export type RatingsResponse = {
  __typename?: 'RatingsResponse';
  count: Scalars['Int'];
  items: Array<Rating>;
};

export type Report = {
  __typename?: 'Report';
  beep?: Maybe<Beep>;
  handled: Scalars['Boolean'];
  handledBy?: Maybe<User>;
  id: Scalars['String'];
  notes?: Maybe<Scalars['String']>;
  reason: Scalars['String'];
  reported: User;
  reporter: User;
  timestamp: Scalars['DateTime'];
};

export type ReportInput = {
  beepId?: InputMaybe<Scalars['String']>;
  reason: Scalars['String'];
  userId: Scalars['String'];
};

export type ReportsResponse = {
  __typename?: 'ReportsResponse';
  count: Scalars['Int'];
  items: Array<Report>;
};

export type ResetPasswordInput = {
  id: Scalars['String'];
  password: Scalars['String'];
};

export type SignUpInput = {
  cashapp?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  first: Scalars['String'];
  last: Scalars['String'];
  password: Scalars['String'];
  phone: Scalars['String'];
  picture: Scalars['Upload'];
  pushToken?: InputMaybe<Scalars['String']>;
  username: Scalars['String'];
  venmo?: InputMaybe<Scalars['String']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  getBeeperUpdates: Array<QueueEntry>;
  getLocationUpdates?: Maybe<Point>;
  getRiderUpdates?: Maybe<QueueEntry>;
  getUserUpdates: User;
};


export type SubscriptionGetBeeperUpdatesArgs = {
  id: Scalars['String'];
};


export type SubscriptionGetLocationUpdatesArgs = {
  id: Scalars['String'];
};


export type SubscriptionGetRiderUpdatesArgs = {
  id: Scalars['String'];
};


export type SubscriptionGetUserUpdatesArgs = {
  id: Scalars['String'];
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
  queueId: Scalars['String'];
  riderId: Scalars['String'];
  value: Scalars['String'];
};

export type UpdateReportInput = {
  handled?: InputMaybe<Scalars['Boolean']>;
  notes?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  capacity: Scalars['Float'];
  cashapp?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  first: Scalars['String'];
  groupRate: Scalars['Float'];
  id: Scalars['String'];
  isBeeping: Scalars['Boolean'];
  isEmailVerified: Scalars['Boolean'];
  isStudent: Scalars['Boolean'];
  last: Scalars['String'];
  location?: Maybe<Point>;
  masksRequired: Scalars['Boolean'];
  name: Scalars['String'];
  password: Scalars['String'];
  phone: Scalars['String'];
  photoUrl?: Maybe<Scalars['String']>;
  pushToken?: Maybe<Scalars['String']>;
  queue: Array<QueueEntry>;
  queueSize: Scalars['Float'];
  rating?: Maybe<Scalars['Float']>;
  ratings: Array<Rating>;
  role: Scalars['String'];
  seen?: Maybe<Scalars['DateTime']>;
  singlesRate: Scalars['Float'];
  username: Scalars['String'];
  venmo?: Maybe<Scalars['String']>;
};

export type UsersResponse = {
  __typename?: 'UsersResponse';
  count: Scalars['Int'];
  items: Array<User>;
};

export type VerifyEmail = {
  __typename?: 'VerifyEmail';
  email: Scalars['String'];
  id: Scalars['String'];
  time: Scalars['DateTime'];
  user: User;
};

export type UserUpdatesSubscriptionVariables = Exact<{
  id: Scalars['String'];
}>;


export type UserUpdatesSubscription = { __typename?: 'Subscription', getUserUpdates: { __typename?: 'User', id: string, username: string, name: string, first: string, last: string, email: string, phone: string, venmo?: string | null | undefined, isBeeping: boolean, isEmailVerified: boolean, isStudent: boolean, groupRate: number, singlesRate: number, photoUrl?: string | null | undefined, capacity: number, masksRequired: boolean, cashapp?: string | null | undefined } };

export type UpdateBeeperQueueMutationVariables = Exact<{
  queueId: Scalars['String'];
  riderId: Scalars['String'];
  value: Scalars['String'];
}>;


export type UpdateBeeperQueueMutation = { __typename?: 'Mutation', setBeeperQueue: boolean };

export type CancelBeepMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type CancelBeepMutation = { __typename?: 'Mutation', cancelBeep: boolean };

export type GetSuggestionsQueryVariables = Exact<{
  location: Scalars['String'];
  sessiontoken: Scalars['String'];
}>;


export type GetSuggestionsQuery = { __typename?: 'Query', getLocationSuggestions: Array<{ __typename?: 'Suggestion', title: string }> };

export type GetRateDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRateDataQuery = { __typename?: 'Query', getLastBeepToRate?: { __typename?: 'Beep', id: string, beeper: { __typename?: 'User', id: string, name: string, username: string, photoUrl?: string | null | undefined } } | null | undefined };

export type ResendMutationVariables = Exact<{ [key: string]: never; }>;


export type ResendMutation = { __typename?: 'Mutation', resendEmailVarification: boolean };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type GetBeepHistoryQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
}>;


export type GetBeepHistoryQuery = { __typename?: 'Query', getBeeps: { __typename?: 'BeepsResponse', count: number, items: Array<{ __typename?: 'Beep', id: string, start: any, end: any, groupSize: number, origin: string, destination: string, rider: { __typename?: 'User', id: string, name: string, first: string, last: string, photoUrl?: string | null | undefined }, beeper: { __typename?: 'User', id: string, name: string, first: string, last: string, photoUrl?: string | null | undefined } }> } };

export type GetRatingsQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
}>;


export type GetRatingsQuery = { __typename?: 'Query', getRatings: { __typename?: 'RatingsResponse', count: number, items: Array<{ __typename?: 'Rating', id: string, stars: number, timestamp: any, message?: string | null | undefined, rater: { __typename?: 'User', id: string, name: string, photoUrl?: string | null | undefined }, rated: { __typename?: 'User', id: string, name: string, photoUrl?: string | null | undefined } }> } };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
  pushToken?: InputMaybe<Scalars['String']>;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'Auth', tokens: { __typename?: 'TokenEntry', id: string, tokenid: string }, user: { __typename?: 'User', id: string, username: string, name: string, first: string, last: string, email: string, phone: string, venmo?: string | null | undefined, isBeeping: boolean, isEmailVerified: boolean, isStudent: boolean, groupRate: number, singlesRate: number, photoUrl?: string | null | undefined, capacity: number, masksRequired: boolean, cashapp?: string | null | undefined } } };

export type SignUpMutationVariables = Exact<{
  first: Scalars['String'];
  last: Scalars['String'];
  email: Scalars['String'];
  phone: Scalars['String'];
  venmo?: InputMaybe<Scalars['String']>;
  cashapp?: InputMaybe<Scalars['String']>;
  username: Scalars['String'];
  password: Scalars['String'];
  picture: Scalars['Upload'];
  pushToken?: InputMaybe<Scalars['String']>;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signup: { __typename?: 'Auth', tokens: { __typename?: 'TokenEntry', id: string, tokenid: string }, user: { __typename?: 'User', id: string, username: string, name: string, first: string, last: string, email: string, phone: string, venmo?: string | null | undefined, isBeeping: boolean, isEmailVerified: boolean, isStudent: boolean, groupRate: number, singlesRate: number, photoUrl?: string | null | undefined, capacity: number, masksRequired: boolean, cashapp?: string | null | undefined } } };

export type LocationUpdateMutationVariables = Exact<{
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  altitude: Scalars['Float'];
  accuracy?: InputMaybe<Scalars['Float']>;
  altitideAccuracy?: InputMaybe<Scalars['Float']>;
  heading: Scalars['Float'];
  speed: Scalars['Float'];
}>;


export type LocationUpdateMutation = { __typename?: 'Mutation', setLocation: boolean };

export type GetInitialQueueQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInitialQueueQuery = { __typename?: 'Query', getQueue: Array<{ __typename?: 'QueueEntry', id: string, isAccepted: boolean, groupSize: number, origin: string, destination: string, state: number, start: number, rider: { __typename?: 'User', id: string, name: string, first: string, last: string, venmo?: string | null | undefined, cashapp?: string | null | undefined, phone: string, photoUrl?: string | null | undefined, isStudent: boolean } }> };

export type GetQueueSubscriptionVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetQueueSubscription = { __typename?: 'Subscription', getBeeperUpdates: Array<{ __typename?: 'QueueEntry', id: string, isAccepted: boolean, groupSize: number, origin: string, destination: string, state: number, start: number, rider: { __typename?: 'User', id: string, name: string, first: string, last: string, venmo?: string | null | undefined, cashapp?: string | null | undefined, phone: string, photoUrl?: string | null | undefined, isStudent: boolean } }> };

export type UpdateBeepSettingsMutationVariables = Exact<{
  singlesRate: Scalars['Float'];
  groupRate: Scalars['Float'];
  capacity: Scalars['Float'];
  isBeeping: Scalars['Boolean'];
  masksRequired: Scalars['Boolean'];
}>;


export type UpdateBeepSettingsMutation = { __typename?: 'Mutation', setBeeperStatus: boolean };

export type GetUserProfileQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetUserProfileQuery = { __typename?: 'Query', getUser: { __typename?: 'User', id: string, name: string, username: string, isBeeping: boolean, isStudent: boolean, role: string, venmo?: string | null | undefined, cashapp?: string | null | undefined, singlesRate: number, groupRate: number, capacity: number, masksRequired: boolean, photoUrl?: string | null | undefined, queueSize: number, rating?: number | null | undefined } };

export type RateUserMutationVariables = Exact<{
  userId: Scalars['String'];
  stars: Scalars['Float'];
  message?: InputMaybe<Scalars['String']>;
  beepId: Scalars['String'];
}>;


export type RateUserMutation = { __typename?: 'Mutation', rateUser: boolean };

export type ReportUserMutationVariables = Exact<{
  userId: Scalars['String'];
  reason: Scalars['String'];
  beepId?: InputMaybe<Scalars['String']>;
}>;


export type ReportUserMutation = { __typename?: 'Mutation', reportUser: boolean };

export type GetInitialRiderStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInitialRiderStatusQuery = { __typename?: 'Query', getRiderStatus?: { __typename?: 'QueueEntry', id: string, position: number, isAccepted: boolean, origin: string, destination: string, state: number, groupSize: number, beeper: { __typename?: 'User', id: string, first: string, name: string, singlesRate: number, groupRate: number, isStudent: boolean, role: string, venmo?: string | null | undefined, cashapp?: string | null | undefined, username: string, phone: string, photoUrl?: string | null | undefined, masksRequired: boolean, capacity: number, queueSize: number, location?: { __typename?: 'Point', longitude: number, latitude: number } | null | undefined } } | null | undefined };

export type RiderStatusSubscriptionVariables = Exact<{
  id: Scalars['String'];
}>;


export type RiderStatusSubscription = { __typename?: 'Subscription', getRiderUpdates?: { __typename?: 'QueueEntry', id: string, position: number, isAccepted: boolean, origin: string, destination: string, state: number, groupSize: number, beeper: { __typename?: 'User', id: string, first: string, name: string, singlesRate: number, groupRate: number, isStudent: boolean, role: string, venmo?: string | null | undefined, cashapp?: string | null | undefined, username: string, phone: string, photoUrl?: string | null | undefined, masksRequired: boolean, capacity: number, queueSize: number, location?: { __typename?: 'Point', longitude: number, latitude: number } | null | undefined } } | null | undefined };

export type BeepersLocationSubscriptionVariables = Exact<{
  id: Scalars['String'];
}>;


export type BeepersLocationSubscription = { __typename?: 'Subscription', getLocationUpdates?: { __typename?: 'Point', latitude: number, longitude: number } | null | undefined };

export type GetEtaQueryVariables = Exact<{
  start: Scalars['String'];
  end: Scalars['String'];
}>;


export type GetEtaQuery = { __typename?: 'Query', getETA: string };

export type LeaveQueueMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type LeaveQueueMutation = { __typename?: 'Mutation', riderLeaveQueue: boolean };

export type GetBeeperListQueryVariables = Exact<{
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  radius?: InputMaybe<Scalars['Float']>;
}>;


export type GetBeeperListQuery = { __typename?: 'Query', getBeeperList: Array<{ __typename?: 'User', id: string, name: string, first: string, isStudent: boolean, singlesRate: number, groupRate: number, capacity: number, queueSize: number, photoUrl?: string | null | undefined, role: string, masksRequired: boolean, rating?: number | null | undefined, venmo?: string | null | undefined, cashapp?: string | null | undefined, location?: { __typename?: 'Point', latitude: number, longitude: number } | null | undefined }> };

export type ChangePasswordMutationVariables = Exact<{
  password: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: boolean };

export type EditAccountMutationVariables = Exact<{
  first: Scalars['String'];
  last: Scalars['String'];
  email: Scalars['String'];
  phone: Scalars['String'];
  venmo?: InputMaybe<Scalars['String']>;
  cashapp?: InputMaybe<Scalars['String']>;
}>;


export type EditAccountMutation = { __typename?: 'Mutation', editAccount: { __typename?: 'User', id: string, name: string } };

export type AddProfilePictureMutationVariables = Exact<{
  picture: Scalars['Upload'];
}>;


export type AddProfilePictureMutation = { __typename?: 'Mutation', addProfilePicture: { __typename?: 'User', photoUrl?: string | null | undefined } };


export const UserUpdatesDocument = gql`
    subscription UserUpdates($id: String!) {
  getUserUpdates(id: $id) {
    id
    username
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
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserUpdatesSubscription(baseOptions: ApolloReactHooks.SubscriptionHookOptions<UserUpdatesSubscription, UserUpdatesSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useSubscription<UserUpdatesSubscription, UserUpdatesSubscriptionVariables>(UserUpdatesDocument, options);
      }
export type UserUpdatesSubscriptionHookResult = ReturnType<typeof useUserUpdatesSubscription>;
export type UserUpdatesSubscriptionResult = ApolloReactCommon.SubscriptionResult<UserUpdatesSubscription>;
export const UpdateBeeperQueueDocument = gql`
    mutation UpdateBeeperQueue($queueId: String!, $riderId: String!, $value: String!) {
  setBeeperQueue(input: {queueId: $queueId, riderId: $riderId, value: $value})
}
    `;
export type UpdateBeeperQueueMutationFn = ApolloReactCommon.MutationFunction<UpdateBeeperQueueMutation, UpdateBeeperQueueMutationVariables>;

/**
 * __useUpdateBeeperQueueMutation__
 *
 * To run a mutation, you first call `useUpdateBeeperQueueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBeeperQueueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBeeperQueueMutation, { data, loading, error }] = useUpdateBeeperQueueMutation({
 *   variables: {
 *      queueId: // value for 'queueId'
 *      riderId: // value for 'riderId'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useUpdateBeeperQueueMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateBeeperQueueMutation, UpdateBeeperQueueMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateBeeperQueueMutation, UpdateBeeperQueueMutationVariables>(UpdateBeeperQueueDocument, options);
      }
export type UpdateBeeperQueueMutationHookResult = ReturnType<typeof useUpdateBeeperQueueMutation>;
export type UpdateBeeperQueueMutationResult = ApolloReactCommon.MutationResult<UpdateBeeperQueueMutation>;
export type UpdateBeeperQueueMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateBeeperQueueMutation, UpdateBeeperQueueMutationVariables>;
export const CancelBeepDocument = gql`
    mutation CancelBeep($id: String!) {
  cancelBeep(id: $id)
}
    `;
export type CancelBeepMutationFn = ApolloReactCommon.MutationFunction<CancelBeepMutation, CancelBeepMutationVariables>;

/**
 * __useCancelBeepMutation__
 *
 * To run a mutation, you first call `useCancelBeepMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelBeepMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelBeepMutation, { data, loading, error }] = useCancelBeepMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCancelBeepMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CancelBeepMutation, CancelBeepMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CancelBeepMutation, CancelBeepMutationVariables>(CancelBeepDocument, options);
      }
export type CancelBeepMutationHookResult = ReturnType<typeof useCancelBeepMutation>;
export type CancelBeepMutationResult = ApolloReactCommon.MutationResult<CancelBeepMutation>;
export type CancelBeepMutationOptions = ApolloReactCommon.BaseMutationOptions<CancelBeepMutation, CancelBeepMutationVariables>;
export const GetSuggestionsDocument = gql`
    query GetSuggestions($location: String!, $sessiontoken: String!) {
  getLocationSuggestions(location: $location, sessiontoken: $sessiontoken) {
    title
  }
}
    `;

/**
 * __useGetSuggestionsQuery__
 *
 * To run a query within a React component, call `useGetSuggestionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSuggestionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSuggestionsQuery({
 *   variables: {
 *      location: // value for 'location'
 *      sessiontoken: // value for 'sessiontoken'
 *   },
 * });
 */
export function useGetSuggestionsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetSuggestionsQuery, GetSuggestionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetSuggestionsQuery, GetSuggestionsQueryVariables>(GetSuggestionsDocument, options);
      }
export function useGetSuggestionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetSuggestionsQuery, GetSuggestionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetSuggestionsQuery, GetSuggestionsQueryVariables>(GetSuggestionsDocument, options);
        }
export type GetSuggestionsQueryHookResult = ReturnType<typeof useGetSuggestionsQuery>;
export type GetSuggestionsLazyQueryHookResult = ReturnType<typeof useGetSuggestionsLazyQuery>;
export type GetSuggestionsQueryResult = ApolloReactCommon.QueryResult<GetSuggestionsQuery, GetSuggestionsQueryVariables>;
export const GetRateDataDocument = gql`
    query GetRateData {
  getLastBeepToRate {
    id
    beeper {
      id
      name
      username
      photoUrl
    }
  }
}
    `;

/**
 * __useGetRateDataQuery__
 *
 * To run a query within a React component, call `useGetRateDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRateDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRateDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetRateDataQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetRateDataQuery, GetRateDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetRateDataQuery, GetRateDataQueryVariables>(GetRateDataDocument, options);
      }
export function useGetRateDataLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRateDataQuery, GetRateDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetRateDataQuery, GetRateDataQueryVariables>(GetRateDataDocument, options);
        }
export type GetRateDataQueryHookResult = ReturnType<typeof useGetRateDataQuery>;
export type GetRateDataLazyQueryHookResult = ReturnType<typeof useGetRateDataLazyQuery>;
export type GetRateDataQueryResult = ApolloReactCommon.QueryResult<GetRateDataQuery, GetRateDataQueryVariables>;
export const ResendDocument = gql`
    mutation Resend {
  resendEmailVarification
}
    `;
export type ResendMutationFn = ApolloReactCommon.MutationFunction<ResendMutation, ResendMutationVariables>;

/**
 * __useResendMutation__
 *
 * To run a mutation, you first call `useResendMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResendMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resendMutation, { data, loading, error }] = useResendMutation({
 *   variables: {
 *   },
 * });
 */
export function useResendMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ResendMutation, ResendMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ResendMutation, ResendMutationVariables>(ResendDocument, options);
      }
export type ResendMutationHookResult = ReturnType<typeof useResendMutation>;
export type ResendMutationResult = ApolloReactCommon.MutationResult<ResendMutation>;
export type ResendMutationOptions = ApolloReactCommon.BaseMutationOptions<ResendMutation, ResendMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout(isApp: true)
}
    `;
export type LogoutMutationFn = ApolloReactCommon.MutationFunction<LogoutMutation, LogoutMutationVariables>;

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
export function useLogoutMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = ApolloReactCommon.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = ApolloReactCommon.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const GetBeepHistoryDocument = gql`
    query GetBeepHistory($id: String) {
  getBeeps(id: $id) {
    items {
      id
      start
      end
      groupSize
      origin
      destination
      rider {
        id
        name
        first
        last
        photoUrl
      }
      beeper {
        id
        name
        first
        last
        photoUrl
      }
    }
    count
  }
}
    `;

/**
 * __useGetBeepHistoryQuery__
 *
 * To run a query within a React component, call `useGetBeepHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBeepHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBeepHistoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetBeepHistoryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetBeepHistoryQuery, GetBeepHistoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetBeepHistoryQuery, GetBeepHistoryQueryVariables>(GetBeepHistoryDocument, options);
      }
export function useGetBeepHistoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetBeepHistoryQuery, GetBeepHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetBeepHistoryQuery, GetBeepHistoryQueryVariables>(GetBeepHistoryDocument, options);
        }
export type GetBeepHistoryQueryHookResult = ReturnType<typeof useGetBeepHistoryQuery>;
export type GetBeepHistoryLazyQueryHookResult = ReturnType<typeof useGetBeepHistoryLazyQuery>;
export type GetBeepHistoryQueryResult = ApolloReactCommon.QueryResult<GetBeepHistoryQuery, GetBeepHistoryQueryVariables>;
export const GetRatingsDocument = gql`
    query GetRatings($id: String) {
  getRatings(id: $id) {
    items {
      id
      stars
      timestamp
      message
      rater {
        id
        name
        photoUrl
      }
      rated {
        id
        name
        photoUrl
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
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetRatingsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetRatingsQuery, GetRatingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetRatingsQuery, GetRatingsQueryVariables>(GetRatingsDocument, options);
      }
export function useGetRatingsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRatingsQuery, GetRatingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetRatingsQuery, GetRatingsQueryVariables>(GetRatingsDocument, options);
        }
export type GetRatingsQueryHookResult = ReturnType<typeof useGetRatingsQuery>;
export type GetRatingsLazyQueryHookResult = ReturnType<typeof useGetRatingsLazyQuery>;
export type GetRatingsQueryResult = ApolloReactCommon.QueryResult<GetRatingsQuery, GetRatingsQueryVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;
export type ForgotPasswordMutationFn = ApolloReactCommon.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

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
export function useForgotPasswordMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, options);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = ApolloReactCommon.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = ApolloReactCommon.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!, $pushToken: String) {
  login(input: {username: $username, password: $password, pushToken: $pushToken}) {
    tokens {
      id
      tokenid
    }
    user {
      id
      username
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
      cashapp
    }
  }
}
    `;
export type LoginMutationFn = ApolloReactCommon.MutationFunction<LoginMutation, LoginMutationVariables>;

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
 *      pushToken: // value for 'pushToken'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = ApolloReactCommon.MutationResult<LoginMutation>;
export type LoginMutationOptions = ApolloReactCommon.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const SignUpDocument = gql`
    mutation SignUp($first: String!, $last: String!, $email: String!, $phone: String!, $venmo: String, $cashapp: String, $username: String!, $password: String!, $picture: Upload!, $pushToken: String) {
  signup(
    input: {first: $first, last: $last, email: $email, phone: $phone, venmo: $venmo, cashapp: $cashapp, username: $username, password: $password, picture: $picture, pushToken: $pushToken}
  ) {
    tokens {
      id
      tokenid
    }
    user {
      id
      username
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
      cashapp
    }
  }
}
    `;
export type SignUpMutationFn = ApolloReactCommon.MutationFunction<SignUpMutation, SignUpMutationVariables>;

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
 *      picture: // value for 'picture'
 *      pushToken: // value for 'pushToken'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = ApolloReactCommon.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = ApolloReactCommon.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const LocationUpdateDocument = gql`
    mutation LocationUpdate($latitude: Float!, $longitude: Float!, $altitude: Float!, $accuracy: Float, $altitideAccuracy: Float, $heading: Float!, $speed: Float!) {
  setLocation(
    location: {latitude: $latitude, longitude: $longitude, altitude: $altitude, accuracy: $accuracy, altitideAccuracy: $altitideAccuracy, heading: $heading, speed: $speed}
  )
}
    `;
export type LocationUpdateMutationFn = ApolloReactCommon.MutationFunction<LocationUpdateMutation, LocationUpdateMutationVariables>;

/**
 * __useLocationUpdateMutation__
 *
 * To run a mutation, you first call `useLocationUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLocationUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [locationUpdateMutation, { data, loading, error }] = useLocationUpdateMutation({
 *   variables: {
 *      latitude: // value for 'latitude'
 *      longitude: // value for 'longitude'
 *      altitude: // value for 'altitude'
 *      accuracy: // value for 'accuracy'
 *      altitideAccuracy: // value for 'altitideAccuracy'
 *      heading: // value for 'heading'
 *      speed: // value for 'speed'
 *   },
 * });
 */
export function useLocationUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LocationUpdateMutation, LocationUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<LocationUpdateMutation, LocationUpdateMutationVariables>(LocationUpdateDocument, options);
      }
export type LocationUpdateMutationHookResult = ReturnType<typeof useLocationUpdateMutation>;
export type LocationUpdateMutationResult = ApolloReactCommon.MutationResult<LocationUpdateMutation>;
export type LocationUpdateMutationOptions = ApolloReactCommon.BaseMutationOptions<LocationUpdateMutation, LocationUpdateMutationVariables>;
export const GetInitialQueueDocument = gql`
    query GetInitialQueue {
  getQueue {
    id
    isAccepted
    groupSize
    origin
    destination
    state
    start
    rider {
      id
      name
      first
      last
      venmo
      cashapp
      phone
      photoUrl
      isStudent
    }
  }
}
    `;

/**
 * __useGetInitialQueueQuery__
 *
 * To run a query within a React component, call `useGetInitialQueueQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInitialQueueQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInitialQueueQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetInitialQueueQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetInitialQueueQuery, GetInitialQueueQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetInitialQueueQuery, GetInitialQueueQueryVariables>(GetInitialQueueDocument, options);
      }
export function useGetInitialQueueLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetInitialQueueQuery, GetInitialQueueQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetInitialQueueQuery, GetInitialQueueQueryVariables>(GetInitialQueueDocument, options);
        }
export type GetInitialQueueQueryHookResult = ReturnType<typeof useGetInitialQueueQuery>;
export type GetInitialQueueLazyQueryHookResult = ReturnType<typeof useGetInitialQueueLazyQuery>;
export type GetInitialQueueQueryResult = ApolloReactCommon.QueryResult<GetInitialQueueQuery, GetInitialQueueQueryVariables>;
export const GetQueueDocument = gql`
    subscription GetQueue($id: String!) {
  getBeeperUpdates(id: $id) {
    id
    isAccepted
    groupSize
    origin
    destination
    state
    start
    rider {
      id
      name
      first
      last
      venmo
      cashapp
      phone
      photoUrl
      isStudent
    }
  }
}
    `;

/**
 * __useGetQueueSubscription__
 *
 * To run a query within a React component, call `useGetQueueSubscription` and pass it any options that fit your needs.
 * When your component renders, `useGetQueueSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetQueueSubscription({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetQueueSubscription(baseOptions: ApolloReactHooks.SubscriptionHookOptions<GetQueueSubscription, GetQueueSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useSubscription<GetQueueSubscription, GetQueueSubscriptionVariables>(GetQueueDocument, options);
      }
export type GetQueueSubscriptionHookResult = ReturnType<typeof useGetQueueSubscription>;
export type GetQueueSubscriptionResult = ApolloReactCommon.SubscriptionResult<GetQueueSubscription>;
export const UpdateBeepSettingsDocument = gql`
    mutation UpdateBeepSettings($singlesRate: Float!, $groupRate: Float!, $capacity: Float!, $isBeeping: Boolean!, $masksRequired: Boolean!) {
  setBeeperStatus(
    input: {singlesRate: $singlesRate, groupRate: $groupRate, capacity: $capacity, isBeeping: $isBeeping, masksRequired: $masksRequired}
  )
}
    `;
export type UpdateBeepSettingsMutationFn = ApolloReactCommon.MutationFunction<UpdateBeepSettingsMutation, UpdateBeepSettingsMutationVariables>;

/**
 * __useUpdateBeepSettingsMutation__
 *
 * To run a mutation, you first call `useUpdateBeepSettingsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBeepSettingsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBeepSettingsMutation, { data, loading, error }] = useUpdateBeepSettingsMutation({
 *   variables: {
 *      singlesRate: // value for 'singlesRate'
 *      groupRate: // value for 'groupRate'
 *      capacity: // value for 'capacity'
 *      isBeeping: // value for 'isBeeping'
 *      masksRequired: // value for 'masksRequired'
 *   },
 * });
 */
export function useUpdateBeepSettingsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateBeepSettingsMutation, UpdateBeepSettingsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateBeepSettingsMutation, UpdateBeepSettingsMutationVariables>(UpdateBeepSettingsDocument, options);
      }
export type UpdateBeepSettingsMutationHookResult = ReturnType<typeof useUpdateBeepSettingsMutation>;
export type UpdateBeepSettingsMutationResult = ApolloReactCommon.MutationResult<UpdateBeepSettingsMutation>;
export type UpdateBeepSettingsMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateBeepSettingsMutation, UpdateBeepSettingsMutationVariables>;
export const GetUserProfileDocument = gql`
    query GetUserProfile($id: String!) {
  getUser(id: $id) {
    id
    name
    username
    name
    isBeeping
    isStudent
    role
    venmo
    cashapp
    singlesRate
    groupRate
    capacity
    masksRequired
    photoUrl
    queueSize
    rating
  }
}
    `;

/**
 * __useGetUserProfileQuery__
 *
 * To run a query within a React component, call `useGetUserProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserProfileQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserProfileQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetUserProfileQuery, GetUserProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUserProfileQuery, GetUserProfileQueryVariables>(GetUserProfileDocument, options);
      }
export function useGetUserProfileLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserProfileQuery, GetUserProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUserProfileQuery, GetUserProfileQueryVariables>(GetUserProfileDocument, options);
        }
export type GetUserProfileQueryHookResult = ReturnType<typeof useGetUserProfileQuery>;
export type GetUserProfileLazyQueryHookResult = ReturnType<typeof useGetUserProfileLazyQuery>;
export type GetUserProfileQueryResult = ApolloReactCommon.QueryResult<GetUserProfileQuery, GetUserProfileQueryVariables>;
export const RateUserDocument = gql`
    mutation RateUser($userId: String!, $stars: Float!, $message: String, $beepId: String!) {
  rateUser(
    input: {userId: $userId, beepId: $beepId, stars: $stars, message: $message}
  )
}
    `;
export type RateUserMutationFn = ApolloReactCommon.MutationFunction<RateUserMutation, RateUserMutationVariables>;

/**
 * __useRateUserMutation__
 *
 * To run a mutation, you first call `useRateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rateUserMutation, { data, loading, error }] = useRateUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      stars: // value for 'stars'
 *      message: // value for 'message'
 *      beepId: // value for 'beepId'
 *   },
 * });
 */
export function useRateUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RateUserMutation, RateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RateUserMutation, RateUserMutationVariables>(RateUserDocument, options);
      }
export type RateUserMutationHookResult = ReturnType<typeof useRateUserMutation>;
export type RateUserMutationResult = ApolloReactCommon.MutationResult<RateUserMutation>;
export type RateUserMutationOptions = ApolloReactCommon.BaseMutationOptions<RateUserMutation, RateUserMutationVariables>;
export const ReportUserDocument = gql`
    mutation ReportUser($userId: String!, $reason: String!, $beepId: String) {
  reportUser(input: {userId: $userId, reason: $reason, beepId: $beepId})
}
    `;
export type ReportUserMutationFn = ApolloReactCommon.MutationFunction<ReportUserMutation, ReportUserMutationVariables>;

/**
 * __useReportUserMutation__
 *
 * To run a mutation, you first call `useReportUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReportUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reportUserMutation, { data, loading, error }] = useReportUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      reason: // value for 'reason'
 *      beepId: // value for 'beepId'
 *   },
 * });
 */
export function useReportUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ReportUserMutation, ReportUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ReportUserMutation, ReportUserMutationVariables>(ReportUserDocument, options);
      }
export type ReportUserMutationHookResult = ReturnType<typeof useReportUserMutation>;
export type ReportUserMutationResult = ApolloReactCommon.MutationResult<ReportUserMutation>;
export type ReportUserMutationOptions = ApolloReactCommon.BaseMutationOptions<ReportUserMutation, ReportUserMutationVariables>;
export const GetInitialRiderStatusDocument = gql`
    query GetInitialRiderStatus {
  getRiderStatus {
    id
    position
    isAccepted
    origin
    destination
    state
    groupSize
    beeper {
      id
      first
      name
      singlesRate
      groupRate
      isStudent
      role
      venmo
      cashapp
      username
      phone
      photoUrl
      masksRequired
      capacity
      queueSize
      location {
        longitude
        latitude
      }
    }
  }
}
    `;

/**
 * __useGetInitialRiderStatusQuery__
 *
 * To run a query within a React component, call `useGetInitialRiderStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInitialRiderStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInitialRiderStatusQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetInitialRiderStatusQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetInitialRiderStatusQuery, GetInitialRiderStatusQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetInitialRiderStatusQuery, GetInitialRiderStatusQueryVariables>(GetInitialRiderStatusDocument, options);
      }
export function useGetInitialRiderStatusLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetInitialRiderStatusQuery, GetInitialRiderStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetInitialRiderStatusQuery, GetInitialRiderStatusQueryVariables>(GetInitialRiderStatusDocument, options);
        }
export type GetInitialRiderStatusQueryHookResult = ReturnType<typeof useGetInitialRiderStatusQuery>;
export type GetInitialRiderStatusLazyQueryHookResult = ReturnType<typeof useGetInitialRiderStatusLazyQuery>;
export type GetInitialRiderStatusQueryResult = ApolloReactCommon.QueryResult<GetInitialRiderStatusQuery, GetInitialRiderStatusQueryVariables>;
export const RiderStatusDocument = gql`
    subscription RiderStatus($id: String!) {
  getRiderUpdates(id: $id) {
    id
    position
    isAccepted
    origin
    destination
    state
    groupSize
    beeper {
      id
      first
      name
      singlesRate
      groupRate
      isStudent
      role
      venmo
      cashapp
      username
      phone
      photoUrl
      masksRequired
      capacity
      queueSize
      location {
        longitude
        latitude
      }
    }
  }
}
    `;

/**
 * __useRiderStatusSubscription__
 *
 * To run a query within a React component, call `useRiderStatusSubscription` and pass it any options that fit your needs.
 * When your component renders, `useRiderStatusSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRiderStatusSubscription({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRiderStatusSubscription(baseOptions: ApolloReactHooks.SubscriptionHookOptions<RiderStatusSubscription, RiderStatusSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useSubscription<RiderStatusSubscription, RiderStatusSubscriptionVariables>(RiderStatusDocument, options);
      }
export type RiderStatusSubscriptionHookResult = ReturnType<typeof useRiderStatusSubscription>;
export type RiderStatusSubscriptionResult = ApolloReactCommon.SubscriptionResult<RiderStatusSubscription>;
export const BeepersLocationDocument = gql`
    subscription BeepersLocation($id: String!) {
  getLocationUpdates(id: $id) {
    latitude
    longitude
  }
}
    `;

/**
 * __useBeepersLocationSubscription__
 *
 * To run a query within a React component, call `useBeepersLocationSubscription` and pass it any options that fit your needs.
 * When your component renders, `useBeepersLocationSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBeepersLocationSubscription({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useBeepersLocationSubscription(baseOptions: ApolloReactHooks.SubscriptionHookOptions<BeepersLocationSubscription, BeepersLocationSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useSubscription<BeepersLocationSubscription, BeepersLocationSubscriptionVariables>(BeepersLocationDocument, options);
      }
export type BeepersLocationSubscriptionHookResult = ReturnType<typeof useBeepersLocationSubscription>;
export type BeepersLocationSubscriptionResult = ApolloReactCommon.SubscriptionResult<BeepersLocationSubscription>;
export const GetEtaDocument = gql`
    query GetETA($start: String!, $end: String!) {
  getETA(start: $start, end: $end)
}
    `;

/**
 * __useGetEtaQuery__
 *
 * To run a query within a React component, call `useGetEtaQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEtaQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEtaQuery({
 *   variables: {
 *      start: // value for 'start'
 *      end: // value for 'end'
 *   },
 * });
 */
export function useGetEtaQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetEtaQuery, GetEtaQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetEtaQuery, GetEtaQueryVariables>(GetEtaDocument, options);
      }
export function useGetEtaLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetEtaQuery, GetEtaQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetEtaQuery, GetEtaQueryVariables>(GetEtaDocument, options);
        }
export type GetEtaQueryHookResult = ReturnType<typeof useGetEtaQuery>;
export type GetEtaLazyQueryHookResult = ReturnType<typeof useGetEtaLazyQuery>;
export type GetEtaQueryResult = ApolloReactCommon.QueryResult<GetEtaQuery, GetEtaQueryVariables>;
export const LeaveQueueDocument = gql`
    mutation LeaveQueue($id: String!) {
  riderLeaveQueue(id: $id)
}
    `;
export type LeaveQueueMutationFn = ApolloReactCommon.MutationFunction<LeaveQueueMutation, LeaveQueueMutationVariables>;

/**
 * __useLeaveQueueMutation__
 *
 * To run a mutation, you first call `useLeaveQueueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaveQueueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaveQueueMutation, { data, loading, error }] = useLeaveQueueMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useLeaveQueueMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LeaveQueueMutation, LeaveQueueMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<LeaveQueueMutation, LeaveQueueMutationVariables>(LeaveQueueDocument, options);
      }
export type LeaveQueueMutationHookResult = ReturnType<typeof useLeaveQueueMutation>;
export type LeaveQueueMutationResult = ApolloReactCommon.MutationResult<LeaveQueueMutation>;
export type LeaveQueueMutationOptions = ApolloReactCommon.BaseMutationOptions<LeaveQueueMutation, LeaveQueueMutationVariables>;
export const GetBeeperListDocument = gql`
    query GetBeeperList($latitude: Float!, $longitude: Float!, $radius: Float) {
  getBeeperList(
    input: {latitude: $latitude, longitude: $longitude, radius: $radius}
  ) {
    id
    name
    first
    isStudent
    singlesRate
    groupRate
    capacity
    queueSize
    photoUrl
    role
    masksRequired
    rating
    venmo
    cashapp
    location {
      latitude
      longitude
    }
  }
}
    `;

/**
 * __useGetBeeperListQuery__
 *
 * To run a query within a React component, call `useGetBeeperListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBeeperListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBeeperListQuery({
 *   variables: {
 *      latitude: // value for 'latitude'
 *      longitude: // value for 'longitude'
 *      radius: // value for 'radius'
 *   },
 * });
 */
export function useGetBeeperListQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetBeeperListQuery, GetBeeperListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetBeeperListQuery, GetBeeperListQueryVariables>(GetBeeperListDocument, options);
      }
export function useGetBeeperListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetBeeperListQuery, GetBeeperListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetBeeperListQuery, GetBeeperListQueryVariables>(GetBeeperListDocument, options);
        }
export type GetBeeperListQueryHookResult = ReturnType<typeof useGetBeeperListQuery>;
export type GetBeeperListLazyQueryHookResult = ReturnType<typeof useGetBeeperListLazyQuery>;
export type GetBeeperListQueryResult = ApolloReactCommon.QueryResult<GetBeeperListQuery, GetBeeperListQueryVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($password: String!) {
  changePassword(input: {password: $password})
}
    `;
export type ChangePasswordMutationFn = ApolloReactCommon.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

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
export function useChangePasswordMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = ApolloReactCommon.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = ApolloReactCommon.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
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
export type EditAccountMutationFn = ApolloReactCommon.MutationFunction<EditAccountMutation, EditAccountMutationVariables>;

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
export function useEditAccountMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EditAccountMutation, EditAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<EditAccountMutation, EditAccountMutationVariables>(EditAccountDocument, options);
      }
export type EditAccountMutationHookResult = ReturnType<typeof useEditAccountMutation>;
export type EditAccountMutationResult = ApolloReactCommon.MutationResult<EditAccountMutation>;
export type EditAccountMutationOptions = ApolloReactCommon.BaseMutationOptions<EditAccountMutation, EditAccountMutationVariables>;
export const AddProfilePictureDocument = gql`
    mutation AddProfilePicture($picture: Upload!) {
  addProfilePicture(picture: $picture) {
    photoUrl
  }
}
    `;
export type AddProfilePictureMutationFn = ApolloReactCommon.MutationFunction<AddProfilePictureMutation, AddProfilePictureMutationVariables>;

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
export function useAddProfilePictureMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddProfilePictureMutation, AddProfilePictureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<AddProfilePictureMutation, AddProfilePictureMutationVariables>(AddProfilePictureDocument, options);
      }
export type AddProfilePictureMutationHookResult = ReturnType<typeof useAddProfilePictureMutation>;
export type AddProfilePictureMutationResult = ApolloReactCommon.MutationResult<AddProfilePictureMutation>;
export type AddProfilePictureMutationOptions = ApolloReactCommon.BaseMutationOptions<AddProfilePictureMutation, AddProfilePictureMutationVariables>;