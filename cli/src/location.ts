import * as r from 'rethinkdb';
import database from './utils/db';

export default class Location {
    public async migrate(): Promise<void> {
        const cursor = await r.table("users").run((await database.getConn()));

        cursor.each(async (error: r.CursorError, user: any) => {
            if (error) console.error(error);
            
            try {
                const result = await r.db("beepLocations").tableCreate(user.id).run((await database.getConnLocations()));
                console.log(result);
            }
            catch (error) {
                console.log("user", user.id, "already has locations table");
            }
        });
    }    
}
