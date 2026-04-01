import userModel from "../../common/models/user.Model.js";
import departmentModel from "../../common/models/department.Model.js";
import bcrypt from "bcryptjs";

export const addUser = async (user) => {
    const { name, email, password, role } = user;
    //convert name into lowercase
   const newname = name.toLowerCase();
    const userExists = await userModel.findOne({ email });
    if (userExists) {
        return {
            status: false,
            statusCode: 400,
            message: "Email already exists"
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
     await userModel.create({
        name: newname,
        email,
        password: hashedPassword,
        role
    });
    return {
        status: true,
        statusCode: 200,
        message: "User added successfully",
    };
};

export const getUsers = async (query) => {
    const { userId,role} = query;
    if(userId) {
        const user = await userModel.findById(userId).select("-password");
        return {
            status: true,
            statusCode: 200,
            message: "User fetched successfully",
            data: {
                user
            }
        }
    }
    if(role) {
        const users = await userModel.find({ role }).select("-password");
        return {
            status: true,
            statusCode: 200,
            message: "Users fetched successfully",
            data: users
        }
    }


    const users = await userModel.find({}).select("-password");
    const filterdUser = users.filter((user) => user.role !== "admin");
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
        }
    }
    
    //check if the email is already exists except the current user
    const emailExists = await userModel.findOne({ email, _id: { $ne: id } });
    if (emailExists) {
        return {
            status: false,
            statusCode: 400,
            message: "Email already exists"
        }
    }
    
    const updateData = {
        name,
        email,
        role,
        isActive,
        salary: (salary !== undefined && salary !== "") ? Number(salary) : userExists.salary
    };

    //only update password when password is provided in the request
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
    }
    
    // at time of update id must be same only other firlds can be updated
   await userModel.updateOne({ _id: id }, { $set: updateData });
    return {
        status: true,
        statusCode: 200,
        message: "User updated successfully",
    };
}



export const deleteUser = async (id) => {
    const userExists = await userModel.findById(id);
    if (!userExists) {
        return {
            status: false,
            statusCode: 404,
            message: "User not found"
        }
    }
    await userModel.deleteOne({ _id: id });
    return {
        status: true,
        statusCode: 200,
        message: "User deleted successfully",
    };
}



export const assignDepartment = async ( departmentId,userData) => {
    const {userId,position,salary,joiningDate} = userData;

    //find if the user exists
    const user = await userModel.findById(userId);
    if (!user) {
        return {
            status: false,
            statusCode: 404,
            message: "User not found"
        }
    }

    // check if the user is active
    if (!user.isActive) {
        return {
            status: false,
            statusCode: 400,
            message: "User is inactive"
        }
    }

    // check if the user is already an employee
    if(user.isEmployee) {
        return {
            status: false,
            statusCode: 400,
            message: "User is already an employee"
        }
    }

    // check if the department exists
    const department = await departmentModel.findById(departmentId);
    if (!department) {
        return {
            status: false,
            statusCode: 404,
            message: "Department not found"
        }
    }

    // update user isEmployee to true and departmentId to departmentId and salary to salary and joiningDate to joiningDate and position to position
    const updatedUser = await userModel.updateOne({ _id: userId }, { $set: { isEmployee: true, departmentId, salary, joiningDate, position } });
    return {
        status: true,
        statusCode: 200,
        message: "User assigned to department successfully",
        updatedUser
    };

}


export const removeDepartmentUser = async (departmentId,userId) => {

    //find if the user exists
    const user = await userModel.findById(userId);
    if (!user) {
        return {
            status: false,
            statusCode: 404,
            message: "User not found"
        }
    }

    // check if the user is active
    if (!user.isActive) {
        return {
            status: false,
            statusCode: 400,
            message: "User is inactive"
        }
    }

    // check if the user is already an employee
    if(!user.isEmployee) {
        return {
            status: false,
            statusCode: 400,
            message: "User is not an employee"
        }
    }

    
    // check if the employee belongs to the department
    // user.departmentId.toString() because departmentId is of type ObjectId not a string
    if (user.departmentId.toString() !== departmentId) {
        return {
            status: false,
            statusCode: 400,
            message: "User does not belong to the department"
        }
    }

    // update user isEmployee to false and departmentId to null
    const updatedUser = await userModel.updateOne({ _id: userId }, { $set: { isEmployee: false, departmentId: null,salary: 0, joiningDate: null, position: null } });
    return {
        status: true,
        statusCode: 200,
        message: "User removed from department successfully",
        updatedUser
    };
}