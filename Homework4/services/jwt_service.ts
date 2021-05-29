import jwt from "jsonwebtoken"
import { EmptyBody, HttpActionResult, NoContent, Ok, ServerError, Unauthorized, Forbidden } from "../action_results";
import { User, UserData } from "../entities";
import { AuthenticationService } from ".";
import { JwtRepository } from "../repositories";
import { PfxService } from "./pfx_service";


export class JwtService {
    private readonly jwtRepository: JwtRepository;
    private readonly pfxService: PfxService;

    constructor() {
        this.pfxService = new PfxService();
        this.jwtRepository = new JwtRepository();
    }

    public async getTokens(user: UserData): Promise<HttpActionResult> {
        const existentUser: User | null | undefined = await new AuthenticationService().authenticateUser(user);
        if (existentUser === undefined) return new ServerError("Something went wrong :(");
        if (existentUser === null) return new Unauthorized(EmptyBody);

        const accessToken = await this.generateAccessToken(existentUser);
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
        return new Ok(JSON.stringify({ accessToken: await this.generateAccessToken(result) }));
    }

    public async deleteRefreshToken(refreshToken: string): Promise<HttpActionResult> {
        const deleted = await this.jwtRepository.delete(refreshToken);
        if (deleted === undefined) return new ServerError("Something went wrong :(");
        return new NoContent(EmptyBody);
    }

    public async getRole(token: string): Promise<HttpActionResult> {
        try {
            const result: any = jwt.verify(token, await this.pfxService.cert(), { algorithms: ['RS512'] });
            return new Ok(JSON.stringify({ role: result.role }));
        }
        catch {
            return new Forbidden(EmptyBody);
        }

    }

    private async generateAccessToken(user: any): Promise<string> {
        const key = await this.pfxService.key();
        return jwt.sign({
            username: user.username,
            email: user.email,
            role: user.role
        }, key, { expiresIn: '15m', algorithm: "RS512" })
    }
    private generateRefreshToken(user: User): string {
        return jwt.sign({
            username: user.username,
            email: user.email,
            role: user.role
        }, process.env.REFRESH_TOKEN_SECRET ?? "")
    }
}