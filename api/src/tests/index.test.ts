/*
import BeepAPIServer from "../app";
import request from "supertest";
import MockUser from "./MockUser";

let b: BeepAPIServer;

const rider: MockUser = new MockUser("rider");
const beeper: MockUser = new MockUser("beeper");

beforeAll(async () => {
    b = new BeepAPIServer();
    await b.start();
});

afterAll(async () => {
    await b.close();
});

describe('Authentication', () => {
    describe('POST /auth/signup', () => {
        test('Successfully signed up (beeper)', async () => {
            const res = await request(b.getApp())
                .post('/auth/signup')
                .send(beeper.getUserDetails());
            beeper.setUserResponse(res.body);
            expect(res.status).toEqual(200);
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('token');
        });

        test('Successfully signed up (rider)', async () => {
            const res = await request(b.getApp())
                .post('/auth/signup')
                .send(rider.getUserDetails());
            rider.setUserResponse(res.body);
            expect(res.status).toEqual(200);
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('token');
        });

        test('Status code 522 if missing required fields', async () => {
            const res = await request(b.getApp())
                .post('/auth/login')
                .send({
                    username: "",
                    password: "",
                });
            expect(res.status).toEqual(422);
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('message');
        });
    });

    describe('POST /auth/login', () => {
        test('Successfully login', async () => {
            const res = await request(b.getApp())
                .post('/auth/login')
                .send({
                    username: "banks",
                    password: "Charlie0",
                });
            expect(res.status).toEqual(200);
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('token');
        });

        test('Status code 522 if missing required fields', async () => {
            const res = await request(b.getApp())
                .post('/auth/login')
                .send({
                    username: "",
                    password: "",
                });
            expect(res.status).toEqual(422);
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('message');
        });

        test('Status code 401 if username or password is wrong', async () => {
            const res = await request(b.getApp())
                .post('/auth/login')
                .send({
                    username: "banks",
                    password: "wrongPassword",
                });
            expect(res.status).toEqual(401);
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('message');
        });
    });
});

describe('Rider', () => {
    describe('GET /rider/list', () => {
        test('Get list of beepers', async () => {
            const res = await request(b.getApp()).get('/rider/list');
            expect(res.status).toEqual(200);
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('beeperList');
        });
    });

    describe('POST /rider/status', () => {
        test('Successfully get rider status', async () => {
            const res = await request(b.getApp())
                .post('/rider/status')
                .set({ Authorization: "Bearer " + rider.getUserResponse().token });
            expect(res.status).toEqual(200);
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('message');
        });
    });

    describe('POST /rider/find', () => {
        test('Successfully find beeper', async () => {
            const res = await request(b.getApp())
                .post('/rider/find')
                .set({ Authorization: "Bearer " + rider.getUserResponse().token });
            rider.setFoundBeeperId(res.body.beeper.id);
            expect(res.status).toEqual(200);
            expect(res.body).toHaveProperty('status');
        });
    });

    describe('POST /rider/choose', () => {
        test('Successfully choose beeper as rider', async () => {
            const res = await request(b.getApp())
                .post('/rider/choose')
                .send({
                    beepersID: rider.getFoundBeeperId(),
                    origin: "Hoey Hall",
                    destination: "The Grove",
                    groupSize: 3
                })
                .set({ Authorization: "Bearer " + rider.getUserResponse().token });
            expect(res.status).toEqual(200);
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('beeper');
        });

        test('Status code 422 when choose beep without beepersID', async () => {
            const res = await request(b.getApp())
                .post('/rider/choose')
                .set({ Authorization: "Bearer " + rider.getUserResponse().token });
            expect(res.status).toEqual(422);
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('message');
        });
    });
});

describe('Account', () => {
    describe('POST /account/delete', () => {
        test('Successfully deleted account (rider)', async () => {
            const res = await request(b.getApp())
                .post('/account/delete')
                .set({ Authorization: "Bearer " + rider.getUserResponse().token });
            expect(res.status).toEqual(200);
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('message');
        });

        test('Successfully deleted account (beeper)', async () => {
            const res = await request(b.getApp())
                .post('/account/delete')
                .set({ Authorization: "Bearer " + beeper.getUserResponse().token });
            expect(res.status).toEqual(200);
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('message');
        });

        test('Status code 401 when not authenticated', async () => {
            const res = await request(b.getApp())
                .post('/rider/status')
                .set({ Authorization: "Bearer Fake-Token" });
            expect(res.status).toEqual(401);
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe("Your token is not valid.");
        });

        test('Status code 401 when no auth token is provided', async () => {
            const res = await request(b.getApp())
                .post('/rider/status')
            expect(res.status).toEqual(401);
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe("You did not provide an authentication token.");
        });
    });
});
*/

describe("Beep API jest testing", () => {
    test("are tests working", () => {
        expect(1).toBe(1);
    });
});
