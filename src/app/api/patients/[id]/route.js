import connectToDatabase from "@/lib/DB_CONNECTION";
import Patient from "@/models/Patient";


// GET single patient
export async function GET(req, { params }) {

    try {

        await connectToDatabase();

        const patient = await Patient.findById(params.id)
            .populate("refMachine")
            .populate("refDoctor")
            .populate("refEmployee");

        if (!patient) {
            return new Response(
                JSON.stringify({ error: "Patient not found" }),
                { status: 404 }
            );
        }

        return new Response(JSON.stringify(patient), { status: 200 });

    } catch (error) {

        console.error("GET Patient Error:", error);

        return new Response(
            JSON.stringify({ error: "Failed to fetch patient" }),
            { status: 500 }
        );
    }
}



// UPDATE patient
export async function PUT(req, { params }) {

    try {

        await connectToDatabase();

        const body = await req.json();
        console.log(body);

        const { id } = await params;

        const updatedPatient = await Patient.findByIdAndUpdate(
            id,
            body,
            { new: true }
        );

        if (!updatedPatient) {
            return new Response(
                JSON.stringify({ error: "Patient not found" }),
                { status: 404 }
            );
        }

        return new Response(JSON.stringify(updatedPatient), { status: 200 });

    } catch (error) {

        console.error("PUT Patient Error:", error);

        return new Response(
            JSON.stringify({ error: "Failed to update patient" }),
            { status: 500 }
        );
    }
}



// DELETE patient
export async function DELETE(req, { params }) {

    try {

        await connectToDatabase();

        const deleted = await Patient.findByIdAndDelete(params.id);

        if (!deleted) {
            return new Response(
                JSON.stringify({ error: "Patient not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ message: "Patient deleted successfully" }),
            { status: 200 }
        );

    } catch (error) {

        console.error("DELETE Patient Error:", error);

        return new Response(
            JSON.stringify({ error: "Failed to delete patient" }),
            { status: 500 }
        );
    }
}



export async function PATCH(req, { params }) {
    await connectToDatabase();


    const { id } = await params;


    const { rentId } = await req.json();


    const patient = await Patient.findById(id)
        .populate("refDoctor")
        .populate("refMachine")
        .populate("refEmployee");

    if (!patient) {
        return Response.json({ error: "Patient not found" }, { status: 404 });
    }

    const rent = patient.monthlyRent.id(rentId);
    if (!rent) {
        return Response.json({ error: "Rent not found" }, { status: 404 });
    }

    rent.status = "paid";
    rent.updatedAt = new Date();

    await patient.save();

    return Response.json(patient);
}