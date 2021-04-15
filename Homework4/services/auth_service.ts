import crypto from "crypto"
import { BadRequest, Created, EmptyBody, HttpActionResult, ServerError } from "../action_results";
import { User } from "../entities/user";
import { UserData } from "../entities/user_data";
import { UserRepository } from "../repositories/user_respository";

export class AuthenticationService {
    private readonly userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    public async registerUser(user: UserData): Promise<HttpActionResult> {
        const userExists: boolean | undefined = await this.userRepository.exists(user);
        if (userExists == undefined) return new ServerError("Something went wrong :(");
        if (!userExists) {
            const result = await this.userRepository.save({
                username: user.username ?? "",
                passwordHash: this.getPasswordHash(user.password),
                email: user.email
            });
            if (result == undefined) return new ServerError("Something went wrong :(");
            return new Created(EmptyBody);
        }
        return new BadRequest("User already exists");
    }
    public async authenticateUser(user: UserData) {
        const existentUser: User | undefined = this.userRepository.findByEmail(user.email);
    }
    private getPasswordHash(password: string) {
        return crypto.createHash("sha256").update(password).digest("hex");
    }

}