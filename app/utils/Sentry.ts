import * as SentryInternal from 'sentry-expo';
import { isMobile } from './config';
import config from '../package.json';

class Sentry {
    public init(): void {
        SentryInternal.init({
            release: config.version,
            dsn: 'https://0b53ec3e7bc4401aa5bfb88f2dce0c31@sentry.nussman.us/3',
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
