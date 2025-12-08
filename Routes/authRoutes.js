import { Router } from "express";
import { CheckAuth, Login, Logout, Register, sendOtp, verifyOtp } from "../Controllers/authController.js";
import { verifyToken } from "../Middlewares/verifyToken.js";

const AuthRoutes = Router()

AuthRoutes.post('/send-otp',sendOtp)
AuthRoutes.post('/verify-otp',verifyOtp)
AuthRoutes.post('/register',Register)
AuthRoutes.post('/login',Login)
AuthRoutes.post('/logout',Logout)
AuthRoutes.get('/check-auth',verifyToken , CheckAuth)

export default AuthRoutes;