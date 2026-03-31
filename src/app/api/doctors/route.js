import connectToDatabase from "@/lib/DB_CONNECTION";
import Doctor from "@/models/Doctor";


// GET /api/doctors
export async function GET(req) {
    try {

        await connectToDatabase();

        const doctors = await Doctor.find({ isDeleted: false }).sort({ createdAt: -1 });

        return new Response(JSON.stringify(doctors), { status: 200 });

    } catch (error) {

        console.error("GET Doctors Error:", error);

        return new Response(
            JSON.stringify({ error: "Failed to fetch doctors" }),
            { status: 500 }
        );

    }
}


// POST /api/doctors
export async function POST(req) {
    try {

        await connectToDatabase();

        const body = await req.json();

        const { name, email, phone, hospitalName, specialization } = body;

        const doctor = new Doctor({
            name,
            email,
            phone,
            hospitalName,
            specialization
        });

        await doctor.save();

        return new Response(JSON.stringify(doctor), { status: 201 });

    } catch (error) {

        console.error("POST Doctor Error:", error);

        return new Response(
            JSON.stringify({ error: "Failed to create doctor" }),
            { status: 500 }
        );

    }
}


// PUT /api/doctors
export async function PUT(req) {
    try {

        await connectToDatabase();

        const body = await req.json();

        const { id, ...updateData } = body;

        if (!id)
            return new Response(
                JSON.stringify({ error: "Doctor ID required" }),
                { status: 400 }
            );

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            id,
            updateData,
            { returnDocument: 'after' }
        );

        if (!updatedDoctor)
            return new Response(
                JSON.stringify({ error: "Doctor not found" }),
                { status: 404 }
            );

        return new Response(JSON.stringify(updatedDoctor), { status: 200 });

    } catch (error) {

        console.error("PUT Doctor Error:", error);

        return new Response(
            JSON.stringify({ error: "Failed to update doctor" }),
            { status: 500 }
        );

    }
}


// DELETE /api/doctors
// export async function DELETE(req) {
//     try {

//         await connectToDatabase();

//         const body = await req.json();

//         const { id } = body;

//         if (!id)
//             return new Response(
//                 JSON.stringify({ error: "Doctor ID required" }),
//                 { status: 400 }
//             );

//         const deleted = await Doctor.findByIdAndDelete(id);

//         if (!deleted)
//             return new Response(
//                 JSON.stringify({ error: "Doctor not found" }),
//                 { status: 404 }
//             );

//         return new Response(
//             JSON.stringify({ message: "Doctor deleted successfully" }),
//             { status: 200 }
//         );

//     } catch (error) {

//         console.error("DELETE Doctor Error:", error);

//         return new Response(
//             JSON.stringify({ error: "Failed to delete doctor" }),
//             { status: 500 }
//         );

//     }
// }


export async function DELETE(req) {
    try {
        await connectToDatabase();

        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ error: "Doctor ID required" }),
                { status: 400 }
            );
        }

        const deleted = await Doctor.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { returnDocument: 'after' }
        );

        if (!deleted) {
            return new Response(
                JSON.stringify({ error: "Doctor not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ message: "Doctor deleted (soft) successfully" }),
            { status: 200 }
        );

    } catch (error) {
        console.error("DELETE Doctor Error:", error);

        return new Response(
            JSON.stringify({ error: "Failed to delete doctor" }),
            { status: 500 }
        );
    }
}