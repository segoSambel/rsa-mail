import express from "express";
import protectedRoute from "../middleware/protectedRoute.js";
import * as AuthController from "../controllers/authController.js";
import * as MessageController from "../controllers/messageController.js";

const router = express.Router();

router.get("/", protectedRoute, MessageController.indexPage);
router.post("/", protectedRoute, MessageController.sendMessage);

router.get("/register", AuthController.registerPage);
router.post("/register", AuthController.performRegister);
router.get("/login", AuthController.loginPage);
router.post("/login", AuthController.performLogin);
router.get(
  "/register/checkDuplicateEmail",
  AuthController.APICheckDuplicateEmail
);

router.get("/logout", protectedRoute, AuthController.performLogout);

export default router;
