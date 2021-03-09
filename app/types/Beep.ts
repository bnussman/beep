export interface User {
    id: string;
    first: string;
    last: string;
    email: string;
    phone: string;
    venmo: string;
    username: string;
    password: string;
    capacity: number;
    singlesRate: number;
    groupRate: number;
    pushToken: string | null;
    inQueueOfUserID: string | null;
    isBeeping: boolean;
    queueSize: number;
    userLevel: number;
    isEmailVerified: boolean;
    isStudent: boolean;
    token: string;
    tokenid: string;
    masksRequired: boolean;
    photoUrl: string | null;
}

export interface Tokens {
    id: string;
    tokenid: string;
}

export interface AuthContext {
    user: User;
    tokens: Tokens;
}
