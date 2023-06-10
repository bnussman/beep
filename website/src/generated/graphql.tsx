import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type AnonymousBeeper = {
  __typename?: 'AnonymousBeeper';
  id: Scalars['String']['output'];
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
};

export type Auth = {
  __typename?: 'Auth';
  tokens: TokenEntry;
  user: User;
};

export type Beep = {
  __typename?: 'Beep';
  beeper: User;
  destination: Scalars['String']['output'];
  end?: Maybe<Scalars['DateTime']['output']>;
  groupSize: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  origin: Scalars['String']['output'];
  position: Scalars['Float']['output'];
  rider: User;
  start: Scalars['DateTime']['output'];
  status: Scalars['String']['output'];
};

export type BeeperSettingsInput = {
  capacity?: InputMaybe<Scalars['Float']['input']>;
  groupRate?: InputMaybe<Scalars['Float']['input']>;
  isBeeping?: InputMaybe<Scalars['Boolean']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  singlesRate?: InputMaybe<Scalars['Float']['input']>;
};

export type BeepsResponse = {
  __typename?: 'BeepsResponse';
  count: Scalars['Int']['output'];
  items: Array<Beep>;
};

export type Car = {
  __typename?: 'Car';
  color: Scalars['String']['output'];
  created: Scalars['DateTime']['output'];
  default: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  make: Scalars['String']['output'];
  model: Scalars['String']['output'];
  photo: Scalars['String']['output'];
  updated: Scalars['DateTime']['output'];
  user: User;
  year: Scalars['Float']['output'];
};

export type CarsResponse = {
  __typename?: 'CarsResponse';
  count: Scalars['Int']['output'];
  items: Array<Car>;
};

export type ChangePasswordInput = {
  password: Scalars['String']['input'];
};

export type EditUserInput = {
  capacity?: InputMaybe<Scalars['Float']['input']>;
  cashapp?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['String']['input']>;
  groupRate?: InputMaybe<Scalars['Float']['input']>;
  isBeeping?: InputMaybe<Scalars['Boolean']['input']>;
  isEmailVerified?: InputMaybe<Scalars['Boolean']['input']>;
  isStudent?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
  pushToken?: InputMaybe<Scalars['String']['input']>;
  queueSize?: InputMaybe<Scalars['Float']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  singlesRate?: InputMaybe<Scalars['Float']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
  venmo?: InputMaybe<Scalars['String']['input']>;
};

export type Feedback = {
  __typename?: 'Feedback';
  created: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  message: Scalars['String']['output'];
  user: User;
};

export type FeedbackResonse = {
  __typename?: 'FeedbackResonse';
  count: Scalars['Int']['output'];
  items: Array<Feedback>;
};

export type GetBeepInput = {
  destination: Scalars['String']['input'];
  groupSize: Scalars['Float']['input'];
  origin: Scalars['String']['input'];
};

export type LocationInput = {
  accuracy?: InputMaybe<Scalars['Float']['input']>;
  altitude?: InputMaybe<Scalars['Float']['input']>;
  altitudeAccuracy?: InputMaybe<Scalars['Float']['input']>;
  heading?: InputMaybe<Scalars['Float']['input']>;
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  speed?: InputMaybe<Scalars['Float']['input']>;
};

export type LoginInput = {
  password: Scalars['String']['input'];
  pushToken?: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addProfilePicture: User;
  cancelBeep: Scalars['Boolean']['output'];
  changePassword: Scalars['Boolean']['output'];
  chooseBeep: Beep;
  cleanObjectStorageBucket: Scalars['Float']['output'];
  clearQueue: Scalars['Boolean']['output'];
  createCar: Car;
  createFeedback: Feedback;
  deleteAccount: Scalars['Boolean']['output'];
  deleteBeep: Scalars['Boolean']['output'];
  deleteCar: Scalars['Boolean']['output'];
  deleteRating: Scalars['Boolean']['output'];
  deleteReport: Scalars['Boolean']['output'];
  editCar: Car;
  editUser: User;
  forgotPassword: Scalars['Boolean']['output'];
  leaveQueue: Scalars['Boolean']['output'];
  login: Auth;
  logout: Scalars['Boolean']['output'];
  rateUser: Scalars['Boolean']['output'];
  removeToken: Scalars['Boolean']['output'];
  removeUser: Scalars['Boolean']['output'];
  reportUser: Scalars['Boolean']['output'];
  resendEmailVarification: Scalars['Boolean']['output'];
  resetPassword: Scalars['Boolean']['output'];
  sendNotification: Scalars['Boolean']['output'];
  sendNotifications: Scalars['Float']['output'];
  setBeeperQueue: Array<Beep>;
  setBeeperStatus: User;
  setLocation: User;
  signup: Auth;
  updateReport: Report;
  verifyAccount: Scalars['Boolean']['output'];
};


export type MutationAddProfilePictureArgs = {
  picture: Scalars['Upload']['input'];
};


export type MutationCancelBeepArgs = {
  id: Scalars['String']['input'];
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationChooseBeepArgs = {
  beeperId: Scalars['String']['input'];
  input: GetBeepInput;
};


export type MutationClearQueueArgs = {
  id: Scalars['String']['input'];
  stopBeeping: Scalars['Boolean']['input'];
};


export type MutationCreateCarArgs = {
  color: Scalars['String']['input'];
  make: Scalars['String']['input'];
  model: Scalars['String']['input'];
  photo?: InputMaybe<Scalars['Upload']['input']>;
  year: Scalars['Float']['input'];
};


export type MutationCreateFeedbackArgs = {
  message: Scalars['String']['input'];
};


export type MutationDeleteBeepArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteCarArgs = {
  id: Scalars['String']['input'];
  notification?: InputMaybe<Scalars['String']['input']>;
};


export type MutationDeleteRatingArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteReportArgs = {
  id: Scalars['String']['input'];
};


export type MutationEditCarArgs = {
  default: Scalars['Boolean']['input'];
  id: Scalars['String']['input'];
};


export type MutationEditUserArgs = {
  data: EditUserInput;
  id?: InputMaybe<Scalars['String']['input']>;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationLeaveQueueArgs = {
  id: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationLogoutArgs = {
  isApp?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationRateUserArgs = {
  input: RatingInput;
};


export type MutationRemoveTokenArgs = {
  token: Scalars['String']['input'];
};


export type MutationRemoveUserArgs = {
  id: Scalars['String']['input'];
};


export type MutationReportUserArgs = {
  input: ReportInput;
};


export type MutationResetPasswordArgs = {
  id: Scalars['String']['input'];
  input: ResetPasswordInput;
};


export type MutationSendNotificationArgs = {
  body: Scalars['String']['input'];
  id: Scalars['String']['input'];
  title: Scalars['String']['input'];
};


export type MutationSendNotificationsArgs = {
  body: Scalars['String']['input'];
  match?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};


export type MutationSetBeeperQueueArgs = {
  input: UpdateQueueEntryInput;
};


export type MutationSetBeeperStatusArgs = {
  input: BeeperSettingsInput;
};


export type MutationSetLocationArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
  location: LocationInput;
};


export type MutationSignupArgs = {
  input: SignUpInput;
};


export type MutationUpdateReportArgs = {
  id: Scalars['String']['input'];
  input: UpdateReportInput;
};


export type MutationVerifyAccountArgs = {
  id: Scalars['String']['input'];
};

export type Point = {
  __typename?: 'Point';
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

export type Query = {
  __typename?: 'Query';
  getAllBeepersLocation: Array<AnonymousBeeper>;
  getBeep: Beep;
  getBeepers: Array<User>;
  getBeeps: BeepsResponse;
  getCars: CarsResponse;
  getETA: Scalars['String']['output'];
  getFeedback: FeedbackResonse;
  getInProgressBeeps: BeepsResponse;
  getLastBeepToRate?: Maybe<Beep>;
  getLocationSuggestions: Array<Suggestion>;
  getQueue: Array<Beep>;
  getRating: Rating;
  getRatings: RatingsResponse;
  getRedisChannels: Array<Scalars['String']['output']>;
  getReport: Report;
  getReports: ReportsResponse;
  getRiderStatus?: Maybe<Beep>;
  getUser: User;
  getUsers: UsersResponse;
  getUsersPerDomain: Array<UsersPerDomain>;
  getUsersWithBeeps: UsersWithBeepsResponse;
  getUsersWithRides: UsersWithRidesResponse;
};


export type QueryGetAllBeepersLocationArgs = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  radius: Scalars['Float']['input'];
};


export type QueryGetBeepArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetBeepersArgs = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  radius?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryGetBeepsArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  show?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetCarsArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  show?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetEtaArgs = {
  end: Scalars['String']['input'];
  start: Scalars['String']['input'];
};


export type QueryGetFeedbackArgs = {
  offset?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  show?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetInProgressBeepsArgs = {
  offset?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  show?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetLocationSuggestionsArgs = {
  location: Scalars['String']['input'];
  sessiontoken: Scalars['String']['input'];
};


export type QueryGetQueueArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetRatingArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetRatingsArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  show?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetReportArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetReportsArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  show?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetUserArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetUsersArgs = {
  offset?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  show?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetUsersWithBeepsArgs = {
  offset?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  show?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetUsersWithRidesArgs = {
  offset?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  show?: InputMaybe<Scalars['Int']['input']>;
};

export type Rating = {
  __typename?: 'Rating';
  beep: Beep;
  id: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
  rated: User;
  rater: User;
  stars: Scalars['Float']['output'];
  timestamp: Scalars['DateTime']['output'];
};

export type RatingInput = {
  beepId: Scalars['String']['input'];
  message?: InputMaybe<Scalars['String']['input']>;
  stars: Scalars['Float']['input'];
  userId: Scalars['String']['input'];
};

export type RatingsResponse = {
  __typename?: 'RatingsResponse';
  count: Scalars['Int']['output'];
  items: Array<Rating>;
};

export type Report = {
  __typename?: 'Report';
  beep?: Maybe<Beep>;
  handled: Scalars['Boolean']['output'];
  handledBy?: Maybe<User>;
  id: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  reason: Scalars['String']['output'];
  reported: User;
  reporter: User;
  timestamp: Scalars['DateTime']['output'];
};

export type ReportInput = {
  beepId?: InputMaybe<Scalars['String']['input']>;
  reason: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type ReportsResponse = {
  __typename?: 'ReportsResponse';
  count: Scalars['Int']['output'];
  items: Array<Report>;
};

export type ResetPasswordInput = {
  password: Scalars['String']['input'];
};

export type SignUpInput = {
  cashapp?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  first: Scalars['String']['input'];
  last: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  picture?: InputMaybe<Scalars['Upload']['input']>;
  pushToken?: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
  venmo?: InputMaybe<Scalars['String']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  getBeeperLocationUpdates: AnonymousBeeper;
  getBeeperUpdates: Array<Beep>;
  getLocationUpdates?: Maybe<Point>;
  getRiderUpdates?: Maybe<Beep>;
  getUserUpdates: User;
};


export type SubscriptionGetBeeperLocationUpdatesArgs = {
  anonymize?: InputMaybe<Scalars['Boolean']['input']>;
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  radius: Scalars['Float']['input'];
};


export type SubscriptionGetBeeperUpdatesArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionGetLocationUpdatesArgs = {
  id: Scalars['String']['input'];
};

export type Suggestion = {
  __typename?: 'Suggestion';
  title: Scalars['String']['output'];
};

export type TokenEntry = {
  __typename?: 'TokenEntry';
  id: Scalars['String']['output'];
  tokenid: Scalars['String']['output'];
  user: User;
};

export type UpdateQueueEntryInput = {
  id: Scalars['String']['input'];
  status: Scalars['String']['input'];
};

export type UpdateReportInput = {
  handled?: InputMaybe<Scalars['Boolean']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  capacity: Scalars['Float']['output'];
  cars?: Maybe<Array<Car>>;
  cashapp?: Maybe<Scalars['String']['output']>;
  created?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  first: Scalars['String']['output'];
  groupRate: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  isBeeping: Scalars['Boolean']['output'];
  isEmailVerified: Scalars['Boolean']['output'];
  isStudent: Scalars['Boolean']['output'];
  last: Scalars['String']['output'];
  location?: Maybe<Point>;
  name: Scalars['String']['output'];
  password: Scalars['String']['output'];
  passwordType: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  photo?: Maybe<Scalars['String']['output']>;
  pushToken?: Maybe<Scalars['String']['output']>;
  queue: Array<Beep>;
  queueSize: Scalars['Float']['output'];
  rating?: Maybe<Scalars['Float']['output']>;
  ratings: Array<Rating>;
  role: Scalars['String']['output'];
  singlesRate: Scalars['Float']['output'];
  username: Scalars['String']['output'];
  venmo?: Maybe<Scalars['String']['output']>;
};

export type UsersPerDomain = {
  __typename?: 'UsersPerDomain';
  count: Scalars['Float']['output'];
  domain: Scalars['String']['output'];
};

export type UsersResponse = {
  __typename?: 'UsersResponse';
  count: Scalars['Int']['output'];
  items: Array<User>;
};

export type UsersWithBeeps = {
  __typename?: 'UsersWithBeeps';
  beeps: Scalars['Float']['output'];
  user: User;
};

export type UsersWithBeepsResponse = {
  __typename?: 'UsersWithBeepsResponse';
  count: Scalars['Int']['output'];
  items: Array<UsersWithBeeps>;
};

export type UsersWithRides = {
  __typename?: 'UsersWithRides';
  rides: Scalars['Float']['output'];
  user: User;
};

export type UsersWithRidesResponse = {
  __typename?: 'UsersWithRidesResponse';
  count: Scalars['Int']['output'];
  items: Array<UsersWithRides>;
};

export type GetUserDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserDataQuery = { __typename?: 'Query', getUser: { __typename?: 'User', id: string, name: string, first: string, last: string, email?: string | null, phone?: string | null, venmo?: string | null, isBeeping: boolean, isEmailVerified: boolean, isStudent: boolean, groupRate: number, singlesRate: number, photo?: string | null, capacity: number, username: string, role: string, cashapp?: string | null, queueSize: number } };

export type UserUpdatesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type UserUpdatesSubscription = { __typename?: 'Subscription', getUserUpdates: { __typename?: 'User', id: string, name: string, first: string, last: string, email?: string | null, phone?: string | null, venmo?: string | null, isBeeping: boolean, isEmailVerified: boolean, isStudent: boolean, groupRate: number, singlesRate: number, photo?: string | null, capacity: number, username: string, role: string, cashapp?: string | null, queueSize: number } };

export type ResendEmailMutationVariables = Exact<{ [key: string]: never; }>;


export type ResendEmailMutation = { __typename?: 'Mutation', resendEmailVarification: boolean };

export type GetBeepsForUserQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']['input']>;
  show?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetBeepsForUserQuery = { __typename?: 'Query', getBeeps: { __typename?: 'BeepsResponse', count: number, items: Array<{ __typename?: 'Beep', id: string, origin: string, destination: string, start: any, end?: any | null, groupSize: number, status: string, beeper: { __typename?: 'User', id: string, photo?: string | null, username: string, first: string, last: string, name: string }, rider: { __typename?: 'User', id: string, photo?: string | null, username: string, first: string, last: string, name: string } }> } };

export type GetCarsForUserQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  show?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetCarsForUserQuery = { __typename?: 'Query', getCars: { __typename?: 'CarsResponse', count: number, items: Array<{ __typename?: 'Car', id: string, make: string, model: string, year: number, color: string, photo: string, created: any, default: boolean }> } };

export type UsersQueueQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']['input']>;
}>;


export type UsersQueueQuery = { __typename?: 'Query', getQueue: Array<{ __typename?: 'Beep', id: string, status: string, rider: { __typename?: 'User', id: string, name: string, photo?: string | null } }> };

export type GetQueueSubscriptionVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetQueueSubscription = { __typename?: 'Subscription', getBeeperUpdates: Array<{ __typename?: 'Beep', id: string, origin: string, destination: string, start: any, groupSize: number, status: string, rider: { __typename?: 'User', id: string, photo?: string | null, username: string, first: string, last: string, name: string } }> };

export type GetRatingsForUserQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']['input']>;
  show?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetRatingsForUserQuery = { __typename?: 'Query', getRatings: { __typename?: 'RatingsResponse', count: number, items: Array<{ __typename?: 'Rating', id: string, timestamp: any, message?: string | null, stars: number, rater: { __typename?: 'User', id: string, name: string, photo?: string | null, username: string }, rated: { __typename?: 'User', id: string, name: string, photo?: string | null, username: string } }> } };

export type GetReportsForUserQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']['input']>;
  show?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetReportsForUserQuery = { __typename?: 'Query', getReports: { __typename?: 'ReportsResponse', count: number, items: Array<{ __typename?: 'Report', id: string, timestamp: any, reason: string, handled: boolean, handledBy?: { __typename?: 'User', id: string, name: string, photo?: string | null, username: string } | null, reporter: { __typename?: 'User', id: string, name: string, photo?: string | null, username: string }, reported: { __typename?: 'User', id: string, name: string, photo?: string | null, username: string } }> } };

export type SendNotificationMutationVariables = Exact<{
  title: Scalars['String']['input'];
  body: Scalars['String']['input'];
  id: Scalars['String']['input'];
}>;


export type SendNotificationMutation = { __typename?: 'Mutation', sendNotification: boolean };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type ChangePasswordMutationVariables = Exact<{
  password: Scalars['String']['input'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: boolean };

export type EditAccountMutationVariables = Exact<{
  data: EditUserInput;
}>;


export type EditAccountMutation = { __typename?: 'Mutation', editUser: { __typename?: 'User', id: string, first: string, last: string, email?: string | null, phone?: string | null, venmo?: string | null, cashapp?: string | null } };

export type AddProfilePictureMutationVariables = Exact<{
  picture: Scalars['Upload']['input'];
}>;


export type AddProfilePictureMutation = { __typename?: 'Mutation', addProfilePicture: { __typename?: 'User', id: string, photo?: string | null } };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'Auth', tokens: { __typename?: 'TokenEntry', id: string, tokenid: string }, user: { __typename?: 'User', id: string, name: string, first: string, last: string, email?: string | null, phone?: string | null, venmo?: string | null, isBeeping: boolean, isEmailVerified: boolean, isStudent: boolean, groupRate: number, singlesRate: number, photo?: string | null, capacity: number, username: string, role: string, cashapp?: string | null, queueSize: number } } };

export type ResetPasswordMutationVariables = Exact<{
  id: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: boolean };

export type SignUpMutationVariables = Exact<{
  first: Scalars['String']['input'];
  last: Scalars['String']['input'];
  email: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  venmo?: InputMaybe<Scalars['String']['input']>;
  cashapp?: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
  picture?: InputMaybe<Scalars['Upload']['input']>;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signup: { __typename?: 'Auth', tokens: { __typename?: 'TokenEntry', id: string, tokenid: string }, user: { __typename?: 'User', id: string, name: string, first: string, last: string, email?: string | null, phone?: string | null, venmo?: string | null, isBeeping: boolean, isEmailVerified: boolean, isStudent: boolean, groupRate: number, singlesRate: number, photo?: string | null, capacity: number, username: string, role: string, cashapp?: string | null, queueSize: number } } };

export type VerifyAccountMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type VerifyAccountMutation = { __typename?: 'Mutation', verifyAccount: boolean };

export type GetUsersPerDomainQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersPerDomainQuery = { __typename?: 'Query', getUsersPerDomain: Array<{ __typename?: 'UsersPerDomain', domain: string, count: number }> };

export type RedisChannelsQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type RedisChannelsQueryQuery = { __typename?: 'Query', getRedisChannels: Array<string> };

export type FeedbackQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  show?: InputMaybe<Scalars['Int']['input']>;
}>;


export type FeedbackQuery = { __typename?: 'Query', getFeedback: { __typename?: 'FeedbackResonse', count: number, items: Array<{ __typename?: 'Feedback', id: string, message: string, created: any, user: { __typename?: 'User', id: string, photo?: string | null, name: string } }> } };

export type GetBeepersQueryVariables = Exact<{
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  radius?: InputMaybe<Scalars['Float']['input']>;
}>;


export type GetBeepersQuery = { __typename?: 'Query', getBeepers: Array<{ __typename?: 'User', id: string, username: string, name: string, photo?: string | null, singlesRate: number, groupRate: number, capacity: number, isStudent: boolean, queueSize: number, location?: { __typename?: 'Point', longitude: number, latitude: number } | null }> };

export type GetBeeperLocationUpdatesSubscriptionVariables = Exact<{
  radius: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  latitude: Scalars['Float']['input'];
  anonymize?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetBeeperLocationUpdatesSubscription = { __typename?: 'Subscription', getBeeperLocationUpdates: { __typename?: 'AnonymousBeeper', id: string, latitude?: number | null, longitude?: number | null } };

export type GetInProgressBeepsQueryVariables = Exact<{
  show?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetInProgressBeepsQuery = { __typename?: 'Query', getInProgressBeeps: { __typename?: 'BeepsResponse', count: number, items: Array<{ __typename?: 'Beep', id: string, origin: string, destination: string, start: any, groupSize: number, status: string, beeper: { __typename?: 'User', id: string, name: string, photo?: string | null, username: string }, rider: { __typename?: 'User', id: string, name: string, photo?: string | null, username: string } }> } };

export type DeleteBeepMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteBeepMutation = { __typename?: 'Mutation', deleteBeep: boolean };

export type GetBeepQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetBeepQuery = { __typename?: 'Query', getBeep: { __typename?: 'Beep', id: string, origin: string, destination: string, start: any, end?: any | null, groupSize: number, beeper: { __typename?: 'User', id: string, name: string, photo?: string | null, username: string }, rider: { __typename?: 'User', id: string, name: string, photo?: string | null, username: string } } };

export type GetBeepsQueryVariables = Exact<{
  show?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetBeepsQuery = { __typename?: 'Query', getBeeps: { __typename?: 'BeepsResponse', count: number, items: Array<{ __typename?: 'Beep', id: string, origin: string, destination: string, start: any, end?: any | null, groupSize: number, status: string, beeper: { __typename?: 'User', id: string, name: string, photo?: string | null, username: string }, rider: { __typename?: 'User', id: string, name: string, photo?: string | null, username: string } }> } };

export type DeleteCarMutationVariables = Exact<{
  id: Scalars['String']['input'];
  notification?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteCarMutation = { __typename?: 'Mutation', deleteCar: boolean };

export type GetCarsQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  show?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetCarsQuery = { __typename?: 'Query', getCars: { __typename?: 'CarsResponse', count: number, items: Array<{ __typename?: 'Car', id: string, make: string, model: string, year: number, color: string, photo: string, created: any, user: { __typename?: 'User', id: string, photo?: string | null, name: string } }> } };

export type GetUsersWithBeepsQueryVariables = Exact<{
  show?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetUsersWithBeepsQuery = { __typename?: 'Query', getUsersWithBeeps: { __typename?: 'UsersWithBeepsResponse', count: number, items: Array<{ __typename?: 'UsersWithBeeps', beeps: number, user: { __typename?: 'User', id: string, photo?: string | null, name: string } }> } };

export type GetUsersWithRidesQueryVariables = Exact<{
  show?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetUsersWithRidesQuery = { __typename?: 'Query', getUsersWithRides: { __typename?: 'UsersWithRidesResponse', count: number, items: Array<{ __typename?: 'UsersWithRides', rides: number, user: { __typename?: 'User', id: string, photo?: string | null, name: string } }> } };

export type SendNotificationsMutationVariables = Exact<{
  title: Scalars['String']['input'];
  body: Scalars['String']['input'];
  match?: InputMaybe<Scalars['String']['input']>;
}>;


export type SendNotificationsMutation = { __typename?: 'Mutation', sendNotifications: number };

export type CleanObjectStorageBucketMutationVariables = Exact<{ [key: string]: never; }>;


export type CleanObjectStorageBucketMutation = { __typename?: 'Mutation', cleanObjectStorageBucket: number };

export type DeleteRatingMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteRatingMutation = { __typename?: 'Mutation', deleteRating: boolean };

export type GetRatingQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetRatingQuery = { __typename?: 'Query', getRating: { __typename?: 'Rating', id: string, message?: string | null, stars: number, timestamp: any, beep: { __typename?: 'Beep', id: string }, rater: { __typename?: 'User', id: string, name: string, photo?: string | null, username: string }, rated: { __typename?: 'User', id: string, name: string, photo?: string | null, username: string } } };

export type GetRatingsQueryVariables = Exact<{
  show?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetRatingsQuery = { __typename?: 'Query', getRatings: { __typename?: 'RatingsResponse', count: number, items: Array<{ __typename?: 'Rating', id: string, timestamp: any, message?: string | null, stars: number, rater: { __typename?: 'User', id: string, name: string, photo?: string | null, username: string }, rated: { __typename?: 'User', id: string, name: string, photo?: string | null, username: string } }> } };

export type DeleteReportMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteReportMutation = { __typename?: 'Mutation', deleteReport: boolean };

export type UpdateReportMutationVariables = Exact<{
  id: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  handled?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UpdateReportMutation = { __typename?: 'Mutation', updateReport: { __typename?: 'Report', id: string, reason: string, timestamp: any, handled: boolean, notes?: string | null, beep?: { __typename?: 'Beep', id: string } | null, reporter: { __typename?: 'User', id: string, name: string, photo?: string | null, username: string }, reported: { __typename?: 'User', id: string, name: string, photo?: string | null, username: string }, handledBy?: { __typename?: 'User', id: string, name: string, photo?: string | null, username: string } | null } };

export type GetReportQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetReportQuery = { __typename?: 'Query', getReport: { __typename?: 'Report', id: string, reason: string, timestamp: any, handled: boolean, notes?: string | null, beep?: { __typename?: 'Beep', id: string } | null, reporter: { __typename?: 'User', id: string, name: string, photo?: string | null, username: string }, reported: { __typename?: 'User', id: string, name: string, photo?: string | null, username: string }, handledBy?: { __typename?: 'User', id: string, name: string, photo?: string | null, username: string } | null } };

export type GetReportsQueryVariables = Exact<{
  show?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetReportsQuery = { __typename?: 'Query', getReports: { __typename?: 'ReportsResponse', count: number, items: Array<{ __typename?: 'Report', id: string, timestamp: any, reason: string, notes?: string | null, handled: boolean, reporter: { __typename?: 'User', id: string, name: string, photo?: string | null, username: string }, reported: { __typename?: 'User', id: string, name: string, photo?: string | null, username: string } }> } };

export type BeepersLocationSubscriptionVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type BeepersLocationSubscription = { __typename?: 'Subscription', getLocationUpdates?: { __typename?: 'Point', latitude: number, longitude: number } | null };

export type GetUserQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUser: { __typename?: 'User', id: string, name: string, first: string, last: string, isBeeping: boolean, isStudent: boolean, isEmailVerified: boolean, role: string, venmo?: string | null, cashapp?: string | null, singlesRate: number, groupRate: number, capacity: number, photo?: string | null, queueSize: number, phone?: string | null, username: string, rating?: number | null, email?: string | null, created?: any | null, pushToken?: string | null, location?: { __typename?: 'Point', latitude: number, longitude: number } | null, queue: Array<{ __typename?: 'Beep', id: string, origin: string, destination: string, start: any, groupSize: number, status: string, rider: { __typename?: 'User', id: string, photo?: string | null, username: string, first: string, last: string, name: string } }> } };

export type RemoveUserMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type RemoveUserMutation = { __typename?: 'Mutation', removeUser: boolean };

export type VerifyUserMutationVariables = Exact<{
  id: Scalars['String']['input'];
  data: EditUserInput;
}>;


export type VerifyUserMutation = { __typename?: 'Mutation', editUser: { __typename?: 'User', id: string, isEmailVerified: boolean, isStudent: boolean } };

export type ClearQueueMutationVariables = Exact<{
  id: Scalars['String']['input'];
  stopBeeping: Scalars['Boolean']['input'];
}>;


export type ClearQueueMutation = { __typename?: 'Mutation', clearQueue: boolean };

export type EditUserMutationVariables = Exact<{
  id: Scalars['String']['input'];
  data: EditUserInput;
}>;


export type EditUserMutation = { __typename?: 'Mutation', editUser: { __typename?: 'User', id: string, first: string, last: string, isBeeping: boolean, isStudent: boolean, isEmailVerified: boolean, role: string, venmo?: string | null, singlesRate: number, groupRate: number, capacity: number, photo?: string | null, queueSize: number, phone?: string | null, username: string, email?: string | null, cashapp?: string | null, pushToken?: string | null } };

export type UserLocationQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type UserLocationQuery = { __typename?: 'Query', getUser: { __typename?: 'User', id: string, name: string, photo?: string | null, username: string, location?: { __typename?: 'Point', latitude: number, longitude: number } | null } };

export type LocationUpdateMutationVariables = Exact<{
  id: Scalars['String']['input'];
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
}>;


export type LocationUpdateMutation = { __typename?: 'Mutation', setLocation: { __typename?: 'User', id: string, location?: { __typename?: 'Point', latitude: number, longitude: number } | null } };

export type GetUsersQueryVariables = Exact<{
  show?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetUsersQuery = { __typename?: 'Query', getUsers: { __typename?: 'UsersResponse', count: number, items: Array<{ __typename?: 'User', id: string, photo?: string | null, name: string, email?: string | null, isStudent: boolean, isEmailVerified: boolean, username: string, phone?: string | null, isBeeping: boolean }> } };


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
    photo
    capacity
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
    photo
    capacity
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
export const GetBeepsForUserDocument = gql`
    query GetBeepsForUser($id: String, $show: Int, $offset: Int) {
  getBeeps(id: $id, show: $show, offset: $offset) {
    items {
      id
      origin
      destination
      start
      end
      groupSize
      status
      beeper {
        id
        photo
        username
        first
        last
        name
      }
      rider {
        id
        photo
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
 * __useGetBeepsForUserQuery__
 *
 * To run a query within a React component, call `useGetBeepsForUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBeepsForUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBeepsForUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *      show: // value for 'show'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetBeepsForUserQuery(baseOptions?: Apollo.QueryHookOptions<GetBeepsForUserQuery, GetBeepsForUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBeepsForUserQuery, GetBeepsForUserQueryVariables>(GetBeepsForUserDocument, options);
      }
export function useGetBeepsForUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBeepsForUserQuery, GetBeepsForUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBeepsForUserQuery, GetBeepsForUserQueryVariables>(GetBeepsForUserDocument, options);
        }
export type GetBeepsForUserQueryHookResult = ReturnType<typeof useGetBeepsForUserQuery>;
export type GetBeepsForUserLazyQueryHookResult = ReturnType<typeof useGetBeepsForUserLazyQuery>;
export type GetBeepsForUserQueryResult = Apollo.QueryResult<GetBeepsForUserQuery, GetBeepsForUserQueryVariables>;
export const GetCarsForUserDocument = gql`
    query GetCarsForUser($id: String, $offset: Int, $show: Int) {
  getCars(id: $id, offset: $offset, show: $show) {
    items {
      id
      make
      model
      year
      color
      photo
      created
      default
    }
    count
  }
}
    `;

/**
 * __useGetCarsForUserQuery__
 *
 * To run a query within a React component, call `useGetCarsForUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCarsForUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCarsForUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *      offset: // value for 'offset'
 *      show: // value for 'show'
 *   },
 * });
 */
export function useGetCarsForUserQuery(baseOptions?: Apollo.QueryHookOptions<GetCarsForUserQuery, GetCarsForUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCarsForUserQuery, GetCarsForUserQueryVariables>(GetCarsForUserDocument, options);
      }
export function useGetCarsForUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCarsForUserQuery, GetCarsForUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCarsForUserQuery, GetCarsForUserQueryVariables>(GetCarsForUserDocument, options);
        }
export type GetCarsForUserQueryHookResult = ReturnType<typeof useGetCarsForUserQuery>;
export type GetCarsForUserLazyQueryHookResult = ReturnType<typeof useGetCarsForUserLazyQuery>;
export type GetCarsForUserQueryResult = Apollo.QueryResult<GetCarsForUserQuery, GetCarsForUserQueryVariables>;
export const UsersQueueDocument = gql`
    query UsersQueue($id: String) {
  getQueue(id: $id) {
    id
    status
    rider {
      id
      name
      photo
    }
  }
}
    `;

/**
 * __useUsersQueueQuery__
 *
 * To run a query within a React component, call `useUsersQueueQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQueueQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQueueQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUsersQueueQuery(baseOptions?: Apollo.QueryHookOptions<UsersQueueQuery, UsersQueueQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersQueueQuery, UsersQueueQueryVariables>(UsersQueueDocument, options);
      }
export function useUsersQueueLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQueueQuery, UsersQueueQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersQueueQuery, UsersQueueQueryVariables>(UsersQueueDocument, options);
        }
export type UsersQueueQueryHookResult = ReturnType<typeof useUsersQueueQuery>;
export type UsersQueueLazyQueryHookResult = ReturnType<typeof useUsersQueueLazyQuery>;
export type UsersQueueQueryResult = Apollo.QueryResult<UsersQueueQuery, UsersQueueQueryVariables>;
export const GetQueueDocument = gql`
    subscription GetQueue($id: String!) {
  getBeeperUpdates(id: $id) {
    id
    origin
    destination
    start
    groupSize
    status
    rider {
      id
      photo
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
export const GetRatingsForUserDocument = gql`
    query GetRatingsForUser($id: String, $show: Int, $offset: Int) {
  getRatings(id: $id, show: $show, offset: $offset) {
    items {
      id
      timestamp
      message
      stars
      rater {
        id
        name
        photo
        username
      }
      rated {
        id
        name
        photo
        username
      }
    }
    count
  }
}
    `;

/**
 * __useGetRatingsForUserQuery__
 *
 * To run a query within a React component, call `useGetRatingsForUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRatingsForUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRatingsForUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *      show: // value for 'show'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetRatingsForUserQuery(baseOptions?: Apollo.QueryHookOptions<GetRatingsForUserQuery, GetRatingsForUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRatingsForUserQuery, GetRatingsForUserQueryVariables>(GetRatingsForUserDocument, options);
      }
export function useGetRatingsForUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRatingsForUserQuery, GetRatingsForUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRatingsForUserQuery, GetRatingsForUserQueryVariables>(GetRatingsForUserDocument, options);
        }
export type GetRatingsForUserQueryHookResult = ReturnType<typeof useGetRatingsForUserQuery>;
export type GetRatingsForUserLazyQueryHookResult = ReturnType<typeof useGetRatingsForUserLazyQuery>;
export type GetRatingsForUserQueryResult = Apollo.QueryResult<GetRatingsForUserQuery, GetRatingsForUserQueryVariables>;
export const GetReportsForUserDocument = gql`
    query GetReportsForUser($id: String, $show: Int, $offset: Int) {
  getReports(id: $id, show: $show, offset: $offset) {
    items {
      id
      timestamp
      reason
      handled
      handledBy {
        id
        name
        photo
        username
      }
      reporter {
        id
        name
        photo
        username
      }
      reported {
        id
        name
        photo
        username
      }
    }
    count
  }
}
    `;

/**
 * __useGetReportsForUserQuery__
 *
 * To run a query within a React component, call `useGetReportsForUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReportsForUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReportsForUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *      show: // value for 'show'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetReportsForUserQuery(baseOptions?: Apollo.QueryHookOptions<GetReportsForUserQuery, GetReportsForUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetReportsForUserQuery, GetReportsForUserQueryVariables>(GetReportsForUserDocument, options);
      }
export function useGetReportsForUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetReportsForUserQuery, GetReportsForUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetReportsForUserQuery, GetReportsForUserQueryVariables>(GetReportsForUserDocument, options);
        }
export type GetReportsForUserQueryHookResult = ReturnType<typeof useGetReportsForUserQuery>;
export type GetReportsForUserLazyQueryHookResult = ReturnType<typeof useGetReportsForUserLazyQuery>;
export type GetReportsForUserQueryResult = Apollo.QueryResult<GetReportsForUserQuery, GetReportsForUserQueryVariables>;
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
    mutation EditAccount($data: EditUserInput!) {
  editUser(data: $data) {
    id
    first
    last
    email
    phone
    venmo
    cashapp
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
 *      data: // value for 'data'
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
    id
    photo
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
      photo
      capacity
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
      photo
      capacity
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
export const GetUsersPerDomainDocument = gql`
    query GetUsersPerDomain {
  getUsersPerDomain {
    domain
    count
  }
}
    `;

/**
 * __useGetUsersPerDomainQuery__
 *
 * To run a query within a React component, call `useGetUsersPerDomainQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersPerDomainQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersPerDomainQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersPerDomainQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersPerDomainQuery, GetUsersPerDomainQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersPerDomainQuery, GetUsersPerDomainQueryVariables>(GetUsersPerDomainDocument, options);
      }
export function useGetUsersPerDomainLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersPerDomainQuery, GetUsersPerDomainQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersPerDomainQuery, GetUsersPerDomainQueryVariables>(GetUsersPerDomainDocument, options);
        }
export type GetUsersPerDomainQueryHookResult = ReturnType<typeof useGetUsersPerDomainQuery>;
export type GetUsersPerDomainLazyQueryHookResult = ReturnType<typeof useGetUsersPerDomainLazyQuery>;
export type GetUsersPerDomainQueryResult = Apollo.QueryResult<GetUsersPerDomainQuery, GetUsersPerDomainQueryVariables>;
export const RedisChannelsQueryDocument = gql`
    query RedisChannelsQuery {
  getRedisChannels
}
    `;

/**
 * __useRedisChannelsQueryQuery__
 *
 * To run a query within a React component, call `useRedisChannelsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useRedisChannelsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRedisChannelsQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useRedisChannelsQueryQuery(baseOptions?: Apollo.QueryHookOptions<RedisChannelsQueryQuery, RedisChannelsQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RedisChannelsQueryQuery, RedisChannelsQueryQueryVariables>(RedisChannelsQueryDocument, options);
      }
export function useRedisChannelsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RedisChannelsQueryQuery, RedisChannelsQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RedisChannelsQueryQuery, RedisChannelsQueryQueryVariables>(RedisChannelsQueryDocument, options);
        }
export type RedisChannelsQueryQueryHookResult = ReturnType<typeof useRedisChannelsQueryQuery>;
export type RedisChannelsQueryLazyQueryHookResult = ReturnType<typeof useRedisChannelsQueryLazyQuery>;
export type RedisChannelsQueryQueryResult = Apollo.QueryResult<RedisChannelsQueryQuery, RedisChannelsQueryQueryVariables>;
export const FeedbackDocument = gql`
    query Feedback($offset: Int, $show: Int) {
  getFeedback(offset: $offset, show: $show) {
    items {
      id
      message
      created
      user {
        id
        photo
        name
      }
    }
    count
  }
}
    `;

/**
 * __useFeedbackQuery__
 *
 * To run a query within a React component, call `useFeedbackQuery` and pass it any options that fit your needs.
 * When your component renders, `useFeedbackQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFeedbackQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      show: // value for 'show'
 *   },
 * });
 */
export function useFeedbackQuery(baseOptions?: Apollo.QueryHookOptions<FeedbackQuery, FeedbackQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FeedbackQuery, FeedbackQueryVariables>(FeedbackDocument, options);
      }
export function useFeedbackLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FeedbackQuery, FeedbackQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FeedbackQuery, FeedbackQueryVariables>(FeedbackDocument, options);
        }
export type FeedbackQueryHookResult = ReturnType<typeof useFeedbackQuery>;
export type FeedbackLazyQueryHookResult = ReturnType<typeof useFeedbackLazyQuery>;
export type FeedbackQueryResult = Apollo.QueryResult<FeedbackQuery, FeedbackQueryVariables>;
export const GetBeepersDocument = gql`
    query GetBeepers($latitude: Float!, $longitude: Float!, $radius: Float) {
  getBeepers(latitude: $latitude, longitude: $longitude, radius: $radius) {
    id
    username
    name
    photo
    singlesRate
    groupRate
    capacity
    isStudent
    queueSize
    location {
      longitude
      latitude
    }
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
 *      latitude: // value for 'latitude'
 *      longitude: // value for 'longitude'
 *      radius: // value for 'radius'
 *   },
 * });
 */
export function useGetBeepersQuery(baseOptions: Apollo.QueryHookOptions<GetBeepersQuery, GetBeepersQueryVariables>) {
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
export const GetBeeperLocationUpdatesDocument = gql`
    subscription GetBeeperLocationUpdates($radius: Float!, $longitude: Float!, $latitude: Float!, $anonymize: Boolean) {
  getBeeperLocationUpdates(
    radius: $radius
    longitude: $longitude
    latitude: $latitude
    anonymize: $anonymize
  ) {
    id
    latitude
    longitude
  }
}
    `;

/**
 * __useGetBeeperLocationUpdatesSubscription__
 *
 * To run a query within a React component, call `useGetBeeperLocationUpdatesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useGetBeeperLocationUpdatesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBeeperLocationUpdatesSubscription({
 *   variables: {
 *      radius: // value for 'radius'
 *      longitude: // value for 'longitude'
 *      latitude: // value for 'latitude'
 *      anonymize: // value for 'anonymize'
 *   },
 * });
 */
export function useGetBeeperLocationUpdatesSubscription(baseOptions: Apollo.SubscriptionHookOptions<GetBeeperLocationUpdatesSubscription, GetBeeperLocationUpdatesSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<GetBeeperLocationUpdatesSubscription, GetBeeperLocationUpdatesSubscriptionVariables>(GetBeeperLocationUpdatesDocument, options);
      }
export type GetBeeperLocationUpdatesSubscriptionHookResult = ReturnType<typeof useGetBeeperLocationUpdatesSubscription>;
export type GetBeeperLocationUpdatesSubscriptionResult = Apollo.SubscriptionResult<GetBeeperLocationUpdatesSubscription>;
export const GetInProgressBeepsDocument = gql`
    query getInProgressBeeps($show: Int, $offset: Int) {
  getInProgressBeeps(show: $show, offset: $offset) {
    items {
      id
      origin
      destination
      start
      groupSize
      status
      beeper {
        id
        name
        photo
        username
      }
      rider {
        id
        name
        photo
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
      photo
      username
    }
    rider {
      id
      name
      photo
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
      status
      beeper {
        id
        name
        photo
        username
      }
      rider {
        id
        name
        photo
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
export const DeleteCarDocument = gql`
    mutation DeleteCar($id: String!, $notification: String) {
  deleteCar(id: $id, notification: $notification)
}
    `;
export type DeleteCarMutationFn = Apollo.MutationFunction<DeleteCarMutation, DeleteCarMutationVariables>;

/**
 * __useDeleteCarMutation__
 *
 * To run a mutation, you first call `useDeleteCarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCarMutation, { data, loading, error }] = useDeleteCarMutation({
 *   variables: {
 *      id: // value for 'id'
 *      notification: // value for 'notification'
 *   },
 * });
 */
export function useDeleteCarMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCarMutation, DeleteCarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCarMutation, DeleteCarMutationVariables>(DeleteCarDocument, options);
      }
export type DeleteCarMutationHookResult = ReturnType<typeof useDeleteCarMutation>;
export type DeleteCarMutationResult = Apollo.MutationResult<DeleteCarMutation>;
export type DeleteCarMutationOptions = Apollo.BaseMutationOptions<DeleteCarMutation, DeleteCarMutationVariables>;
export const GetCarsDocument = gql`
    query GetCars($offset: Int, $show: Int) {
  getCars(offset: $offset, show: $show) {
    items {
      id
      make
      model
      year
      color
      photo
      created
      user {
        id
        photo
        name
      }
    }
    count
  }
}
    `;

/**
 * __useGetCarsQuery__
 *
 * To run a query within a React component, call `useGetCarsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCarsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCarsQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      show: // value for 'show'
 *   },
 * });
 */
export function useGetCarsQuery(baseOptions?: Apollo.QueryHookOptions<GetCarsQuery, GetCarsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCarsQuery, GetCarsQueryVariables>(GetCarsDocument, options);
      }
export function useGetCarsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCarsQuery, GetCarsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCarsQuery, GetCarsQueryVariables>(GetCarsDocument, options);
        }
export type GetCarsQueryHookResult = ReturnType<typeof useGetCarsQuery>;
export type GetCarsLazyQueryHookResult = ReturnType<typeof useGetCarsLazyQuery>;
export type GetCarsQueryResult = Apollo.QueryResult<GetCarsQuery, GetCarsQueryVariables>;
export const GetUsersWithBeepsDocument = gql`
    query getUsersWithBeeps($show: Int, $offset: Int) {
  getUsersWithBeeps(show: $show, offset: $offset) {
    items {
      user {
        id
        photo
        name
      }
      beeps
    }
    count
  }
}
    `;

/**
 * __useGetUsersWithBeepsQuery__
 *
 * To run a query within a React component, call `useGetUsersWithBeepsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersWithBeepsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersWithBeepsQuery({
 *   variables: {
 *      show: // value for 'show'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetUsersWithBeepsQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersWithBeepsQuery, GetUsersWithBeepsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersWithBeepsQuery, GetUsersWithBeepsQueryVariables>(GetUsersWithBeepsDocument, options);
      }
export function useGetUsersWithBeepsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersWithBeepsQuery, GetUsersWithBeepsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersWithBeepsQuery, GetUsersWithBeepsQueryVariables>(GetUsersWithBeepsDocument, options);
        }
export type GetUsersWithBeepsQueryHookResult = ReturnType<typeof useGetUsersWithBeepsQuery>;
export type GetUsersWithBeepsLazyQueryHookResult = ReturnType<typeof useGetUsersWithBeepsLazyQuery>;
export type GetUsersWithBeepsQueryResult = Apollo.QueryResult<GetUsersWithBeepsQuery, GetUsersWithBeepsQueryVariables>;
export const GetUsersWithRidesDocument = gql`
    query getUsersWithRides($show: Int, $offset: Int) {
  getUsersWithRides(show: $show, offset: $offset) {
    items {
      user {
        id
        photo
        name
      }
      rides
    }
    count
  }
}
    `;

/**
 * __useGetUsersWithRidesQuery__
 *
 * To run a query within a React component, call `useGetUsersWithRidesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersWithRidesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersWithRidesQuery({
 *   variables: {
 *      show: // value for 'show'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetUsersWithRidesQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersWithRidesQuery, GetUsersWithRidesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersWithRidesQuery, GetUsersWithRidesQueryVariables>(GetUsersWithRidesDocument, options);
      }
export function useGetUsersWithRidesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersWithRidesQuery, GetUsersWithRidesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersWithRidesQuery, GetUsersWithRidesQueryVariables>(GetUsersWithRidesDocument, options);
        }
export type GetUsersWithRidesQueryHookResult = ReturnType<typeof useGetUsersWithRidesQuery>;
export type GetUsersWithRidesLazyQueryHookResult = ReturnType<typeof useGetUsersWithRidesLazyQuery>;
export type GetUsersWithRidesQueryResult = Apollo.QueryResult<GetUsersWithRidesQuery, GetUsersWithRidesQueryVariables>;
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
      photo
      username
    }
    rated {
      id
      name
      photo
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
        photo
        username
      }
      rated {
        id
        name
        photo
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
      photo
      username
    }
    reported {
      id
      name
      photo
      username
    }
    handledBy {
      id
      name
      photo
      username
    }
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
      photo
      username
    }
    reported {
      id
      name
      photo
      username
    }
    handledBy {
      id
      name
      photo
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
        photo
        username
      }
      reported {
        id
        name
        photo
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
    first
    last
    isBeeping
    isStudent
    isEmailVerified
    role
    venmo
    cashapp
    singlesRate
    groupRate
    capacity
    photo
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
      status
      rider {
        id
        photo
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
    mutation VerifyUser($id: String!, $data: EditUserInput!) {
  editUser(id: $id, data: $data) {
    id
    isEmailVerified
    isStudent
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
export const EditUserDocument = gql`
    mutation EditUser($id: String!, $data: EditUserInput!) {
  editUser(id: $id, data: $data) {
    id
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
    photo
    queueSize
    phone
    username
    email
    cashapp
    pushToken
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
    photo
    username
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
  setLocation(location: {latitude: $latitude, longitude: $longitude}, id: $id) {
    id
    location {
      latitude
      longitude
    }
  }
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
      photo
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