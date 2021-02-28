"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function deleteUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        //delete user document in user table
        yield app_1.BeepORM.userRepository.removeAndFlush(user);
        //delete user's queue table from beepQueues 
        yield app_1.BeepORM.queueEntryRepository.removeAndFlush({ beeper: user });
        //deative all of the user's tokens
        helpers_1.deactivateTokens(user);
        return true;
    });
}
exports.deleteUser = deleteUser;
