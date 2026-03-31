import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({

    name: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    status: { type: String, enum: ["Active", "On-Leave", "Inactive"], default: "Active" },
    role: { type: String },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    }


}, { timestamps: true });

export default mongoose.models.Employee || mongoose.model("Employee", employeeSchema);