import BloodBank from "../Models/bloodbankModel.js";
import bcrypt from "bcryptjs";
import fs from "fs";
// import cloudinary from "../Utils/cloudinary.js";
import jwt from "jsonwebtoken";
import {Camp} from "../Models/campModel.js";

   
export const signupBloodBank = async (req, res) => {
  try {
    const { name, email, password, licenseNumber, contactNumber, address, district } = req.body;

    if (!name || !email || !password || !licenseNumber || !contactNumber || !address || !district) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // if (!req.file?.path) {
    //   return res.status(400).json({ message: "License photo is required" });
    // }

  
    // const uploadResult = await cloudinary.uploader.upload(req.file.path, {
    //   folder: "bloodbank_licenses",
    // });

    // const licenseImageUrl = uploadResult.secure_url;

  
    // fs.unlinkSync(req.file.path);

    
    const exists = await BloodBank.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

    const newBank = new BloodBank({
      name,
      email,
      password: hashedPassword,
      licenseNumber,
    //   licenseFile: licenseImageUrl,
      contactNumber,
      address,
      district,
      verificationStatus: "pending",
    });

    await newBank.save();

    res.status(201).json({
      success: true,
      message: "Signup successful — waiting for admin verification",
      bloodBank: newBank,
    });

  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



export const BloodBankLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const bloodBank = await BloodBank.findOne({ email });
    if (!bloodBank) {
      return res.status(404).json({ message: "Blood bank not found" });
    }

    const isMatch = await bcrypt.compare(password, bloodBank.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (bloodBank.verificationStatus !== "verified") {
      return res.status(403).json({ message: "Your account is not verified yet." });
    }

    
    const token = jwt.sign({ id: bloodBank._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      token,
      bloodBank,
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


export const updateBloodUnits = async (req, res) => {
  try {
    const bloodBankId = req.bloodBank.id;  
    const { Apos, Aneg, Bpos, Bneg, Opos, Oneg, ABpos, ABneg } = req.body;
    console.log("UPDATE BLOOD UNITS REQUEST BODY:", req.body);

    const updatedBank = await BloodBank.findByIdAndUpdate(
      bloodBankId,
      {
        bloodData: {
          Apos,
          Aneg,
          Bpos,
          Bneg,
          Opos,
          Oneg,
          ABpos,
          ABneg
        }
      },
      { new: true }
    );

    if (!updatedBank) {
      return res.status(404).json({ message: "Blood bank not found" });
    }

    res.json({
      success: true,
      message: "Blood units updated successfully",
      data: updatedBank,
    });

  } catch (error) {
    console.error("UPDATE BLOOD UNITS ERROR:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


export const getBloodBankDetails=async(req,res)=>{
  try{
    const bloodBankId=req.bloodBank.id;
    const bloodBank=await BloodBank.findById(bloodBankId).select('-password');
    if(!bloodBank){
      return  res.status(404).json({ message: "Blood bank not found" });
    }
    res.status(200).json({
      success:true,
      bloodBank
    });

  }catch{
    res.status(500).json({ message: "Internal server error" });
  }
};



export const createCamp = async (req, res) => {
  try {
    const {
      campTitle,
      location,
      date,
      time,
      campPoster,
      sendNotifications,
    } = req.body;

    // Validation
    if (!campTitle || !location || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const newCamp = await Camp.create({
      campTitle,
      location,
      date,
      time,
      campPoster,
      sendNotifications,
    });

    res.status(201).json({
      success: true,
      message: "Camp created successfully",
      data: newCamp,
    });
  } catch (error) {
    console.error("Create Camp Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating camp",
    });
  }
};


export const getAllCamps = async (req, res) => {
  try {
    const camps = await Camp.find().sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: camps.length,
      data: camps,
    });
  } catch (error) {
    console.error("Get Camps Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching camps",
    });
  }
};

export const getCampById = async (req, res) => {
  try {
    const { id } = req.params;

    const camp = await Camp.findById(id);

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Camp not found",
      });
    }

    res.status(200).json({
      success: true,
      data: camp,
    });
  } catch (error) {
    console.error("Get Camp Error:", error);
    res.status(500).json({
      success: false,
      message: "Invalid camp ID",
    });
  }
};
