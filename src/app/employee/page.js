"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, History, LogOut, CheckCircle2, Clock, Wrench, View } from "lucide-react";
import HistoryView from "./HistoryView";
import PatientForm from "../form/page";
import PatientsTable from "@/components/Dashboard/Tabs/Dashboard";

export default function EmployeePage() {
    const router = useRouter();
    const [tab, setTab] = useState("new");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) { router.replace("/login"); return; }
            try {
                const res = await fetch("/api/auth/verify-token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
                    },
                });
                const data = await res.json();
                if (!data.success || data.user.role !== "employee") {
                    localStorage.removeItem("token");
                    router.replace("/login");
                    return;
                }
                setUser(data.user);
            } catch {
                localStorage.removeItem("token");
                router.replace("/login");
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.replace("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                        <Wrench size={18} className="text-blue-400 animate-pulse" />
                    </div>
                    <p className="text-slate-400 text-sm font-medium tracking-wide">Verifying session…</p>
                </div>
            </div>
        );
    }

    const nameInitials = (user?.name || user?.email || "??").split(/[\s@]/).filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const greeting = (() => {
        const h = new Date().getHours();
        if (h < 12) return "Good morning";
        if (h < 17) return "Good afternoon";
        return "Good evening";
    })();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">


            {/* ── Hero Header ── */}
            <header className="bg-slate-900 text-white">
                <div className="px-4 pt-5 pb-6 max-w-2xl mx-auto">
                    <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-900/40">
                                {nameInitials}
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs font-medium tracking-wide">{greeting}</p>
                                <h1 className="text-white font-semibold text-base leading-tight">{user?.name || user?.email?.split("@")[0] || "—"}</h1>
                                <p className="text-slate-500 text-[11px] mt-0.5 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">

                            <button
                                onClick={handleLogout}
                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                title="Logout"
                            >
                                <LogOut size={15} />
                            </button>
                        </div>
                    </div>


                </div>
            </header>

            {/* ── Tab bar ── */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                <div className="max-w-2xl mx-auto px-4 flex gap-1 py-2">
                    {[
                        { key: "new", label: "New Records", Icon: ClipboardList },
                        { key: "history", label: "History", Icon: History },
                        { key: 'dashboard', label: "Dashboard", Icon: View }
                    ].map(({ key, label, Icon }) => (
                        <button
                            key={key}
                            onClick={() => setTab(key)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === key
                                ? "bg-slate-900 text-white shadow-sm"
                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                                }`}
                        >
                            <Icon size={15} />
                            <span className="hidden xs:inline sm:inline capitalize">{label}</span>
                            <span className="inline xs:hidden sm:hidden capitalize">{key}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Content ── */}
            <div className="flex-1 px-4 py-5 max-w-9xl mx-auto w-full">

                {tab === "new" && (
                    <div className="card-enter">
                        <PatientForm user={user} />
                    </div>
                )}

                {tab === "history" && (
                    <div className="card-enter">
                        <HistoryView user={user} />
                    </div>
                )}

                {tab === "dashboard" && (
                    <div className="card-enter">
                        <PatientsTable user={user} />
                    </div>
                )}
            </div>
        </div>
    );
}