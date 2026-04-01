import userModel from "../../common/models/user.Model.js";
import bcrypt from "bcryptjs";
import generateToken from "../../common/utils/generateToken.js";
import { sendAdminLoginEmail } from "../config/mailer.js";
export const login = async (email, password) => {

    const user = await userModel.findOne({ email }).select("+password");
   
    if(!user) {
        return {
            status: false,
            statusCode: 404,
            message: "Invalid credentials"
        }
    }

    //  check if user is blocked
    if (user.blockUntil && user.blockUntil > Date.now()) {
        return {
            status: false,
            statusCode: 403,
            message: "Account temporarily blocked. Try again later after 1 minute."
        };
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        user.loginAttempts += 1;

        // block after 5 attempts
        if (user.loginAttempts >= 5) {
            user.blockUntil = Date.now() + 1 * 60 * 1000; // 1 minute
            user.loginAttempts = 0; // reset after block
        }

        await user.save();

        return {
            status: false,
            statusCode: 401,
            message: "Invalid Password"
        };
    }

    // successful login → reset attempts
    user.loginAttempts = 0;
    user.blockUntil = null;

    await user.save();

    const token = generateToken({ id: user._id, role: user.role });
    const userProfile = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isEmployee: user.isEmployee
    };
    //send name, email and timestamp
//    if (user.role === "admin") {
//      await sendAdminLoginEmail(user.email, user.name, user.email);
//    }
    return {
        status: true,
        statusCode: 200,
        message: "Login successful",
        data: {
            token,
            user: userProfile
        }
    }
    
};


export const getProfile = async (id) => {
    
    const user = await userModel.findById(id).populate("departmentId", "name");
 
    if(!user) {
        return {
            status: false,
            statusCode: 404,
            message: "User not found"
        }
    }
    
    return {
        status: true,
        statusCode: 200,
        message: "User found",
        data: user
    }
}