import express from "express";
import * as controller from "./dashboard.controller.js";
import authMiddleware from "../../common/middlewares/authMiddleware.js";
import { isAdmin } from "../../common/middlewares/roleCheck.js";

const router = express.Router();

router.use(authMiddleware, isAdmin);

router.get("/getStats", controller.getStats);

export default router;
