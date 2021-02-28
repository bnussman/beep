import Location from './location';
import Queues from './queues';
import database from './utils/db';

const input: string[] = process.argv.slice(2);

function main() {
    if (input[0] == "location") {
        if (input[1] == "migrate") {
            const l = new Location();
            l.migrate();
        }
    }

    if (input[0] == "queue") {
        if (input[1] == "clear") {
            const q = new Queues();
            q.clear(input[2]);
        }
    }
}

database.connect(() => {
    main();
});
