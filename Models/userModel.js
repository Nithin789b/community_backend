import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },


    address: [
        {
            state: {
                type: String,
                required: false
            },
            city: {
                type: String,
                required: false
            },
            district: {
                type: String,
                required: false
            }
        }
    ],

    otp: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    }
});

export const User = mongoose.model("user", userSchema);
