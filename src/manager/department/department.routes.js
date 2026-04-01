import express from "express";
import * as controller from "./department.controller.js";
// import validate from '../../common/middlewares/joivalidation.js'
// import {  updateDepartmentSchema, paramsSchema } from "./validate.js";
import authMiddleware from "../../common/middlewares/authMiddleware.js";
import {isManager} from "../../common/middlewares/roleCheck.js";


const router = express.Router();

router.use(authMiddleware, isManager);


router.get("/getDepartments", controller.getDepartments);
router.get("/getDepartmentDetails", controller.getDepartmentDetails);
router.put("/updateDepartment/:departmentId", controller.updateDepartment);
router.post("/addEmployee", controller.addEmployeeToDepartment);
router.delete("/removeEmployee/:employeeId", controller.removeEmployee);


export default router
