import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({

    name: { type: String, required: true, index: true },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    }

}, { timestamps: true });

export default mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);