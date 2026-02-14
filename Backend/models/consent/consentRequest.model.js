import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const consentRequestSchema = new mongoose.Schema(
  {
    consentRequestId: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },

    companyId: {
      type: String,
      required: true,
      index: true,
    },

    companyUserId: {
      type: String,
      required: true,
      index: true,
    },

    purposeId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED", "REVOKED"],
      default: "PENDING",
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ConsentRequest", consentRequestSchema);
