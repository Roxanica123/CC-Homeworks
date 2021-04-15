import { HttpActionResult } from "./http-action-result";

export class Forbidden implements HttpActionResult {
    public readonly statusCode: number;
    public readonly body: string;
    constructor(body: string) {
        this.statusCode = 403;
        this.body = body;
    }
}