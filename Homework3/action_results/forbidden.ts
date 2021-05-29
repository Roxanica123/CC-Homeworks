import { EmptyBody, HttpActionResult } from "./http-action-result";

export class Forbidden implements HttpActionResult {
    public readonly statusCode: number;
    public readonly body: string;
    constructor() {
        this.statusCode = 403;
        this.body = JSON.stringify(EmptyBody);
    }
}