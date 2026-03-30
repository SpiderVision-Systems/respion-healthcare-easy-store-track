"use client";
import { RefreshCcw, Search, Phone, User } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

// ── Helpers ───────────────────────────────────────────────────────────────────
const AVATAR_BG = ["bg-teal-500", "bg-indigo-500", "bg-rose-500", "bg-amber-500", "bg-sky-500", "bg-violet-500", "bg-emerald-500", "bg-pink-500"];
const avatarBg = n => AVATAR_BG[n.charCodeAt(0) % AVATAR_BG.length];
const initials = n => n.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
const parseDuration = d => {
    if (!d) return "—";
    const [unit, val] = d.split(":");
    if (unit === "d") return `${val} day${Number(val) > 1 ? "s" : ""}`;
    if (unit === "m") return `${val} month${Number(val) > 1 ? "s" : ""}`;
    return d;
};

// ── Atoms ─────────────────────────────────────────────────────────────────────
function Avatar({ name, size = "sm" }) {
    const sz = size === "md" ? "w-10 h-10 text-sm" : "w-8 h-8 text-xs";
    return (
        <div className={`${sz} ${avatarBg(name)} rounded-full flex items-center justify-center text-white font-bold shrink-0 select-none`}>
            {initials(name)}
        </div>
    );
}

function PaymentBadge({ type }) {
    return (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${type === "rent" ? "bg-violet-50 text-violet-700 border-violet-200" : "bg-sky-50 text-sky-700 border-sky-200"}`}>
            {type === "rent" ? "Rent" : "Fully Paid"}
        </span>
    );
}

// ── Mobile Card ───────────────────────────────────────────────────────────────
function MobileCard({ p }) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            {/* Top row */}
            <div className="flex items-center gap-3 mb-3">
                <Avatar name={p.name} size="md" />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-gray-800 truncate">{p.name}</p>
                        <PaymentBadge type={p.paymentType} />
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        {p.phone && <span className="flex items-center gap-1 text-xs text-gray-400"><Phone size={10} />{p.phone}</span>}
                        {p.age && <span className="flex items-center gap-1 text-xs text-gray-400"><User size={10} />{p.age} yrs</span>}
                    </div>
                    {p.altPhone && <p className="text-xs text-gray-400 mt-0.5">Alt: {p.altPhone}</p>}
                    {p.whatsapp && p.whatsapp !== p.phone && <p className="text-xs text-gray-400">WA: {p.whatsapp}</p>}
                </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
                {(p.refDoctor?.name || p.otherSource) && (
                    <div className="bg-slate-50 rounded-xl px-3 py-2">
                        <p className="text-gray-400 mb-0.5">🩺 Referred By</p>
                        <p className="font-semibold text-gray-700 truncate">{p.refDoctor?.name || p.otherSource}</p>
                    </div>
                )}
                {p.refMachine?.name && (
                    <div className="bg-slate-50 rounded-xl px-3 py-2">
                        <p className="text-gray-400 mb-0.5">⚙️ Machine</p>
                        <p className="font-semibold text-gray-700 truncate">{p.refMachine.name}</p>
                        {p.refMachine.serialNumber && <p className="text-gray-400 font-mono text-[10px] truncate">{p.refMachine.serialNumber}</p>}
                    </div>
                )}
                {(p.refEmployee?.name || p.otherEmployee) && (
                    <div className="bg-slate-50 rounded-xl px-3 py-2">
                        <p className="text-gray-400 mb-0.5">👤 Installed By</p>
                        <p className="font-semibold text-gray-700 truncate">{p.refEmployee?.name || p.otherEmployee}</p>
                    </div>
                )}
                {p.duration && (
                    <div className="bg-slate-50 rounded-xl px-3 py-2">
                        <p className="text-gray-400 mb-0.5">⏱ Duration</p>
                        <p className="font-semibold text-gray-700">{parseDuration(p.duration)}</p>
                    </div>
                )}
                {p.startDate && (
                    <div className="bg-slate-50 rounded-xl px-3 py-2">
                        <p className="text-gray-400 mb-0.5">📆 Start Date</p>
                        <p className="font-semibold text-gray-700">{fmtDate(p.startDate)}</p>
                    </div>
                )}
                {p.address && (
                    <div className="bg-slate-50 rounded-xl px-3 py-2 col-span-2">
                        <p className="text-gray-400 mb-0.5">📍 Address</p>
                        <p className="font-semibold text-gray-700 line-clamp-2">{p.address}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Desktop Table Row ─────────────────────────────────────────────────────────
function TableRow({ p, i }) {
    return (
        <tr className="hover:bg-slate-50/70 transition-colors border-b border-gray-50 last:border-0">
            <td className="px-4 py-3 text-xs text-gray-400 font-mono">{i + 1}</td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                    <Avatar name={p.name} />
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate max-w-[140px]">{p.name}</p>
                        <PaymentBadge type={p.paymentType} />
                    </div>
                </div>
            </td>
            <td className="px-4 py-3">
                <p className="text-sm text-gray-700 whitespace-nowrap">{p.phone || "—"}</p>
                {p.altPhone && <p className="text-xs text-gray-400">Alt: {p.altPhone}</p>}
                {p.whatsapp && p.whatsapp !== p.phone && <p className="text-xs text-gray-400">WA: {p.whatsapp}</p>}
            </td>
            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{p.age ? `${p.age} yrs` : "—"}</td>
            <td className="px-4 py-3 text-sm text-gray-600 max-w-[130px]">
                <p className="truncate">{p.refDoctor?.name || p.otherSource || "—"}</p>
            </td>
            <td className="px-4 py-3">
                <p className="text-sm text-gray-700 font-medium truncate max-w-[120px]">{p.refMachine?.name || "—"}</p>
                {p.refMachine?.serialNumber && <p className="text-xs font-mono text-gray-400">{p.refMachine.serialNumber}</p>}
            </td>
            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{p.refEmployee?.name || p.otherEmployee || "—"}</td>
            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{parseDuration(p.duration)}</td>
            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{fmtDate(p.startDate)}</td>
            <td className="px-4 py-3 text-sm text-gray-500 max-w-[180px]">
                <p className="truncate" title={p.address}>{p.address || "—"}</p>
            </td>
        </tr>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const HEADERS = ["#", "Patient", "Phone", "Age", "Referred By", "Machine", "Installed By", "Duration", "Start Date", "Address"];

export default function PatientOverview() {
    const [search, setSearch] = useState("");
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        async function fetchPatients() {
            setLoading(true);
            try {
                const res = await fetch("/api/patients", {
                    headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
                });
                if (!res.ok) throw new Error("Failed");
                setPatients(await res.json());
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchPatients();
    }, [refresh]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return patients;
        return patients.filter(p =>
            p.name?.toLowerCase().includes(q) ||
            p.phone?.includes(q) ||
            p.altPhone?.includes(q) ||
            p.whatsapp?.includes(q) ||
            p.address?.toLowerCase().includes(q) ||
            p.refDoctor?.name?.toLowerCase().includes(q) ||
            p.otherSource?.toLowerCase().includes(q) ||
            p.refMachine?.name?.toLowerCase().includes(q) ||
            p.refEmployee?.name?.toLowerCase().includes(q) ||
            p.otherEmployee?.toLowerCase().includes(q)
        );
    }, [patients, search]);

    const isEmpty = !loading && filtered.length === 0;

    return (
        <div className="min-h-screen bg-slate-50">

            {/* ── Header ── */}
            <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-teal-600 rounded-xl flex items-center justify-center shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900 text-sm leading-tight">Patient Overview</h1>
                                <p className="text-[11px] text-gray-400">{patients.length} total · {filtered.length} shown</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setRefresh(n => n + 1)}
                            disabled={loading}
                            className="flex items-center gap-1.5 text-xs bg-amber-50 border border-amber-300 rounded-xl px-3 py-1.5 hover:bg-amber-100 transition-colors disabled:opacity-50"
                        >
                            <RefreshCcw size={13} className={loading ? "animate-spin" : ""} />
                            <span className="hidden sm:inline">Refresh</span>
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            className="w-full pl-9 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-50 transition-all"
                            placeholder="Search name, phone, machine, doctor, address…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">✕</button>
                        )}
                    </div>
                </div>
            </header>

            {/* ── Content ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

                {search && !loading && (
                    <p className="text-xs text-slate-400 mb-3">
                        {filtered.length} result{filtered.length !== 1 ? "s" : ""} for <span className="font-semibold text-slate-600">"{search}"</span>
                    </p>
                )}

                {/* ── Empty state ── */}
                {isEmpty && (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <Search size={28} className="mx-auto mb-2 text-gray-300" />
                        <p className="text-sm font-medium text-gray-500">
                            {search ? `No results for "${search}"` : "No patients found"}
                        </p>
                        {search && (
                            <button onClick={() => setSearch("")} className="mt-2 text-xs text-teal-600 font-semibold hover:underline">
                                Clear search
                            </button>
                        )}
                    </div>
                )}

                {/* ── Mobile cards (< lg) ── */}
                {!isEmpty && (
                    <div className="flex flex-col gap-3 lg:hidden">
                        {loading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 animate-pulse">
                                    <div className="flex gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                                        <div className="flex-1 space-y-2 pt-1">
                                            <div className="h-3 bg-gray-200 rounded w-2/5" />
                                            <div className="h-2 bg-gray-100 rounded w-1/3" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[1, 2, 3, 4].map(j => <div key={j} className="h-12 bg-gray-100 rounded-xl" />)}
                                    </div>
                                </div>
                            ))
                            : filtered.map(p => <MobileCard key={p._id} p={p} />)
                        }
                    </div>
                )}

                {/* ── Desktop table (lg+) ── */}
                {!isEmpty && (
                    <div className="hidden lg:block bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm min-w-[900px]">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-gray-100">
                                        {HEADERS.map((h, i) => (
                                            <th key={h} className={`text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3 whitespace-nowrap ${i === 0 ? "w-10" : ""}`}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading
                                        ? Array.from({ length: 6 }).map((_, i) => (
                                            <tr key={i} className="animate-pulse border-b border-gray-50">
                                                {HEADERS.map((_, j) => (
                                                    <td key={j} className="px-4 py-3">
                                                        <div className="h-3 bg-gray-100 rounded w-3/4" />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                        : filtered.map((p, i) => <TableRow key={p._id} p={p} i={i} />)
                                    }
                                </tbody>
                            </table>
                        </div>

                        {!loading && filtered.length > 0 && (
                            <div className="border-t border-gray-100 bg-slate-50 px-4 py-2.5 text-xs text-gray-400">
                                {filtered.length} patient{filtered.length !== 1 ? "s" : ""}
                                {search && ` matching "${search}"`}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}