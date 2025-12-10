import express from "express";
import {
  addMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  getMedicineByDate
} from "../Controllers/medicineController.js";

import { verifyToken } from "../Middlewares/verifyToken.js";


const medicineRoutes = express.Router();

// Protected routes
medicineRoutes.post("/add",verifyToken, addMedicine);
medicineRoutes.get("/all", verifyToken, getAllMedicines);
medicineRoutes.get("/:id", verifyToken, getMedicineById);
medicineRoutes.put("/:id", verifyToken, updateMedicine);
medicineRoutes.delete("/:id", verifyToken, deleteMedicine);
medicineRoutes.post('/get-medicines-by-date' , verifyToken , getMedicineByDate) ;

export default medicineRoutes;
