import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    passId: String, // ⭐ Pass ID Save
    name: String,
    phone: String,
    whomToMeet: String,
    aadhaar: String,
    pan: String,
    photo: String
  },
  { timestamps: true }
);

export default mongoose.model("Visitor", visitorSchema);
