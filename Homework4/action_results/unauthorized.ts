import { HttpActionResult } from "./http-action-result";

export class Unauthorized implements HttpActionResult {
    public readonly statusCode: number;
    public readonly body: string;
    constructor(body: string) {
        this.statusCode = 401;
        this.body = body;
    }
}