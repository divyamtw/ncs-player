import express from "express";
import {
  registerController,
  loginController,
  logoutController,
  getUserController,
} from "../controllers/auth.controller.js";
import { handleValidation } from "../middlewares/validation.middleware.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/user.validator.js";
import verifyUser from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/register",
  registerValidator,
  handleValidation,
  registerController,
);
router.post("/login", loginValidator, handleValidation, loginController);

router.post("/logout", verifyUser, logoutController);
router.get("/get-user", verifyUser, getUserController);

export default router;
