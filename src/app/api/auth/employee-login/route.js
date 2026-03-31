import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Employee from "@/models/Employee";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        await connectToDatabase();

        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // find employee (include password)
        const employee = await Employee.findOne({ email, isDeleted: false }).select("+password");

        if (!employee) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // check password
        const isMatch = await bcrypt.compare(password, employee.password);

        if (!isMatch) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // create JWT
        const token = jwt.sign(
            {
                id: employee._id,
                role: "employee",
                email: employee.email,
                name: employee.name
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return NextResponse.json({
            message: "Login successful",
            token,
            role: "employee",
            user: {
                id: employee._id,
                name: employee.name,
                email: employee.email,
                status: employee.status,
            },
        });

    } catch (error) {
        console.error("Employee Login Error:", error);

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}