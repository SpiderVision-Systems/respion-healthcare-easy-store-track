import connectToDatabase from "@/lib/DB_CONNECTION";
import Machine from "@/models/Machine";
import { NextResponse } from "next/server";


// GET ALL MACHINES
export async function GET() {
    try {
        await connectToDatabase();

        const machines = await Machine.find().sort({ createdAt: -1 });

        return NextResponse.json(machines);
    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching machines" },
            { status: 500 }
        );
    }
}



// CREATE MACHINE
export async function POST(req) {
    try {
        await connectToDatabase();

        const body = await req.json();

        const machine = await Machine.create(body);

        return NextResponse.json(machine, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}



// UPDATE MACHINE
export async function PUT(req) {
    try {
        await connectToDatabase();

        const body = await req.json();

        const machine = await Machine.findByIdAndUpdate(
            body.id,
            body,
            { new: true }
        );

        return NextResponse.json(machine);
    } catch (error) {
        return NextResponse.json(
            { message: "Update failed" },
            { status: 500 }
        );
    }
}



// DELETE MACHINE
export async function DELETE(req) {
    try {
        await connectToDatabase();

        const { id } = await req.json();

        await Machine.findByIdAndDelete(id);

        return NextResponse.json({
            message: "Machine deleted"
        });

    } catch (error) {
        return NextResponse.json(
            { message: "Delete failed" },
            { status: 500 }
        );
    }
}