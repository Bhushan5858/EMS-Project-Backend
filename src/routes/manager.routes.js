import express from "express";
import departmentRoutes from "../manager/department/department.routes.js";
import userRoutes from "../manager/user/user.routes.js";
import dashboardRoutes from "../manager/dashboard/dashboard.routes.js";

const router = express.Router();

router.use("/department", departmentRoutes);
router.use("/user", userRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;