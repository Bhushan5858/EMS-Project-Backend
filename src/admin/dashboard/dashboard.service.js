import userModel from "../../common/models/user.Model.js";
import departmentModel from "../../common/models/department.Model.js";
import { getCache, setCache } from "../../common/utils/cacheUtils.js";

export const getStats = async () => {
    // 0. Check Cache
    const CACHE_KEY = "admin_dashboard_stats";
    const cachedData = await getCache(CACHE_KEY);
    
    if (cachedData) {
        return {
            status: true,
            statusCode: 200,
            message: "Stats fetched successfully (from cache)",
            data: cachedData
        };
    }

    // 1. User Stats
    const totalUsers = await userModel.countDocuments();
    const activeUsers = await userModel.countDocuments({ isActive: true });
    const inactiveUsers = totalUsers - activeUsers;

    // 2. Count distinct departments
    const totalDepartments = await departmentModel.countDocuments();

    // 3. Count employees (those assigned to a dept or marked isEmployee)
    const totalEmployees = await userModel.countDocuments({ isEmployee: true });

    // 4. Calculate total and average salary
    const salaryStats = await userModel.aggregate([
        { $match: { isEmployee: true } },
        { 
            $group: { 
                _id: null, 
                totalPayroll: { $sum: "$salary" },
                avgSalary: { $avg: "$salary" }
            } 
        }
    ]);

    const stats = {
        totalUsers,
        activeUsers,
        inactiveUsers,
        totalDepartments,
        totalEmployees,
        totalPayroll: salaryStats[0]?.totalPayroll || 0,
        avgSalary: salaryStats[0]?.avgSalary || 0
    };

    // 5. Store in Cache for 5 minutes (300 seconds)
    await setCache(CACHE_KEY, stats, 300);

    return {
        status: true,
        statusCode: 200,
        message: "Stats fetched successfully",
        data: stats
    };
};

