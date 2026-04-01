import express from "express";
import * as controller from "./user.controller.js";
import authMiddleware from "../../common/middlewares/authMiddleware.js";
import { isManager } from "../../common/middlewares/roleCheck.js";

const router = express.Router();

router.use(authMiddleware, isManager);

router.get("/getUnassignedUsers", controller.getUnassignedUsers);

export default router;
