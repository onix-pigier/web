import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const modelservice = mongoose.model("Service", serviceSchema);

export default modelservice;
