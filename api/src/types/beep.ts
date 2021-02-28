import { ObjectId } from '@mikro-orm/mongodb';
import { TokenEntry } from '../entities/TokenEntry';
import { User } from '../entities/User';

export interface TokenData {
    userid?: ObjectId,
    token: ObjectId,
    tokenid: ObjectId
}

export interface BeepError {
    status: string;
    message: string;
}
/*
export interface User {
    id: ObjectId;
    first: string;
    last: string;
    email: string;
    phone: string;
    venmo: string;
    username: string;
    password?: string;
    capacity: number;
    singlesRate: number;
    groupRate: number;
    pushToken?: string | null;
    isBeeping: boolean;
    queueSize: number;
    userLevel: number;
    isEmailVerified: boolean;
    isStudent: boolean;
    masksRequired: boolean;
    photoUrl: string | null;
}
*/

export interface UserPluckResult {
    id?: string;
    first?: string;
    last?: string;
    email?: string;
    phone?: string;
    venmo?: string;
    username?: string;
    password?: string;
    capacity?: number;
    singlesRate?: number;
    groupRate?: number;
    pushToken?: string | null;
    inQueueOfUserID?: string | null;
    isBeeping?: boolean;
    queueSize?: number;
    userLevel?: number;
    isEmailVerified?: boolean;
    isStudent?: boolean;
}

export interface TokenPluckResult {
    id?: string,
    tokenid?: string,
    userid?: string
}

export interface BeepTableResult {
    beepersid: string;
    beepersName?: string;
    id?: string;
    destination: string;
    origin: string;
    groupSize: number | string;
    isAccepted: boolean;
    riderid: string;
    riderName: string;
    state: number;
    timeEnteredQueue: number;
}

declare global {
    namespace Express {
        export interface Request {
            user: { user: User, token: TokenEntry };
        }
    }
}
