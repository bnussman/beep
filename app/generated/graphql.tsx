import { gql } from '@apollo/client';
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
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
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTimeISO: { input: any; output: any; }
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
  end?: Maybe<Scalars['DateTimeISO']['output']>;
  groupSize: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  origin: Scalars['String']['output'];
  position: Scalars['Float']['output'];
  rider: User;
  start: Scalars['DateTimeISO']['output'];
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
  created: Scalars['DateTimeISO']['output'];
  default: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  make: Scalars['String']['output'];
  model: Scalars['String']['output'];
  photo: Scalars['String']['output'];
  updated: Scalars['DateTimeISO']['output'];
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
  created: Scalars['DateTimeISO']['output'];
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
  checkUserSubscriptions?: Maybe<Array<Payment>>;
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


export type MutationCheckUserSubscriptionsArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
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

export type Payment = {
  __typename?: 'Payment';
  created: Scalars['DateTimeISO']['output'];
  expires: Scalars['DateTimeISO']['output'];
  id: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  productId: Scalars['String']['output'];
  store: Scalars['String']['output'];
  storeId: Scalars['String']['output'];
  user: User;
};

export type PaymentResponse = {
  __typename?: 'PaymentResponse';
  count: Scalars['Int']['output'];
  items: Array<Payment>;
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
  getBeepersNew: Array<User>;
  getBeeps: BeepsResponse;
  getCars: CarsResponse;
  getETA: Scalars['String']['output'];
  getFeedback: FeedbackResonse;
  getInProgressBeeps: BeepsResponse;
  getLastBeepToRate?: Maybe<Beep>;
  getLocationSuggestions: Array<Suggestion>;
  getPaymentHistory: PaymentResponse;
  getPayments: PaymentResponse;
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


export type QueryGetBeepersNewArgs = {
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


export type QueryGetPaymentHistoryArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  show?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetPaymentsArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  show?: InputMaybe<Scalars['Int']['input']>;
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
  timestamp: Scalars['DateTimeISO']['output'];
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
  timestamp: Scalars['DateTimeISO']['output'];
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
  created?: Maybe<Scalars['DateTimeISO']['output']>;
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
  payments?: Maybe<Array<Payment>>;
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

export type UpdateBeeperQueueMutationVariables = Exact<{
  id: Scalars['String']['input'];
  status: Scalars['String']['input'];
}>;


export type UpdateBeeperQueueMutation = { __typename?: 'Mutation', setBeeperQueue: Array<{ __typename?: 'Beep', id: string, groupSize: number, origin: string, destination: string, status: string, rider: { __typename?: 'User', id: string, name: string, first: string, last: string, venmo?: string | null, cashapp?: string | null, phone?: string | null, photo?: string | null, isStudent: boolean, rating?: number | null } }> };

export type CancelBeepMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type CancelBeepMutation = { __typename?: 'Mutation', cancelBeep: boolean };

export type GetRateDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRateDataQuery = { __typename?: 'Query', getLastBeepToRate?: { __typename?: 'Beep', id: string, beeper: { __typename?: 'User', id: string, name: string, username: string, photo?: string | null, isBeeping: boolean } } | null };

export type DeleteRatingMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteRatingMutation = { __typename?: 'Mutation', deleteRating: boolean };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type ResendMutationVariables = Exact<{ [key: string]: never; }>;


export type ResendMutation = { __typename?: 'Mutation', resendEmailVarification: boolean };

export type GetBeepHistoryQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  show?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetBeepHistoryQuery = { __typename?: 'Query', getBeeps: { __typename?: 'BeepsResponse', count: number, items: Array<{ __typename?: 'Beep', id: string, start: any, end?: any | null, groupSize: number, origin: string, destination: string, status: string, rider: { __typename?: 'User', id: string, name: string, first: string, last: string, photo?: string | null }, beeper: { __typename?: 'User', id: string, name: string, first: string, last: string, photo?: string | null } }> } };

export type CheckUserSubscriptionsMutationVariables = Exact<{ [key: string]: never; }>;


export type CheckUserSubscriptionsMutation = { __typename?: 'Mutation', checkUserSubscriptions?: Array<{ __typename?: 'Payment', id: string, expires: any }> | null };

export type PaymentsQueryQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']['input']>;
}>;


export type PaymentsQueryQuery = { __typename?: 'Query', getPayments: { __typename?: 'PaymentResponse', items: Array<{ __typename?: 'Payment', id: string, productId: string, expires: any }> } };

export type GetRatingsQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  show?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetRatingsQuery = { __typename?: 'Query', getRatings: { __typename?: 'RatingsResponse', count: number, items: Array<{ __typename?: 'Rating', id: string, stars: number, timestamp: any, message?: string | null, rater: { __typename?: 'User', id: string, name: string, photo?: string | null }, rated: { __typename?: 'User', id: string, name: string, photo?: string | null } }> } };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
  pushToken?: InputMaybe<Scalars['String']['input']>;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'Auth', tokens: { __typename?: 'TokenEntry', id: string, tokenid: string }, user: { __typename?: 'User', id: string, username: string, name: string, first: string, last: string, email?: string | null, phone?: string | null, venmo?: string | null, isBeeping: boolean, isEmailVerified: boolean, isStudent: boolean, groupRate: number, singlesRate: number, photo?: string | null, capacity: number, cashapp?: string | null } } };

export type SignUpMutationVariables = Exact<{
  input: SignUpInput;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signup: { __typename?: 'Auth', tokens: { __typename?: 'TokenEntry', id: string, tokenid: string }, user: { __typename?: 'User', id: string, username: string, name: string, first: string, last: string, email?: string | null, phone?: string | null, venmo?: string | null, isBeeping: boolean, isEmailVerified: boolean, isStudent: boolean, groupRate: number, singlesRate: number, photo?: string | null, capacity: number, cashapp?: string | null } } };

export type LocationUpdateMutationVariables = Exact<{
  location: LocationInput;
}>;


export type LocationUpdateMutation = { __typename?: 'Mutation', setLocation: { __typename?: 'User', id: string, location?: { __typename?: 'Point', latitude: number, longitude: number } | null } };

export type GetInitialQueueQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetInitialQueueQuery = { __typename?: 'Query', getQueue: Array<{ __typename?: 'Beep', id: string, groupSize: number, origin: string, destination: string, status: string, rider: { __typename?: 'User', id: string, name: string, first: string, last: string, venmo?: string | null, cashapp?: string | null, phone?: string | null, photo?: string | null, rating?: number | null } }> };

export type GetQueueSubscriptionVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetQueueSubscription = { __typename?: 'Subscription', getBeeperUpdates: Array<{ __typename?: 'Beep', id: string, groupSize: number, origin: string, destination: string, status: string, rider: { __typename?: 'User', id: string, name: string, first: string, last: string, venmo?: string | null, cashapp?: string | null, phone?: string | null, photo?: string | null, rating?: number | null } }> };

export type UpdateBeepSettingsMutationVariables = Exact<{
  input: BeeperSettingsInput;
}>;


export type UpdateBeepSettingsMutation = { __typename?: 'Mutation', setBeeperStatus: { __typename?: 'User', id: string, singlesRate: number, groupRate: number, capacity: number, isBeeping: boolean, queueSize: number, location?: { __typename?: 'Point', latitude: number, longitude: number } | null } };

export type CreateCarMutationVariables = Exact<{
  make: Scalars['String']['input'];
  model: Scalars['String']['input'];
  year: Scalars['Float']['input'];
  color: Scalars['String']['input'];
  photo: Scalars['Upload']['input'];
}>;


export type CreateCarMutation = { __typename?: 'Mutation', createCar: { __typename?: 'Car', id: string, make: string, model: string, year: number, color: string } };

export type DeleteCarMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteCarMutation = { __typename?: 'Mutation', deleteCar: boolean };

export type EditCarMutationVariables = Exact<{
  default: Scalars['Boolean']['input'];
  id: Scalars['String']['input'];
}>;


export type EditCarMutation = { __typename?: 'Mutation', editCar: { __typename?: 'Car', id: string, default: boolean } };

export type GetCarsQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  show?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetCarsQuery = { __typename?: 'Query', getCars: { __typename?: 'CarsResponse', count: number, items: Array<{ __typename?: 'Car', id: string, make: string, model: string, year: number, color: string, photo: string, default: boolean }> } };

export type CreateFeedbackMutationVariables = Exact<{
  message: Scalars['String']['input'];
}>;


export type CreateFeedbackMutation = { __typename?: 'Mutation', createFeedback: { __typename?: 'Feedback', id: string } };

export type GetUserProfileQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetUserProfileQuery = { __typename?: 'Query', getUser: { __typename?: 'User', id: string, name: string, username: string, isBeeping: boolean, isStudent: boolean, role: string, venmo?: string | null, cashapp?: string | null, singlesRate: number, groupRate: number, capacity: number, photo?: string | null, queueSize: number, rating?: number | null } };

export type RateUserMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  stars: Scalars['Float']['input'];
  message?: InputMaybe<Scalars['String']['input']>;
  beepId: Scalars['String']['input'];
}>;


export type RateUserMutation = { __typename?: 'Mutation', rateUser: boolean };

export type GetRatingsForUserQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  show?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetRatingsForUserQuery = { __typename?: 'Query', getRatings: { __typename?: 'RatingsResponse', count: number, items: Array<{ __typename?: 'Rating', id: string, timestamp: any, message?: string | null, stars: number, rater: { __typename?: 'User', id: string, name: string, photo?: string | null, username: string }, rated: { __typename?: 'User', id: string, name: string, photo?: string | null, username: string } }> } };

export type ReportUserMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  reason: Scalars['String']['input'];
  beepId?: InputMaybe<Scalars['String']['input']>;
}>;


export type ReportUserMutation = { __typename?: 'Mutation', reportUser: boolean };

export type GetAllBeepersLocationQueryVariables = Exact<{
  radius: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  latitude: Scalars['Float']['input'];
}>;


export type GetAllBeepersLocationQuery = { __typename?: 'Query', getAllBeepersLocation: Array<{ __typename?: 'AnonymousBeeper', id: string, latitude?: number | null, longitude?: number | null }> };

export type GetBeeperLocationUpdatesSubscriptionVariables = Exact<{
  radius: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  latitude: Scalars['Float']['input'];
}>;


export type GetBeeperLocationUpdatesSubscription = { __typename?: 'Subscription', getBeeperLocationUpdates: { __typename?: 'AnonymousBeeper', id: string, latitude?: number | null, longitude?: number | null } };

export type ChooseBeepMutationVariables = Exact<{
  beeperId: Scalars['String']['input'];
  origin: Scalars['String']['input'];
  destination: Scalars['String']['input'];
  groupSize: Scalars['Float']['input'];
}>;


export type ChooseBeepMutation = { __typename?: 'Mutation', chooseBeep: { __typename?: 'Beep', id: string, position: number, origin: string, destination: string, status: string, groupSize: number, beeper: { __typename?: 'User', id: string, first: string, name: string, singlesRate: number, groupRate: number, isStudent: boolean, role: string, venmo?: string | null, cashapp?: string | null, username: string, phone?: string | null, photo?: string | null, capacity: number, queueSize: number, location?: { __typename?: 'Point', longitude: number, latitude: number } | null, cars?: Array<{ __typename?: 'Car', id: string, photo: string, make: string, color: string, model: string }> | null } } };

export type GetInitialRiderStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInitialRiderStatusQuery = { __typename?: 'Query', getRiderStatus?: { __typename?: 'Beep', id: string, position: number, origin: string, destination: string, status: string, groupSize: number, beeper: { __typename?: 'User', id: string, first: string, name: string, singlesRate: number, groupRate: number, isStudent: boolean, role: string, venmo?: string | null, cashapp?: string | null, username: string, phone?: string | null, photo?: string | null, capacity: number, queueSize: number, location?: { __typename?: 'Point', longitude: number, latitude: number } | null, cars?: Array<{ __typename?: 'Car', id: string, photo: string, make: string, color: string, model: string }> | null } } | null };

export type RiderStatusSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type RiderStatusSubscription = { __typename?: 'Subscription', getRiderUpdates?: { __typename?: 'Beep', id: string, position: number, origin: string, destination: string, status: string, groupSize: number, beeper: { __typename?: 'User', id: string, first: string, name: string, singlesRate: number, groupRate: number, isStudent: boolean, role: string, venmo?: string | null, cashapp?: string | null, username: string, phone?: string | null, photo?: string | null, capacity: number, queueSize: number, location?: { __typename?: 'Point', longitude: number, latitude: number } | null, cars?: Array<{ __typename?: 'Car', id: string, photo: string, make: string, color: string, model: string }> | null } } | null };

export type BeepersLocationSubscriptionVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type BeepersLocationSubscription = { __typename?: 'Subscription', getLocationUpdates?: { __typename?: 'Point', latitude: number, longitude: number } | null };

export type GetEtaQueryVariables = Exact<{
  start: Scalars['String']['input'];
  end: Scalars['String']['input'];
}>;


export type GetEtaQuery = { __typename?: 'Query', getETA: string };

export type LeaveQueueMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type LeaveQueueMutation = { __typename?: 'Mutation', leaveQueue: boolean };

export type GetBeepersQueryVariables = Exact<{
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  radius?: InputMaybe<Scalars['Float']['input']>;
}>;


export type GetBeepersQuery = { __typename?: 'Query', getBeepersNew: Array<{ __typename?: 'User', id: string, name: string, first: string, isStudent: boolean, singlesRate: number, groupRate: number, capacity: number, queueSize: number, photo?: string | null, role: string, rating?: number | null, venmo?: string | null, cashapp?: string | null, payments?: Array<{ __typename?: 'Payment', id: string, productId: string }> | null }> };

export type ChangePasswordMutationVariables = Exact<{
  password: Scalars['String']['input'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: boolean };

export type DeleteAccountMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteAccountMutation = { __typename?: 'Mutation', deleteAccount: boolean };

export type EditAccountMutationVariables = Exact<{
  input: EditUserInput;
}>;


export type EditAccountMutation = { __typename?: 'Mutation', editUser: { __typename?: 'User', id: string, name: string, first: string, last: string, email?: string | null, phone?: string | null, venmo?: string | null, cashapp?: string | null } };

export type AddProfilePictureMutationVariables = Exact<{
  picture: Scalars['Upload']['input'];
}>;


export type AddProfilePictureMutation = { __typename?: 'Mutation', addProfilePicture: { __typename?: 'User', id: string, photo?: string | null } };

export type UserDataQueryVariables = Exact<{ [key: string]: never; }>;


export type UserDataQuery = { __typename?: 'Query', getUser: { __typename?: 'User', id: string, username: string, name: string, first: string, last: string, email?: string | null, phone?: string | null, venmo?: string | null, isBeeping: boolean, isEmailVerified: boolean, isStudent: boolean, groupRate: number, singlesRate: number, photo?: string | null, capacity: number, cashapp?: string | null } };

export type UserUpdatesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type UserUpdatesSubscription = { __typename?: 'Subscription', getUserUpdates: { __typename?: 'User', id: string, username: string, name: string, first: string, last: string, email?: string | null, phone?: string | null, venmo?: string | null, isBeeping: boolean, isEmailVerified: boolean, isStudent: boolean, groupRate: number, singlesRate: number, photo?: string | null, capacity: number, cashapp?: string | null } };


export const UpdateBeeperQueueDocument = gql`
    mutation UpdateBeeperQueue($id: String!, $status: String!) {
  setBeeperQueue(input: {id: $id, status: $status}) {
    id
    groupSize
    origin
    destination
    status
    rider {
      id
      name
      first
      last
      venmo
      cashapp
      phone
      photo
      isStudent
      rating
    }
  }
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
 *      id: // value for 'id'
 *      status: // value for 'status'
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
export const GetRateDataDocument = gql`
    query GetRateData {
  getLastBeepToRate {
    id
    beeper {
      id
      name
      username
      photo
      isBeeping
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
export const DeleteRatingDocument = gql`
    mutation DeleteRating($id: String!) {
  deleteRating(id: $id)
}
    `;
export type DeleteRatingMutationFn = ApolloReactCommon.MutationFunction<DeleteRatingMutation, DeleteRatingMutationVariables>;

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
export function useDeleteRatingMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteRatingMutation, DeleteRatingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteRatingMutation, DeleteRatingMutationVariables>(DeleteRatingDocument, options);
      }
export type DeleteRatingMutationHookResult = ReturnType<typeof useDeleteRatingMutation>;
export type DeleteRatingMutationResult = ApolloReactCommon.MutationResult<DeleteRatingMutation>;
export type DeleteRatingMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteRatingMutation, DeleteRatingMutationVariables>;
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
export const GetBeepHistoryDocument = gql`
    query GetBeepHistory($id: String, $offset: Int, $show: Int) {
  getBeeps(id: $id, offset: $offset, show: $show) {
    items {
      id
      start
      end
      groupSize
      origin
      destination
      status
      rider {
        id
        name
        first
        last
        photo
      }
      beeper {
        id
        name
        first
        last
        photo
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
 *      offset: // value for 'offset'
 *      show: // value for 'show'
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
export const CheckUserSubscriptionsDocument = gql`
    mutation checkUserSubscriptions {
  checkUserSubscriptions {
    id
    expires
  }
}
    `;
export type CheckUserSubscriptionsMutationFn = ApolloReactCommon.MutationFunction<CheckUserSubscriptionsMutation, CheckUserSubscriptionsMutationVariables>;

/**
 * __useCheckUserSubscriptionsMutation__
 *
 * To run a mutation, you first call `useCheckUserSubscriptionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckUserSubscriptionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkUserSubscriptionsMutation, { data, loading, error }] = useCheckUserSubscriptionsMutation({
 *   variables: {
 *   },
 * });
 */
export function useCheckUserSubscriptionsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CheckUserSubscriptionsMutation, CheckUserSubscriptionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CheckUserSubscriptionsMutation, CheckUserSubscriptionsMutationVariables>(CheckUserSubscriptionsDocument, options);
      }
export type CheckUserSubscriptionsMutationHookResult = ReturnType<typeof useCheckUserSubscriptionsMutation>;
export type CheckUserSubscriptionsMutationResult = ApolloReactCommon.MutationResult<CheckUserSubscriptionsMutation>;
export type CheckUserSubscriptionsMutationOptions = ApolloReactCommon.BaseMutationOptions<CheckUserSubscriptionsMutation, CheckUserSubscriptionsMutationVariables>;
export const PaymentsQueryDocument = gql`
    query PaymentsQuery($id: String) {
  getPayments(id: $id) {
    items {
      id
      productId
      expires
    }
  }
}
    `;

/**
 * __usePaymentsQueryQuery__
 *
 * To run a query within a React component, call `usePaymentsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `usePaymentsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePaymentsQueryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePaymentsQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<PaymentsQueryQuery, PaymentsQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<PaymentsQueryQuery, PaymentsQueryQueryVariables>(PaymentsQueryDocument, options);
      }
export function usePaymentsQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<PaymentsQueryQuery, PaymentsQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<PaymentsQueryQuery, PaymentsQueryQueryVariables>(PaymentsQueryDocument, options);
        }
export type PaymentsQueryQueryHookResult = ReturnType<typeof usePaymentsQueryQuery>;
export type PaymentsQueryLazyQueryHookResult = ReturnType<typeof usePaymentsQueryLazyQuery>;
export type PaymentsQueryQueryResult = ApolloReactCommon.QueryResult<PaymentsQueryQuery, PaymentsQueryQueryVariables>;
export const GetRatingsDocument = gql`
    query GetRatings($id: String, $offset: Int, $show: Int) {
  getRatings(id: $id, offset: $offset, show: $show) {
    items {
      id
      stars
      timestamp
      message
      rater {
        id
        name
        photo
      }
      rated {
        id
        name
        photo
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
 *      offset: // value for 'offset'
 *      show: // value for 'show'
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
      photo
      capacity
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
    mutation SignUp($input: SignUpInput!) {
  signup(input: $input) {
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
      photo
      capacity
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
 *      input: // value for 'input'
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
    mutation LocationUpdate($location: LocationInput!) {
  setLocation(location: $location) {
    id
    location {
      latitude
      longitude
    }
  }
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
 *      location: // value for 'location'
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
    query GetInitialQueue($id: String) {
  getQueue(id: $id) {
    id
    groupSize
    origin
    destination
    status
    rider {
      id
      name
      first
      last
      venmo
      cashapp
      phone
      photo
      rating
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
 *      id: // value for 'id'
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
    groupSize
    origin
    destination
    status
    rider {
      id
      name
      first
      last
      venmo
      cashapp
      phone
      photo
      rating
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
    mutation UpdateBeepSettings($input: BeeperSettingsInput!) {
  setBeeperStatus(input: $input) {
    id
    singlesRate
    groupRate
    capacity
    isBeeping
    queueSize
    location {
      latitude
      longitude
    }
  }
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
 *      input: // value for 'input'
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
export const CreateCarDocument = gql`
    mutation CreateCar($make: String!, $model: String!, $year: Float!, $color: String!, $photo: Upload!) {
  createCar(make: $make, model: $model, year: $year, color: $color, photo: $photo) {
    id
    make
    model
    year
    color
  }
}
    `;
export type CreateCarMutationFn = ApolloReactCommon.MutationFunction<CreateCarMutation, CreateCarMutationVariables>;

/**
 * __useCreateCarMutation__
 *
 * To run a mutation, you first call `useCreateCarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCarMutation, { data, loading, error }] = useCreateCarMutation({
 *   variables: {
 *      make: // value for 'make'
 *      model: // value for 'model'
 *      year: // value for 'year'
 *      color: // value for 'color'
 *      photo: // value for 'photo'
 *   },
 * });
 */
export function useCreateCarMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateCarMutation, CreateCarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateCarMutation, CreateCarMutationVariables>(CreateCarDocument, options);
      }
export type CreateCarMutationHookResult = ReturnType<typeof useCreateCarMutation>;
export type CreateCarMutationResult = ApolloReactCommon.MutationResult<CreateCarMutation>;
export type CreateCarMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateCarMutation, CreateCarMutationVariables>;
export const DeleteCarDocument = gql`
    mutation DeleteCar($id: String!) {
  deleteCar(id: $id)
}
    `;
export type DeleteCarMutationFn = ApolloReactCommon.MutationFunction<DeleteCarMutation, DeleteCarMutationVariables>;

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
 *   },
 * });
 */
export function useDeleteCarMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteCarMutation, DeleteCarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteCarMutation, DeleteCarMutationVariables>(DeleteCarDocument, options);
      }
export type DeleteCarMutationHookResult = ReturnType<typeof useDeleteCarMutation>;
export type DeleteCarMutationResult = ApolloReactCommon.MutationResult<DeleteCarMutation>;
export type DeleteCarMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteCarMutation, DeleteCarMutationVariables>;
export const EditCarDocument = gql`
    mutation EditCar($default: Boolean!, $id: String!) {
  editCar(default: $default, id: $id) {
    id
    default
  }
}
    `;
export type EditCarMutationFn = ApolloReactCommon.MutationFunction<EditCarMutation, EditCarMutationVariables>;

/**
 * __useEditCarMutation__
 *
 * To run a mutation, you first call `useEditCarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditCarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editCarMutation, { data, loading, error }] = useEditCarMutation({
 *   variables: {
 *      default: // value for 'default'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEditCarMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EditCarMutation, EditCarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<EditCarMutation, EditCarMutationVariables>(EditCarDocument, options);
      }
export type EditCarMutationHookResult = ReturnType<typeof useEditCarMutation>;
export type EditCarMutationResult = ApolloReactCommon.MutationResult<EditCarMutation>;
export type EditCarMutationOptions = ApolloReactCommon.BaseMutationOptions<EditCarMutation, EditCarMutationVariables>;
export const GetCarsDocument = gql`
    query GetCars($id: String, $offset: Int, $show: Int) {
  getCars(id: $id, offset: $offset, show: $show) {
    items {
      id
      make
      model
      year
      color
      photo
      default
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
 *      id: // value for 'id'
 *      offset: // value for 'offset'
 *      show: // value for 'show'
 *   },
 * });
 */
export function useGetCarsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetCarsQuery, GetCarsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetCarsQuery, GetCarsQueryVariables>(GetCarsDocument, options);
      }
export function useGetCarsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetCarsQuery, GetCarsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetCarsQuery, GetCarsQueryVariables>(GetCarsDocument, options);
        }
export type GetCarsQueryHookResult = ReturnType<typeof useGetCarsQuery>;
export type GetCarsLazyQueryHookResult = ReturnType<typeof useGetCarsLazyQuery>;
export type GetCarsQueryResult = ApolloReactCommon.QueryResult<GetCarsQuery, GetCarsQueryVariables>;
export const CreateFeedbackDocument = gql`
    mutation CreateFeedback($message: String!) {
  createFeedback(message: $message) {
    id
  }
}
    `;
export type CreateFeedbackMutationFn = ApolloReactCommon.MutationFunction<CreateFeedbackMutation, CreateFeedbackMutationVariables>;

/**
 * __useCreateFeedbackMutation__
 *
 * To run a mutation, you first call `useCreateFeedbackMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFeedbackMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFeedbackMutation, { data, loading, error }] = useCreateFeedbackMutation({
 *   variables: {
 *      message: // value for 'message'
 *   },
 * });
 */
export function useCreateFeedbackMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateFeedbackMutation, CreateFeedbackMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateFeedbackMutation, CreateFeedbackMutationVariables>(CreateFeedbackDocument, options);
      }
export type CreateFeedbackMutationHookResult = ReturnType<typeof useCreateFeedbackMutation>;
export type CreateFeedbackMutationResult = ApolloReactCommon.MutationResult<CreateFeedbackMutation>;
export type CreateFeedbackMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateFeedbackMutation, CreateFeedbackMutationVariables>;
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
    photo
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
export const GetRatingsForUserDocument = gql`
    query GetRatingsForUser($id: String, $offset: Int, $show: Int) {
  getRatings(id: $id, show: $show, offset: $offset, filter: "recieved") {
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
 *      offset: // value for 'offset'
 *      show: // value for 'show'
 *   },
 * });
 */
export function useGetRatingsForUserQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetRatingsForUserQuery, GetRatingsForUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetRatingsForUserQuery, GetRatingsForUserQueryVariables>(GetRatingsForUserDocument, options);
      }
export function useGetRatingsForUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRatingsForUserQuery, GetRatingsForUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetRatingsForUserQuery, GetRatingsForUserQueryVariables>(GetRatingsForUserDocument, options);
        }
export type GetRatingsForUserQueryHookResult = ReturnType<typeof useGetRatingsForUserQuery>;
export type GetRatingsForUserLazyQueryHookResult = ReturnType<typeof useGetRatingsForUserLazyQuery>;
export type GetRatingsForUserQueryResult = ApolloReactCommon.QueryResult<GetRatingsForUserQuery, GetRatingsForUserQueryVariables>;
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
export const GetAllBeepersLocationDocument = gql`
    query GetAllBeepersLocation($radius: Float!, $longitude: Float!, $latitude: Float!) {
  getAllBeepersLocation(
    radius: $radius
    longitude: $longitude
    latitude: $latitude
  ) {
    id
    latitude
    longitude
  }
}
    `;

/**
 * __useGetAllBeepersLocationQuery__
 *
 * To run a query within a React component, call `useGetAllBeepersLocationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllBeepersLocationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllBeepersLocationQuery({
 *   variables: {
 *      radius: // value for 'radius'
 *      longitude: // value for 'longitude'
 *      latitude: // value for 'latitude'
 *   },
 * });
 */
export function useGetAllBeepersLocationQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetAllBeepersLocationQuery, GetAllBeepersLocationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetAllBeepersLocationQuery, GetAllBeepersLocationQueryVariables>(GetAllBeepersLocationDocument, options);
      }
export function useGetAllBeepersLocationLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAllBeepersLocationQuery, GetAllBeepersLocationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetAllBeepersLocationQuery, GetAllBeepersLocationQueryVariables>(GetAllBeepersLocationDocument, options);
        }
export type GetAllBeepersLocationQueryHookResult = ReturnType<typeof useGetAllBeepersLocationQuery>;
export type GetAllBeepersLocationLazyQueryHookResult = ReturnType<typeof useGetAllBeepersLocationLazyQuery>;
export type GetAllBeepersLocationQueryResult = ApolloReactCommon.QueryResult<GetAllBeepersLocationQuery, GetAllBeepersLocationQueryVariables>;
export const GetBeeperLocationUpdatesDocument = gql`
    subscription GetBeeperLocationUpdates($radius: Float!, $longitude: Float!, $latitude: Float!) {
  getBeeperLocationUpdates(
    radius: $radius
    longitude: $longitude
    latitude: $latitude
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
 *   },
 * });
 */
export function useGetBeeperLocationUpdatesSubscription(baseOptions: ApolloReactHooks.SubscriptionHookOptions<GetBeeperLocationUpdatesSubscription, GetBeeperLocationUpdatesSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useSubscription<GetBeeperLocationUpdatesSubscription, GetBeeperLocationUpdatesSubscriptionVariables>(GetBeeperLocationUpdatesDocument, options);
      }
export type GetBeeperLocationUpdatesSubscriptionHookResult = ReturnType<typeof useGetBeeperLocationUpdatesSubscription>;
export type GetBeeperLocationUpdatesSubscriptionResult = ApolloReactCommon.SubscriptionResult<GetBeeperLocationUpdatesSubscription>;
export const ChooseBeepDocument = gql`
    mutation ChooseBeep($beeperId: String!, $origin: String!, $destination: String!, $groupSize: Float!) {
  chooseBeep(
    beeperId: $beeperId
    input: {origin: $origin, destination: $destination, groupSize: $groupSize}
  ) {
    id
    position
    origin
    destination
    status
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
      photo
      capacity
      queueSize
      location {
        longitude
        latitude
      }
      cars {
        id
        photo
        make
        color
        model
      }
    }
  }
}
    `;
export type ChooseBeepMutationFn = ApolloReactCommon.MutationFunction<ChooseBeepMutation, ChooseBeepMutationVariables>;

/**
 * __useChooseBeepMutation__
 *
 * To run a mutation, you first call `useChooseBeepMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChooseBeepMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [chooseBeepMutation, { data, loading, error }] = useChooseBeepMutation({
 *   variables: {
 *      beeperId: // value for 'beeperId'
 *      origin: // value for 'origin'
 *      destination: // value for 'destination'
 *      groupSize: // value for 'groupSize'
 *   },
 * });
 */
export function useChooseBeepMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ChooseBeepMutation, ChooseBeepMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ChooseBeepMutation, ChooseBeepMutationVariables>(ChooseBeepDocument, options);
      }
export type ChooseBeepMutationHookResult = ReturnType<typeof useChooseBeepMutation>;
export type ChooseBeepMutationResult = ApolloReactCommon.MutationResult<ChooseBeepMutation>;
export type ChooseBeepMutationOptions = ApolloReactCommon.BaseMutationOptions<ChooseBeepMutation, ChooseBeepMutationVariables>;
export const GetInitialRiderStatusDocument = gql`
    query GetInitialRiderStatus {
  getRiderStatus {
    id
    position
    origin
    destination
    status
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
      photo
      capacity
      queueSize
      location {
        longitude
        latitude
      }
      cars {
        id
        photo
        make
        color
        model
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
    subscription RiderStatus {
  getRiderUpdates {
    id
    position
    origin
    destination
    status
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
      photo
      capacity
      queueSize
      location {
        longitude
        latitude
      }
      cars {
        id
        photo
        make
        color
        model
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
 *   },
 * });
 */
export function useRiderStatusSubscription(baseOptions?: ApolloReactHooks.SubscriptionHookOptions<RiderStatusSubscription, RiderStatusSubscriptionVariables>) {
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
  leaveQueue(id: $id)
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
export const GetBeepersDocument = gql`
    query GetBeepers($latitude: Float!, $longitude: Float!, $radius: Float) {
  getBeepersNew(latitude: $latitude, longitude: $longitude, radius: $radius) {
    id
    name
    first
    isStudent
    singlesRate
    groupRate
    capacity
    queueSize
    photo
    role
    rating
    venmo
    cashapp
    payments {
      id
      productId
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
export function useGetBeepersQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetBeepersQuery, GetBeepersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetBeepersQuery, GetBeepersQueryVariables>(GetBeepersDocument, options);
      }
export function useGetBeepersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetBeepersQuery, GetBeepersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetBeepersQuery, GetBeepersQueryVariables>(GetBeepersDocument, options);
        }
export type GetBeepersQueryHookResult = ReturnType<typeof useGetBeepersQuery>;
export type GetBeepersLazyQueryHookResult = ReturnType<typeof useGetBeepersLazyQuery>;
export type GetBeepersQueryResult = ApolloReactCommon.QueryResult<GetBeepersQuery, GetBeepersQueryVariables>;
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
export const DeleteAccountDocument = gql`
    mutation DeleteAccount {
  deleteAccount
}
    `;
export type DeleteAccountMutationFn = ApolloReactCommon.MutationFunction<DeleteAccountMutation, DeleteAccountMutationVariables>;

/**
 * __useDeleteAccountMutation__
 *
 * To run a mutation, you first call `useDeleteAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAccountMutation, { data, loading, error }] = useDeleteAccountMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteAccountMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteAccountMutation, DeleteAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteAccountMutation, DeleteAccountMutationVariables>(DeleteAccountDocument, options);
      }
export type DeleteAccountMutationHookResult = ReturnType<typeof useDeleteAccountMutation>;
export type DeleteAccountMutationResult = ApolloReactCommon.MutationResult<DeleteAccountMutation>;
export type DeleteAccountMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteAccountMutation, DeleteAccountMutationVariables>;
export const EditAccountDocument = gql`
    mutation EditAccount($input: EditUserInput!) {
  editUser(data: $input) {
    id
    name
    first
    last
    email
    phone
    venmo
    cashapp
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
 *      input: // value for 'input'
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
    id
    photo
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
export const UserDataDocument = gql`
    query UserData {
  getUser {
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
    photo
    capacity
    cashapp
  }
}
    `;

/**
 * __useUserDataQuery__
 *
 * To run a query within a React component, call `useUserDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserDataQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UserDataQuery, UserDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<UserDataQuery, UserDataQueryVariables>(UserDataDocument, options);
      }
export function useUserDataLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UserDataQuery, UserDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<UserDataQuery, UserDataQueryVariables>(UserDataDocument, options);
        }
export type UserDataQueryHookResult = ReturnType<typeof useUserDataQuery>;
export type UserDataLazyQueryHookResult = ReturnType<typeof useUserDataLazyQuery>;
export type UserDataQueryResult = ApolloReactCommon.QueryResult<UserDataQuery, UserDataQueryVariables>;
export const UserUpdatesDocument = gql`
    subscription UserUpdates {
  getUserUpdates {
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
    photo
    capacity
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
 *   },
 * });
 */
export function useUserUpdatesSubscription(baseOptions?: ApolloReactHooks.SubscriptionHookOptions<UserUpdatesSubscription, UserUpdatesSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useSubscription<UserUpdatesSubscription, UserUpdatesSubscriptionVariables>(UserUpdatesDocument, options);
      }
export type UserUpdatesSubscriptionHookResult = ReturnType<typeof useUserUpdatesSubscription>;
export type UserUpdatesSubscriptionResult = ApolloReactCommon.SubscriptionResult<UserUpdatesSubscription>;