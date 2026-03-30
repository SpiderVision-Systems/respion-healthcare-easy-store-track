import connectToDatabase from "@/lib/DB_CONNECTION";
import Employee from "@/models/Employee";

import bcrypt from "bcrypt";

// GET /api/employees
export async function GET(req) {
    try {
        await connectToDatabase();
        const employees = await Employee.find();
        return new Response(JSON.stringify(employees), { status: 200 });
    } catch (error) {
        console.error("GET Employees Error:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch employees" }), { status: 500 });
    }
}

// POST /api/employees
// export async function POST(req) {
//     try {
//         await connectToDatabase();
//         const body = await req.json();
//         const { name, phone, email, password, status, role } = body;

//         const employee = new Employee({ name, phone, email, password, status, role });
//         await employee.save();

//         return new Response(JSON.stringify(employee), { status: 201 });
//     } catch (error) {
//         console.error("POST Employee Error:", error);
//         return new Response(JSON.stringify({ error: "Failed to create employee" }), { status: 500 });
//     }
// }



export async function POST(req) {
    try {
        await connectToDatabase();

        const body = await req.json();
        const { name, phone, email, password, status, role } = body;

        if (!password) {
            return new Response(
                JSON.stringify({ error: "Password is required" }),
                { status: 400 }
            );
        }

        // 🔐 hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const employee = new Employee({
            name,
            phone,
            email,
            password: hashedPassword, // ✅ store hashed password
            status,
            role,
        });

        await employee.save();

        // optional: hide password in response
        const safeEmployee = employee.toObject();
        delete safeEmployee.password;

        return new Response(JSON.stringify(safeEmployee), { status: 201 });

    } catch (error) {
        console.error("POST Employee Error:", error);

        return new Response(
            JSON.stringify({ error: "Failed to create employee" }),
            { status: 500 }
        );
    }
}

// PUT /api/employees
export async function PUT(req) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const { id, ...updateData } = body;

        if (!id) return new Response(JSON.stringify({ error: "Employee ID required" }), { status: 400 });

        const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedEmployee) return new Response(JSON.stringify({ error: "Employee not found" }), { status: 404 });

        return new Response(JSON.stringify(updatedEmployee), { status: 200 });
    } catch (error) {
        console.error("PUT Employee Error:", error);
        return new Response(JSON.stringify({ error: "Failed to update employee" }), { status: 500 });
    }
}

// DELETE /api/employees
export async function DELETE(req) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const { id } = body;

        if (!id) return new Response(JSON.stringify({ error: "Employee ID required" }), { status: 400 });

        const deleted = await Employee.findByIdAndDelete(id);
        if (!deleted) return new Response(JSON.stringify({ error: "Employee not found" }), { status: 404 });

        return new Response(JSON.stringify({ message: "Employee deleted successfully" }), { status: 200 });
    } catch (error) {
        console.error("DELETE Employee Error:", error);
        return new Response(JSON.stringify({ error: "Failed to delete employee" }), { status: 500 });
    }
}