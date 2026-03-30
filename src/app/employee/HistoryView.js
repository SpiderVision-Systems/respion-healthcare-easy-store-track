"use client";

import { useEffect, useState } from "react";
import { Package, MapPin, Phone, Calendar, Loader2, PackageCheck, AlertTriangle, ChevronDown, ChevronUp, Star } from "lucide-react";
import UninstallModal from "./UninstallModal";
import RenewalModal from '@/components/Dashboard/RenewModal'

const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
const parseDuration = d => {
    if (!d) return "—";
    const [unit, val] = d.split(":");
    if (unit === "d") return `${val} day${Number(val) > 1 ? "s" : ""}`;
    if (unit === "m") return `${val} month${Number(val) > 1 ? "s" : ""}`;
    return d;
};

// ── Patient Card ──────────────────────────────────────────────────────────────
function PatientCard({ patient, onUninstallSuccess }) {
    const [expanded, setExpanded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [renewTarget, setRenewTarget] = useState(null);


    const paidCount = patient.monthlyRent?.filter(r => r.status === "paid").length || 0;
    const totalCount = patient.monthlyRent?.length || 0;

    return (
        <>
            <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${patient.isReturned ? "border-gray-200 opacity-60" : "border-slate-200"}`}>
                <div className="px-4 pt-4 pb-3">

                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${patient.isReturned ? "bg-gray-100" : "bg-slate-900"}`}>
                            <Package size={16} className={patient.isReturned ? "text-gray-400" : "text-white"} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-sm font-bold text-slate-800 truncate">{patient.name}</h3>
                                {patient.isReturned && (
                                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <PackageCheck size={9} /> Returned
                                    </span>
                                )}
                                {patient.isReturned && patient.reviewGiven === true && (
                                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <Star size={8} className="fill-amber-500 text-amber-500" /> Review given
                                    </span>
                                )}
                                {patient.isReturned && patient.reviewGiven === false && (
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                                        No review
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 truncate">
                                {patient.refMachine?.name || "—"}
                                {patient.refMachine?.serialNumber ? ` · ${patient.refMachine.serialNumber}` : ""}
                            </p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${patient.paymentType === "rent" ? "bg-violet-50 text-violet-700 border-violet-200" : "bg-sky-50 text-sky-700 border-sky-200"}`}>
                            {patient.paymentType === "rent" ? "Rent" : "Fully Paid"}
                        </span>
                    </div>

                    {/* Info rows */}
                    <div className="flex flex-col gap-1.5 mb-3">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Phone size={11} className="text-slate-400 shrink-0" />
                            <span>{patient.phone}</span>
                            {patient.altPhone && <span className="text-slate-400">· Alt: {patient.altPhone}</span>}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <MapPin size={11} className="text-slate-400 shrink-0" />
                            <span className="truncate">{patient.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Calendar size={11} className="text-slate-400 shrink-0" />
                            <span>Installed: {fmtDate(patient.startDate)} · {parseDuration(patient.duration)}</span>
                        </div>
                        {patient.returnDate && (
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <PackageCheck size={11} className="text-slate-400 shrink-0" />
                                <span>Returned: {fmtDate(patient.returnDate)}</span>
                            </div>
                        )}
                    </div>

                    {/* Payment progress */}
                    {patient.paymentType === "rent" && totalCount > 0 && (
                        <div className="mb-3">
                            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                                <span>Rent payments</span>
                                <span className="font-semibold text-slate-600">{paidCount}/{totalCount} paid</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${paidCount === totalCount ? "bg-emerald-500" : "bg-blue-500"}`}
                                    style={{ width: `${totalCount > 0 ? (paidCount / totalCount) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Accessories toggle + Uninstall button */}
                    <div className="flex items-center gap-2">
                        {patient.accessories?.filter(a => a.name?.trim()).length > 0 && (
                            <button
                                onClick={() => setExpanded(e => !e)}
                                className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors"
                            >
                                {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                                Accessories ({patient.accessories.filter(a => a.name?.trim()).length})
                            </button>
                        )}
                        <div className="flex-1" />
                        <button
                            onClick={() => setRenewTarget(patient?._id)}
                            className="flex items-center gap-1.5 text-xs font-bold text-yellow-900 bg-rose-50 border border-rose-200 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-colors"
                        >
                            Renew
                        </button>
                        {!patient.isReturned && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-colors"
                            >
                                <PackageCheck size={12} /> Uninstall
                            </button>
                        )}
                    </div>
                </div>

                {/* Accessories list */}
                {expanded && patient.accessories?.filter(a => a.name?.trim()).length > 0 && (
                    <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Accessories</p>
                        <div className="flex flex-col gap-1">
                            {patient.accessories.filter(a => a.name?.trim()).map((acc, i) => (
                                <div key={acc._id || i} className="flex items-center gap-2 text-xs text-slate-600">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                                    {acc.name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showModal && (
                <UninstallModal
                    patient={patient}
                    onCancel={() => setShowModal(false)}
                    onSuccess={(updated) => {
                        setShowModal(false);
                        onUninstallSuccess(updated);
                    }}
                />
            )}


            {renewTarget && (
                <RenewalModal
                    patientId={renewTarget}
                    onClose={() => setRenewTarget(null)}
                    onSuccess={() => {
                        setRenewTarget(null);

                    }}
                />
            )}
        </>
    );
}

// ── Main HistoryView ──────────────────────────────────────────────────────────
export default function HistoryView({ user }) {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReturned, setShowReturned] = useState(false);

    const fetchPatients = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/employees/installations", {
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to fetch installations");
            const data = await res.json();
            setPatients(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Called by UninstallModal after successful API call
    const handleUninstallSuccess = (updated) => {
        setPatients(prev => prev.map(p => p._id === updated._id ? updated : p));
    };

    useEffect(() => { fetchPatients(); }, []);

    const active = patients.filter(p => !p.isReturned);
    const returned = patients.filter(p => p.isReturned);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 size={24} className="animate-spin text-slate-400" />
                <p className="text-sm text-slate-400">Loading installations…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center">
                    <AlertTriangle size={20} className="text-rose-400" />
                </div>
                <p className="text-sm text-slate-500">{error}</p>
                <button onClick={fetchPatients} className="text-xs text-blue-600 hover:underline font-semibold">Retry</button>
            </div>
        );
    }

    if (patients.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 py-16 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Package size={22} className="text-slate-400" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-semibold text-slate-700">No installations yet</p>
                    <p className="text-xs text-slate-400 mt-1">Machines you install will appear here</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {active.length > 0 && (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-800">Active Installations</h2>
                        <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{active.length}</span>
                    </div>
                    {active.map(p => (
                        <PatientCard key={p._id} patient={p} onUninstallSuccess={handleUninstallSuccess} />
                    ))}
                </div>
            )}

            {returned.length > 0 && (
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => setShowReturned(s => !s)}
                        className="flex items-center justify-between w-full text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            <PackageCheck size={14} className="text-slate-400" />
                            Returned Machines
                            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{returned.length}</span>
                        </span>
                        {showReturned ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {showReturned && returned.map(p => (
                        <PatientCard
                            key={p._id}
                            patient={p}
                            onUninstallSuccess={handleUninstallSuccess} />
                    ))}
                </div>
            )}



        </div>
    );
}