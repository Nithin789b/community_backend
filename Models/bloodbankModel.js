import mongoose from "mongoose";

const BloodBankSchema = new mongoose.Schema({
 
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  
  licenseNumber: {
    type: String,
    required: true
  },

  licenseFile: {
    type: String, 
    required: false
  },

  verificationStatus: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending"
  },

  
  contactNumber: {
    type: String,
    default: ""
  },

  address: {
    type: String,
    default: ""
  },

  district: {
    type: String,
    default: ""
  },

  
  bloodData: {
    Apos: { type: Number, default: 0 },  
    Aneg: { type: Number, default: 0 },  
    Bpos: { type: Number, default: 0 },  
    Bneg: { type: Number, default: 0 },  
    Opos: { type: Number, default: 0 },  
    Oneg: { type: Number, default: 0 },  
    ABpos: { type: Number, default: 0 }, 
    ABneg: { type: Number, default: 0 }  
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const BloodBank = mongoose.model("BloodBank", BloodBankSchema);

export default BloodBank;