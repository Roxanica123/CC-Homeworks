export enum UserTypes {
    BASIC = "basic",
    PREMIUM = "premium",
    MODERATOR = "moderator",
    ADMIN = "boss_de_boss",
}

export const ALL:UserTypes[] = [UserTypes.ADMIN, UserTypes.BASIC, UserTypes.MODERATOR, UserTypes.PREMIUM]
export const MODERATOR: UserTypes[] = [UserTypes.ADMIN, UserTypes.MODERATOR]
export const PREMIUM: UserTypes[] = [UserTypes.ADMIN, UserTypes.MODERATOR, UserTypes.PREMIUM]