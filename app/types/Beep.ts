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

export interface TokenEntry {
    id: string,
    tokenid: string,
    userid: string
}

export interface TokenPluckResult {
    id?: string,
    tokenid?: string,
    userid?: string
}

export interface AuthUser {
    id: string,
    token: string
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

export interface LocationEntry {
    id: string;
    accuracy: number;
    altitude: number;
    altitudeAccuracy: number;
    heading: number;
    latitude: number;
    longitude: number;
    speed: number;
    timestamp: number;
}
