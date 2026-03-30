import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Machine from "@/models/Machine";

export async function GET(request) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const branch = searchParams.get("branch");

        if (!branch) {
            return NextResponse.json(
                { error: "Branch is required" },
                { status: 400 }
            );
        }

        const machines = await Machine.find({
            branch,
            status: "available",
        })
            .select("_id name type serialNumber status branch")
            .lean();

        return NextResponse.json(machines);
    } catch (error) {
        console.error("GET /api/branches/machines error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}