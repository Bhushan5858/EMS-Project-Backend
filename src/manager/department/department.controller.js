import * as service from "./department.service.js";
const sendResponse = (res, result) => {
    return res.status(result.statusCode).json({
        status: result.status,
        message: result.message,
        data: result.data ?? null
    });
};


export const getDepartments = async (req, res) => {

    const managerId = req.user.id;
    
    try {
        const result = await service.getDepartments(managerId);
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
    const managerId = req.user.id;
    try {
        const result = await service.getDepartmentDetails(managerId);
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
    const { name } = req.body;
    const departmentId = req.params.departmentId;
    const managerId = req.user.id;
    try {
        const result = await service.updateDepartment(departmentId, name, managerId);
        return sendResponse(res, result);
    } catch (error) {
        console.log("error in update department : ", error.message);
        return res.status(500).json({
            status: false,
            message: "Something went wrong"
        });
    }
};

export const addEmployeeToDepartment = async (req, res) => {
    const { employeeId } = req.body;
    const managerId = req.user.id;
    try {
        const result = await service.addEmployeeToDepartment(managerId, employeeId);
        return sendResponse(res, result);
    } catch (error) {
        console.log("error in add employee to department : ", error.message);
        return res.status(500).json({
            status: false,
            message: "Something went wrong"
        });
    }
};

export const removeEmployee = async (req, res) => {
    const { employeeId } = req.params;
    const managerId = req.user.id;
    try {
        const result = await service.removeEmployeeFromDepartment(managerId, employeeId);
        return sendResponse(res, result);
    } catch (error) {
        console.log("error in remove employee : ", error.message);
        return res.status(500).json({
            status: false,
            message: "Something went wrong"
        });
    }
};
