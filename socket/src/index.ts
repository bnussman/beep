import { Server, Socket } from "socket.io";
import * as Sentry from "@sentry/node";
import { isTokenValid, formulateUserUpdateData } from "./utils/helpers";
import { makeJSONError } from "./utils/json";
import { initializeSentry } from "./utils/sentry";
import db from "./utils/db";
import {ObjectId} from "mongodb";

const server = new Server();

initializeSentry();

server.on("connection", function (socket: Socket) {
    socket.on('getRiderStatus', async function (authToken: string, beepersID: string) {
        const userid = await isTokenValid(authToken);

        if (!userid) {
            server.to(socket.id).emit('updateRiderStatus', makeJSONError("Your token is not valid."));
            return;
        }

        if (!beepersID) {
            server.to(socket.id).emit('updateRiderStatus', makeJSONError("You did not provide a beeper's id"));
            return;
        }

        const filter = [{ $match: {'fullDocument.beeper': new ObjectId(beepersID) } }];
        const stream = db.beep().collection('queue-entry').watch(filter, { fullDocument: 'updateLookup' });

        stream.on("change", (changeEvent) => {
            server.to(socket.id).emit("updateRiderStatus");
            console.log("Rider Update", userid);

        });

        socket.on('stopGetRiderStatus', function stop() {
            stream.close();
        });

        socket.on("disconnect", () => {
            stream.close();
            socket.removeAllListeners();
        });

        const filter2 = [{ $match: {'fullDocument.user': new ObjectId(beepersID) } }];
        const stream2 = db.beep().collection('location').watch(filter2, { fullDocument: 'updateLookup' });

        stream2.on("change", (changeEvent) => {
            console.log("Sending Location Update to Rider:", changeEvent);
            //@ts-ignore
            server.to(socket.id).emit("hereIsBeepersLocation", changeEvent.fullDocument);

        });

        socket.on('stopGetRiderStatus', function stop() {
            stream2.close();
        });

        socket.on("disconnect", () => {
            stream2.close();
            socket.removeAllListeners();
        });
    });

    socket.on('getQueue', async function (userid: string) {
        const filter = [{ $match: {'fullDocument.beeper': new ObjectId(userid) } }];
        //const stream = db.beep().collection('queue-entry').watch(filter);
        const stream = db.beep().collection('queue-entry').watch(filter, { fullDocument: 'updateLookup' });

        stream.on("change", (changeEvent) => {

            server.to(socket.id).emit("updateQueue");

        });

        socket.on('stopGetQueue', function stop() {
            stream.close();
        });

        socket.on("disconnect", () => {
            stream.close();
            socket.removeAllListeners();
        });
    });

    socket.on('getUser', async function (authToken: string) {

        const userid = await isTokenValid(authToken);

        if (!userid) {
            server.to(socket.id).emit('updateUser', makeJSONError("Your token is not valid."));
            return;
        }

        const filter = [{ $match: { "fullDocument._id": userid}  }];
        const stream = db.beep().collection('user').watch(filter, { fullDocument: 'updateLookup' });

        stream.on("change", (changeEvent) => {
            //@ts-ignore
            if (changeEvent.updateDescription?.updatedFields) {
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

        socket.on("disconnect", () => {
            stream.close();
            socket.removeAllListeners();
        });
    });

    socket.on('updateUsersLocation', async function (authToken: string, latitude: number, longitude: number, altitude: number, accuracy: number, altitudeAccuracy: number, heading: number, speed: number) {
        const userid = await isTokenValid(authToken);

        if (!userid) {
            return console.log("Token is not valid. Just skipping this entry attempt");
        }

        const dataToInsert = {
            user: new ObjectId(userid),
            latitude: latitude,
            longitude: longitude,
            altitude: altitude,
            accuracy: accuracy,
            altitudeAccuracy: altitudeAccuracy,
            heading: heading,
            speed: speed,
            timestamp: Date.now(),
            expireAt: new Date(Date.now() + (1000 * 60 * 60 * 24 * 30))
        };

        try {
            db.beep().collection("location").createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });
            db.beep().collection("location").insertOne(dataToInsert);
        } 
        catch (error) {
            Sentry.captureException(error);
            console.log(error);
        }
    });
});


db.connect(() => {
    server.listen(3000);
    console.log("Running Beep Socket on http://0.0.0.0:3000");
});
