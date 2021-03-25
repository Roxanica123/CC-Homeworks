import { HttpActionResult, EmptyBody } from "./http-action-result";

export class NoContent implements HttpActionResult {
    public readonly statusCode: number;
    public readonly body: string;
    constructor(body: string = EmptyBody) {
        this.body = body;
        this.statusCode = 204;
    }
}