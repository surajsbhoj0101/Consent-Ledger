import mongoose from "mongoose";

const emailAuditSchema = new mongoose.Schema(
  {
    companyId: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      enum: ["PENDING", "SENT", "BOUNCED", "FAILED", "RETRYING"],
      required: true,
    },
    reason: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("EmailAudit", emailAuditSchema);
