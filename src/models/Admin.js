import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: Number, required: true, unique: true, },
        password: { type: String, required: true },
        bio: { type: String },
        photo: { type: String },
        isActive: { type: Boolean, default: true },
        role: { type: String, enum: ["Admin1"], default: "Admin1" },
    },
    { timestamps: true }
);

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
