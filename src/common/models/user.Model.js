import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
        },

        password: {
            type: String,
            required: true,
            select: false, // never return password
        },

        role: {
            type: String,
            enum: ["admin", "manager", "employee"],
            required: true,
        },

        loginAttempts: {
            type: Number,
            default: 0,
        },

        blockUntil: {
            type: Date,
            default: null,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
        isEmployee: {
            type: Boolean,
            default: false,
        },
        departmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            default: null,
        },
        position: {
            type: String,
            default: null,
        },
        salary: {
            type: Number,
            default: null,
        },
        joiningDate: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);