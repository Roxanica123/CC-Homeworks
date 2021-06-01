import { UserRepository } from "../repositories";

import { User, UserProfile } from "../entities";

import { HttpActionResult, NotFound, Ok } from "../action_results";

export class UserService {
    private readonly userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    public async getProfileByEmail(email: string): Promise<HttpActionResult> {
        const existentUser: User | null | undefined = await this.userRepository.findByEmail(email);
        if (existentUser === null || existentUser === undefined) {
            return new NotFound();
        }
        let userProfile: UserProfile = {
            username: existentUser.username,
            email: existentUser.email,
            role: existentUser.role
        };
        return new Ok(JSON.stringify(userProfile));
    }
}