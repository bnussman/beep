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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var Sentry = require("@sentry/node");
var helpers_1 = require("./utils/helpers");
var json_1 = require("./utils/json");
var sentry_1 = require("./utils/sentry");
var db_1 = require("./utils/db");
var mongodb_1 = require("mongodb");
var server = new socket_io_1.Server();
sentry_1.initializeSentry();
server.on("connection", function (socket) {
    socket.on('getRiderStatus', function (authToken, beepersID) {
        return __awaiter(this, void 0, void 0, function () {
            var userid, filter, stream, filter2, stream2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, helpers_1.isTokenValid(authToken)];
                    case 1:
                        userid = _a.sent();
                        if (!userid) {
                            server.to(socket.id).emit('updateRiderStatus', json_1.makeJSONError("Your token is not valid."));
                            return [2 /*return*/];
                        }
                        if (!beepersID) {
                            server.to(socket.id).emit('updateRiderStatus', json_1.makeJSONError("You did not provide a beeper's id"));
                            return [2 /*return*/];
                        }
                        filter = [{ $match: { 'fullDocument.beeper': new mongodb_1.ObjectId(beepersID) } }];
                        stream = db_1.default.beep().collection('queue-entry').watch(filter, { fullDocument: 'updateLookup' });
                        stream.on("change", function (changeEvent) {
                            server.to(socket.id).emit("updateRiderStatus");
                            console.log("Rider Update", userid);
                        });
                        socket.on('stopGetRiderStatus', function stop() {
                            stream.close();
                        });
                        socket.on("disconnect", function () {
                            stream.close();
                            socket.removeAllListeners();
                        });
                        filter2 = [{ $match: { 'fullDocument.user': userid } }];
                        stream2 = db_1.default.beep().collection('queue-entry').watch(filter2, { fullDocument: 'updateLookup' });
                        stream2.on("change", function (changeEvent) {
                            //@ts-ignore
                            server.to(socket.id).emit("hereIsBeepersLocation", changeEvent.fullDocument);
                        });
                        socket.on('stopGetRiderStatus', function stop() {
                            stream2.close();
                        });
                        socket.on("disconnect", function () {
                            stream2.close();
                            socket.removeAllListeners();
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
    socket.on('getQueue', function (userid) {
        return __awaiter(this, void 0, void 0, function () {
            var filter, stream;
            return __generator(this, function (_a) {
                filter = [{ $match: { 'fullDocument.beeper': new mongodb_1.ObjectId(userid) } }];
                stream = db_1.default.beep().collection('queue-entry').watch(filter, { fullDocument: 'updateLookup' });
                stream.on("change", function (changeEvent) {
                    server.to(socket.id).emit("updateQueue");
                });
                socket.on('stopGetQueue', function stop() {
                    stream.close();
                });
                socket.on("disconnect", function () {
                    stream.close();
                    socket.removeAllListeners();
                });
                return [2 /*return*/];
            });
        });
    });
    socket.on('getUser', function (authToken) {
        return __awaiter(this, void 0, void 0, function () {
            var userid, filter, stream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, helpers_1.isTokenValid(authToken)];
                    case 1:
                        userid = _a.sent();
                        if (!userid) {
                            server.to(socket.id).emit('updateUser', json_1.makeJSONError("Your token is not valid."));
                            return [2 /*return*/];
                        }
                        filter = [{ $match: { "fullDocument._id": userid } }];
                        stream = db_1.default.beep().collection('user').watch(filter, { fullDocument: 'updateLookup' });
                        stream.on("change", function (changeEvent) {
                            var _a;
                            //@ts-ignore
                            if ((_a = changeEvent.updateDescription) === null || _a === void 0 ? void 0 : _a.updatedFields) {
                                //@ts-ignore
                                console.log("User Profile Update", userid, changeEvent.updateDescription.updatedFields);
                                //@ts-ignore
                                if (!changeEvent.updateDescription.updatedFields.password) {
                                    //@ts-ignore
                                    server.to(socket.id).emit('updateUser', changeEvent.updateDescription.updatedFields);
                                }
                            }
                        });
                        socket.on('stopGetUser', function stop() {
                            stream.close();
                        });
                        socket.on("disconnect", function () {
                            stream.close();
                            socket.removeAllListeners();
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
    socket.on('updateUsersLocation', function (authToken, latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, speed) {
        return __awaiter(this, void 0, void 0, function () {
            var userid, dataToInsert;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, helpers_1.isTokenValid(authToken)];
                    case 1:
                        userid = _a.sent();
                        if (!userid) {
                            return [2 /*return*/, console.log("Token is not valid. Just skipping this entry attempt")];
                        }
                        dataToInsert = {
                            user: new mongodb_1.ObjectId(userid),
                            latitude: latitude,
                            longitude: longitude,
                            altitude: altitude,
                            accuracy: accuracy,
                            altitudeAccuracy: altitudeAccuracy,
                            heading: heading,
                            speed: speed,
                            timestamp: Date.now()
                        };
                        try {
                            db_1.default.beep().collection("location").insertOne(dataToInsert);
                        }
                        catch (error) {
                            Sentry.captureException(error);
                            console.log(error);
                        }
                        return [2 /*return*/];
                }
            });
        });
    });
});
db_1.default.connect(function () {
    server.listen(3000);
    console.log("Running Beep Socket on http://0.0.0.0:3000");
});
