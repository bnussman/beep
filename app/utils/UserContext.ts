import React from 'react';
import { User } from '../types/Beep';

export interface UserContextData {
    user: User | null;
    setUser: (user: User | null) => void;
}

export interface AuthenticatedUserContextData {
    user: User;
    setUser: (user: User | null) => void;
}

export const UserContext = React.createContext<UserContextData | null>(null);
