import * as service from "./user.service.js";
const sendResponse = (res, result) => {
    return res.status(result.statusCode).json({
        status: result.status,
        message: result.message,
        data: result.data ?? null
    });
};

export const addUser = async (req, res) => {
    const user = req.body;
    try {
        const result = await service.addUser(user);
        return sendResponse(res, result);
    } catch (error) {
        console.log("error in add user : ", error.message);
        return res.status(500).json({
            status: false,
            message: "Something went wrong"
        });
    }
};

export const getUsers = async (req, res) => {
    const query = req.query;
    try {
        const result = await service.getUsers(query);
        return sendResponse(res, result);
    } catch (error) {
        console.log("error in get users : ", error.message);
        return res.status(500).json({
            status: false,
            message: "Something went wrong"
        });
    }
};

export const updateUser = async (req, res) => {
    const user = req.body;
    const id = req.params.userId;
    try {
        const result = await service.updateUser(id, user);
        return sendResponse(res, result);
    } catch (error) {
        console.log("error in update user : ", error.message);
        return res.status(500).json({
            status: false,
            message: "Something went wrong"
        });
    }
};



export const deleteUser = async (req, res) => {
    const id = req.params.userId;
    try {
        const result = await service.deleteUser(id);
        return sendResponse(res, result);
    } catch (error) {
        console.log("error in delete user : ", error.message);
        return res.status(500).json({
            status: false,
            message: "Something went wrong"
        });
    }
};


export const assignDepartment = async (req, res) => {
    const userData = req.body;
    const departmentId = req.params.departmentId;
    try {
        const result = await service.assignDepartment(departmentId, userData);
        return sendResponse(res, result);
    } catch (error) {
        console.log("error in assign department : ", error.message);
        return res.status(500).json({
            status: false,
            message: "Something went wrong"
        });
    }
};

export const removeDepartmentUser = async (req, res) => {
    const departmentId = req.params.departmentId;
    const userId = req.params.userId;
    try {
        const result = await service.removeDepartmentUser(departmentId, userId);
        return sendResponse(res, result);
    } catch (error) {
        console.log("error in remove department user : ", error.message);
        return res.status(500).json({
            status: false,
            message: "Something went wrong"
        });
    }
};


