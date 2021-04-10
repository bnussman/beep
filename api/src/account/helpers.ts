import { deactivateTokens } from "../auth/helpers";
import { BeepORM } from "../app";
import { User } from '../entities/User';

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
export async function deleteUser(user: User): Promise<boolean> {

    await BeepORM.queueEntryRepository.nativeDelete({ beeper: user });
    await BeepORM.queueEntryRepository.nativeDelete({ rider: user });
    
    await BeepORM.beepRepository.nativeDelete({ beeper: user });
    await BeepORM.beepRepository.nativeDelete({ rider: user });

    await BeepORM.reportRepository.nativeDelete({ reporter: user });
    await BeepORM.reportRepository.nativeDelete({ reported: user });
    
    await BeepORM.ratingRepository.nativeDelete({ rater: user });
    await BeepORM.ratingRepository.nativeDelete({ rated: user });

    await BeepORM.userRepository.nativeDelete(user);

    deactivateTokens(user);

    return true;
}
