import mongoose from "mongoose";

const consumerSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },

    basicInformation: {
      firstName: {
        type: String,
        trim: true,
      },
      lastName: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        lowercase: true,
        trim: true,
      },

      phone: {
        type: String,
      },
      address: {
        type: String,
      },
      bio: {
        type: String,
      },
    },
    isRegistered: {
      type: Boolean,
      default: false,
    },

    profileUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Consumer", consumerSchema);
