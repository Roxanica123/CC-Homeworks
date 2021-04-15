import { HttpActionResult } from "./http-action-result";

export class Created implements HttpActionResult {
    public readonly statusCode: number;
    public readonly body: string;
    
    constructor(body: string) {
        this.statusCode = 201;
        this.body = body;
    }
}