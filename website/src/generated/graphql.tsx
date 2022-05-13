import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
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
  cleanObjectStorageBucket: Scalars['Float'];
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
  sendNotification: Scalars['Boolean'];
  sendNotifications: Scalars['Float'];
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
  id: Scalars['String'];
  input: ResetPasswordInput;
};


export type MutationRiderLeaveQueueArgs = {
  id: Scalars['String'];
};


export type MutationSendNotificationArgs = {
  body: Scalars['String'];
  id: Scalars['String'];
  title: Scalars['String'];
};


export type MutationSendNotificationsArgs = {
  body: Scalars['String'];
  match?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
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
  password: Scalars['String'];
};

export type SignUpInput = {
  cashapp?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  first: Scalars['String'];
  last: Scalars['String'];
  password: Scalars['String'];
  phone: Scalars['String'];
  picture?: InputMaybe<Scalars['Upload']>;
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
  created?: Maybe<Scalars['DateTime']>;
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

export type GetUserDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserDataQuery = { __typename?: 'Query', getUser: { __typename?: 'User', id: string, name: string, first: string, last: string, email: string, phone: string, venmo?: string | null | undefined, isBeeping: boolean, isEmailVerified: boolean, isStudent: boolean, groupRate: number, singlesRate: number, photoUrl?: string | null | undefined, capacity: number, masksRequired: boolean, username: string, role: string, cashapp?: string | null | undefined, queueSize: number } };

export type UserUpdatesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type UserUpdatesSubscription = { __typename?: 'Subscription', getUserUpdates: { __typename?: 'User', id: string, name: string, first: string, last: string, email: string, phone: string, venmo?: string | null | undefined, isBeeping: boolean, isEmailVerified: boolean, isStudent: boolean, groupRate: number, singlesRate: number, photoUrl?: string | null | undefined, capacity: number, masksRequired: boolean, username: string, role: string, cashapp?: string | null | undefined, queueSize: number } };

export type ResendEmailMutationVariables = Exact<{ [key: string]: never; }>;


export type ResendEmailMutation = { __typename?: 'Mutation', resendEmailVarification: boolean };

export type GetBeepsQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
  show?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;


export type GetBeepsQuery = { __typename?: 'Query', getBeeps: { __typename?: 'BeepsResponse', count: number, items: Array<{ __typename?: 'Beep', id: string, origin: string, destination: string, start: any, end: any, groupSize: number, beeper: { __typename?: 'User', id: string, photoUrl?: string | null | undefined, username: string, first: string, last: string, name: string }, rider: { __typename?: 'User', id: string, photoUrl?: string | null | undefined, username: string, first: string, last: string, name: string } }> } };

export type GetQueueSubscriptionVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetQueueSubscription = { __typename?: 'Subscription', getBeeperUpdates: Array<{ __typename?: 'QueueEntry', id: string, origin: string, destination: string, start: number, groupSize: number, isAccepted: boolean, state: number, rider: { __typename?: 'User', id: string, photoUrl?: string | null | undefined, username: string, first: string, last: string, name: string } }> };

export type GetRatingsQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
  show?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;


export type GetRatingsQuery = { __typename?: 'Query', getRatings: { __typename?: 'RatingsResponse', count: number, items: Array<{ __typename?: 'Rating', id: string, timestamp: any, message?: string | null | undefined, stars: number, rater: { __typename?: 'User', id: string, name: string, photoUrl?: string | null | undefined, username: string }, rated: { __typename?: 'User', id: string, name: string, photoUrl?: string | null | undefined, username: string } }> } };

export type GetReportsQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
  show?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;


export type GetReportsQuery = { __typename?: 'Query', getReports: { __typename?: 'ReportsResponse', count: number, items: Array<{ __typename?: 'Report', id: string, timestamp: any, reason: string, handled: boolean, handledBy?: { __typename?: 'User', id: string, name: string, photoUrl?: string | null | undefined, username: string } | null | undefined, reporter: { __typename?: 'User', id: string, name: string, photoUrl?: string | null | undefined, username: string }, reported: { __typename?: 'User', id: string, name: string, photoUrl?: string | null | undefined, username: string } }> } };

export type SendNotificationMutationVariables = Exact<{
  title: Scalars['String'];
  body: Scalars['String'];
  id: Scalars['String'];
}>;


export type SendNotificationMutation = { __typename?: 'Mutation', sendNotification: boolean };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

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


export type EditAccountMutation = { __typename?: 'Mutation', editAccount: { __typename?: 'User', id: string } };

export type AddProfilePictureMutationVariables = Exact<{
  picture: Scalars['Upload'];
}>;


export type AddProfilePictureMutation = { __typename?: 'Mutation', addProfilePicture: { __typename?: 'User', photoUrl?: string | null | undefined } };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'Auth', tokens: { __typename?: 'TokenEntry', id: string, tokenid: string }, user: { __typename?: 'User', id: string, name: string, first: string, last: string, email: string, phone: string, venmo?: string | null | undefined, isBeeping: boolean, isEmailVerified: boolean, isStudent: boolean, groupRate: number, singlesRate: number, photoUrl?: string | null | undefined, capacity: number, masksRequired: boolean, username: string, role: string, cashapp?: string | null | undefined, queueSize: number } } };

export type ResetPasswordMutationVariables = Exact<{
  id: Scalars['String'];
  password: Scalars['String'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: boolean };

export type SignUpMutationVariables = Exact<{
  first: Scalars['String'];
  last: Scalars['String'];
  email: Scalars['String'];
  phone: Scalars['String'];
  venmo?: InputMaybe<Scalars['String']>;
  cashapp?: InputMaybe<Scalars['String']>;
  username: Scalars['String'];
  password: Scalars['String'];
  picture?: InputMaybe<Scalars['Upload']>;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signup: { __typename?: 'Auth', tokens: { __typename?: 'TokenEntry', id: string, tokenid: string }, user: { __typename?: 'User', id: string, name: string, first: string, last: string, email: string, phone: string, venmo?: string | null | undefined, isBeeping: boolean, isEmailVerified: boolean, isStudent: boolean, groupRate: number, singlesRate: number, photoUrl?: string | null | undefined, capacity: number, masksRequired: boolean, username: string, role: string, cashapp?: string | null | undefined, queueSize: number } } };

export type VerifyAccountMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type VerifyAccountMutation = { __typename?: 'Mutation', verifyAccount: boolean };

export type GetBeeperListQueryVariables = Exact<{
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  radius?: InputMaybe<Scalars['Float']>;
}>;


export type GetBeeperListQuery = { __typename?: 'Query', getBeeperList: Array<{ __typename?: 'User', id: string, username: string, name: string, photoUrl?: string | null | undefined, singlesRate: number, groupRate: number, capacity: number, isStudent: boolean, queueSize: number, masksRequired: boolean, location?: { __typename?: 'Point', longitude: number, latitude: number } | null | undefined }> };

export type GetInProgressBeepsQueryVariables = Exact<{
  show?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;


export type GetInProgressBeepsQuery = { __typename?: 'Query', getInProgressBeeps: { __typename?: 'BeepsInProgressResponse', count: number, items: Array<{ __typename?: 'QueueEntry', id: string, origin: string, destination: string, start: number, groupSize: number, isAccepted: boolean, state: number, beeper: { __typename?: 'User', id: string, name: string, photoUrl?: string | null | undefined, username: string }, rider: { __typename?: 'User', id: string, name: string, photoUrl?: string | null | undefined, username: string } }> } };

export type DeleteBeepMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteBeepMutation = { __typename?: 'Mutation', deleteBeep: boolean };

export type GetBeepQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetBeepQuery = { __typename?: 'Query', getBeep: { __typename?: 'Beep', id: string, origin: string, destination: string, start: any, end: any, groupSize: number, beeper: { __typename?: 'User', id: string, name: string, photoUrl?: string | null | undefined, username: string }, rider: { __typename?: 'User', id: string, name: string, photoUrl?: string | null | undefined, username: string } } };

export type GetBeepsQueryVariables = Exact<{
  show?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;


export type GetBeepsQuery = { __typename?: 'Query', getBeeps: { __typename?: 'BeepsResponse', count: number, items: Array<{ __typename?: 'Beep', id: string, origin: string, destination: string, start: any, end: any, groupSize: number, beeper: { __typename?: 'User', id: string, name: string, photoUrl?: string | null | undefined, username: string }, rider: { __typename?: 'User', id: string, name: string, photoUrl?: string | null | undefined, username: string } }> } };

export type SendNotificationsMutationVariables = Exact<{
  title: Scalars['String'];
  body: Scalars['String'];
  match?: InputMaybe<Scalars['String']>;
}>;


export type SendNotificationsMutation = { __typename?: 'Mutation', sendNotifications: number };

export type CleanObjectStorageBucketMutationVariables = Exact<{ [key: string]: never; }>;


export type CleanObjectStorageBucketMutation = { __typename?: 'Mutation', cleanObjectStorageBucket: number };

export type DeleteRatingMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteRatingMutation = { __typename?: 'Mutation', deleteRating: boolean };

export type GetRatingQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetRatingQuery = { __typename?: 'Query', getRating: { __typename?: 'Rating', id: string, message?: string | null | undefined, stars: number, timestamp: any, beep: { __typename?: 'Beep', id: string }, rater: { __typename?: 'User', id: string, name: string, photoUrl?: string | null | undefined, username: string }, rated: { __typename?: 'User', id: string, name: string, photoUrl?: string | null | undefined, username: string } } };

export type GetRatingsQueryVariables = Exact<{
  show?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;


export type GetRatingsQuery = { __typename?: 'Query', getRatings: { __typename?: 'RatingsResponse', count: number, items: Array<{ __typename?: 'Rating', id: string, timestamp: any, message?: string | null | undefined, stars: number, rater: { __typename?: 'User', id: string, name: string, photoUrl?: string | null | undefined, username: string }, rated: { __typename?: 'User', id: string, name: string, photoUrl?: string | null | undefined, username: string } }> } };

export type DeleteReportMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteReportMutation = { __typename?: 'Mutation', deleteReport: boolean };

export type UpdateReportMutationVariables = Exact<{
  id: Scalars['String'];
  notes?: InputMaybe<Scalars['String']>;
  handled?: InputMaybe<Scalars['Boolean']>;
}>;


export type UpdateReportMutation = { __typename?: 'Mutation', updateReport: { __typename?: 'Report', id: string } };

export type GetReportQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetReportQuery = { __typename?: 'Query', getReport: { __typename?: 'Report', id: string, reason: string, timestamp: any, handled: boolean, notes?: string | null | undefined, beep?: { __typename?: 'Beep', id: string } | null | undefined, reporter: { __typename?: 'User', id: string, name: string, photoUrl?: string | null | undefined, username: string }, reported: { __typename?: 'User', id: string, name: string, photoUrl?: string | null | undefined, username: string }, handledBy?: { __typename?: 'User', id: string, name: string, photoUrl?: string | null | undefined, username: string } | null | undefined } };

export type GetReportsQueryVariables = Exact<{
  show?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;


export type GetReportsQuery = { __typename?: 'Query', getReports: { __typename?: 'ReportsResponse', count: number, items: Array<{ __typename?: 'Report', id: string, timestamp: any, reason: string, notes?: string | null | undefined, handled: boolean, reporter: { __typename?: 'User', id: string, name: string, photoUrl?: string | null | undefined, username: string }, reported: { __typename?: 'User', id: string, name: string, photoUrl?: string | null | undefined, username: string } }> } };

export type BeepersLocationSubscriptionVariables = Exact<{
  id: Scalars['String'];
}>;


export type BeepersLocationSubscription = { __typename?: 'Subscription', getLocationUpdates?: { __typename?: 'Point', latitude: number, longitude: number } | null | undefined };

export type GetUserQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUser: { __typename?: 'User', id: string, name: string, isBeeping: boolean, isStudent: boolean, isEmailVerified: boolean, role: string, venmo?: string | null | undefined, cashapp?: string | null | undefined, singlesRate: number, groupRate: number, capacity: number, masksRequired: boolean, photoUrl?: string | null | undefined, queueSize: number, phone: string, username: string, rating?: number | null | undefined, email: string, created?: any | null | undefined, pushToken?: string | null | undefined, location?: { __typename?: 'Point', latitude: number, longitude: number } | null | undefined, queue: Array<{ __typename?: 'QueueEntry', id: string, origin: string, destination: string, start: number, groupSize: number, isAccepted: boolean, state: number, rider: { __typename?: 'User', id: string, photoUrl?: string | null | undefined, username: string, first: string, last: string, name: string } }> } };

export type RemoveUserMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type RemoveUserMutation = { __typename?: 'Mutation', removeUser: boolean };

export type VerifyUserMutationVariables = Exact<{
  id: Scalars['String'];
  data: EditUserValidator;
}>;


export type VerifyUserMutation = { __typename?: 'Mutation', editUser: { __typename?: 'User', username: string } };

export type ClearQueueMutationVariables = Exact<{
  id: Scalars['String'];
  stopBeeping: Scalars['Boolean'];
}>;


export type ClearQueueMutation = { __typename?: 'Mutation', clearQueue: boolean };

export type GetEditableUserQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetEditableUserQuery = { __typename?: 'Query', getUser: { __typename?: 'User', first: string, last: string, isBeeping: boolean, isStudent: boolean, isEmailVerified: boolean, role: string, venmo?: string | null | undefined, singlesRate: number, groupRate: number, capacity: number, masksRequired: boolean, photoUrl?: string | null | undefined, queueSize: number, phone: string, username: string, email: string, cashapp?: string | null | undefined, pushToken?: string | null | undefined } };

export type EditUserMutationVariables = Exact<{
  id: Scalars['String'];
  data: EditUserValidator;
}>;


export type EditUserMutation = { __typename?: 'Mutation', editUser: { __typename?: 'User', username: string } };

export type UserLocationQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type UserLocationQuery = { __typename?: 'Query', getUser: { __typename?: 'User', id: string, name: string, photoUrl?: string | null | undefined, location?: { __typename?: 'Point', latitude: number, longitude: number } | null | undefined } };

export type LocationUpdateMutationVariables = Exact<{
  id: Scalars['String'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
}>;


export type LocationUpdateMutation = { __typename?: 'Mutation', setLocation: boolean };

export type GetUsersQueryVariables = Exact<{
  show?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
}>;


export type GetUsersQuery = { __typename?: 'Query', getUsers: { __typename?: 'UsersResponse', count: number, items: Array<{ __typename?: 'User', id: string, photoUrl?: string | null | undefined, name: string, email: string, isStudent: boolean, isEmailVerified: boolean, username: string, phone: string, isBeeping: boolean }> } };


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
    queueSize
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
    subscription UserUpdates {
  getUserUpdates {
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
    queueSize
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
 *   },
 * });
 */
export function useUserUpdatesSubscription(baseOptions?: Apollo.SubscriptionHookOptions<UserUpdatesSubscription, UserUpdatesSubscriptionVariables>) {
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
export const GetBeepsDocument = gql`
    query GetBeeps($id: String, $show: Int, $offset: Int) {
  getBeeps(id: $id, show: $show, offset: $offset) {
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
 *      id: // value for 'id'
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
export const GetQueueDocument = gql`
    subscription GetQueue($id: String!) {
  getBeeperUpdates(id: $id) {
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
export function useGetQueueSubscription(baseOptions: Apollo.SubscriptionHookOptions<GetQueueSubscription, GetQueueSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<GetQueueSubscription, GetQueueSubscriptionVariables>(GetQueueDocument, options);
      }
export type GetQueueSubscriptionHookResult = ReturnType<typeof useGetQueueSubscription>;
export type GetQueueSubscriptionResult = Apollo.SubscriptionResult<GetQueueSubscription>;
export const GetRatingsDocument = gql`
    query GetRatings($id: String, $show: Int, $offset: Int) {
  getRatings(id: $id, show: $show, offset: $offset) {
    items {
      id
      timestamp
      message
      stars
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
export const GetReportsDocument = gql`
    query GetReports($id: String, $show: Int, $offset: Int) {
  getReports(id: $id, show: $show, offset: $offset) {
    items {
      id
      timestamp
      reason
      handled
      handledBy {
        id
        name
        photoUrl
        username
      }
      reporter {
        id
        name
        photoUrl
        username
      }
      reported {
        id
        name
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
 *      id: // value for 'id'
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
export const SendNotificationDocument = gql`
    mutation SendNotification($title: String!, $body: String!, $id: String!) {
  sendNotification(title: $title, body: $body, id: $id)
}
    `;
export type SendNotificationMutationFn = Apollo.MutationFunction<SendNotificationMutation, SendNotificationMutationVariables>;

/**
 * __useSendNotificationMutation__
 *
 * To run a mutation, you first call `useSendNotificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendNotificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendNotificationMutation, { data, loading, error }] = useSendNotificationMutation({
 *   variables: {
 *      title: // value for 'title'
 *      body: // value for 'body'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSendNotificationMutation(baseOptions?: Apollo.MutationHookOptions<SendNotificationMutation, SendNotificationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendNotificationMutation, SendNotificationMutationVariables>(SendNotificationDocument, options);
      }
export type SendNotificationMutationHookResult = ReturnType<typeof useSendNotificationMutation>;
export type SendNotificationMutationResult = Apollo.MutationResult<SendNotificationMutation>;
export type SendNotificationMutationOptions = Apollo.BaseMutationOptions<SendNotificationMutation, SendNotificationMutationVariables>;
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
export const ChangePasswordDocument = gql`
    mutation ChangePassword($password: String!) {
  changePassword(input: {password: $password})
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
    user {
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
      queueSize
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
  resetPassword(id: $id, input: {password: $password})
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
    mutation SignUp($first: String!, $last: String!, $email: String!, $phone: String!, $venmo: String, $cashapp: String, $username: String!, $password: String!, $picture: Upload) {
  signup(
    input: {first: $first, last: $last, email: $email, phone: $phone, venmo: $venmo, cashapp: $cashapp, username: $username, password: $password, picture: $picture}
  ) {
    tokens {
      id
      tokenid
    }
    user {
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
      queueSize
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
 *      picture: // value for 'picture'
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
export const GetBeeperListDocument = gql`
    query GetBeeperList($latitude: Float!, $longitude: Float!, $radius: Float) {
  getBeeperList(
    input: {latitude: $latitude, longitude: $longitude, radius: $radius}
  ) {
    id
    username
    name
    photoUrl
    singlesRate
    groupRate
    capacity
    isStudent
    queueSize
    masksRequired
    location {
      longitude
      latitude
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
export function useGetBeeperListQuery(baseOptions: Apollo.QueryHookOptions<GetBeeperListQuery, GetBeeperListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBeeperListQuery, GetBeeperListQueryVariables>(GetBeeperListDocument, options);
      }
export function useGetBeeperListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBeeperListQuery, GetBeeperListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBeeperListQuery, GetBeeperListQueryVariables>(GetBeeperListDocument, options);
        }
export type GetBeeperListQueryHookResult = ReturnType<typeof useGetBeeperListQuery>;
export type GetBeeperListLazyQueryHookResult = ReturnType<typeof useGetBeeperListLazyQuery>;
export type GetBeeperListQueryResult = Apollo.QueryResult<GetBeeperListQuery, GetBeeperListQueryVariables>;
export const GetInProgressBeepsDocument = gql`
    query getInProgressBeeps($show: Int, $offset: Int) {
  getInProgressBeeps(show: $show, offset: $offset) {
    items {
      id
      origin
      destination
      start
      groupSize
      isAccepted
      state
      beeper {
        id
        name
        photoUrl
        username
      }
      rider {
        id
        name
        photoUrl
        username
      }
    }
    count
  }
}
    `;

/**
 * __useGetInProgressBeepsQuery__
 *
 * To run a query within a React component, call `useGetInProgressBeepsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInProgressBeepsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInProgressBeepsQuery({
 *   variables: {
 *      show: // value for 'show'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetInProgressBeepsQuery(baseOptions?: Apollo.QueryHookOptions<GetInProgressBeepsQuery, GetInProgressBeepsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInProgressBeepsQuery, GetInProgressBeepsQueryVariables>(GetInProgressBeepsDocument, options);
      }
export function useGetInProgressBeepsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInProgressBeepsQuery, GetInProgressBeepsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInProgressBeepsQuery, GetInProgressBeepsQueryVariables>(GetInProgressBeepsDocument, options);
        }
export type GetInProgressBeepsQueryHookResult = ReturnType<typeof useGetInProgressBeepsQuery>;
export type GetInProgressBeepsLazyQueryHookResult = ReturnType<typeof useGetInProgressBeepsLazyQuery>;
export type GetInProgressBeepsQueryResult = Apollo.QueryResult<GetInProgressBeepsQuery, GetInProgressBeepsQueryVariables>;
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
      name
      photoUrl
      username
    }
    rider {
      id
      name
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
        name
        photoUrl
        username
      }
      rider {
        id
        name
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
export const SendNotificationsDocument = gql`
    mutation SendNotifications($title: String!, $body: String!, $match: String) {
  sendNotifications(title: $title, body: $body, match: $match)
}
    `;
export type SendNotificationsMutationFn = Apollo.MutationFunction<SendNotificationsMutation, SendNotificationsMutationVariables>;

/**
 * __useSendNotificationsMutation__
 *
 * To run a mutation, you first call `useSendNotificationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendNotificationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendNotificationsMutation, { data, loading, error }] = useSendNotificationsMutation({
 *   variables: {
 *      title: // value for 'title'
 *      body: // value for 'body'
 *      match: // value for 'match'
 *   },
 * });
 */
export function useSendNotificationsMutation(baseOptions?: Apollo.MutationHookOptions<SendNotificationsMutation, SendNotificationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendNotificationsMutation, SendNotificationsMutationVariables>(SendNotificationsDocument, options);
      }
export type SendNotificationsMutationHookResult = ReturnType<typeof useSendNotificationsMutation>;
export type SendNotificationsMutationResult = Apollo.MutationResult<SendNotificationsMutation>;
export type SendNotificationsMutationOptions = Apollo.BaseMutationOptions<SendNotificationsMutation, SendNotificationsMutationVariables>;
export const CleanObjectStorageBucketDocument = gql`
    mutation CleanObjectStorageBucket {
  cleanObjectStorageBucket
}
    `;
export type CleanObjectStorageBucketMutationFn = Apollo.MutationFunction<CleanObjectStorageBucketMutation, CleanObjectStorageBucketMutationVariables>;

/**
 * __useCleanObjectStorageBucketMutation__
 *
 * To run a mutation, you first call `useCleanObjectStorageBucketMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCleanObjectStorageBucketMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cleanObjectStorageBucketMutation, { data, loading, error }] = useCleanObjectStorageBucketMutation({
 *   variables: {
 *   },
 * });
 */
export function useCleanObjectStorageBucketMutation(baseOptions?: Apollo.MutationHookOptions<CleanObjectStorageBucketMutation, CleanObjectStorageBucketMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CleanObjectStorageBucketMutation, CleanObjectStorageBucketMutationVariables>(CleanObjectStorageBucketDocument, options);
      }
export type CleanObjectStorageBucketMutationHookResult = ReturnType<typeof useCleanObjectStorageBucketMutation>;
export type CleanObjectStorageBucketMutationResult = Apollo.MutationResult<CleanObjectStorageBucketMutation>;
export type CleanObjectStorageBucketMutationOptions = Apollo.BaseMutationOptions<CleanObjectStorageBucketMutation, CleanObjectStorageBucketMutationVariables>;
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
      name
      photoUrl
      username
    }
    reported {
      id
      name
      photoUrl
      username
    }
    handledBy {
      id
      name
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
        name
        photoUrl
        username
      }
      reported {
        id
        name
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
export function useBeepersLocationSubscription(baseOptions: Apollo.SubscriptionHookOptions<BeepersLocationSubscription, BeepersLocationSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<BeepersLocationSubscription, BeepersLocationSubscriptionVariables>(BeepersLocationDocument, options);
      }
export type BeepersLocationSubscriptionHookResult = ReturnType<typeof useBeepersLocationSubscription>;
export type BeepersLocationSubscriptionResult = Apollo.SubscriptionResult<BeepersLocationSubscription>;
export const GetUserDocument = gql`
    query GetUser($id: String!) {
  getUser(id: $id) {
    id
    name
    isBeeping
    isStudent
    isEmailVerified
    role
    venmo
    cashapp
    singlesRate
    groupRate
    capacity
    masksRequired
    photoUrl
    queueSize
    phone
    username
    rating
    email
    created
    pushToken
    location {
      latitude
      longitude
    }
    queue {
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
export const VerifyUserDocument = gql`
    mutation VerifyUser($id: String!, $data: EditUserValidator!) {
  editUser(id: $id, data: $data) {
    username
  }
}
    `;
export type VerifyUserMutationFn = Apollo.MutationFunction<VerifyUserMutation, VerifyUserMutationVariables>;

/**
 * __useVerifyUserMutation__
 *
 * To run a mutation, you first call `useVerifyUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyUserMutation, { data, loading, error }] = useVerifyUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useVerifyUserMutation(baseOptions?: Apollo.MutationHookOptions<VerifyUserMutation, VerifyUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifyUserMutation, VerifyUserMutationVariables>(VerifyUserDocument, options);
      }
export type VerifyUserMutationHookResult = ReturnType<typeof useVerifyUserMutation>;
export type VerifyUserMutationResult = Apollo.MutationResult<VerifyUserMutation>;
export type VerifyUserMutationOptions = Apollo.BaseMutationOptions<VerifyUserMutation, VerifyUserMutationVariables>;
export const ClearQueueDocument = gql`
    mutation ClearQueue($id: String!, $stopBeeping: Boolean!) {
  clearQueue(id: $id, stopBeeping: $stopBeeping)
}
    `;
export type ClearQueueMutationFn = Apollo.MutationFunction<ClearQueueMutation, ClearQueueMutationVariables>;

/**
 * __useClearQueueMutation__
 *
 * To run a mutation, you first call `useClearQueueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClearQueueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [clearQueueMutation, { data, loading, error }] = useClearQueueMutation({
 *   variables: {
 *      id: // value for 'id'
 *      stopBeeping: // value for 'stopBeeping'
 *   },
 * });
 */
export function useClearQueueMutation(baseOptions?: Apollo.MutationHookOptions<ClearQueueMutation, ClearQueueMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ClearQueueMutation, ClearQueueMutationVariables>(ClearQueueDocument, options);
      }
export type ClearQueueMutationHookResult = ReturnType<typeof useClearQueueMutation>;
export type ClearQueueMutationResult = Apollo.MutationResult<ClearQueueMutation>;
export type ClearQueueMutationOptions = Apollo.BaseMutationOptions<ClearQueueMutation, ClearQueueMutationVariables>;
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
export const UserLocationDocument = gql`
    query UserLocation($id: String!) {
  getUser(id: $id) {
    id
    name
    photoUrl
    location {
      latitude
      longitude
    }
  }
}
    `;

/**
 * __useUserLocationQuery__
 *
 * To run a query within a React component, call `useUserLocationQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserLocationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserLocationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserLocationQuery(baseOptions: Apollo.QueryHookOptions<UserLocationQuery, UserLocationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserLocationQuery, UserLocationQueryVariables>(UserLocationDocument, options);
      }
export function useUserLocationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserLocationQuery, UserLocationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserLocationQuery, UserLocationQueryVariables>(UserLocationDocument, options);
        }
export type UserLocationQueryHookResult = ReturnType<typeof useUserLocationQuery>;
export type UserLocationLazyQueryHookResult = ReturnType<typeof useUserLocationLazyQuery>;
export type UserLocationQueryResult = Apollo.QueryResult<UserLocationQuery, UserLocationQueryVariables>;
export const LocationUpdateDocument = gql`
    mutation LocationUpdate($id: String!, $latitude: Float!, $longitude: Float!) {
  setLocation(location: {latitude: $latitude, longitude: $longitude}, id: $id)
}
    `;
export type LocationUpdateMutationFn = Apollo.MutationFunction<LocationUpdateMutation, LocationUpdateMutationVariables>;

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
 *      id: // value for 'id'
 *      latitude: // value for 'latitude'
 *      longitude: // value for 'longitude'
 *   },
 * });
 */
export function useLocationUpdateMutation(baseOptions?: Apollo.MutationHookOptions<LocationUpdateMutation, LocationUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LocationUpdateMutation, LocationUpdateMutationVariables>(LocationUpdateDocument, options);
      }
export type LocationUpdateMutationHookResult = ReturnType<typeof useLocationUpdateMutation>;
export type LocationUpdateMutationResult = Apollo.MutationResult<LocationUpdateMutation>;
export type LocationUpdateMutationOptions = Apollo.BaseMutationOptions<LocationUpdateMutation, LocationUpdateMutationVariables>;
export const GetUsersDocument = gql`
    query getUsers($show: Int, $offset: Int, $query: String) {
  getUsers(show: $show, offset: $offset, query: $query) {
    items {
      id
      photoUrl
      name
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
 *      query: // value for 'query'
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