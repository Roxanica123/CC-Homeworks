export interface User{
    email:string;
    passwordHash:string;
    username:string;
    role:string;
}

export enum UserTypes {
    BASIC = "basic",
    PREMIUM = "premium",
    MODERATOR = "moderator",
    ADMIN = "boss_de_boss",
  }