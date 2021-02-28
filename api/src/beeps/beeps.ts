import { Beep } from '../entities/Beep';
import { APIStatus } from '../utils/Error';

export interface BeepsResponse {
    status: APIStatus,
    total: number;
    beeps: Beep[]
}

export interface BeepResponse {
    status: APIStatus;
    beep: Beep;
}
