/* eslint-disable */
/* prettier-ignore */

export type introspection_types = {
    'Boolean': unknown;
    'File': unknown;
    'Float': unknown;
    'ID': unknown;
    'Int': unknown;
    'Mutation': { kind: 'OBJECT'; name: 'Mutation'; fields: { 'uploadProfilePicture': { name: 'uploadProfilePicture'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; }; };
    'Query': { kind: 'OBJECT'; name: 'Query'; fields: { 'me': { name: 'me'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; }; };
    'String': unknown;
    'Subscription': { kind: 'OBJECT'; name: 'Subscription'; fields: { 'userSubscription': { name: 'userSubscription'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'User'; ofType: null; }; } }; }; };
    'User': { kind: 'OBJECT'; name: 'User'; fields: { 'capacity': { name: 'capacity'; type: { kind: 'SCALAR'; name: 'Int'; ofType: null; } }; 'cashapp': { name: 'cashapp'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'email': { name: 'email'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'first': { name: 'first'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'fullName': { name: 'fullName'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'groupRate': { name: 'groupRate'; type: { kind: 'SCALAR'; name: 'Int'; ofType: null; } }; 'id': { name: 'id'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'last': { name: 'last'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'phone': { name: 'phone'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'photo': { name: 'photo'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'pushToken': { name: 'pushToken'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'rating': { name: 'rating'; type: { kind: 'SCALAR'; name: 'Float'; ofType: null; } }; 'role': { name: 'role'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'singlesRate': { name: 'singlesRate'; type: { kind: 'SCALAR'; name: 'Int'; ofType: null; } }; 'venmo': { name: 'venmo'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; }; };
};

/** An IntrospectionQuery representation of your schema.
 *
 * @remarks
 * This is an introspection of your schema saved as a file by GraphQLSP.
 * It will automatically be used by `gql.tada` to infer the types of your GraphQL documents.
 * If you need to reuse this data or update your `scalars`, update `tadaOutputLocation` to
 * instead save to a .ts instead of a .d.ts file.
 */
export type introspection = {
  name: never;
  query: 'Query';
  mutation: 'Mutation';
  subscription: 'Subscription';
  types: introspection_types;
};

import * as gqlTada from 'gql.tada';

declare module 'gql.tada' {
  interface setupSchema {
    introspection: introspection
  }
}