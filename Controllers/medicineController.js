import { MedicineForm } from "../Models/medicineformModel.js";
import mongoose from "mongoose";

export const addMedicine = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      medicineName,
      genericName,
      dosage,
      medicineType,
      frequency,
      timeslots,
      startDate,
      endDate,
      whenToTake,
      specialInstructions,
      possibleSideEffects,
      currentStock,
      lowStockAlert,
      refillReminder,
      automaticRefill,
    } = req.body;

    console.log("Received Body:", req.body);

    // ------------------ REQUIRED FIELD VALIDATION ------------------
    const requiredFields = {
      medicineName,
      dosage,
      medicineType,
      frequency,
      startDate,
      whenToTake,
    };

    const missing = Object.keys(requiredFields).filter(
      (key) => !requiredFields[key] || requiredFields[key].length === 0
    );

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(", ")}`,
      });
    }

    // ------------------ ENUM VALIDATION ------------------
    const validMedicineTypes = [
      "Tablet", "Capsule", "Syrup", "Injection", 
      "Ointment", "Inhaler", "Drops", "Other"
    ];

    if (!validMedicineTypes.includes(medicineType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid medicineType. Allowed: ${validMedicineTypes.join(", ")}`,
      });
    }

    const validFrequency = [
      "Once a day",
      "Twice a day",
      "Thrice a day",
      "As needed",
      "custom",
    ];

    if (!validFrequency.includes(frequency)) {
      return res.status(400).json({
        success: false,
        message: `Invalid frequency. Allowed: ${validFrequency.join(", ")}`,
      });
    }

    const validWhenToTake = [
      "Before Food",
      "After Food",
      "With Food",
      "Empty Stomach",
      "Anytime",
    ];

    if (!validWhenToTake.includes(whenToTake)) {
      return res.status(400).json({
        success: false,
        message: `Invalid whenToTake. Allowed: ${validWhenToTake.join(", ")}`,
      });
    }

    // ------------------ TIMESLOTS VALIDATION ------------------
    if (frequency === "custom") {
      if (!Array.isArray(timeslots) || timeslots.length === 0) {
        return res.status(400).json({
          success: false,
          message: "For custom frequency, timeslots must be a non-empty array",
        });
      }
    }

    // ------------------ DATE VALIDATION ------------------
    if (startDate && isNaN(Date.parse(startDate))) {
        console.log('first')
      return res.status(400).json({
        success: false,
        message: "Invalid startDate format",
      });
    }

    if (endDate && isNaN(Date.parse(endDate))) {
      return res.status(400).json({
        success: false,
        message: "Invalid endDate format",
      });
    }

    // ------------------ CREATE DOCUMENT ------------------

    const medicine = await MedicineForm.create({
      user: userId,
      medicineName,
      genericName: genericName || "",
      dosage,
      medicineType,
      frequency,
      timeslots: timeslots || [],
      startDate,
      endDate: endDate || "",
      whenToTake,
      specialInstructions: specialInstructions || "",
      possibleSideEffects: possibleSideEffects || "",
      currentStock: currentStock || "",
      lowStockAlert: lowStockAlert || "",
      refillReminder: refillReminder ?? false,
      automaticRefill: automaticRefill ?? false,
    });

    return res.status(201).json({
      success: true,
      message: "Medicine added successfully",
      data: medicine,
    });

  } catch (error) {
    console.error("ADD MEDICINE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while adding medicine",
    });
  }
};


export const getAllMedicines = async (req, res) => {
  try {
    const userId = req.user._id;

    const medicines = await MedicineForm.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines,
    });
  } catch (error) {
    console.error("FETCH MEDICINES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching medicines",
    });
  }
};


export const getMedicineByDate = async (req, res) => {
  try {
    const userId = req.user._id;
    let { date } = req.body;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    // ──────────────────────────────────────────────
    // ⭐ 1. NORMALIZE INPUT DATE FORMAT
    // Supports: "2025-12-10" OR "10/12/2025"
    // ──────────────────────────────────────────────
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      const [d, m, y] = date.split("/");
      date = `${y}-${m}-${d}`; // convert → yyyy-mm-dd
    }

    const targetDate = new Date(date);
    if (isNaN(targetDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use YYYY-MM-DD or DD/MM/YYYY",
      });
    }

    // ──────────────────────────────────────────────
    // ⭐ 2. FETCH USER MEDICINES
    // ──────────────────────────────────────────────
    const medicines = await MedicineForm.find({ user: userId });

    // ──────────────────────────────────────────────
    // ⭐ 3. FILTER MEDICINES ACTIVE ON SELECTED DATE
    // Condition: startDate ≤ targetDate ≤ endDate
    // If no endDate → treat as unlimited
    // ──────────────────────────────────────────────
    const activeMedicines = medicines.filter((med) => {
      if (!med.startDate) return false;

      let start = med.startDate;
      let end = med.endDate;

      // Convert DB stored dd/mm/yyyy → yyyy-mm-dd
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(start)) {
        const [d, m, y] = start.split("/");
        start = `${y}-${m}-${d}`;
      }

      if (end && /^\d{2}\/\d{2}\/\d{4}$/.test(end)) {
        const [d, m, y] = end.split("/");
        end = `${y}-${m}-${d}`;
      }

      const startDate = new Date(start);
      const endDate = end ? new Date(end) : null;

      if (isNaN(startDate)) return false;

      // target < start → NOT ACTIVE
      if (targetDate < startDate) return false;

      // has endDate AND target > endDate → NOT ACTIVE
      if (endDate && targetDate > endDate) return false;

      return true;
    });

    // ──────────────────────────────────────────────
    // ⭐ 4. RETURN RESPONSE
    // ──────────────────────────────────────────────
    return res.status(200).json({
      success: true,
      date,
      count: activeMedicines.length,
      medicines: activeMedicines,
    });
  } catch (error) {
    console.error("FETCH MEDICINES at date ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching medicines",
    });
  }
};


export const getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid medicine ID",
      });
    }

    const medicine = await MedicineForm.findById(id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: medicine,
    });
  } catch (error) {
    console.error("GET MEDICINE BY ID ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid medicine ID",
      });
    }

    const updated = await MedicineForm.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("UPDATE MEDICINE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating medicine",
    });
  }
};

export const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid medicine ID",
      });
    }

    const deleted = await MedicineForm.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Medicine deleted successfully",
    });
  } catch (error) {
    console.error("DELETE MEDICINE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting medicine",
    });
  }
};
