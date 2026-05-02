import { EntityManager } from "@mikro-orm/core";
import { User } from "../entities/User";
import { UsersResponse } from "./resolver";
import { Stream } from "stream";
import { Rating } from "../entities/Rating";
import { Report } from "../entities/Report";
import { Beep } from "../entities/Beep";
import { ForgotPassword } from "../entities/ForgotPassword";
import { VerifyEmail } from "../entities/VerifyEmail";
import { Token } from "../entities/Token";
import { Car } from "../entities/Car";
import { Feedback } from "../entities/Feedback";

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
  return (email.substring(email.length - 3) === "edu");
}

/**
 * delete a user based on their id
 * @param id string the user's id
 * @returns boolean true if delete was successful
 */
export async function deleteUser(user: User, em: EntityManager): Promise<boolean> {
  await em.nativeDelete(Car, { user });

  await em.nativeDelete(ForgotPassword, { user: user });

  await em.nativeDelete(VerifyEmail, { user: user });

  await em.nativeDelete(Feedback, { user: user });

  await em.nativeDelete(Rating, { rater: user });
  await em.nativeDelete(Rating, { rated: user });

  await em.nativeDelete(Report, { reporter: user });
  await em.nativeDelete(Report, { reported: user });

  await em.nativeDelete(Beep, { beeper: user });
  await em.nativeDelete(Beep, { rider: user });

  await em.nativeDelete(Token, { user });

  await em.nativeDelete(User, user);

  return true;
}

export async function search(
  em: EntityManager,
  offset: number = 0,
  show: number = 500,
  query: string
): Promise<UsersResponse> {
  const connection = em.getConnection();

  if (!query.endsWith(' ')) {
    query = query.replace(" ", " & ");
  }

  const raw: User[] = await connection.execute(`select * from public.user where to_tsvector(id || ' ' || first|| ' '  || username || ' ' || last || ' ' || email || ' ' || phone) @@ to_tsquery('${query}') limit ${show} offset ${offset};`);
  const count = await connection.execute(`select count(*) from public.user where to_tsvector(id || ' ' || first|| ' '  || username || ' ' || last || ' ' || email || ' ' || phone) @@ to_tsquery('${query}')`);

  const users = raw.map(user => em.map(User, user));

  return {
    items: users,
    count: count[0].count
  };
}
