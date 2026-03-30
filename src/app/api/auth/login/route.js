import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectionToDatabase from '@/lib/DB_CONNECTION'
import Admin from "@/models/Admin";

// POST /api/admin/login
export async function POST(req) {
    try {
        await connectionToDatabase();
        const { email, password, name, phone } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email and password are required" },
                { status: 400 }
            );
        }

        // Check if any admin exists
        const existingAdmins = await Admin.find();

        if (existingAdmins.length === 0) {
            // If no admin exists, create the first one
            const hashedPassword = await bcrypt.hash(password, 10);
            const newAdmin = await Admin.create({
                name: name || "Super Admin",
                email,
                phone: phone || 0,
                password: hashedPassword,
                bio: "Super Admin Bio",
                photo: "",
                role: "Admin1",
            });

            // Generate token for new admin
            const token = jwt.sign(
                {
                    id: newAdmin._id,
                    mail: newAdmin.email,
                    role: newAdmin.role
                },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            return NextResponse.json(
                {
                    success: true,
                    message: "Admin account created",
                    token,
                    admin: { id: newAdmin._id, email: newAdmin.email, role: newAdmin.role },
                },
                { status: 201 }
            );
        }

        // If admin exists → login flow
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return NextResponse.json(
                { success: false, message: "Admin not found" },
                { status: 404 }
            );
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Generate token for login
        const token = jwt.sign(
            {
                id: admin._id,
                role: admin.role,
                mail: admin.email,
                photo: admin.photo,
                name: admin.name,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return NextResponse.json(
            {
                success: true,
                message: "Login successful",
                token,
                admin: { id: admin._id, email: admin.email, role: admin.role },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
