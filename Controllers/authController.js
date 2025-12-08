import { User } from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

export const Register = async (req, res) => {
  try {
    const { name, email, mobile, age, gender } = req.body;

    const mobileExists = await User.findOne({ mobile });
    if (mobileExists) {
      return res.status(400).json({
        success: false,
        message: "mobile number already exists",
      });
    }

    const newUser = await User.create({
      name,
      email,
      mobile,
      age,
      gender,
    });

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("Authtoken", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    return res
      .status(200)
      .json({ success: true, message: "Registration successful" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error from register.",
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

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      sid: otpResponse.sid,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send OTP" });
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
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
  } catch (error) {
    res.status(500).json({
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
      return res
        .status(400)
        .json({ success: false, message: "user not found!" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("Authtoken", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    return res
      .status(200)
      .json({ success: true, message: "Login successful!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error from login.",
    });
  }
};

export const CheckAuth = async (req, res) => {
  try {
    const user = await User.findById(res.userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user with user id!",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Authorized user", user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error from check auth.",
    });
  }
};

export const Logout = async (req, res) => {
  try {
    res.clearCookie("Authtoken", {
      httpOnly: true,
      sameSite: "strict",
    });

    res
      .status(200)
      .json({ success: true, message: "Logout successful" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error from logout.",
    });
  }
};
