import express from "express";
import {
  adminLogin,
  approveBloodBank,
  rejectBloodBank,
  getPendingBloodBanks,
  registerAdmin
} from "../Controllers/admincontroller.js";

import { adminAuth } from "../Middlewares/adminAuth.js";

const adminRoutes = express.Router();
adminRoutes.post("/register", registerAdmin);

adminRoutes.post("/login", adminLogin);


adminRoutes.get("/pending-banks", adminAuth, getPendingBloodBanks);


adminRoutes.put("/approve/:id", adminAuth, approveBloodBank);

adminRoutes.put("/reject/:id", adminAuth, rejectBloodBank);

export default adminRoutes;