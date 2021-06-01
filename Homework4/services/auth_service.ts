import crypto from "crypto"

import { UserRepository } from "../repositories";

import { BadRequest, Created, EmptyBody, HttpActionResult, ServerError } from "../action_results";

import { DatabaseUser, User, UserData, UserTypes } from "../entities";

export class AuthenticationService {
    private readonly userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    public async registerUser(user: UserData): Promise<HttpActionResult> {
        const userExists: boolean | undefined = await this.userRepository.exists(user);
        if (userExists == undefined) {
            return new ServerError("Something went wrong :(");
        }
        if (!userExists) {
            const result = await this.userRepository.save({
                username: user.username ?? "",
                passwordHash: this.getPasswordHash(user.password),
                email: user.email,
                role: UserTypes.BASIC
            });
            if (result == undefined) {
                return new ServerError("Something went wrong :(");
            }
            return new Created(EmptyBody);
        }
        return new BadRequest("User already exists");
    }

    public async authenticateUser(user: UserData): Promise<User | null | undefined> {
        const existentUser: User | undefined | null = await this.userRepository.findByEmail(user.email);
        if (existentUser === undefined || existentUser === null) {
            return existentUser;
        }
        if (this.getPasswordHash(user.password) === existentUser.passwordHash) {
            return existentUser;
        }
        return null;
    }

    private getPasswordHash(password: string) {
        return crypto.createHash("sha256").update(password).digest("hex");
    }
    
    public async changeUserRole(email: string, type:UserTypes): Promise<HttpActionResult> {
        const existentUser: DatabaseUser | undefined | null = await this.userRepository.findByEmail(email);
        if (existentUser == null) {
            return new BadRequest(EmptyBody);
        }
        if (existentUser == undefined) {
            return new ServerError(EmptyBody);
        }
        existentUser.role = type;
        return await this.userRepository.update(existentUser);
    }
}
