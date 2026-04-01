import userModel from "../../common/models/user.Model.js";
import departmentModel from "../../common/models/department.Model.js";

export const getDepartments = async (employeeId) => {
    const user = await userModel.findById(employeeId);
    if (!user || !user.departmentId) {
        return {
            status: false,
            statusCode: 404,
            message: "You are not assigned to any department"
        }
    }

    const department = await departmentModel.findById(user.departmentId);
    if (!department) {
        return {
            status: false,
            statusCode: 404,
            message: "Department not found"
        }
    }

    return {
        status: true,
        statusCode: 200,
        message: "Department fetched successfully",
        data: {
            departments: [department]
        }
    };
}

export const getDepartmentDetails = async (employeeId) => {
    const user = await userModel.findById(employeeId);
    if (!user || !user.departmentId) {
        return {
            status: false,
            statusCode: 404,
            message: "You are not assigned to any department"
        }
    }

    const department = await departmentModel.findById(user.departmentId);
    if (!department) {
        return {
            status: false,
            statusCode: 404,
            message: "Department not found"
        }
    }

    // get manager of this department
    const manager = await userModel.findOne({ departmentId: department._id, role: "manager" });

    // get colleagues (other employees in the same department)
    const employees = await userModel.find({ departmentId: department._id, isEmployee: true });

   return {
        status: true,
        statusCode: 200,
        message: "Department details fetched successfully",
       data: { department, manager, employees }
    };
}
