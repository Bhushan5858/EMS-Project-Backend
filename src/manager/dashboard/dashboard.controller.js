import * as service from "./dashboard.service.js";

const sendResponse = (res, result) => {
    return res.status(result.statusCode).json({
        status: result.status,
        message: result.message,
        data: result.data ?? null
    });
};

export const getStats = async (req, res) => {
    const managerId = req.user.id;
    try {
        const result = await service.getStats(managerId);
        return sendResponse(res, result);
    } catch (error) {
        console.log("error in get manager stats : ", error.message);
        return res.status(500).json({
            status: false,
            message: "Something went wrong"
        });
    }
};
