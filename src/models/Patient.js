import mongoose from "mongoose";

const accessorySchema = new mongoose.Schema({
    name: { type: String, trim: true },
});

const rentScheduleSchema = new mongoose.Schema({
    month: { type: String }, // "January 2026" OR "Day 1"
    dueDate: { type: String }, // YYYY-MM-DD
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending",
    },
    updatedAt: { type: String },
});

const patientSchema = new mongoose.Schema(
    {
        // ─── Patient Info ─────────────────────────
        name: { type: String, required: true, trim: true },
        phone: { type: String, required: true },
        altPhone: { type: String },
        whatsapp: { type: String },
        address: { type: String, required: true },
        reviewGiven: { type: Boolean },
        dob: { type: String },
        age: { type: String },

        // ─── Assignment ───────────────────────────
        refDoctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            default: null,
        },
        otherSource: { type: String, trim: true }, // used when doctor = "others"
        refMachine: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Machine",
            required: true,
        },
        refEmployee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            default: null,                          // null when employee = "others"
        },
        otherEmployee: { type: String, trim: true }, // used when employee = "others"

        // ─── Accessories ──────────────────────────
        accessories: [accessorySchema],             // name only, no price

        // ─── Rental Info ──────────────────────────
        paymentType: {
            type: String,
            enum: ["fully_paid", "rent"],
            default: "rent",
        },
        rentPerPeriod: { type: Number, required: true }, // per day OR per month
        duration: { type: String, required: true },      // "d:7" or "m:2"
        startDate: { type: String, required: true },
        returnDate: { type: String },
        securityAmount: { type: Number, default: 0 },
        paymentAcc: { type: String },
        paymentMode: { type: String },

        // ─── Totals ───────────────────────────────
        grandTotal: { type: Number, required: true },
        isReturned: { type: Boolean },
        returnDate: { type: String },

        // ─── Rent Schedule ────────────────────────
        monthlyRent: [rentScheduleSchema],
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Patient ||
    mongoose.model("Patient", patientSchema);