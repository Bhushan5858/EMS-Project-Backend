import Joi from "joi";

export const addDepartmentSchema = Joi.object({
    name: Joi.string().required()
    .messages({
        "any.required": "Name is required",
        "string.empty": "Name must be a string"
    }),
});

export const updateDepartmentSchema = Joi.object({
    name: Joi.string().required()
    .messages({
        "any.required": "Name is required",
        "string.empty": "Name must be a string"
    }),
})
export const paramsSchema = Joi.object({
    departmentId: Joi.string().required(),
});