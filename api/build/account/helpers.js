"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.isEduEmail = void 0;
const helpers_1 = require("../auth/helpers");
const app_1 = require("../app");
/**
 * checks last 4 characters of an email address
 * @param email
 * @returns boolean true if ends in ".edu" and false if otherwise
 */
function isEduEmail(email) {
    return (email.substr(email.length - 3) === "edu");
}
exports.isEduEmail = isEduEmail;
/**
 * delete a user based on their id
 * @param id string the user's id
 * @returns boolean true if delete was successful
 */
async function deleteUser(user) {
    await app_1.BeepORM.queueEntryRepository.nativeDelete({ beeper: user });
    await app_1.BeepORM.queueEntryRepository.nativeDelete({ rider: user });
    await app_1.BeepORM.beepRepository.nativeDelete({ beeper: user });
    await app_1.BeepORM.beepRepository.nativeDelete({ rider: user });
    await app_1.BeepORM.reportRepository.nativeDelete({ reporter: user });
    await app_1.BeepORM.reportRepository.nativeDelete({ reported: user });
    await app_1.BeepORM.userRepository.nativeDelete(user);
    helpers_1.deactivateTokens(user);
    return true;
}
exports.deleteUser = deleteUser;
