import Joi from "joi";



export const updateDepartmentSchema = Joi.object({
    name: Joi.string().required()
    .messages({
        "any.required": "Name is required",
        "string.empty": "Name must be a string"
    }),
    managerId: Joi.string().required()
    .messages({
        "any.required": "Manager ID is required",
        "string.empty": "Manager ID must be a string"
    }),
})
export const paramsSchema = Joi.object({
   manegerId: Joi.string().required(),
});