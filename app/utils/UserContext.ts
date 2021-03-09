import React from 'react';
import { AuthContext } from '../types/Beep';

export interface AuthenticatedUserContextData {
    user: AuthContext | null;
    setUser: (user: AuthContext | null) => void;
}

export const UserContext = React.createContext<AuthenticatedUserContextData | null>(null);
