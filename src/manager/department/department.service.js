import userModel from "../../common/models/user.Model.js";
import departmentModel from "../../common/models/department.Model.js";

export const getDepartments = async (managerId) => {
    const user = await userModel.findById(managerId);
    if (!user || !user.departmentId) {
        return {
            status: false,
            statusCode: 404,
            message: "You are not manager of any department"
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
            departments: [department] // Return as array for compatibility if needed, but manager only has one
        }
    };
}


export const getDepartmentDetails = async (managerId) => {
    const user = await userModel.findById(managerId);
    if (!user || !user.departmentId) {
        return {
            status: false,
            statusCode: 404,
            message: "You are not manager of any department"
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

    // get employees of this department
    const employees = await userModel.find({ departmentId: department._id, isEmployee: true });

   return {
        status: true,
        statusCode: 200,
        message: "Department details fetched successfully",
       data: { department, manager: user, employees }
    };
}

export const updateDepartment = async (departmentId, name, managerId) => {
    const user = await userModel.findById(managerId);
    
    // Check if this manager actually manages this department
    if (user.departmentId.toString() !== departmentId) {
        return {
            status: false,
            statusCode: 403,
            message: "Access denied. You can only update your own department."
        }
    }

    //check if the department name already exists taken by another department
    const departmentExists = await departmentModel.findOne({ name: name, _id: { $ne: departmentId } });
    if (departmentExists) {
        return {
            status: false,
            statusCode: 400,
            message: "Department name already exists"
        }
    }

    // update department - ONLY allow name update as per requirement
    const updatedDepartment = await departmentModel.findByIdAndUpdate(departmentId, { $set: { name } }, { new: true });
    
    return {
        status: true,
        statusCode: 200,
        message: "Department name updated successfully",
        data: updatedDepartment
    };
}

export const addEmployeeToDepartment = async (managerId, employeeId) => {
    const manager = await userModel.findById(managerId);
    if (!manager || !manager.departmentId) {
        return {
            status: false,
            statusCode: 404,
            message: "Manager or managed department not found"
        }
    }

    const employee = await userModel.findById(employeeId);
    if (!employee) {
        return {
            status: false,
            statusCode: 404,
            message: "Employee not found"
        }
    }

    // Assign employee to department
    employee.departmentId = manager.departmentId;
    employee.isEmployee = true;
    await employee.save();

    return {
        status: true,
        statusCode: 200,
        message: "Employee added to department successfully",
        data: employee
    };
}


export const removeEmployeeFromDepartment = async (managerId, employeeId) => {
    const manager = await userModel.findById(managerId);
    if (!manager || !manager.departmentId) {
        return {
            status: false,
            statusCode: 404,
            message: "Manager or managed department not found"
        }
    }

    const employee = await userModel.findById(employeeId);
    if (!employee || !employee.departmentId) {
        return {
            status: false,
            statusCode: 404,
            message: "Employee not found or not assigned to any department"
        }
    }

    // Verify employee belongs to the manager's department
    if (employee.departmentId.toString() !== manager.departmentId.toString()) {
        return {
            status: false,
            statusCode: 403,
            message: "You can only remove employees from your own department"
        }
    }

    // Unassign employee
    employee.departmentId = null;
    employee.isEmployee = false;
    employee.salary = 0;
    employee.joiningDate = null;
    employee.position = null;
    await employee.save();

    return {
        status: true,
        statusCode: 200,
        message: "Employee removed from department successfully",
        data: employee
    };
}

