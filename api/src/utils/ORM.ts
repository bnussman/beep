import { EntityManager, EntityRepository, MikroORM } from "@mikro-orm/core";
import { User } from "../entities/User";
import { Beep } from "../entities/Beep";
import { ForgotPassword } from "../entities/ForgotPassword";
import { QueueEntry } from "../entities/QueueEntry";
import { Rating } from "../entities/Rating";
import { Report } from "../entities/Report";
import { TokenEntry } from "../entities/TokenEntry";
import { VerifyEmail } from "../entities/VerifyEmail";
import { Location } from "../entities/Location";

export interface ORM {
    orm: MikroORM,
    em: EntityManager
    userRepository: EntityRepository<User>,
    queueEntryRepository: EntityRepository<QueueEntry>,
    tokenRepository: EntityRepository<TokenEntry>,
    verifyEmailRepository: EntityRepository<VerifyEmail>,
    beepRepository: EntityRepository<Beep>,
    forgotPasswordRepository: EntityRepository<ForgotPassword>,
    reportRepository: EntityRepository<Report>,
    locationRepository: EntityRepository<Location>,
    ratingRepository: EntityRepository<Rating>,
};