import { Schema } from "express-validator";

export const registerSchema:Schema = {
    username: {
        notEmpty: true
    },
    password: {
        isStrongPassword: true,
        errorMessage: "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number",
    },
    email: {
        notEmpty: true,
        normalizeEmail: true,
        isEmail: true,
    }
}