import { EmptyBody, HttpActionResult } from "./http-action-result";

export class Unauthorized implements HttpActionResult {
    public readonly statusCode: number;
    public readonly body: string;
    constructor() {
        this.statusCode = 401;
        this.body = JSON.stringify(EmptyBody);
    }
}