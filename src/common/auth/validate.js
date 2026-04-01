import Joi from "joi";

export const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .lowercase()
        .required()
        .messages({
            "any.required": "Email is required",
            "string.email": "Invalid email format",
            "string.empty": "Email is required"
        }),

    password: Joi.string()
        .required()
        .messages({
            "any.required": "Password is required",
            "string.empty": "Password is required"
        })
});