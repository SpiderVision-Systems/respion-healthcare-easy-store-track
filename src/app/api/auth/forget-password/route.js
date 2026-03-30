import connectToDatabase from "@/lib/DB_CONNECTION";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import Admin from "@/models/Admin";
import Otp from "@/models/Otp";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

export const POST = async (req) => {
    try {
        const { email } = await req.json();
        await connectToDatabase();

        if (!email) {
            return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
        }

        let user = await Admin.findOne({ email });

        if (!user) {
            return new Response(JSON.stringify({ error: "Admin not found" }), { status: 404 });
        }

        const otpGenerated = generateOTP();

        const otpRecord = new Otp({
            email,
            otp: otpGenerated.toString(),
        });

        await otpRecord.save();


        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",


            html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 400px; margin: auto;">
            <h2 style="color: #0056b3; text-align: center;">Password Reset Request</h2>
            <p>Hello,</p>
            <p>You have requested to reset your password. Use the OTP below to proceed. This OTP is valid for <strong>2 minutes</strong>.</p>
            <div style="text-align: center; margin: 20px 0;">
                <span style="font-size: 20px; font-weight: bold; color: #fff; background-color: #0056b3; padding: 10px 20px; border-radius: 4px; display: inline-block;">
                    ${otpGenerated}
                </span>
            </div>
            <p>If you did not request a password reset, please ignore this email or contact support immediately.</p>
            <p>Thank you,<br>The Support Team</p>
        </div>
    `,
        };

        try {
            await transporter.sendMail(mailOptions);
            return new Response(JSON.stringify({ message: "OTP sent successfully. It is valid for 2 minutes." }), { status: 200 });
        } catch (err) {
            return new Response(JSON.stringify({ error: "Failed to send OTP" || err }), { status: 500 });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};


export const PUT = async (req) => {
    try {
        const { email, otp } = await req.json();
        await connectToDatabase();

        if (!otp || !email) {
            return new Response(JSON.stringify({ error: "OTP and Email are required" }), { status: 400 });
        }

        const otpRecord = await Otp.findOne({ email })
            .sort({ createdAt: -1 }) // Sort by `createdAt` in descending order
            .exec();

        if (!otpRecord) {
            return new Response(JSON.stringify({ error: "OTP not found" }), { status: 404 });
        }



        // Check if the OTP matches
        if (otpRecord.otp !== otp) {
            return new Response(JSON.stringify({ error: "Invalid OTP" }), { status: 400 });
        }

        return new Response(JSON.stringify({ message: "OTP verified successfully" }), { status: 200 });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};



export const PATCH = async (req) => {
    try {
        const { email, newPassword } = await req.json();
        await connectToDatabase();

        if (!newPassword || !email) {
            return new Response(JSON.stringify({ error: "New password and registration number are required" }), { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Find user in Admin or Teacher model
        const user = await Admin.findOne({ email })

        if (!user) {
            return new Response(JSON.stringify({ error: "Admin not found" }), { status: 404 });
        }

        // Update password
        user.password = hashedPassword;
        await user.save();




        return new Response(JSON.stringify({ message: "Password reset successfully and OTP record deleted" }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
