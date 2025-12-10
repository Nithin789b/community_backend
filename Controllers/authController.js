import { User } from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();


export const Register = async (req, res) => {
  try {
    const { name, email, mobile, dob, gender,city,district, state } = req.body;

    const mobileExists = await User.findOne({ mobile });
    if (mobileExists) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already exists",
      });
    }

    const newUser = await User.create({
      name,
      email,
      mobile,
      dob,
      gender,
      address: [{ state, city, district }],
    });

    const userObject = newUser.toObject();
    delete userObject.password;

    const token = jwt.sign(
      { user: userObject },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Registration successful",
      token,
      user: userObject,
    });

  } catch (error) {
    
    return res.status(500).json({
      success: false,
      message: "Internal server error from register",
    });
  }
};



export const sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    const otpResponse = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verifications.create({
        to: `+91${mobile}`,
        channel: "sms",
      });
      

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      sid: otpResponse.sid,
    });

  } catch (error) {
    
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};



export const verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: `+91${mobile}`,
        code: otp,
      });

    if (verificationCheck.status === "approved") {
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
};




export const Login = async (req, res) => {
  try {
    const { mobile } = req.body;

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const userObject = user.toObject();
    delete userObject.password;

    const token = jwt.sign(
      { user: userObject },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    console.log(token)
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userObject,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error from login",
    });
  }
};



export const CheckAuth = async (req, res) => {
  try {
    const user = req.user; 

    return res.status(200).json({
      success: true,
      message: "Authorized user",
      user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error from check auth",
    });
  }
};



export const Logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};


export const getProfile = async(req,res) =>{
  try {
    const user = req.user ;
    return res.status(200).json({
      success:true,
      message:"User profile fetched successfully",
      user
    }) ;
  } catch (error) {
    return res.status(500).json({
      success:false,  
      message:"Internal server error from get profile"
    }) ;
  } 
}