'use client';
import { useState, useEffect } from "react";

const AVATAR_COLORS = ["bg-teal-500", "bg-purple-500", "bg-blue-500", "bg-amber-500", "bg-indigo-500", "bg-emerald-500", "bg-rose-500", "bg-cyan-500"];

function getAvatarColor(name) {
    return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function initials(name) {
    return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function Avatar({ name, size = "md" }) {
    const sizeClass = size === "lg" ? "w-14 h-14 text-xl" : size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
    return (
        <div className={`${sizeClass} ${getAvatarColor(name)} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}>
            {initials(name)}
        </div>
    );
}

// ── Skeleton components ──────────────────────────────────────────────────────

function SkeletonBlock({ className }) {
    return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

function SidebarSkeleton() {
    return (
        <div className="flex flex-col gap-1 py-2 px-2">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
                    <SkeletonBlock className="w-8 h-8 rounded-full shrink-0" />
                    <div className="flex-1 flex flex-col gap-1.5">
                        <SkeletonBlock className="h-3 w-3/4" />
                        <SkeletonBlock className="h-2.5 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function DoctorCardSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <SkeletonBlock className="w-14 h-14 rounded-full shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                    <SkeletonBlock className="h-5 w-48" />
                    <SkeletonBlock className="h-3.5 w-28" />
                    <SkeletonBlock className="h-5 w-24 rounded-full" />
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[...Array(3)].map((_, i) => <SkeletonBlock key={i} className="h-4 w-36" />)}
            </div>
        </div>
    );
}

function PatientRowSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-3 px-4 py-3">
                <SkeletonBlock className="w-8 h-8 rounded-full shrink-0" />
                <div className="flex-1 flex flex-col gap-1.5">
                    <SkeletonBlock className="h-3 w-36" />
                    <SkeletonBlock className="h-2.5 w-24" />
                </div>
                <SkeletonBlock className="h-5 w-16 rounded-full hidden sm:block" />
            </div>
        </div>
    );
}

// ── Spinner ──────────────────────────────────────────────────────────────────

function Spinner({ size = "sm", color = "teal" }) {
    const s = size === "sm" ? "w-4 h-4" : "w-5 h-5";
    const c = color === "white" ? "border-white/30 border-t-white" : "border-teal-200 border-t-teal-500";
    return <div className={`${s} border-2 ${c} rounded-full animate-spin shrink-0`} />;
}

// ── Shared UI ────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h2 className="text-gray-800 font-semibold text-lg">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                </div>
                {children}
            </div>
        </div>
    );
}

function FormField({ label, type = "text", value, onChange, children }) {
    return (
        <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</span>
            {children ?? (
                <input
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100"
                />
            )}
        </label>
    );
}

// ── Doctor Form — specialty is a plain text input ────────────────────────────

function DoctorForm({ initial = {}, onSave, onCancel, saving }) {
    const isEdit = !!initial.name;
    const [form, setForm] = useState({
        name: initial.name || "",
        specialty: initial.specialty || "",
        email: initial.email || "",
        phone: initial.phone || "",
        hospitalName: initial.hospitalName || "",
    });
    const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

    return (
        <div className="p-6 flex flex-col gap-4">
            <FormField label="Full Name" value={form.name} onChange={set("name")} />
            <FormField label="Specialty" value={form.specialty} onChange={set("specialty")} />
            <FormField label="Email" type="email" value={form.email} onChange={set("email")} />
            <FormField label="Phone" type="tel" value={form.phone} onChange={set("phone")} />
            <FormField label="hospitalName" value={form.hospitalName} onChange={set("hospitalName")} />
            <div className="flex justify-end gap-3 pt-2">
                <button
                    onClick={onCancel}
                    disabled={saving}
                    className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                >Cancel</button>
                <button
                    onClick={() => onSave(form)}
                    disabled={!form.name || saving}
                    className="px-4 py-2 text-sm bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-40 font-medium flex items-center gap-2 min-w-[80px] justify-center"
                >
                    {saving ? <><Spinner size="sm" color="white" />{isEdit ? "Updating..." : "Saving..."}</> : (isEdit ? "Update" : "Save")}
                </button>
            </div>
        </div>
    );
}

// ── Patient Form ─────────────────────────────────────────────────────────────

function PatientForm({ initial = {}, onSave, onCancel, saving }) {
    const isEdit = !!initial.name;
    const [form, setForm] = useState({
        name: initial.name || "",
        age: initial.age || "",
        // gender: initial.gender || GENDERS[0],
        condition: initial.condition || "",
        phone: initial.phone || "",
        email: initial.email || "",
        since: initial.since || new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    });
    const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

    return (
        <div className="p-6 flex flex-col gap-4">
            <FormField label="Full Name" value={form.name} onChange={set("name")} />
            <div className="grid grid-cols-2 gap-4">
                <FormField label="Age" type="number" value={form.age} onChange={set("age")} />
                {/* <FormField label="Gender">
                    <select value={form.gender} onChange={e => set("gender")(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-teal-400">
                        {GENDERS.map(g => <option key={g}>{g}</option>)}
                    </select>
                </FormField> */}
            </div>
            <FormField label="Condition / Diagnosis" value={form.condition} onChange={set("condition")} />
            <FormField label="Phone" type="tel" value={form.phone} onChange={set("phone")} />
            <FormField label="Email" type="email" value={form.email} onChange={set("email")} />
            <div className="flex justify-end gap-3 pt-2">
                <button
                    onClick={onCancel}
                    disabled={saving}
                    className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                >Cancel</button>
                <button
                    onClick={() => onSave(form)}
                    disabled={!form.name || saving}
                    className="px-4 py-2 text-sm bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-40 font-medium flex items-center gap-2 min-w-[80px] justify-center"
                >
                    {saving ? <><Spinner size="sm" color="white" />{isEdit ? "Updating..." : "Saving..."}</> : (isEdit ? "Update" : "Save")}
                </button>
            </div>
        </div>
    );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function DoctorPatientManager() {
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [expandedPatient, setExpandedPatient] = useState(null);
    const [showDoctorForm, setShowDoctorForm] = useState(false);
    const [showPatientForm, setShowPatientForm] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [editingPatient, setEditingPatient] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const [loadingPatients, setLoadingPatients] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null); // id of item currently being deleted

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoadingDoctors(true);
            const res = await fetch("/api/doctors", {
                headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }
            });
            const data = await res.json();
            const formatted = data.map(d => ({
                id: d._id,
                name: d.name,
                specialty: d.specialization,
                email: d.email,
                phone: d.phone,
                hospitalName: d.hospitalName
            }));
            setDoctors(formatted);
            if (formatted.length > 0) {
                setSelectedDoctor(formatted[0]);
                fetchPatientsByDoctor(formatted[0].id);
            }
        } catch (err) {
            console.error("Fetch doctors error:", err);
        } finally {
            setLoadingDoctors(false);
        }
    };

    const fetchPatientsByDoctor = async (doctorId) => {
        try {
            setLoadingPatients(true);
            setPatients([]);
            const res = await fetch(`/api/doctors/${doctorId}`, {
                headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }
            });
            const data = await res.json();

            // console.log(data);



            const formatted = data.map(p => ({
                id: p._id,
                name: p.name,
                age: p.age,
                // gender: p.gender,
                address: p.address,
                phone: p.phone,
                altPhone: p.altPhone,
                whatsapp: p.whatsapp,
                securityAmount: p.securityAmount,
                since: p.since,
                doctorId: p.refDoctor,
                advancePaidAmount: p.advancePaidAmount,
                grandTotal: p.grandTotal,
                paymentType: p.paymentType,


                monthlyRent: p.monthlyRent, // <-- keep the whole array
                createdAt: p.createdAt,
                updatedAt: p.updatedAt
            }));
            setPatients(formatted);
        } catch (err) {
            console.error("Fetch patients error:", err);
        } finally {
            setLoadingPatients(false);
        }
    };

    const doctorPatients = patients;

    const saveDoctor = async (form) => {
        try {
            setSaving(true);
            if (editingDoctor) {
                await fetch("/api/doctors", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
                    body: JSON.stringify({ id: editingDoctor.id, name: form.name, email: form.email, phone: form.phone, specialization: form.specialty, hospitalName: form.hospitalName })
                });
            } else {
                await fetch("/api/doctors", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
                    body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, specialization: form.specialty, hospitalName: form.hospitalName })
                });
            }
            await fetchDoctors();
            setShowDoctorForm(false);
            setEditingDoctor(null);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const deleteDoctor = async (id) => {
        try {
            setDeletingId(id);
            await fetch("/api/doctors", {
                method: "DELETE",
                headers: { "Content-Type": "application/json", "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
                body: JSON.stringify({ id })
            });
            if (selectedDoctor?.id === id) { setSelectedDoctor(null); setPatients([]); }
            await fetchDoctors();
            setConfirmDelete(null);
        } catch (err) {
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    const savePatient = async (form) => {
        try {
            setSaving(true);
            if (editingPatient) {
                await fetch(`/api/patients/${editingPatient.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
                    body: JSON.stringify({ ...form })
                });
            } else {
                await fetch("/api/patients", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
                    body: JSON.stringify({ ...form, refDoctor: selectedDoctor.id })
                });
            }
            await fetchPatientsByDoctor(selectedDoctor.id);
            setShowPatientForm(false);
            setEditingPatient(null);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const deletePatient = async (id) => {
        try {
            setDeletingId(id);
            await fetch(`/api/patients/${id}`, {
                method: "DELETE",
                headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }
            });
            await fetchPatientsByDoctor(selectedDoctor.id);
            setConfirmDelete(null);
        } catch (err) {
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    const selectDoctor = (doc) => {
        setSelectedDoctor(doc);
        setExpandedPatient(null);
        setSidebarOpen(false);
        fetchPatientsByDoctor(doc.id);
    };

    return (
        <div className="bg-gray-50 min-h-screen text-gray-800 flex flex-col">

            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 shadow-sm">
                <div className="flex items-center gap-3">
                    <button className="sm:hidden text-gray-400 hover:text-gray-700 mr-1" onClick={() => setSidebarOpen(o => !o)}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="w-7 h-7 bg-teal-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow">M</div>
                    <span className="font-semibold text-gray-800 text-sm sm:text-base">MedPanel</span>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                    <div className="text-center">
                        {loadingDoctors
                            ? <div className="flex justify-center pb-0.5"><Spinner /></div>
                            : <div className="text-teal-600 font-bold text-base sm:text-lg leading-none">{doctors.length}</div>
                        }
                        <div className="text-gray-400 text-xs uppercase tracking-wide mt-0.5">Doctors</div>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div className="text-center">
                        {loadingPatients
                            ? <div className="flex justify-center pb-0.5"><Spinner /></div>
                            : <div className="text-teal-600 font-bold text-base sm:text-lg leading-none">{patients.length}</div>
                        }
                        <div className="text-gray-400 text-xs uppercase tracking-wide mt-0.5">Patients</div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">

                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-black/30 z-20 sm:hidden" onClick={() => setSidebarOpen(false)} />
                )}

                {/* Sidebar */}
                <aside className={`
                    fixed sm:static z-30 sm:z-auto top-0 left-0 h-full sm:h-auto
                    w-72 sm:w-64 lg:w-72
                    bg-white border-r border-gray-200 shadow-sm
                    flex flex-col
                    transition-transform duration-200
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
                `}>
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
                        <span className="text-sm font-semibold text-gray-700">Doctors</span>
                        <button
                            onClick={() => { setEditingDoctor(null); setShowDoctorForm(true); }}
                            className="text-xs bg-teal-50 text-teal-600 border border-teal-200 px-3 py-1 rounded-full hover:bg-teal-100 font-medium"
                        >+ Add</button>
                    </div>
                    <div className="flex-1 overflow-y-auto py-2 px-2">
                        {loadingDoctors ? <SidebarSkeleton /> : doctors.map(doc => (
                            <div
                                key={doc.id}
                                onClick={() => selectDoctor(doc)}
                                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer mb-1 transition-colors
                                    ${selectedDoctor?.id === doc.id
                                        ? "bg-teal-50 border border-teal-200"
                                        : "hover:bg-gray-50 border border-transparent"}`}
                            >
                                <Avatar name={doc.name} size="sm" />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-800 truncate">{doc.name}</div>
                                    <div className="text-xs text-gray-400 truncate">{doc.specialty}</div>
                                </div>
                                {/* Show spinner on the doctor being deleted, otherwise show edit/delete */}
                                {deletingId === doc.id ? (
                                    <Spinner />
                                ) : (
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            className="text-gray-400 hover:text-blue-500 px-1 text-xs"
                                            onClick={e => { e.stopPropagation(); setEditingDoctor(doc); setShowDoctorForm(true); }}
                                        >✎</button>
                                        <button
                                            className="text-gray-400 hover:text-red-500 px-1 text-xs"
                                            onClick={e => { e.stopPropagation(); setConfirmDelete({ type: "doctor", id: doc.id, name: doc.name }); }}
                                        >✕</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 overflow-y-auto">
                    {selectedDoctor ? (
                        <div className="p-4 sm:p-6 max-w-4xl mx-auto">

                            {/* Doctor detail card */}
                            {loadingPatients ? <DoctorCardSkeleton /> : (
                                <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 mb-6 shadow-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <Avatar name={selectedDoctor.name} size="lg" />
                                        <div className="flex-1 min-w-0">
                                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{selectedDoctor.name}</h1>
                                            <p className="text-teal-600 text-sm mt-0.5 font-medium">{selectedDoctor.specialty}</p>
                                            {selectedDoctor.hospitalName && (
                                                <span className="inline-block mt-2 text-xs bg-teal-50 text-teal-700 border border-teal-200 px-3 py-0.5 rounded-full font-medium">
                                                    {selectedDoctor.hospitalName}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {[["📧", selectedDoctor.email], ["📞", selectedDoctor.phone], ["🧑‍⚕️", `${doctorPatients.length} referred patient${doctorPatients.length !== 1 ? "s" : ""}`]].map(([icon, val]) => val && (
                                            <div key={val} className="flex items-center gap-2 text-sm text-gray-500">
                                                <span>{icon}</span><span className="truncate">{val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}


                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-base font-semibold text-gray-700">Referred Patients</h2>
                                    {loadingPatients && <Spinner />}
                                </div>

                                {loadingPatients ? (
                                    <div className="flex flex-col gap-3">
                                        {[...Array(4)].map((_, i) => <PatientRowSkeleton key={i} />)}
                                    </div>
                                ) : doctorPatients.length === 0 ? (
                                    <div className="text-center py-16 text-gray-400 italic text-sm bg-white rounded-2xl border border-dashed border-gray-200">
                                        No patients referred yet.
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {doctorPatients.map(p => (
                                            <div key={p.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                                {/* Patient summary row */}
                                                <div
                                                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                                                    onClick={() => setExpandedPatient(expandedPatient === p.id ? null : p.id)}
                                                >
                                                    <Avatar name={p.name} size="sm" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-medium text-gray-800 truncate">{p.name}</div>
                                                        <div className="text-xs text-gray-400 truncate">{p.condition}</div>
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <span className="hidden sm:inline text-xs text-gray-900 bg-gray-100 px-2 py-0.5 rounded-full">₹ {p.grandTotal}</span>
                                                        {/* {deletingId === p.id ? <Spinner /> : (
                                                            <>
                                                                <button
                                                                    className="text-gray-300 hover:text-blue-400 text-xs px-1"
                                                                    onClick={e => { e.stopPropagation(); setEditingPatient(p); setShowPatientForm(true); }}
                                                                >✎</button>
                                                                <button
                                                                    className="text-gray-300 hover:text-red-400 text-xs px-1"
                                                                    onClick={e => { e.stopPropagation(); setConfirmDelete({ type: "patient", id: p.id, name: p.name }); }}
                                                                >✕</button>
                                                            </>
                                                        )} */}
                                                        <svg className={`w-4 h-4 text-gray-400 transition-transform ${expandedPatient === p.id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                {/* Expanded details */}
                                                {expandedPatient === p.id && (
                                                    <div className="px-4 pb-4 pt-1 border-t border-gray-100 bg-gray-50">
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 mt-2">
                                                            {[
                                                                ["Age", p.age],
                                                                // ["Gender", p.gender],
                                                                ["Address", p.address],
                                                                ["Phone", p.phone],
                                                                ["Alternative Phone", p.altPhone],
                                                                ["whatsapp", p.whatsapp],
                                                                // ["Referred Since", p.since],
                                                                ["Security Amount Paid", p.securityAmount],
                                                                ["Grand Total", p.grandTotal],
                                                                ["Payment Type", p.paymentType],

                                                            ].map(([k, v]) => (
                                                                <div key={k}>
                                                                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-0.5 font-medium">{k}</div>
                                                                    <div className="text-sm text-gray-700">{v}</div>
                                                                </div>
                                                            ))}

                                                            {/* Monthly Rent as mini-table */}
                                                            {p.monthlyRent?.length > 0 && (
                                                                <div className="col-span-2 sm:col-span-3">
                                                                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-1 font-medium">Monthly Rent</div>
                                                                    <table className="text-sm text-gray-700 w-full border border-gray-200 rounded-lg overflow-hidden">
                                                                        <thead className="bg-gray-100 text-gray-500 text-xs uppercase">
                                                                            <tr>
                                                                                <th className="px-2 py-1 border-b border-gray-200 text-left">Month</th>
                                                                                <th className="px-2 py-1 border-b border-gray-200 text-right">Amount</th>
                                                                                <th className="px-2 py-1 border-b border-gray-200 text-left">Status</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {p.monthlyRent.map(m => (
                                                                                <tr key={m._id} className="odd:bg-white even:bg-gray-50">
                                                                                    <td className="px-2 py-1">{m.month}</td>
                                                                                    <td className="px-2 py-1 text-right">{m.amount}</td>
                                                                                    <td className="px-2 py-1">{m.status}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            )}

                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 italic text-sm">
                            Select a doctor to view details
                        </div>
                    )}
                </main>
            </div>

            {/* Doctor Form Modal */}
            {showDoctorForm && (
                <Modal title={editingDoctor ? "Edit Doctor" : "Add Doctor"} onClose={() => { if (!saving) { setShowDoctorForm(false); setEditingDoctor(null); } }}>
                    <DoctorForm initial={editingDoctor || {}} onSave={saveDoctor} onCancel={() => { setShowDoctorForm(false); setEditingDoctor(null); }} saving={saving} />
                </Modal>
            )}

            {/* Patient Form Modal */}
            {showPatientForm && (
                <Modal title={editingPatient ? "Edit Patient" : "Refer New Patient"} onClose={() => { if (!saving) { setShowPatientForm(false); setEditingPatient(null); } }}>
                    <PatientForm initial={editingPatient || {}} onSave={savePatient} onCancel={() => { setShowPatientForm(false); setEditingPatient(null); }} saving={saving} />
                </Modal>
            )}

            {/* Confirm Delete Modal */}
            {confirmDelete && (
                <Modal title="Confirm Delete" onClose={() => { if (!deletingId) setConfirmDelete(null); }}>
                    <div className="p-6 flex flex-col gap-4">
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Are you sure you want to delete <strong className="text-gray-900">{confirmDelete.name}</strong>?
                            {confirmDelete.type === "doctor" && <span className="text-amber-600"> All their referred patients will also be removed.</span>}
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                disabled={!!deletingId}
                                className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                            >Cancel</button>
                            <button
                                onClick={() => confirmDelete.type === "doctor" ? deleteDoctor(confirmDelete.id) : deletePatient(confirmDelete.id)}
                                disabled={!!deletingId}
                                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium flex items-center gap-2 min-w-[90px] justify-center disabled:opacity-60"
                            >
                                {deletingId ? <><Spinner size="sm" color="white" />Deleting...</> : "Delete"}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}