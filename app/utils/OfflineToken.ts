import { gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { client } from './Apollo';

const RemoveToken = gql`
  mutation RemoveToken($token: String!) {
    removeToken(token: $token)
  }
`;

export async function removeOldToken(): Promise<void> {
  const tokenid = await AsyncStorage.getItem('token');

  if (tokenid !== null) {
    const result = await client.mutate({ mutation: RemoveToken, variables: { token: tokenid } });

    if (result) {
      AsyncStorage.removeItem("token");
    }
  }
}
