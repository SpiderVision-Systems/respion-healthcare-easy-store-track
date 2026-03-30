import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ success: false, message: "No token" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!["Admin1", "employee"].includes(decoded.role)) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            user: decoded, // contains id, role, etc.
        });
    } catch (err) {
        // console.log(err);
        return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }
}
