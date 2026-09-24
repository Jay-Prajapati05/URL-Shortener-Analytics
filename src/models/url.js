import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    longUrl: {
      type: String,
      required: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true, // fast lookup ke liye, redirect isi field pe query karega
    },
    expiresAt: {
      type: Date,
      default: null, // null matlab kabhi expire nahi hoga
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }, // createdAt, updatedAt automatic
);

export default mongoose.model("Url", urlSchema);
