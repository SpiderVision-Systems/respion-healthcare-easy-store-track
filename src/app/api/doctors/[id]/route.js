// app/api/doctors/[id]/route.js

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Patient from "@/models/Patient";
import connectToDatabase from "@/lib/DB_CONNECTION";

export async function GET(req, { params }) {
    await connectToDatabase()

    try {


        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid doctor ID" }, { status: 400 });
        }

        const patients = await Patient.find({
            refDoctor: new mongoose.Types.ObjectId(id)
        }).lean();
        // console.log(patients);

        return NextResponse.json(patients);

    } catch (err) {
        console.error("GET /api/doctors/[id] error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}