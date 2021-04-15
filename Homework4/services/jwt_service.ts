import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import { EmptyBody, HttpActionResult, Ok, ServerError, Unauthorized } from "../action_results";
import { User } from "../entities/user";
import { UserData } from "../entities/user_data";
import { AuthenticationService } from "./auth_service";
dotenv.config()

export class JwtService {
    public async getTokens(user: UserData): Promise<HttpActionResult> {
        const existentUser: User | null | undefined = await new AuthenticationService().authenticateUser(user);
        if (existentUser === undefined) return new ServerError("Something went wrong :(");
        if (existentUser === null) return new Unauthorized(EmptyBody);

        const accessToken = jwt.sign({
            username: existentUser.username,
            email: existentUser.email
        }, process.env.ACCESS_TOKEN_SECRET ?? "", { expiresIn: '15m' })
        return new Ok(JSON.stringify({ accessToken: accessToken }))
        //const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    }
}