import express from "express";
import * as controller from "./dashboard.controller.js";
import authMiddleware from "../../common/middlewares/authMiddleware.js";
import { isManager } from "../../common/middlewares/roleCheck.js";

const router = express.Router();

router.use(authMiddleware, isManager);

router.get("/getStats", controller.getStats);

export default router;
