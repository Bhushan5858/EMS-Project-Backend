const sessionSchema = new mongoose.Schema(
    {
        punchInTime: {
            type: Date,
            required: true,
        },

        punchOutTime: {
            type: Date,
            default: null,
        },
    },
    { _id: false }
);

const attendanceSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
            index: true,
        },

        date: {
            type: String, // "YYYY-MM-DD"
            required: true,
            index: true,
        },

        sessions: [sessionSchema],

        totalHours: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: ["present", "half-day", "absent"],
            default: "absent",
        },
    },
    { timestamps: true }
);

// prevent duplicate record per day
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);