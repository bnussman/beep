import * as Sentry from 'sentry-expo';
import { User } from '../types/Beep';
import { isMobile } from './config';

export function setSentryUserContext(user: User | null): void {
    if (isMobile) {
        Sentry.Native.setUser({ ...user });
    }
    else {
        Sentry.Browser.setUser({ ...user });
    }
}

export function initializeSentry(): void {
    Sentry.init({
        dsn: 'https://9bea69e2067f4e2a96e6c26627f97732@sentry.nussman.us/4',
        enableInExpoDevelopment: true,
        enableAutoSessionTracking: true,
        environment: __DEV__ ? "development" : "production",
        debug: false
    });
}
