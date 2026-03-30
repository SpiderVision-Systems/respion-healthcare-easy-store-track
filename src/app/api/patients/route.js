import connectToDatabase from "@/lib/DB_CONNECTION";
import "@/models/Patient";
import "@/models/Machine";
import "@/models/Doctor";
import "@/models/Employee"
import Patient from "@/models/Patient";
import Doctor from "@/models/Doctor";
// import Patient from "@/models/Patient";
import Machine from "@/models/Machine";
import Employee from "@/models/Employee";


export async function GET() {
    try {
        await connectToDatabase();

        const patients = await Patient.find()
            .sort({ createdAt: -1 }) // 🔥 latest first
            .populate("refMachine")
            .populate("refDoctor")
            .populate("refEmployee");

        return new Response(JSON.stringify(patients), { status: 200 });

    } catch (error) {
        console.error("GET Patients Error:", error);

        return new Response(
            JSON.stringify({ error: "Failed to fetch patients" }),
            { status: 500 }
        );
    }
}



// ── POST /api/patients ──
// export async function POST(req) {
//     await connectToDatabase();

//     try {
//         const data = await req.json();
//         console.log(data);

//         // Optional server-side validation
//         const requiredFields = ["name", "phone", "refMachine", "refDoctor", "refEmployee", "paymentType"];
//         for (const field of requiredFields) {
//             if (!data[field]) {
//                 return new Response(JSON.stringify({ error: `${field} is required` }), { status: 400 });
//             }
//         }

//         const patient = new Patient(data);
//         await patient.save();

//         return new Response(JSON.stringify({ message: "Patient saved successfully", patient }), { status: 201 });
//     } catch (err) {
//         console.error(err);
//         return new Response(JSON.stringify({ error: "Failed to save patient", details: err.message }), { status: 500 });
//     }
// }


export async function POST(req) {
    await connectToDatabase();

    try {
        const data = await req.json();

        const requiredFields = ["name", "phone", "refMachine", "refDoctor", "refEmployee", "paymentType"];
        for (const field of requiredFields) {
            if (!data[field]) {
                return new Response(JSON.stringify({ error: `${field} is required` }), { status: 400 });
            }
        }

        const patient = new Patient(data);
        await patient.save();

        // ✅ UPDATE MACHINE STATUS
        await Machine.findByIdAndUpdate(
            data.refMachine,
            { status: "in_use" }
        );

        return new Response(
            JSON.stringify({ message: "Patient saved successfully", patient }),
            { status: 201 }
        );

    } catch (err) {
        console.error(err);
        return new Response(
            JSON.stringify({ error: "Failed to save patient", details: err.message }),
            { status: 500 }
        );
    }
}