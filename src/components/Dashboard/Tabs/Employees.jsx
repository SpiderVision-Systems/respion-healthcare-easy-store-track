"use client";
import LoadingDots from "@/components/Loading";
import { Pencil } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

const STATUSES = ["Active", "On-Leave", "Inactive"];

const AVATAR_COLORS = [
    ["#4f46e5", "#e0e7ff"], ["#0ea5e9", "#e0f2fe"], ["#10b981", "#d1fae5"],
    ["#f59e0b", "#fef3c7"], ["#ef4444", "#fee2e2"], ["#8b5cf6", "#ede9fe"],
    ["#14b8a6", "#ccfbf1"], ["#ec4899", "#fce7f3"],
];
const avatarColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const initials = (n) => n.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const STATUS_STYLE = {
    Active: { pill: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "#10b981" },
    "On-Leave": { pill: "bg-amber-50 text-amber-700 border border-amber-200", dot: "#f59e0b" },
    Inactive: { pill: "bg-gray-100 text-gray-500 border border-gray-200", dot: "#9ca3af" },
};

// ─── Avatar ──────────────────────────────────────────────────────────────────
function Avatar({ name, size = "md" }) {
    const sz = { lg: "w-12 h-12 text-sm", md: "w-10 h-10 text-xs", sm: "w-8 h-8 text-xs" }[size];
    const [bg, fg] = avatarColor(name);
    return (
        <div
            className={`${sz} rounded-2xl flex items-center justify-center font-bold shrink-0 select-none`}
            style={{ background: bg, color: fg }}
        >
            {initials(name)}
        </div>
    );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
    return (
        <div
            className="fixed inset-0 flex items-end sm:items-center justify-center z-50 sm:p-4"
            style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md max-h-[92dvh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white flex justify-between items-center px-5 py-4 border-b border-gray-100 rounded-t-3xl sm:rounded-t-2xl z-10">
                    {/* drag handle mobile */}
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-200 rounded-full sm:hidden" />
                    <h2 className="font-semibold text-gray-800 text-sm mt-1 sm:mt-0">{title}</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-xl leading-none"
                    >
                        &times;
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

const inputCls =
    "bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all w-full";

function Field({ label, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
            {children}
        </div>
    );
}

// ─── Employee Form ────────────────────────────────────────────────────────────
function EmployeeForm({ initial = {}, onSave, onCancel, saving }) {
    const [form, setForm] = useState({
        name: initial.name || "",
        role: initial.role || "",
        email: initial.email || "",
        phone: initial.phone || "",
        status: initial.status || "Active",
        password: "",
    });
    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
    const isEdit = !!initial._id || !!initial.id;

    return (
        <div className="p-5 sm:p-6 flex flex-col gap-4">
            <Field label="Full Name">
                <input className={inputCls} placeholder="Enter Full Name" value={form.name} onChange={set("name")} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
                <Field label="Role">
                    <input className={inputCls} placeholder="e.g. Technician" value={form.role} onChange={set("role")} />
                </Field>
                <Field label="Status">
                    <select className={inputCls} value={form.status} onChange={set("status")}>
                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                </Field>
            </div>
            <Field label="Email">
                <input className={inputCls} type="email" placeholder="example@gmail.com" value={form.email} onChange={set("email")} />
            </Field>
            <Field label="Phone">
                <input className={inputCls} type="tel" placeholder="9876543210" value={form.phone} onChange={set("phone")} />
            </Field>
            <Field label={isEdit ? "New Password (leave blank to keep)" : "Password"}>
                <input
                    className={inputCls}
                    type="password"
                    placeholder={isEdit ? "••••••••" : "Set a password"}
                    value={form.password}
                    onChange={set("password")}
                />
            </Field>
            <div className="flex gap-3 pt-1">
                <button
                    onClick={onCancel}
                    className="flex-1 py-2.5 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={() => form.name && onSave(form)}
                    disabled={!form.name || saving}
                    className="flex-[2] py-2.5 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-40 font-medium shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                    {saving && <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>}
                    {saving ? "Saving…" : "Save Employee"}
                </button>
            </div>
        </div>
    );
}

// ─── Confirm Delete ───────────────────────────────────────────────────────────
function ConfirmDelete({ name, onConfirm, onCancel, deleting }) {
    return (
        <Modal title="Delete Employee" onClose={onCancel}>
            <div className="p-5 sm:p-6 flex flex-col gap-5">
                <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">Remove <span className="text-red-600">{name}</span>?</p>
                        <p className="text-xs text-gray-500 mt-0.5">This action cannot be undone.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-2.5 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium">Cancel</button>
                    <button
                        onClick={onConfirm}
                        disabled={deleting}
                        className="flex-1 py-2.5 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {deleting && <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>}
                        {deleting ? "Deleting…" : "Delete"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

// ─── Detail row helper ────────────────────────────────────────────────────────
function DetailItem({ icon, label, value, children }) {
    return (
        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3.5 py-3">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-xs text-gray-400 font-medium">{label}</p>
                {children || <p className="text-sm text-gray-700 font-semibold truncate">{value || "—"}</p>}
            </div>
        </div>
    );
}

const iconCls = "w-4 h-4 text-indigo-400";

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EmployeeManager() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [expandedId, setExpandedId] = useState(null);
    const [modal, setModal] = useState(null);
    const [confirmDel, setConfirmDel] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const fetchEmployees = async () => {
        try {
            setLoading(true); setError(null);
            const res = await fetch("/api/employees", { headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY } });
            if (!res.ok) throw new Error("Failed to fetch employees");
            setEmployees(await res.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEmployees(); }, []);

    const saveEmployee = async (form) => {
        setSaving(true);
        try {
            const isEdit = modal && modal !== "add";
            const body = { ...form };
            if (isEdit) body.id = modal._id || modal.id;
            if (!body.password) delete body.password;
            const res = await fetch("/api/employees", {
                method: isEdit ? "PUT" : "POST",
                headers: { "Content-Type": "application/json", "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error("Save failed");
            await fetchEmployees();
            setModal(null);
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    };

    const deleteEmployee = async () => {
        if (!confirmDel) return;
        setDeleting(true);
        try {
            const id = confirmDel._id || confirmDel.id;
            const res = await fetch("/api/employees", {
                method: "DELETE",
                headers: { "Content-Type": "application/json", "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
                body: JSON.stringify({ id }),
            });
            if (!res.ok) throw new Error("Delete failed");
            if (expandedId === id) setExpandedId(null);
            await fetchEmployees();
            setConfirmDel(null);
        } catch (err) {
            alert(err.message);
        } finally {
            setDeleting(false);
        }
    };

    const filtered = useMemo(() =>
        employees.filter((e) => {
            const q = search.toLowerCase();
            return (
                (e.name.toLowerCase().includes(q) || (e.role || "").toLowerCase().includes(q) || (e.email || "").toLowerCase().includes(q)) &&
                (statusFilter === "All" || e.status === statusFilter)
            );
        }),
        [employees, search, statusFilter]
    );

    const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: employees.filter((e) => e.status === s).length }), {});

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">

            {/* ── Sticky Header ── */}
            <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex flex-col gap-3">

                    {/* Top bar: brand + add button */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5M12 12a4 4 0 100-8 4 4 0 000 8z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h1 className="font-bold text-gray-900 text-sm leading-tight">Employees</h1>
                            <p className="text-[11px] text-gray-400">{counts["Active"] ?? 0} active · {counts["On-Leave"] ?? 0} on leave</p>
                        </div>
                        <button
                            onClick={() => setModal("add")}
                            className="flex items-center gap-1.5 bg-indigo-600 text-white text-xs px-3 py-2 rounded-xl hover:bg-indigo-700 transition-colors font-bold shadow-sm shrink-0"
                        >
                            <span className="text-base leading-none">+</span>
                            <span className="hidden sm:inline">Add Employee</span>
                            <span className="sm:hidden">Add</span>
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                        </svg>
                        <input
                            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
                            placeholder="Search name, role, email…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">✕</button>
                        )}
                    </div>

                    {/* Status filter + count */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
                        {["All", ...STATUSES].map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold transition-colors border whitespace-nowrap ${statusFilter === s ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"}`}
                            >
                                {s} <span className={`ml-1 ${statusFilter === s ? "opacity-70" : "text-gray-400"}`}>{s === "All" ? employees.length : (counts[s] ?? 0)}</span>
                            </button>
                        ))}
                        <span className="ml-auto text-[11px] text-gray-400 shrink-0 pl-2">{filtered.length} shown</span>
                    </div>
                </div>
            </header>

            {/* ── Body ── */}
            <div className="flex-1 px-4 sm:px-6 py-4 max-w-3xl mx-auto w-full flex flex-col gap-3">

                {loading && <LoadingDots />}

                {error && !loading && (
                    <div className="flex flex-col items-center py-20 gap-3">
                        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-500">{error}</p>
                        <button onClick={fetchEmployees} className="text-xs text-indigo-600 hover:underline font-medium">Retry</button>
                    </div>
                )}

                {!loading && !error && filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5M12 12a4 4 0 100-8 4 4 0 000 8z" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">No employees found</p>
                        <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
                    </div>
                )}

                {!loading && !error && filtered.map((emp) => {
                    const id = emp._id || emp.id;
                    const isOpen = expandedId === id;

                    return (
                        <div key={id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

                            {/* ── Card row ── */}
                            <div
                                className="flex items-center gap-3 px-4 py-3.5 cursor-pointer select-none active:bg-slate-50 transition-colors"
                                onClick={() => setExpandedId(isOpen ? null : id)}
                            >
                                <Avatar name={emp.name} size="md" />

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                        <span className="font-semibold text-gray-800 text-sm leading-tight">{emp.name}</span>
                                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[emp.status]?.pill ?? "bg-gray-100 text-gray-500 border border-gray-200"}`}>
                                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: STATUS_STYLE[emp.status]?.dot }} />
                                            {emp.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                                        {[emp.role, emp.phone].filter(Boolean).join(" · ") || emp.email}
                                    </p>
                                </div>

                                {/* Action buttons — always visible */}
                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setModal(emp); }}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                        title="Edit"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setConfirmDel(emp); }}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                        title="Delete"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                    <svg className={`w-4 h-4 text-gray-300 transition-transform ml-0.5 ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {/* ── Expanded details ── */}
                            {isOpen && (
                                <div className="border-t border-gray-100 bg-slate-50 px-4 py-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">

                                        <DetailItem
                                            label="Phone"
                                            value={emp.phone}
                                            icon={<svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
                                        />

                                        <DetailItem
                                            label="Email"
                                            value={emp.email}
                                            icon={<svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                                        />

                                        <DetailItem
                                            label="Role"
                                            value={emp.role}
                                            icon={<svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                                        />

                                        <DetailItem
                                            label="Status"
                                            icon={<svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                        >
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full mt-0.5 ${STATUS_STYLE[emp.status]?.pill ?? "bg-gray-100 text-gray-500 border border-gray-200"}`}>
                                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_STYLE[emp.status]?.dot }} />
                                                {emp.status}
                                            </span>
                                        </DetailItem>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {modal && (
                <Modal title={modal === "add" ? "Add Employee" : "Edit Employee"} onClose={() => !saving && setModal(null)}>
                    <EmployeeForm initial={modal === "add" ? {} : modal} onSave={saveEmployee} onCancel={() => setModal(null)} saving={saving} />
                </Modal>
            )}

            {confirmDel && (
                <ConfirmDelete name={confirmDel.name} onConfirm={deleteEmployee} onCancel={() => !deleting && setConfirmDel(null)} deleting={deleting} />
            )}
        </div>
    );
}