import userModel from "../../common/models/user.Model.js";

export const getUnassignedUsers = async () => {
    // Get users who are not already employees and belong to 'employee' role
    const users = await userModel.find({ 
        role: "employee", 
        isEmployee: false, 
        departmentId: null 
    });

    return {
        status: true,
        statusCode: 200,
        message: "Unassigned users fetched successfully",
        data: users
    };
}
