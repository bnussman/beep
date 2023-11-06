import Purchase from 'react-native-purchases';
import { Logger } from './Logger';

export async function setPurchaseUser(id: string) {
  try {
    await Purchase.logIn(id);
  } catch (error) {
    Logger.error(error);
  }
}
