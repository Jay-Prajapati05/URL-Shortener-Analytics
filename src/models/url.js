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
      index: true, // indexed because redirects always look up by this field
    },
    expiresAt: {
      type: Date,
      default: null, // null means the link never expires
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }, // adds createdAt and updatedAt automatically
);

export default mongoose.model("Url", urlSchema);
