import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
    {
        userId: {
            type: String, 
            ref: "User",
            required: true,
            index: true,
        },

        basicInformation: {
            name: {
                type: String,
                trim: true,
            },
            email: {
                type: String,
                lowercase: true,
                trim: true,
            },
            website: {
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
            industry: {
                type: String,
                enum: [
                    "technology",
                    "finance",
                    "retail",
                    "manufacturing",
                    "healthcare",
                    "other",
                ],
            },
            description: {
                type: String,
            },
        },

        isRegistered:{
            type: Boolean,
            default: false
        },

        profileUrl: {
            type: String,
        },

        isVerified: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Company", companySchema);
