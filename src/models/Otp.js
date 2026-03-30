import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        otp: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 240, // auto-delete after 120 seconds (3 min)
        },
    },
    { timestamps: true }
);

export default mongoose.models.Otp || mongoose.model("Otp", otpSchema);
