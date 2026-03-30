import mongoose from "mongoose";

const machineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: String,
    serialNumber: {
        type: String,
        required: true,
        unique: true
    },
    branch: String,
    status: {
        type: String,
        enum: ["available", "in_use", "reserved", "maintenance", "broken"],
        default: "available"
    }
}, { timestamps: true });

export default mongoose.models.Machine || mongoose.model("Machine", machineSchema);