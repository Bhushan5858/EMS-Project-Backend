import userModel from "../../common/models/user.Model.js";
import departmentModel from "../../common/models/department.Model.js";

export const getStats = async (managerId) => {
    const manager = await userModel.findById(managerId);
    if (!manager || !manager.departmentId) {
        return {
            status: false,
            statusCode: 404,
            message: "Manager or managed department not found"
        }
    }

    const department = await departmentModel.findById(manager.departmentId);
    const employeesCount = await userModel.countDocuments({ departmentId: manager.departmentId, isEmployee: true });

    const stats = {
        departmentName: department?.name || "Unknown",
        employeesCount,
        isActive: department?.isActive || false,
    };

    return {
        status: true,
        statusCode: 200,
        message: "Manager stats fetched successfully",
        data: stats
    };
};
