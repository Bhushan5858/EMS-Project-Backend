import express from "express";
import * as controller from "./department.controller.js";
import authMiddleware from "../../common/middlewares/authMiddleware.js";
import { isEmployee } from "../../common/middlewares/roleCheck.js";

const router = express.Router();

router.use(authMiddleware, isEmployee);

router.get("/getDepartmentDetails", controller.getDepartmentDetails);
router.get("/getDepartments", controller.getDepartments);

export default router;
