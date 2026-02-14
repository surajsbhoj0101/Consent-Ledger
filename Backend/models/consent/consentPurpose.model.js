import mongoose from "mongoose";

const consentPurposeSchema = new mongoose.Schema(
  {
    companyId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    consentType: {
      type: String,
      default: "Required",
      trim: true,
    },
    duration: {
      type: String,
      default: "12 months",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

consentPurposeSchema.index({ companyId: 1, name: 1 });

export default mongoose.model("ConsentPurpose", consentPurposeSchema);
