import { MongoClient } from 'mongodb';
import * as Sentry from "@sentry/node";

const uri = `mongodb+srv://banks:${process.env.MONGODB_PASSWORD}@beep.5zzlx.mongodb.net/beep?retryWrites=true&w=majority`;

class Database {

    private connection: MongoClient;

    constructor() {
        this.connection = new MongoClient(uri, { useUnifiedTopology: true });
    }

    public async connect(run?: () => void): Promise<void> {
        await this.connection.connect();
        if (run) run();
    }

    public async close(): Promise<void> {
        await this.connection.close();
    }

    public beep() {
        return this.connection.db('beep');
    }
}
const db = new Database();
export default db;
