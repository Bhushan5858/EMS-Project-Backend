import * as service from "./department.service.js";
const sendResponse = (res, result) => {
    return res.status(result.statusCode).json({
        status: result.status,
        message: result.message,
        data: result.data ?? null
    });
};

export const getDepartments = async (req, res) => {
    const employeeId = req.user.id;
    try {
        const result = await service.getDepartments(employeeId);
        return sendResponse(res, result);
    } catch (error) {
        console.log("error in get employee departments : ", error.message);
        return res.status(500).json({
            status: false,
            message: "Something went wrong"
        });
    }
};

export const getDepartmentDetails = async (req, res) => {
    const employeeId = req.user.id;
    try {
        const result = await service.getDepartmentDetails(employeeId);
        return sendResponse(res, result);
    } catch (error) {
        console.log("error in get employee department details : ", error.message);
        return res.status(500).json({
            status: false,
            message: "Something went wrong"
        });
    }
};
