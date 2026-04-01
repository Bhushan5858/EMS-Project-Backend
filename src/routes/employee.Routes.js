import express from "express";
import departmentRoutes from "../employee/department/department.routes.js";

const router = express.Router();

router.use("/department", departmentRoutes);

export default router;