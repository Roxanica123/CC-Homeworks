import { HttpActionResult } from "./http-action-result";

export class ServerError implements HttpActionResult {
    public readonly statusCode: number;
    public readonly body: string;
    constructor(body: string) {
        this.statusCode = 500;
        this.body = JSON.stringify({error: body});
    }
}