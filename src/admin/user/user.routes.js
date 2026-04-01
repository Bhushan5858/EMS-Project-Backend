import express from "express";
import * as controller from "./user.controller.js";
import validate from '../../common/middlewares/joivalidation.js'
import { addUserSchema, updateUserSchema, paramsSchema, assignDepartmentSchema } from "./validate.js";
import authMiddleware from "../../common/middlewares/authMiddleware.js";
import {isAdmin} from "../../common/middlewares/roleCheck.js";


const router = express.Router();

router.use(authMiddleware, isAdmin);
router.post("/addUser", validate({ body: addUserSchema }), controller.addUser);
router.get("/getUsers", authMiddleware, controller.getUsers);
router.put("/updateUser/:userId", validate({ body: updateUserSchema, params: paramsSchema }), controller.updateUser);
router.delete("/deleteUser/:userId", validate({ params: paramsSchema }), controller.deleteUser);


//assign user to department
router.put('/assignDepartment/:departmentId',controller.assignDepartment);

// remove user from department
router.put('/removeUserFromDepartment/:departmentId/:userId',controller.removeDepartmentUser);




export default router
