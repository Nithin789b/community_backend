import { Router } from "express";
import {
  sendOtp,
  verifyOtp,
  Register,
  Login,
  Logout,
  CheckAuth,
  getProfile,
  updateProfile
} from "../Controllers/authController.js";
import { verifyToken } from "../Middlewares/verifyToken.js";

const AuthRoutes = Router();



AuthRoutes.post("/send-otp", sendOtp);
AuthRoutes.post("/verify-otp", verifyOtp);
AuthRoutes.post("/register", Register);
AuthRoutes.post("/login", Login);
AuthRoutes.get("/check-auth", verifyToken, CheckAuth);
AuthRoutes.post("/logout", Logout);
AuthRoutes.get("/profile", verifyToken, getProfile );
AuthRoutes.put("/update-profile",verifyToken,updateProfile);

export default AuthRoutes;
