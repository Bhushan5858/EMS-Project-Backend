import express from "express";
import userRoutes from '../admin/user/user.routes.js';
import departmentRoutes from '../admin/department/department.routes.js';
import authMiddleware from "../common/middlewares/authMiddleware.js";
import { isAdmin } from "../common/middlewares/roleCheck.js";
import dashboardRoutes from '../admin/dashboard/dashboard.routes.js';

const router = express.Router();

router.use(authMiddleware, isAdmin);

router.use('/user', userRoutes);
router.use('/department', departmentRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;