import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({

    name: { type: String, required: true, index: true },
    email: String,
    phone: { type: String, required: true, index: true },
    hospitalName: String,
    specialization: { type: String, index: true },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    }

}, { timestamps: true });

export default mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);