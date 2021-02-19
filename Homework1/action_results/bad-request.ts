  import { HttpActionResult } from "./http-action-result";

export class BadRequest implements HttpActionResult {
    public readonly statusCode: number;
    public readonly body: string;
    constructor(body: string) {
        this.statusCode = 400;
        this.body = body;
    }
}