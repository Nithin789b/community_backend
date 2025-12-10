import Admin from "../Models/adminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import BloodBank from "../Models/bloodbankModel.js";


export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

    const role = "admin";
    const admin = new Admin({
      email,
      password: hashedPassword,
      role: role
    });

    await admin.save();

    res.status(201).json({ 
      success: true, 
      message: "Admin registered successfully", 
      admin 
    });

  } catch (error) {
    console.error("ADMIN REGISTER ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("ADMIN LOGIN REQUEST:", req.body);
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const admin = await Admin.findOne({ email });
    console.log("FOUND ADMIN:", admin);
    if (!admin)
      return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { adminId: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Admin login successful",
      token,
      admin
    });

  } catch (error) {
    console.log(error);
    console.error("ADMIN LOGIN ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};





export const approveBloodBank = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedBank = await BloodBank.findByIdAndUpdate(
      id,
      { verificationStatus: "verified" },
      { new: true }
    );

    res.json({
      success: true,
      message: "Blood bank approved successfully",
      updatedBank
    });

  } catch (error) {
    res.status(500).json({ message: "Error approving blood bank" });
  }
};

export const rejectBloodBank = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedBank = await BloodBank.findByIdAndUpdate(
      id,
      { verificationStatus: "rejected" },
      { new: true }
    );

    res.json({
      success: true,
      message: "Blood bank rejected",
      updatedBank
    });

  } catch (error) {
    res.status(500).json({ message: "Error rejecting blood bank" });
  }
};

export const getPendingBloodBanks = async (req, res) => {
  try {
    const banks = await BloodBank.find({ verificationStatus: "pending" });
    res.json({ success: true, banks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending blood banks" });
  }
};
