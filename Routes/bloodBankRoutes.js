import express from "express";
import { signupBloodBank, BloodBankLogin ,updateBloodUnits, getBloodBankDetails, createCamp,getAllCamps,getCampById} from "../Controllers/bloodbankcontroller.js";
import { bloodBankAuth } from "../Middlewares/bloodbank.js";

const bloodRoutes = express.Router();

bloodRoutes.post("/signup", signupBloodBank);
bloodRoutes.post("/login", BloodBankLogin);
bloodRoutes.put("/update-blood-units", bloodBankAuth, updateBloodUnits);
bloodRoutes.get("/getdata", bloodBankAuth, getBloodBankDetails);
bloodRoutes.get("/createcamp", bloodBankAuth, createCamp);
bloodRoutes.get("/getAll", bloodBankAuth, getAllCamps);
bloodRoutes.get("/:id", bloodBankAuth, getCampById);

export default bloodRoutes;