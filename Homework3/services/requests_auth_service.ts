import fs from "fs"
import jwt from "jsonwebtoken"
import { Forbidden, HttpActionResult, Unauthorized } from "../action_results";

import { UserTypes } from "./user_roles";

export class RequestsAuthService {
    private readonly key = fs.readFileSync("./public.key");
    public static readonly instance: RequestsAuthService = new RequestsAuthService();
    private constructor() { }
    public hasAcces(request: any, roles: UserTypes[]): true | HttpActionResult {
        const header: string = request.headers.authorization;
        
        if (header === undefined || !header.startsWith("Bearer ")) return new Unauthorized();
        const token: string = header.split(" ")[1];

        try {
            const result: any = jwt.verify(token, this.key, { algorithms: ["RS512"] })
            return roles.indexOf(result.role) !== -1 ? true : new Forbidden();
        } catch (e){
            console.log(e);
            return new Unauthorized();
        }
    }
}