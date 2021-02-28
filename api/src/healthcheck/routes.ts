import { APIStatus, APIResponse } from "../utils/Error";
import { Request, Response } from "express";

export default function (request: Request, response: Response): void {
    response.send(new APIResponse(APIStatus.Success, "Ok"));
}
