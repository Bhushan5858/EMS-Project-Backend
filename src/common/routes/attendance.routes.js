import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { isAdmin, isManager } from "../middlewares/roleCheck.js";
import * as attendanceController from "../controllers/attendance.controller.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Punch In/Out
router.post("/punch", attendanceController.punch);

// Get my history (calendar)
router.get("/me", attendanceController.getMyAttendance);

// Manager/Admin: Get department attendance
// We can use a custom middleware or check inside controller
router.get("/department", attendanceController.getDepartmentAttendance);

// Admin only: Get all attendance
router.get("/all", isAdmin, attendanceController.getAllAttendance);

export default router;
