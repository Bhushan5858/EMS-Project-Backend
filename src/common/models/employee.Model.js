import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        departmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },

        position: {
            type: String,
            required: true,
        },

        salary: {
            type: Number,
            required: true,
            min: 0,
        },

        joiningDate: {
            type: Date,
            required: true,
        },

        employmentStatus: {
            type: String,
            enum: ["active", "inactive", "terminated"],
            default: "active",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);