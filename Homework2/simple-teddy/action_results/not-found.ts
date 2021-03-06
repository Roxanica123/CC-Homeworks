import { HttpActionResult, EmptyBody } from "./http-action-result";

export class NotFound implements HttpActionResult {
    public readonly statusCode: number;
    public readonly body: string;
    constructor(body: string = EmptyBody) {
        this.body = body;
        this.statusCode = 404;
    }
}