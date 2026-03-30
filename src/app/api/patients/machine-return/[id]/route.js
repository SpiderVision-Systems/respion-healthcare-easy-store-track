import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Patient from "@/models/Patient";
import Machine from "@/models/Machine";

// export async function PATCH(request, { params }) {
//     try {
//         await connectToDatabase();

//         const { id } = await params;

//         if (!id) {
//             return NextResponse.json({ error: "Patient ID is required" }, { status: 400 });
//         }

//         const body = await request.json();
//         const { reviewGiven } = body;

//         const today = new Date().toISOString().split("T")[0];

//         const patient = await Patient.findByIdAndUpdate(
//             id,
//             {
//                 isReturned: true,
//                 returnDate: today,
//                 reviewGiven: reviewGiven ?? false,
//             },
//             { returnDocument: "after" }
//         )
//             .populate("refDoctor", "name")
//             .populate("refMachine", "name serialNumber type")
//             .populate("refEmployee", "name")
//             .lean();

//         if (!patient) {
//             return NextResponse.json({ error: "Patient not found" }, { status: 404 });
//         }

//         return NextResponse.json(patient);

//     } catch (error) {
//         console.error("PATCH /api/patients/[id]/return error:", error);
//         return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//     }
// }



export async function PATCH(request, { params }) {
    try {
        await connectToDatabase();

        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "Patient ID is required" }, { status: 400 });
        }

        const body = await request.json();
        const { reviewGiven } = body;

        const today = new Date().toISOString().split("T")[0];

        const patient = await Patient.findByIdAndUpdate(
            id,
            {
                isReturned: true,
                returnDate: today,
                reviewGiven: reviewGiven ?? false,
            },
            { returnDocument: "after" }
        )
            .populate("refDoctor", "name")
            .populate("refMachine", "name serialNumber type")
            .populate("refEmployee", "name")
            .lean();

        if (!patient) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }

        // ✅ UPDATE MACHINE STATUS TO AVAILABLE
        if (patient.refMachine?._id) {
            await Machine.findByIdAndUpdate(
                patient.refMachine._id,
                { status: "available" }
            );
        }

        return NextResponse.json(patient);

    } catch (error) {
        console.error("PATCH /api/patients/[id]/return error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}