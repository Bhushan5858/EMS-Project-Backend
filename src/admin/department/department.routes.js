import express from "express";
import * as controller from "./department.controller.js";
import validate from '../../common/middlewares/joivalidation.js'
import { addDepartmentSchema, updateDepartmentSchema, paramsSchema } from "./validate.js";
import authMiddleware from "../../common/middlewares/authMiddleware.js";
import {isAdmin} from "../../common/middlewares/roleCheck.js";


const router = express.Router();

router.use(authMiddleware, isAdmin);

router.post("/addDepartment", validate({ body: addDepartmentSchema }), controller.addDepartment);
router.get("/getDepartments", controller.getDepartments);
router.get("/getDepartmentDetails/:departmentId", controller.getDepartmentDetails);
router.put("/updateDepartment/:departmentId", validate({ body: updateDepartmentSchema, params: paramsSchema }), controller.updateDepartment);
router.delete("/deleteDepartment/:departmentId", validate({ params: paramsSchema }), controller.deleteDepartment);

export default router
