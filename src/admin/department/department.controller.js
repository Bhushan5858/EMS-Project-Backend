import * as service from "./department.service.js";
const sendResponse = (res, result) => {
    return res.status(result.statusCode).json({
        status: result.status,
        message: result.message,
        data: result.data ?? null
    });
};

export const addDepartment = async (req, res) => {
    const { name} = req.body;
    try {
        const result = await service.addDepartment(name);
        return sendResponse(res, result);
    } catch (error) {
        console.log("error in add department : ", error.message);
        return res.status(500).json({
            status: false,
            message: "Something went wrong"
        });
    }
};

export const getDepartments = async (req, res) => {

    try {
        const result = await service.getDepartments();
        return sendResponse(res, result);
    } catch (error) {
        console.log("error in get departments : ", error.message);
        return res.status(500).json({
            status: false,
            message: "Something went wrong"
        });
    }
};

export const getDepartmentDetails = async (req, res) => {
    const id = req.params.departmentId;
    try {
        const result = await service.getDepartmentDetails(id);
        return sendResponse(res, result);
    } catch (error) {
        console.log("error in get department details : ", error.message);
        return res.status(500).json({
            status: false,
            message: "Something went wrong"
        });
    }
};

export const updateDepartment = async (req, res) => {
    const { name, managerId } = req.body;
    const id = req.params.departmentId;
    try {
        const result = await service.updateDepartment(id, name, managerId);
        return sendResponse(res, result);
    } catch (error) {
        console.log("error in update department : ", error.message);
        return res.status(500).json({
            status: false,
            message: "Something went wrong"
        });
    }
};

export const deleteDepartment = async (req, res) => {
    const id = req.params.departmentId;
    try {
        const result = await service.deleteDepartment(id);
        return sendResponse(res, result);
    } catch (error) {
        console.log("error in delete department : ", error.message);
        return res.status(500).json({
            status: false,
            message: "Something went wrong"
        });
    }
};