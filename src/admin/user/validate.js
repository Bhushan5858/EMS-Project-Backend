import Joi from "joi";
export const addUserSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "Name is required",
        "string.empty": "Name must be a string"
    }),
    email: Joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.email": "Invalid email format",
        "string.empty": "Email is required"
    }),
    password: Joi.string().required().messages({
        "any.required": "Password is required",
        "string.empty": "Password is required"
    }),
    role: Joi.string().required().valid("admin", "manager", "employee").messages({
        "any.required": "Role is required",
        "string.empty": "Role must be a string"
    }),
   
});

export const updateUserSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "Name is required",
        "string.empty": "Name must be a string"
    }),
    email: Joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.email": "Invalid email format",
        "string.empty": "Email is required"
    }),
    role: Joi.string().required().valid("admin", "manager", "employee").messages({
        "any.required": "Role is required",
        "string.empty": "Role must be a string"
    }),
    password: Joi.string().optional().allow(""),
    isActive: Joi.boolean().required().messages({
        "any.required": "isActive is required",
        "string.empty": "isActive must be a boolean"
    }),
    salary: Joi.number().optional().allow("", null)
});

export const assignDepartmentSchema = Joi.object({
    userId: Joi.string().required().messages({
        "any.required": "User ID is required bhej",
        "string.empty": "User ID must be a string"
    }),
    position: Joi.string().required().messages({
        "any.required": "Position is required",
        "string.empty": "Position must be a string"
    }),
    salary: Joi.number().required().messages({
        "any.required": "Salary is required",
        "string.empty": "Salary must be a number"
    }),
    joiningDate: Joi.date().required().messages({
        "any.required": "Joining date is required",
        "string.empty": "Joining date must be a date"
    }),
});

export const paramsSchema = Joi.object({
    userId: Joi.string().required(),
});