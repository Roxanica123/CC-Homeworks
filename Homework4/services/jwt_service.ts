import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import { EmptyBody, HttpActionResult, Ok, ServerError, Unauthorized } from "../action_results";
import { User } from "../entities/user";
import { UserData } from "../entities/user_data";
import { AuthenticationService } from "./auth_service";
import { JwtRepository } from "../repositories/jwt_repository";
import { Forbidden } from "../action_results/forbidden";
dotenv.config()

export class JwtService {
    private readonly jwtRepository: JwtRepository;
    constructor() {
        this.jwtRepository = new JwtRepository();
    }

    public async getTokens(user: UserData): Promise<HttpActionResult> {
        const existentUser: User | null | undefined = await new AuthenticationService().authenticateUser(user);
        if (existentUser === undefined) return new ServerError("Something went wrong :(");
        if (existentUser === null) return new Unauthorized(EmptyBody);

        const accessToken = this.generateAccessToken(existentUser);
        const refreshToken = this.generateRefreshToken(existentUser);

        await this.jwtRepository.save(refreshToken, user.email);
        return new Ok(JSON.stringify({ accessToken: accessToken, refreshToken: refreshToken }))

    }
    public async getAccessToken(refreshToken: string): Promise<HttpActionResult> {
        const existentToken: boolean | undefined = await this.jwtRepository.exists(refreshToken);
        if (existentToken === undefined) return new ServerError("Something went wrong :(");
        if (existentToken === false) return new Forbidden(EmptyBody);
        const result = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET ?? "");
        if (typeof (result) === "string") return new Forbidden(EmptyBody);
        return new Ok(JSON.stringify({ accessToken: this.generateAccessToken(result) }));
    }

    private generateAccessToken(user: any): string {
        return jwt.sign({
            username: user.username,
            email: user.email
        }, process.env.ACCESS_TOKEN_SECRET ?? "", { expiresIn: '15m' })
    }
    private generateRefreshToken(user: User): string {
        return jwt.sign({
            username: user.username,
            email: user.email
        }, process.env.REFRESH_TOKEN_SECRET ?? "")
    }
}