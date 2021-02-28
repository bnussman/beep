import * as Sentry from "@sentry/node";
import {ObjectId} from "mongodb";
import db from "./db";

/**
 * Retuns user's id if their token is valid, null otherwise
 *
 * @param token takes a user's auth token as input
 * @return userid if token is valid, null otherwise
 */
export async function isTokenValid(token: string): Promise<string | null> {
    if (token == null) return null;

    try {
        const result = await db.beep().collection('token-entry').findOne(new ObjectId(token));
        console.log(result);

        if (result) {
            return result.user;
        }

        //we did not find this token in the tokens table, so it is not valid,
        //rather then returning a userid, return null to signify that token is not valid.
    }
    catch (error) {
        console.error(error);
    }

    return null;
}

export function formulateUserUpdateData(data: any) {
    const didPasswordChange: boolean = data.updateDescription?.updatedFields?.password != null;

    return {
        id: data.fullDocument._id,
        first: data.fullDocument.first,
        last: data.fullDocument.last,
        email: data.fullDocument.email,
        phone: data.fullDocument.phone,
        capacity: data.fullDocument.capacity,
        groupRate: data.fullDocument.groupRate,
        singlesRate: data.fullDocument.singlesRate,
        inQueueOfUserID: data.fullDocument.inQueueOfUserID,
        isBeeping: data.fullDocument.isBeeping,
        venmo: data.fullDocument.venmo,
        userLevel: data.fullDocument.userLevel,
        isEmailVerified: data.fullDocument.isEmailVerified,
        isStudent: data.fullDocument.isStudent,
        didPasswordChange: didPasswordChange,
        masksRequired: data.fullDocument.masksRequired,
        photoUrl: data.fullDocument.photoUrl
    };
}
