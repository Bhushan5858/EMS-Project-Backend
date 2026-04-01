import * as service from "./auth.service.js";
const sendResponse = (res, result) => {
    return res.status(result.statusCode).json({
        status: result.status,
        message: result.message,
        data: result.data ?? null
    });
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await service.login(email, password);
        return sendResponse(res, result);

    } catch (error) {
        console.log("error in admin login : ",error.message)
        return res.status(500).json({
            status: false,
            message: "Something went wrong"
        });
    }
};


export const getProfile = async (req, res) => {
    const  id  = req.user.id;
    try {
        const result = await service.getProfile(id);
        return sendResponse(res, result);
    } catch (error) {
        console.log("error in admin login : ",error.message)
        return res.status(500).json({
            status: false,
            message: "Something went wrong"
        });
    }
};
