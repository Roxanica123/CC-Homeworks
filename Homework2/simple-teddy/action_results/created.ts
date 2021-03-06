import { HttpActionResult } from "./http-action-result";

export class Created implements HttpActionResult {
    public readonly statusCode: number;
    public readonly body: string;
    public readonly redirectLocation: string;
    
    constructor(body: string, location:string) {
        this.statusCode = 201;
        this.body = body;
        this.redirectLocation = location;
    }
}