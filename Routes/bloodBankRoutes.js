import express from "express";
import { signupBloodBank, BloodBankLogin ,updateBloodUnits} from "../Controllers/bloodbankcontroller.js";
import { bloodBankAuth } from "../Middlewares/bloodbank.js";

const bloodRoutes = express.Router();

bloodRoutes.post("/signup", signupBloodBank);
bloodRoutes.post("/login", BloodBankLogin);
bloodRoutes.put("/update-blood-units", bloodBankAuth, updateBloodUnits);
export default bloodRoutes;