"use client";

import { useState } from "react";
import { Loader2, PackageCheck, AlertTriangle, Star } from "lucide-react";

export default function UninstallModal({ patient, onCancel, onSuccess }) {
    const [step, setStep] = useState("confirm"); // "confirm" | "accessories" | "review"
    const [reviewGiven, setReviewGiven] = useState(null);
    const [loading, setLoading] = useState(false);

    const accessories = (patient?.accessories || []).filter(a => a.name?.trim());
    const [collected, setCollected] = useState(() => accessories.map(() => false));

    const toggleCollected = (i) =>
        setCollected(prev => prev.map((v, idx) => idx === i ? !v : v));

    const allCollected = collected.every(Boolean);
    const collectedCount = collected.filter(Boolean).length;

    const STEPS = ["confirm", ...(accessories.length > 0 ? ["accessories"] : []), "review"];
    const stepIdx = STEPS.indexOf(step);
    const goNext = () => setStep(STEPS[stepIdx + 1]);
    const goBack = () => setStep(STEPS[stepIdx - 1]);

    const handleFinalConfirm = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/patients/machine-return/${patient._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
                },
                body: JSON.stringify({ reviewGiven: reviewGiven ?? false }),
            });
            if (!res.ok) throw new Error("Failed to uninstall");
            const updated = await res.json();
            onSuccess(updated); // pass updated patient back to parent
        } catch (err) {
            alert("Failed to uninstall machine: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}
            onClick={onCancel}
        >
            <div
                className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm shadow-2xl flex flex-col max-h-[90dvh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Drag handle (mobile) */}
                <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3 sm:hidden shrink-0" />

                {/* Step progress dots */}
                <div className="flex items-center justify-center gap-1.5 pt-3 pb-1 shrink-0">
                    {STEPS.map((s, i) => (
                        <div
                            key={s}
                            className={`h-1.5 rounded-full transition-all ${i === stepIdx
                                ? "w-5 bg-slate-800"
                                : i < stepIdx
                                    ? "w-1.5 bg-emerald-400"
                                    : "w-1.5 bg-gray-200"
                                }`}
                        />
                    ))}
                </div>

                <div className="p-5 sm:p-6 flex flex-col gap-4 overflow-y-auto">

                    {/* ── Step 1: Confirm ── */}
                    {step === "confirm" && (
                        <>
                            <div className="flex items-start gap-4 p-4 bg-rose-50 rounded-xl border border-rose-100">
                                <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center shrink-0">
                                    <AlertTriangle size={18} className="text-rose-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800">Uninstall machine?</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        This will mark{" "}
                                        <span className="font-semibold text-gray-700">{patient?.refMachine?.name}</span> as returned from{" "}
                                        <span className="font-semibold text-gray-700">{patient?.name}</span>. This cannot be undone.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={onCancel}
                                    className="flex-1 py-2.5 text-sm font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={goNext}
                                    className="flex-1 py-2.5 text-sm font-bold text-white bg-rose-500 rounded-xl hover:bg-rose-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <PackageCheck size={14} /> Next
                                </button>
                            </div>
                        </>
                    )}

                    {/* ── Step 2: Accessories checklist ── */}
                    {step === "accessories" && (
                        <>
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-sm font-bold text-gray-800">Accessories Checklist</h3>
                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${allCollected
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                        : "bg-amber-50 text-amber-600 border-amber-200"
                                        }`}>
                                        {collectedCount}/{accessories.length} collected
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400">Mark each accessory as collected before proceeding</p>
                            </div>

                            <div className="flex flex-col gap-2">
                                {accessories.map((acc, i) => (
                                    <button
                                        key={acc._id || i}
                                        onClick={() => toggleCollected(i)}
                                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 text-left transition-all ${collected[i]
                                            ? "border-emerald-300 bg-emerald-50"
                                            : "border-gray-200 bg-white hover:border-gray-300"
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${collected[i]
                                            ? "border-emerald-500 bg-emerald-500"
                                            : "border-gray-300"
                                            }`}>
                                            {collected[i] && (
                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className={`text-sm font-medium ${collected[i] ? "text-emerald-700 line-through" : "text-gray-700"}`}>
                                            {acc.name}
                                        </span>
                                        {!collected[i] && (
                                            <span className="ml-auto text-[10px] font-bold text-amber-500 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                                                Pending
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {!allCollected && (
                                <div className="flex items-center gap-2 px-3 py-2.5 bg-amber-50 border border-amber-100 rounded-xl">
                                    <AlertTriangle size={13} className="text-amber-500 shrink-0" />
                                    <p className="text-xs text-amber-700 font-medium">
                                        {accessories.length - collectedCount}{" "}
                                        {accessories.length - collectedCount !== 1 ? "accessories" : "accessory"} not yet collected. You can still proceed.
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={goBack}
                                    className="flex-1 py-2.5 text-sm font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={goNext}
                                    className="flex-[2] py-2.5 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors"
                                >
                                    Next →
                                </button>
                            </div>
                        </>
                    )}

                    {/* ── Step 3: Review ── */}
                    {step === "review" && (
                        <>
                            <div className="flex flex-col items-center gap-1 pt-1">
                                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mb-1">
                                    <Star size={22} className="text-amber-500 fill-amber-400" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-800 text-center">
                                    Did the patient give a Google review?
                                </h3>
                                <p className="text-xs text-gray-400 text-center">This helps track our customer feedback</p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setReviewGiven(false)}
                                    className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${reviewGiven === false
                                        ? "border-rose-400 bg-rose-50 text-rose-600"
                                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                                        }`}
                                >
                                    ✗ No
                                </button>
                                <button
                                    onClick={() => setReviewGiven(true)}
                                    className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${reviewGiven === true
                                        ? "border-emerald-400 bg-emerald-50 text-emerald-600"
                                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                                        }`}
                                >
                                    ✓ Yes
                                </button>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={goBack}
                                    className="flex-1 py-2.5 text-sm font-semibold text-gray-400 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleFinalConfirm}
                                    disabled={reviewGiven === null || loading}
                                    className="flex-[2] py-2.5 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
                                >
                                    {loading
                                        ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                                        : <><PackageCheck size={14} /> Confirm Uninstall</>
                                    }
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}