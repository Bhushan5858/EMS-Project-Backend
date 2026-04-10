import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    }, // Normalized to YYYY-MM-DD
    logs: [
      {
        punchIn: { type: Date, required: true },
        punchOut: { type: Date },
        durationMinutes: { type: Number, default: 0 },
      },
    ],
    totalMinutes: {
      type: Number,
      default: 0,
    },
    isPunchedIn: {
      type: Boolean,
      default: false,
    },
    isAutoPunchedOut: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "On Leave", "Half Day"],
      default: "Present",
    },
  },
  { timestamps: true }
);

// Pre-save hook to calculate totalMinutes from logs if needed
attendanceSchema.pre("save", async function () {
  this.totalMinutes = this.logs.reduce((acc, log) => acc + (log.durationMinutes || 0), 0);
});

export default mongoose.model("Attendance", attendanceSchema);
