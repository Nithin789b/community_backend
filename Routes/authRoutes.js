import { Router } from "express";
import {
  sendOtp,
  verifyOtp,
  Register,
  Login,
  Logout,
  CheckAuth
} from "../Controllers/authController.js";
import { verifyToken } from "../Middlewares/verifyToken.js";

const AuthRoutes = Router();



AuthRoutes.post("/send-otp", sendOtp);
AuthRoutes.post("/verify-otp", verifyOtp);
AuthRoutes.post("/register", Register);
AuthRoutes.post("/login", Login);
AuthRoutes.get("/check-auth", verifyToken, CheckAuth);
AuthRoutes.post("/logout", Logout);

export default AuthRoutes;
