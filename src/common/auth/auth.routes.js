import express from "express";
import * as controller from "./auth.controller.js";
import validate from '../../common/middlewares/joivalidation.js'
import { loginSchema } from "./validate.js";
import authMiddleware from "../../common/middlewares/authMiddleware.js";
import { isAdmin } from "../../common/middlewares/roleCheck.js";


const router = express.Router();

router.post("/login", validate({ body: loginSchema }), controller.login);
router.get("/getProfile", authMiddleware, controller.getProfile);

export default router
