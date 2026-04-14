import userModel from "../../common/models/user.Model.js";
import departmentModel from "../../common/models/department.Model.js";
import bcrypt from "bcryptjs";
import { getCache, setCache, delCache } from "../../common/utils/cacheUtils.js";

// Helper to invalidate all user-related caches
const invalidateUserCache = async (userId = null, role = null) => {
    const keys = ["users_all", "users_role:manager", "users_role:employee"];
    if (userId) keys.push(`user_id:${userId}`);
    if (role) keys.push(`users_role:${role}`);
    
    await Promise.all(keys.map(key => delCache(key)));
};

export const addUser = async (user) => {
    const { name, email, password, role } = user;
    const newname = name.toLowerCase();
    const userExists = await userModel.findOne({ email });
    if (userExists) {
        return {
            status: false,
            statusCode: 400,
            message: "Email already exists"
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.create({
        name: newname,
        email,
        password: hashedPassword,
        role
    });

    // Invalidate caches
    await invalidateUserCache(null, role);

    return {
        status: true,
        statusCode: 200,
        message: "User added successfully",
    };
};

export const getUsers = async (query) => {
    const { userId, role } = query;

    // 1. Individual User Fetch
    if (userId) {
        const CACHE_KEY = `user_id:${userId}`;
        const cachedUser = await getCache(CACHE_KEY);
        if (cachedUser) {
            return {
                status: true,
                statusCode: 200,
                message: "User fetched successfully (from cache)",
                data: { user: cachedUser }
            };
        }

        const user = await userModel.findById(userId).select("-password");
        if (user) await setCache(CACHE_KEY, user, 3600);
        
        return {
            status: true,
            statusCode: 200,
            message: "User fetched successfully",
            data: { user }
        };
    }

    // 2. Fetch by Role
    if (role) {
        const CACHE_KEY = `users_role:${role}`;
        const cachedUsers = await getCache(CACHE_KEY);
        if (cachedUsers) {
            return {
                status: true,
                statusCode: 200,
                message: `Users with role ${role} fetched successfully (from cache)`,
                data: cachedUsers
            };
        }

        const users = await userModel.find({ role }).select("-password");
        await setCache(CACHE_KEY, users, 3600);

        return {
            status: true,
            statusCode: 200,
            message: "Users fetched successfully",
            data: users
        };
    }

    // 3. Fetch All Non-Admins
    const CACHE_KEY_ALL = "users_all";
    const cachedAll = await getCache(CACHE_KEY_ALL);
    if (cachedAll) {
        return {
            status: true,
            statusCode: 200,
            message: "Users fetched successfully (from cache)",
            data: cachedAll
        };
    }

    const users = await userModel.find({}).select("-password");
    const filterdUser = users.filter((user) => user.role !== "admin");
    
    await setCache(CACHE_KEY_ALL, filterdUser, 3600);

    return {
        status: true,
        statusCode: 200,
        message: "Users fetched successfully",
        data: filterdUser
    };
};

export const updateUser = async (id, user) => {
    const { name, email, role, password, isActive, salary } = user;
    const userExists = await userModel.findById(id);
    if (!userExists) {
        return {
            status: false,
            statusCode: 404,
            message: "User not found"
        };
    }
    
    const emailExists = await userModel.findOne({ email, _id: { $ne: id } });
    if (emailExists) {
        return {
            status: false,
            statusCode: 400,
            message: "Email already exists"
        };
    }
    
    const updateData = {
        name,
        email,
        role,
        isActive,
        salary: (salary !== undefined && salary !== "") ? Number(salary) : userExists.salary
    };

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
    }
    
    await userModel.updateOne({ _id: id }, { $set: updateData });

    // Invalidate caches
    await invalidateUserCache(id, role);
    if (userExists.role !== role) await invalidateUserCache(null, userExists.role);

    return {
        status: true,
        statusCode: 200,
        message: "User updated successfully",
    };
};

export const deleteUser = async (id) => {
    const userExists = await userModel.findById(id);
    if (!userExists) {
        return {
            status: false,
            statusCode: 404,
            message: "User not found"
        };
    }
    const role = userExists.role;
    await userModel.deleteOne({ _id: id });

    // Invalidate caches
    await invalidateUserCache(id, role);

    return {
        status: true,
        statusCode: 200,
        message: "User deleted successfully",
    };
};

export const assignDepartment = async (departmentId, userData) => {
    const { userId, position, salary, joiningDate } = userData;

    const user = await userModel.findById(userId);
    if (!user) {
        return {
            status: false,
            statusCode: 404,
            message: "User not found"
        };
    }

    if (!user.isActive) {
        return {
            status: false,
            statusCode: 400,
            message: "User is inactive"
        };
    }

    if (user.isEmployee) {
        return {
            status: false,
            statusCode: 400,
            message: "User is already an employee"
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

    const updatedUser = await userModel.updateOne({ _id: userId }, { $set: { isEmployee: true, departmentId, salary, joiningDate, position } });
    
    // Invalidate caches
    await invalidateUserCache(userId, user.role);

    // Invalidate department caches
    await delCache("departments_all");
    await delCache(`department_id:${departmentId}`);

    return {
        status: true,
        statusCode: 200,
        message: "User assigned to department successfully",
        updatedUser
    };
};

export const removeDepartmentUser = async (departmentId, userId) => {
    const user = await userModel.findById(userId);
    if (!user) {
        return {
            status: false,
            statusCode: 404,
            message: "User not found"
        };
    }

    if (!user.isActive) {
        return {
            status: false,
            statusCode: 400,
            message: "User is inactive"
        };
    }

    if (!user.isEmployee) {
        return {
            status: false,
            statusCode: 400,
            message: "User is not an employee"
        };
    }

    if (user.departmentId.toString() !== departmentId) {
        return {
            status: false,
            statusCode: 400,
            message: "User does not belong to the department"
        };
    }

    const updatedUser = await userModel.updateOne({ _id: userId }, { $set: { isEmployee: false, departmentId: null, salary: 0, joiningDate: null, position: null } });
    
    // Invalidate caches
    await invalidateUserCache(userId, user.role);

    // Invalidate department caches
    await delCache("departments_all");
    await delCache(`department_id:${departmentId}`);

    return {
        status: true,
        statusCode: 200,
        message: "User removed from department successfully",
        updatedUser
    };
};
