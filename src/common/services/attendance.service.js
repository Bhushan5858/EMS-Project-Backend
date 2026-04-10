import Attendance from "../models/Attendance.Model.js";
import User from "../models/user.Model.js";

export const togglePunch = async (userId) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // 1. Check for any "stale" punch-ins across all days (Auto-punchout check)
  // Find the most recent record with an open punch-in
  let openRecord = await Attendance.findOne({ user: userId, isPunchedIn: true }).sort({ date: -1 });

  if (openRecord) {
    const lastLog = openRecord.logs[openRecord.logs.length - 1];
    const now = new Date();
    const durationMs = now - lastLog.punchIn;
    const durationMinutes = Math.floor(durationMs / (1000 * 60));

    // If session exceeds 12 hours, auto-close it at 12 hours
    if (durationMinutes >= 720) {
      lastLog.punchOut = new Date(lastLog.punchIn.getTime() + 720 * 60000);
      lastLog.durationMinutes = 720;
      openRecord.isPunchedIn = false;
      openRecord.isAutoPunchedOut = true;
      await openRecord.save();
      
      // After auto-closing a stale session, if it's not today's session, we continue to create today's record
      // But if it was TODAY'S session that hit 12h, we might want to prevent immediate re-punching 
      // depending on requirements. Here we follow "allow punch in direct next day".
      if (openRecord.date.getTime() === today.getTime()) {
         return { message: "Auto-punched out after 12 hours", record: openRecord };
      }
    } else {
      // Regular Punch Out
      lastLog.punchOut = now;
      lastLog.durationMinutes = durationMinutes;
      openRecord.isPunchedIn = false;
      await openRecord.save();
      return { message: "Punched out successfully", record: openRecord };
    }
  }

  // 2. Punch In Logic
  // Fetch or create today's record
  let attendance = await Attendance.findOne({ user: userId, date: today });

  if (!attendance) {
    attendance = new Attendance({
      user: userId,
      departmentId: user.departmentId,
      date: today,
      logs: [],
    });
  }

  // Check if total day time already exceeded 12h
  if (attendance.totalMinutes >= 720) {
    throw new Error("Maximum 12 hours daily limit reached.");
  }

  attendance.logs.push({ punchIn: new Date() });
  attendance.isPunchedIn = true;
  await attendance.save();

  return { message: "Punched in successfully", record: attendance };
};

export const getMyAttendance = async (userId, month, year) => {
  const startDate = new Date(Date.UTC(year, month, 1));
  const endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

  return await Attendance.find({
    user: userId,
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: 1 });
};

export const getDepartmentAttendance = async (departmentId, date) => {
  const queryDate = new Date(date);
  queryDate.setUTCHours(0, 0, 0, 0);

  return await Attendance.find({
    departmentId,
    date: queryDate,
  }).populate("user", "name email position");
};

export const getAllAttendance = async (date) => {
  const queryDate = new Date(date);
  queryDate.setUTCHours(0, 0, 0, 0);

  return await Attendance.find({
    date: queryDate,
  }).populate("user", "name email position role departmentId");
};
