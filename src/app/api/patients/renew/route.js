import connectToDatabase from "@/lib/DB_CONNECTION";
import Patient from "@/models/Patient";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectToDatabase();

        const body = await req.json();
        const { patientId, dueDate, amount, status } = body;

        if (!patientId || !dueDate || !amount) {
            return NextResponse.json(
                { success: false, message: "Missing fields" },
                { status: 400 }
            );
        }

        const patient = await Patient.findById(patientId);

        if (!patient) {
            return NextResponse.json(
                { success: false, message: "Patient not found" },
                { status: 404 }
            );
        }

        const newEntry = {
            month: "Manual Renewal",
            dueDate,
            amount,
            status: status || "pending",
            updatedAt: new Date().toISOString(),
        };

        patient.monthlyRent.push(newEntry);
        patient.returnDate = dueDate;

        await patient.save();

        return NextResponse.json({
            success: true,
            message: "Renew added",
            data: newEntry,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}