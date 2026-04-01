import * as service from "./dashboard.service.js";

const sendResponse = (res, result) => {
    return res.status(result.statusCode).json({
        status: result.status,
        message: result.message,
        data: result.data ?? null
    });
};

export const getStats = async (req, res) => {
    try {
        const result = await service.getStats();
        return sendResponse(res, result);
    } catch (error) {
        console.log("error in get admin stats : ", error.message);
        return res.status(500).json({
            status: false,
            message: "Something went wrong"
        });
    }
};
