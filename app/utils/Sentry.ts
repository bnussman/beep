import * as SentryInternal from 'sentry-expo';
import {isMobile} from './config';

class Sentry {
    public init(): void {
        SentryInternal.init({
            dsn: 'https://9bea69e2067f4e2a96e6c26627f97732@sentry.nussman.us/4',
            enableInExpoDevelopment: true,
            debug: false,
            enableAutoSessionTracking: true
        });
    }

    public setUserContext(user: any): void {
        if (isMobile) {
            SentryInternal.Native.setUser({ ...user });
        }
        else {
            SentryInternal.Browser.setUser({ ...user });
        }
    }
}

const s = new Sentry();

export default s as Sentry;
