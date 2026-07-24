import { defineConfig } from '@mikro-orm/postgresql';
import { DB_URL } from './utils/constants';
import { User } from './entities/User';
import { Beep } from './entities/Beep';
import { VerifyEmail } from './entities/VerifyEmail';
import { Car } from './entities/Car';
import { Feedback } from './entities/Feedback';
import { ForgotPassword } from './entities/ForgotPassword';
import { Token } from './entities/Token';
import { Rating } from './entities/Rating';
import { Payment } from './entities/Payment';
import { Report } from './entities/Report';

export default defineConfig({
  debug: ['query'],
  entities: [
    User,
    Beep,
    Report,
    Rating,
    Car,
    Feedback,
    Token,
    Payment,
    VerifyEmail,
    ForgotPassword,
  ],
  clientUrl: DB_URL,
});
