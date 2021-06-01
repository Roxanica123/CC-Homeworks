import jwt from "jsonwebtoken"

import { PfxService } from ".";

import { EmptyBody, Forbidden, HttpActionResult, Unauthorized } from "../action_results";

import { UserTypes } from "../entities";

export class RequestsValidationService {
    private readonly pfxService : PfxService;
    public static readonly instance: RequestsValidationService = new RequestsValidationService();

    private constructor() { 
        this.pfxService = new PfxService();
    }
    public async hasAcces(request: any, roles: UserTypes[]): Promise<HttpActionResult | true> {
        const header: string = request.headers.authorization;
        
        if (header === undefined || !header.startsWith("Bearer ")) return new Unauthorized(EmptyBody);
        const token: string = header.split(" ")[1];

        try {
            const result: any = jwt.verify(token, await this.pfxService.cert(), { algorithms: ["RS512"] })
            return roles.indexOf(result.role) !== -1 ? true : new Forbidden(EmptyBody);
        } catch (e){
            console.log(e);
            return new Unauthorized(EmptyBody);
        }
    }
}