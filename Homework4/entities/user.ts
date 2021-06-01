export interface User {
    email: string;
    passwordHash: string;
    username: string;
    role: string;
}

export interface UserProfile {
    email: string;
    username: string;
    role: string;
}

export interface DatabaseUser {
    email: string;
    passwordHash: string;
    username: string;
    role: string;
    id: string;
}

export enum UserTypes {
    BASIC = "basic",
    PREMIUM = "premium",
    MODERATOR = "moderator",
    ADMIN = "boss_de_boss",
    PAYMENTS_SERVICE = "payments_service"
}
