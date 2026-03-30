"use client";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Mail, Lock, GraduationCap, BriefcaseBusiness, ArrowRight, LogOut, ShieldCheck, Eye, EyeOff, User, } from "lucide-react";
import { useRouter } from "next/navigation";
import ForgotPasswordModal from './ForgetPasswordModal'


export default function Login() {
    const router = useRouter();
    const [role, setRole] = useState("installer");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loggedInRole, setLoggedInRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const [forgotModal, setForgotModal] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);

        try {
            // 🔥 decide API based on role
            const apiUrl =
                role === "installer"
                    ? "/api/auth/employee-login"
                    : "/api/auth/login";

            const res = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Login failed");
                setLoading(false);
                return;
            }

            // ✅ store token
            localStorage.setItem("token", data.token);

            // optional: store role
            localStorage.setItem("role", data.role);

            toast.success("Login successful");

            router.replace("/");

        } catch (error) {
            toast.error("Something went wrong");
        }

        setLoading(false);
    };

    if (loggedInRole) {
        return (
            <div className="min-h-screen bg-linear-to-br from-sky-50 via-white to-indigo-50 flex items-center justify-center p-4">
                <Toaster position="top-right" toastOptions={{ style: { fontSize: "13px", borderRadius: "10px" } }} />
                <div className="w-full max-w-sm bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
                        {loggedInRole === "installer" ? (
                            <GraduationCap className="w-9 h-9 text-emerald-500" />
                        ) : (
                            <BriefcaseBusiness className="w-9 h-9 text-emerald-500" />
                        )}
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs text-emerald-600 tracking-widest uppercase font-semibold">Session Active</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-1">Welcome back!</h2>
                    <p className="text-slate-500 text-sm capitalize mb-1">{loggedInRole}</p>
                    <p className="text-slate-400 text-xs font-mono mb-8">{email}</p>
                    <button
                        onClick={() => { setLoggedInRole(null); setEmail(""); setPassword(""); }}
                        className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-800 rounded-xl py-3 text-sm font-medium transition-all duration-200"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gradient-to-br from-sky-200 via-white to-indigo-200 flex items-center justify-center p-4 relative overflow-hidden">
            <Toaster position="top-right" toastOptions={{ style: { fontSize: "13px", borderRadius: "10px" } }} />

            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-200/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="w-full max-w-sm relative z-10">

                {/* Brand */}


                {/* Card */}
                <div className="bg-white rounded-3xl border-2 border-indigo-200 shadow-xl shadow-slate-200/60 p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-500 shadow-lg shadow-sky-300/50 mb-4">
                            <ShieldCheck className="w-7 h-7 text-white" />
                        </div>
                        {/* <h1 className="text-2xl font-bold text-slate-800 tracking-tight">EduPortal</h1> */}
                        <p className="text-slate-400 text-sm mt-1">Sign in to continue</p>
                    </div>
                    {/* Role Switcher */}
                    <div className="flex bg-blue-100 rounded-2xl p-1 mb-7 gap-1">
                        {[
                            { value: "installer", label: "Installer", Icon: User },
                            { value: "Admin1", label: "Super Admin", Icon: BriefcaseBusiness },
                        ].map(({ value, label, Icon }) => (
                            <button
                                key={value}
                                onClick={() => setRole(value)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all duration-200 cursor-pointer ${role === value
                                    ? "bg-white text-sky-600 border border-slate-200 shadow-sm"
                                    : "text-slate-400 hover:text-slate-600"
                                    }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-sky-500 transition-colors duration-200" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 rounded-xl pl-10 pr-4 py-3 text-lg text-slate-700 placeholder-slate-300 outline-none transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Password</label>
                                {role === "Admin1" &&
                                    <button onClick={() => setForgotModal(true)} type="button" className="text-xs text-sky-500 hover:text-sky-600 font-medium transition-colors">
                                        Forgot password?
                                    </button>
                                }
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-sky-500 transition-colors duration-200" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 rounded-xl pl-10 pr-11 py-3 text-lg text-slate-700 placeholder-slate-300 outline-none transition-all duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>



                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold tracking-wide transition-all duration-200 ${loading
                                ? "bg-sky-100 text-sky-400 cursor-not-allowed"
                                : "bg-sky-500 hover:bg-sky-600 active:scale-95 text-white shadow-lg shadow-sky-300/40 hover:shadow-sky-400/50"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>


                </div>


            </div>

            {/* Footer */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                <a
                    href="https://spidervisionsystems.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700 transition"
                >

                    Developed by <span className="font-semibold">SpiderVision Systems</span>
                </a>
            </div>


            <ForgotPasswordModal
                isOpen={forgotModal}
                onClose={() => setForgotModal(false)}
            />
        </div>
    );
}

