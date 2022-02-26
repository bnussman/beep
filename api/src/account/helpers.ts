import { User } from '../entities/User';
import { Stream } from "stream";
import { Rating } from "../entities/Rating";
import { Report } from "../entities/Report";
import { Beep } from "../entities/Beep";
import { QueueEntry } from "../entities/QueueEntry";
import { ForgotPassword } from "../entities/ForgotPassword";
import { VerifyEmail } from "../entities/VerifyEmail";
import { EntityManager } from "@mikro-orm/core";
import { TokenEntry } from "../entities/TokenEntry";

/**
 * Used for handling GraphQL Uploads
 */
export interface Upload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}

/**
 * checks last 4 characters of an email address
 * @param email
 * @returns boolean true if ends in ".edu" and false if otherwise
 */
export function isEduEmail(email: string): boolean {
  return (email.substr(email.length - 3) === "edu");
}

/**
 * delete a user based on their id
 * @param id string the user's id
 * @returns boolean true if delete was successful
 */
export async function deleteUser(user: User, em: EntityManager): Promise<boolean> {
  await em.nativeDelete(ForgotPassword, { user: user });

  await em.nativeDelete(VerifyEmail, { user: user });

  await em.nativeDelete(QueueEntry, { beeper: user });
  await em.nativeDelete(QueueEntry, { rider: user });

  await em.nativeDelete(Beep, { beeper: user });
  await em.nativeDelete(Beep, { rider: user });

  await em.nativeDelete(Report, { reporter: user });
  await em.nativeDelete(Report, { reported: user });

  await em.nativeDelete(Rating, { rater: user });
  await em.nativeDelete(Rating, { rated: user });

  await em.nativeDelete(TokenEntry, { user });

  await em.nativeDelete(User, user);

  return true;
}