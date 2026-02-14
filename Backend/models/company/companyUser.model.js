import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const companyUserSchema = new mongoose.Schema(
  {
    companyUserId: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },

    companyId: {
      type: String, // UUID of Company
      required: true,
      index: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      index: true,
    },
    //id of user in company db
    externalUserId: {
      type: String,
      required: true,
    },
    
    name: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      default: "member",
    },

    //userId of user in db if exists
    userId: {
      type: String,
      default: null,
      index: true,
    },

    status: {
      type: String,
      enum: ["INVITED", "ACTIVE", "INACTIVE"],
      default: "INVITED",
      index: true,
    },

    firstContactedAt: {
      type: Date,
      default: Date.now,
    },

    lastConsentRequestAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

// Prevent duplicate per company
companyUserSchema.index({ companyId: 1, email: 1, externalUserId: 1 }, { unique: true }); //mean setting one user one company should be unique
//one company can't have two user's with same name.

export default mongoose.model("CompanyUser", companyUserSchema);
