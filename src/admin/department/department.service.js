import userModel from "../../common/models/user.Model.js";
import departmentModel from "../../common/models/department.Model.js";
import { getCache, setCache, delCache } from "../../common/utils/cacheUtils.js";

// Helper to invalidate department caches
const invalidateDepartmentCache = async (departmentId = null) => {
    const keys = ["departments_all"];
    if (departmentId) keys.push(`department_id:${departmentId}`);
    
    await Promise.all(keys.map(key => delCache(key)));
};


export const addDepartment = async (name) => {
    const newName = name.toLowerCase();

    //check if the department name already exists
    const departmentExists = await departmentModel.findOne({ name: newName });
    if (departmentExists) {
        return {
            status: false,
            statusCode: 400,
            message: "Department name already exists"
        }
    }

    // create department
    const department = await departmentModel.create({ name: newName});

    // Invalidate cache
    await invalidateDepartmentCache();

    return {
        status: true,
        statusCode: 200,
        message: "Department created successfully",
        department
    };
}


export const getDepartments = async () => {
    const CACHE_KEY = "departments_all";
    
    // Check cache
    const cachedDepartments = await getCache(CACHE_KEY);
    if (cachedDepartments) {
        return {
            status: true,
            statusCode: 200,
            message: "Departments fetched successfully (from cache)",
            data: cachedDepartments
        };
    }

    // Aggregation to count employees and find manager for each department
    const departments = await departmentModel.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "departmentId",
                as: "employees"
            }
        },
        {
            $addFields: {
                employeeCount: { 
                    $size: {
                        $filter: {
                            input: "$employees",
                            as: "emp",
                            cond: { $eq: ["$$emp.isEmployee", true] }
                        }
                    } 
                },
                manager: {
                    $arrayElemAt: [
                        {
                            $filter: {
                                input: "$employees",
                                as: "emp",
                                cond: { $eq: ["$$emp.role", "manager"] }
                            }
                        },
                        0
                    ]
                }
            }
        },
        {
            $project: {
                name: 1,
                createdAt: 1,
                updatedAt: 1,
                employeeCount: 1,
                managerName: "$manager.name"
            }
        }
    ]);

    // Set cache
    await setCache(CACHE_KEY, departments, 3600);

    return {
        status: true,
        statusCode: 200,
        message: "Departments fetched successfully",
        data: departments
    };
}


export const getDepartmentDetails = async (departmentId) => {
    const CACHE_KEY = `department_id:${departmentId}`;

    // Check cache
    const cachedDetails = await getCache(CACHE_KEY);
    if (cachedDetails) {
        return {
            status: true,
            statusCode: 200,
            message: "Department details fetched successfully (from cache)",
            data: cachedDetails
        };
    }

    const department = await departmentModel.findById(departmentId);

    if (!department) {
        return {
            status: false,
            statusCode: 404,
            message: "Department not found"
        };
    }

    // manager of this department with user data
    const manager = await userModel.findOne({ departmentId: department._id,role: "manager", isEmployee: true });

    // employees with user data
    const employees = await userModel.find({ departmentId: department._id, isEmployee: true ,role: "employee"});

    const responseData = {
        department,
        manager,
        employees
    };

    // Set cache
    await setCache(CACHE_KEY, responseData, 3600);
    
    return {
        status: true,
        statusCode: 200,
        message: "Department details fetched successfully",
        data: responseData
    };
};

export const updateDepartment = async (departmentId, name) => {
    
    //check if the department exists
    const department = await departmentModel.findById(departmentId);
    if (!department) {
        return {
            status: false,
            statusCode: 404,
            message: "Department not found"
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
   

   

    // update department without manager
    const updatedDepartment = await departmentModel.updateOne({ _id: departmentId }, { $set: { name } });

    // Invalidate cache
    await invalidateDepartmentCache(departmentId);

    return {
        status: true,
        statusCode: 200,
        message: "Department updated successfully",
        updatedDepartment
    };
}


export const deleteDepartment = async (departmentId) => {
    //check if the department exists
    const department = await departmentModel.findById(departmentId);
    if (!department) {
        return {
            status: false,
            statusCode: 404,
            message: "Department not found"
        }
    }

   //update all users isEmployee to false and departmentId to null and salary to 0 and joiningDate to null and postion to null
    
     await userModel.updateMany({ departmentId: departmentId }, { $set: { isEmployee: false, departmentId: null, salary: 0, joiningDate: null, position: null } });

    // delete department
    const deletedDepartment = await departmentModel.deleteOne({ _id: departmentId });
    // Invalidate cache
    await invalidateDepartmentCache(departmentId);

    return {
        status: true,
        statusCode: 200,
        message: "Department deleted successfully",
        deletedDepartment
    };
}