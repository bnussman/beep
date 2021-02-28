import { Manager } from "socket.io-client";
import { config } from './config';

const manager = new Manager(config.baseUrl, { transports: ['websocket'] });
const socket = manager.socket("/");

export default socket

export function didUserChange(existingUser, newData) {
    let changed = false;
    for (const key in newData) {
        if (existingUser[key] !== newData[key]) {
            changed = true;
        }
    }
    return changed;
}
