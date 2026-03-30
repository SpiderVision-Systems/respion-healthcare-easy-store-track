import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Patient from "@/models/Patient";

export async function GET(request) {
    try {
        await connectToDatabase();

        // 🔐 Get token
        const authHeader = request.headers.get("authorization") || "";

        if (!authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];

        // 🔐 Decode token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 401 }
            );
        }

        const employeeId = decoded.id;
        const role = decoded.role;

        // 🔥 ROLE CHECK
        if (role !== "employee") {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        // 📦 Fetch assigned patients
        const patients = await Patient.find({ refEmployee: employeeId })
            .populate("refMachine", "name serialNumber type")
            .populate("refDoctor", "name")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(patients);

    } catch (error) {
        console.error("GET /api/employee/installations error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}