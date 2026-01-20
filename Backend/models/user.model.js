import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const walletSchema = new mongoose.Schema(
    {
        address: {
            type: String,
            required: true,
            lowercase: true,
        },

        provider: {
            type: String,
            enum: ["metamask", "web3auth_google", "web3auth_email", "web3auth_wallet"],
            required: true,
        },

        isPrimary: {
            type: Boolean,
            default: false,
        },

        linkedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

const userSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuidv4,
        },

        role: {
            type: String,
            enum: ["consumer", "company"],
            required: true,
        },

        email: String,
        name: String,
        profileImage: String,

        wallets: {
            type: [walletSchema],
            default: [],
        },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
