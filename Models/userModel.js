import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mobile:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    gender : {
        type: String,
        required: true
    },
    age : {
        type: Number,
        required: true
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    }

});

export const User = mongoose.model('user', userSchema);