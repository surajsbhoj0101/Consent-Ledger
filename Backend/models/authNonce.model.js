import mongoose from "mongoose";

const authNonceSchema = new mongoose.Schema({
    wallet: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
    },

    nonce: {
        type: String,
        required: true,
    },

    expiresAt: {
        type: Date,
        required: true,
        index: true,
    },
}, {
    timestamps: true,
});
