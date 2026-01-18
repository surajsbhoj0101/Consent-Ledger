import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuidv4 
        },

        role: {
            type: String,
            enum: ["user", "company"],
            required: true,
        },

        email: {
            type: String
        },

        name: {
            type: String
        },

        profileImage: {
            type: String
        },

        wallets: [
            {
                address,
                type: "web3auth" | "metamask",
               
            }
        ]

    },
    { timestamps: true }
);
export default mongoose.model("User", userSchema);
