import * as service from "./user.service.js";

const sendResponse = (res, result) => {
    return res.status(result.statusCode).json({
        status: result.status,
        message: result.message,
        data: result.data ?? null
    });
};

export const getUnassignedUsers = async (req, res) => {
    try {
        const result = await service.getUnassignedUsers();
        return sendResponse(res, result);
    } catch (error) {
        console.log("error in get unassigned users : ", error.message);
        return res.status(500).json({
            status: false,
            message: "Something went wrong"
        });
    }
};
