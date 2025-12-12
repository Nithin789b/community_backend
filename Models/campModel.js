import mongoose from "mongoose";

const CampSchema = new mongoose.Schema(
  {
    campTitle: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String, 
      required: true,
    },
    campPoster: {
      type: String, 
    },
    sendNotifications: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Camp = mongoose.model("Camp", CampSchema);
