import { HttpActionResult } from "./http-action-result";

export class Conflict implements HttpActionResult {
    public readonly statusCode: number;
    public readonly body: string;
    constructor(body: string) {
        this.statusCode = 409;
        this.body = body;
    }
}