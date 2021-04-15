import { Schema } from "express-validator";

export const loginSchema:Schema = {
    password: {
        notEmpty: true
    },
    email: {
        notEmpty: true,
        normalizeEmail: true,
        isEmail: true,
    }
}