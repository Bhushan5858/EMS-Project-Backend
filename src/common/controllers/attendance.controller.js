import * as attendanceService from "../services/attendance.service.js";

export const punch = async (req, res) => {
  try {
    const result = await attendanceService.togglePunch(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyAttendance = async (req, res) => {
  try {
    const { month, year } = req.query;
    const records = await attendanceService.getMyAttendance(
      req.user.id,
      parseInt(month),
      parseInt(year)
    );
    res.status(200).json(records);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDepartmentAttendance = async (req, res) => {
  try {
    const { departmentId, date } = req.query;
    // Basic verification: if user is manager, ensure they only see their department
    if (req.user.role === "manager" && req.user.departmentId !== departmentId) {
       return res.status(403).json({ message: "Access denied to this department's data" });
    }
    const records = await attendanceService.getDepartmentAttendance(departmentId, date);
    res.status(200).json(records);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    const records = await attendanceService.getAllAttendance(date);
    res.status(200).json(records);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
