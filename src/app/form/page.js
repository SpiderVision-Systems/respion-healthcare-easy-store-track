// "use client";
// import { useState, useEffect, useMemo } from "react";
// import { generatePatientPDF } from "@/lib/generatePatientPDF";
// import { useRouter } from "next/navigation";

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// const MONTH_NAMES = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December",
// ];

// const fmt = (v) => "₹" + (Math.round(Number(v) || 0)).toLocaleString("en-IN");

// const fmtDateShort = (iso) => {
//     if (!iso) return "—";
//     const [y, m, d] = iso.split("-").map(Number);
//     return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
//         day: "numeric", month: "short", year: "numeric",
//     });
// };

// const getMonthLabel = (y, m) => `${MONTH_NAMES[m]} ${y}`;

// function addMonthsToYMD(year, month, day, n) {
//     let totalMonths = month + n;
//     let y = year + Math.floor(totalMonths / 12);
//     let m = totalMonths % 12;
//     const maxDay = new Date(y, m + 1, 0).getDate();
//     const d = Math.min(day, maxDay);
//     return { y, m, d };
// }

// function ymdToISO({ y, m, d }) {
//     return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
// }

// function sameDayNextMonth() {
//     const now = new Date();
//     const day = now.getDate();
//     const nextM = now.getMonth() + 1;
//     const y = nextM > 11 ? now.getFullYear() + 1 : now.getFullYear();
//     const m = nextM % 12;
//     const maxDay = new Date(y, m + 1, 0).getDate();
//     const d = Math.min(day, maxDay);
//     return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
// }

// function todayISO() {
//     const now = new Date();
//     return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
// }

// // ─── Duration options ─────────────────────────────────────────────────────────
// const DAY_OPTIONS = [1, 3, 7, 15];
// const MONTH_OPTIONS = [1, 2, 3];

// // ─── Step config ──────────────────────────────────────────────────────────────
// const STEPS = [
//     { id: 1, title: "Patient Info", icon: "👤", short: "Patient" },
//     { id: 2, title: "Assignment", icon: "🩺", short: "Assign" },
//     { id: 3, title: "Rental Setup", icon: "📋", short: "Rental" },
//     { id: 4, title: "Review & Save", icon: "✅", short: "Review" },
// ];

// // ─── Reusable atoms ───────────────────────────────────────────────────────────
// function FieldLabel({ children, required }) {
//     return (
//         <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
//             {children}
//             {required && <span className="text-rose-400 ml-1">*</span>}
//         </label>
//     );
// }

// function TextInput({ error, className = "", ...props }) {
//     return (
//         <input
//             {...props}
//             className={[
//                 "w-full px-3 py-2.5 text-sm bg-white border rounded-xl text-slate-800",
//                 "placeholder-slate-300 transition-all outline-none",
//                 "focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500",
//                 "hover:border-slate-300",
//                 error ? "border-rose-300 bg-rose-50/50" : "border-slate-200",
//                 className,
//             ].join(" ")}
//         />
//     );
// }

// function TextareaInput({ error, className = "", ...props }) {
//     return (
//         <textarea
//             {...props}
//             rows={3}
//             className={[
//                 "w-full px-3 py-2.5 text-sm bg-white border rounded-xl text-slate-800 resize-none",
//                 "placeholder-slate-300 transition-all outline-none",
//                 "focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500",
//                 "hover:border-slate-300",
//                 error ? "border-rose-300 bg-rose-50/50" : "border-slate-200",
//                 className,
//             ].join(" ")}
//         />
//     );
// }

// function SelectInput({ error, children, className = "", ...props }) {
//     return (
//         <select
//             {...props}
//             className={[
//                 "w-full px-3 py-2.5 text-sm bg-white border rounded-xl text-slate-800",
//                 "transition-all outline-none appearance-none cursor-pointer",
//                 "focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500",
//                 "hover:border-slate-300",
//                 `bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_12px_center] pr-8`,
//                 error ? "border-rose-300 bg-rose-50/50" : "border-slate-200",
//                 className,
//             ].join(" ")}
//         >
//             {children}
//         </select>
//     );
// }

// function ErrorMsg({ msg }) {
//     if (!msg) return null;
//     return (
//         <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
//             <span>⚠</span> {msg}
//         </p>
//     );
// }

// function InfoChip({ label, value, color }) {
//     const colors = {
//         teal: "bg-teal-50   border-teal-200   [&_.cv]:text-teal-900   text-teal-600",
//         violet: "bg-violet-50 border-violet-200 [&_.cv]:text-violet-900 text-violet-600",
//         amber: "bg-amber-50  border-amber-200  [&_.cv]:text-amber-900  text-amber-600",
//         sky: "bg-sky-50    border-sky-200    [&_.cv]:text-sky-900    text-sky-600",
//         rose: "bg-rose-50   border-rose-200   [&_.cv]:text-rose-900   text-rose-600",
//         emerald: "bg-emerald-50 border-emerald-200 [&_.cv]:text-emerald-900 text-emerald-600",
//     };
//     return (
//         <div className={`flex flex-col gap-0.5 border rounded-xl px-3.5 py-2.5 flex-1 min-w-[110px] ${colors[color] || colors.teal}`}>
//             <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{label}</span>
//             <span className="cv text-sm font-bold font-mono">{value}</span>
//         </div>
//     );
// }

// // ─── Spinner ──────────────────────────────────────────────────────────────────
// function Spinner() {
//     return (
//         <svg className="w-4 h-4 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
//         </svg>
//     );
// }

// // ─── Step Progress Bar ────────────────────────────────────────────────────────
// function StepBar({ current }) {
//     return (
//         <div className="flex items-center gap-0 mb-8 select-none">
//             {STEPS.map((step, idx) => {
//                 const done = current > step.id;
//                 const active = current === step.id;
//                 return (
//                     <div key={step.id} className="flex items-center flex-1 last:flex-none">
//                         <div className="flex flex-col items-center gap-1">
//                             <div className={[
//                                 "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2",
//                                 done ? "bg-teal-600 border-teal-600 text-white" : "",
//                                 active ? "bg-white border-teal-600 text-teal-700 shadow-md shadow-teal-100" : "",
//                                 !done && !active ? "bg-white border-slate-200 text-slate-400" : "",
//                             ].join(" ")}>
//                                 {done ? (
//                                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                                     </svg>
//                                 ) : (
//                                     <span className="text-xs">{step.icon}</span>
//                                 )}
//                             </div>
//                             <span className={`text-[10px] font-semibold whitespace-nowrap hidden sm:block
//                 ${active ? "text-teal-700" : done ? "text-teal-500" : "text-slate-400"}`}>
//                                 {step.short}
//                             </span>
//                         </div>
//                         {idx < STEPS.length - 1 && (
//                             <div className="flex-1 h-0.5 mx-1 mb-4 sm:mb-5 rounded-full transition-all duration-500"
//                                 style={{ background: done ? "#0d9488" : "#e2e8f0" }}
//                             />
//                         )}
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }

// // ─── Review row ───────────────────────────────────────────────────────────────
// function ReviewRow({ label, value, badge }) {
//     return (
//         <div className="flex justify-between items-start py-2.5 border-b border-slate-50 last:border-0 gap-4">
//             <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex-shrink-0">{label}</span>
//             <span className="text-sm font-medium text-slate-700 text-right">
//                 {badge ? (
//                     <span className={`inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-0.5 ${badge === "yes"
//                         ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
//                         : "bg-rose-50 text-rose-700 border border-rose-200"
//                         }`}>
//                         {badge === "yes" ? "✓ Yes" : "✗ No"}
//                     </span>
//                 ) : value || <span className="text-slate-300">—</span>}
//             </span>
//         </div>
//     );
// }

// // ─── Rental table ─────────────────────────────────────────────────────────
// function InstalmentTable({ schedule, onToggle, isDailyMode }) {
//     const paidCount = schedule.filter(r => r.status === "paid").length;
//     const pendingCount = schedule.filter(r => r.status === "pending").length;
//     const scheduleTotal = schedule.reduce((s, r) => s + r.amount, 0);

//     return (
//         <div className="rounded-xl border border-slate-100 overflow-hidden mt-2">
//             <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
//                 <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
//                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {paidCount} paid
//                 </span>
//                 <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5">
//                     <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> {pendingCount} pending
//                 </span>
//                 <span className="ml-auto text-xs text-slate-400 font-medium font-mono">
//                     {schedule.length} {isDailyMode ? "days" : "months"} · Total {fmt(scheduleTotal)}
//                 </span>
//             </div>
//             <div className="overflow-x-auto">
//                 <table className="w-full text-sm min-w-[500px]">
//                     <thead>
//                         <tr className="border-b border-slate-100 bg-white">
//                             {["#", isDailyMode ? "Day" : "Month", "Due Date", "Amount", "Status", onToggle ? "Action" : ""].map((h, i) => (
//                                 <th key={i} className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-2.5">{h}</th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-50">
//                         {schedule.map((r, i) => (
//                             <tr key={r._id} className={`transition-colors ${r.status === "paid" ? "bg-emerald-50/30" : "bg-white hover:bg-slate-50/70"}`}>
//                                 <td className="px-4 py-3 text-xs text-slate-400">{i + 1}</td>
//                                 <td className="px-4 py-3 text-sm font-semibold text-slate-700">{r.month}</td>
//                                 <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{fmtDateShort(r.dueDate)}</td>
//                                 <td className="px-4 py-3 text-sm font-bold font-mono text-slate-800 whitespace-nowrap">{fmt(r.amount)}</td>
//                                 <td className="px-4 py-3">
//                                     {r.status === "paid"
//                                         ? <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-0.5">✓ Paid</span>
//                                         : <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5">⏳ Pending</span>
//                                     }
//                                 </td>
//                                 {onToggle && (
//                                     <td className="px-4 py-3">
//                                         <button
//                                             type="button"
//                                             onClick={() => onToggle(r._id)}
//                                             className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all
//                         ${r.status === "paid"
//                                                     ? "bg-white border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50"
//                                                     : "bg-white border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-400"}`}
//                                         >
//                                             {r.status === "paid" ? "Undo" : "Mark paid"}
//                                         </button>
//                                     </td>
//                                 )}
//                                 {!onToggle && <td />}
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }

// // ─── Duration Picker ──────────────────────────────────────────────────────────
// function DurationPicker({ value, onChange, error }) {
//     return (
//         <div className={`rounded-xl border p-3 ${error ? "border-rose-300 bg-rose-50/30" : "border-slate-200 bg-slate-50/50"}`}>
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Days</p>
//             <div className="flex flex-wrap gap-1.5 mb-3">
//                 {DAY_OPTIONS.map(n => {
//                     const active = value === `d:${n}`;
//                     return (
//                         <button key={n} type="button" onClick={() => onChange(`d:${n}`)}
//                             className={`w-10 h-10 rounded-lg text-xs font-bold border transition-all
//                 ${active ? "bg-teal-600 border-teal-600 text-white shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-700"}`}>
//                             {n}d
//                         </button>
//                     );
//                 })}
//             </div>
//             <div className="flex items-center gap-2 mb-2">
//                 <div className="flex-1 h-px bg-slate-200" />
//                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or Months</span>
//                 <div className="flex-1 h-px bg-slate-200" />
//             </div>
//             <div className="flex flex-wrap gap-1.5">
//                 {MONTH_OPTIONS.map(n => {
//                     const active = value === `m:${n}`;
//                     return (
//                         <button key={n} type="button" onClick={() => onChange(`m:${n}`)}
//                             className={`px-4 h-10 rounded-lg text-xs font-bold border transition-all
//                 ${active ? "bg-teal-600 border-teal-600 text-white shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-700"}`}>
//                             {n} Month{n > 1 ? "s" : ""}
//                         </button>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }

// // ═════════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═════════════════════════════════════════════════════════════════════════════
// export default function PatientForm({ onSuccess, user }) {
//     const router = useRouter();
//     const [step, setStep] = useState(1);

//     // Step 1 — Patient Info
//     const [name, setName] = useState("");
//     const [phone, setPhone] = useState("");
//     const [altPhone, setAltPhone] = useState("");
//     const [whatsapp, setWhatsapp] = useState("");
//     const [dob, setDob] = useState("");
//     const [age, setAge] = useState("");
//     const [address, setAddress] = useState("");
//     const [review, setReview] = useState(false);

//     // Step 2 — Assignment
//     const [doctors, setDoctors] = useState([]);
//     const [doctorsLoading, setDoctorsLoading] = useState(false);
//     const [employees, setEmployees] = useState([]);
//     const [employeesLoading, setEmployeesLoading] = useState(false);
//     const [selectedBranch, setSelectedBranch] = useState("");
//     const [branchMachines, setBranchMachines] = useState([]);
//     const [branchMachinesLoading, setBranchMachinesLoading] = useState(false);

//     const [doctorId, setDoctorId] = useState("");
//     const [otherSource, setOtherSource] = useState("");
//     const [machineId, setMachineId] = useState("");
//     const [accessories, setAccessories] = useState([{ name: "" }]);
//     const [employeeId, setEmployeeId] = useState(user?.id || "");
//     const [otherEmployee, setOtherEmployee] = useState("");

//     // Step 3 — Rental Setup
//     const [perPeriodRent, setPerPeriodRent] = useState("");
//     const [securityAmount, setSecurityAmount] = useState("");
//     const [paymentMode, setPaymentMode] = useState("");
//     const [paymentAcc, setPaymentAcc] = useState("");
//     const [duration, setDuration] = useState("");
//     const [startDate, setStartDate] = useState(() => todayISO());
//     const [machineReturnDate, setMachineReturnDate] = useState("");
//     const [schedule, setSchedule] = useState([]);

//     // UI
//     const [errors, setErrors] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [submitted, setSubmitted] = useState(false);

//     // ── Fetch doctors & employees when Step 2 mounts ───────────────────────────
//     useEffect(() => {
//         if (step !== 2) return;

//         setDoctorsLoading(true);
//         fetch("/api/doctors", { headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY } })
//             .then(r => r.json())
//             .then(data => setDoctors(Array.isArray(data) ? data : []))
//             .catch(() => setDoctors([]))
//             .finally(() => setDoctorsLoading(false));

//         setEmployeesLoading(true);
//         fetch("/api/employees", { headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY } })
//             .then(r => r.json())
//             .then(data => setEmployees(Array.isArray(data) ? data : []))
//             .catch(() => setEmployees([]))
//             .finally(() => setEmployeesLoading(false));
//     }, [step]);

//     // ── Fetch branch machines when branch is selected ──────────────────────────
//     useEffect(() => {
//         if (!selectedBranch) { setBranchMachines([]); return; }
//         setMachineId("");
//         setBranchMachinesLoading(true);
//         fetch(`/api/branches/machines?branch=${encodeURIComponent(selectedBranch)}`, {
//             headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }
//         })
//             .then(r => r.json())
//             .then(data => setBranchMachines(Array.isArray(data) ? data : []))
//             .catch(() => setBranchMachines([]))
//             .finally(() => setBranchMachinesLoading(false));
//     }, [selectedBranch]);

//     // ── Derived rental values ──────────────────────────────────────────────────
//     const isDailyMode = duration.startsWith("d:");
//     const isMonthMode = duration.startsWith("m:");
//     const durationNum = parseInt(duration.slice(2), 10) || 0;
//     const rentPerPeriod = parseInt(perPeriodRent, 10) || 0;
//     const security = parseInt(securityAmount, 10) || 0;
//     const rentTotal = rentPerPeriod * durationNum;
//     const grandTotal = rentTotal;
//     const perInstalment = durationNum > 0 ? Math.floor(grandTotal / durationNum) : 0;
//     const instalmentRem = durationNum > 0 ? grandTotal % durationNum : 0;
//     const hasCalc = rentPerPeriod > 0 && durationNum > 0;

//     // ── Rebuild schedule ───────────────────────────────────────────────────────
//     useEffect(() => {
//         if (!hasCalc || grandTotal <= 0 || durationNum <= 0) { setSchedule([]); return; }
//         const base = Math.floor(grandTotal / durationNum);
//         const rem = grandTotal % durationNum;
//         if (isDailyMode) {
//             const [sy, sm, sd] = startDate.split("-").map(Number);
//             setSchedule(Array.from({ length: durationNum }, (_, i) => {
//                 const date = new Date(sy, sm - 1, sd);
//                 date.setDate(date.getDate() + i);
//                 const dueDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
//                 return { _id: `slot_${i}`, month: `Day ${i + 1}`, dueDate, amount: base + (i < rem ? 1 : 0), status: "pending", updatedAt: new Date().toISOString().slice(0, 10) };
//             }));
//         } else {
//             const [sy, sm, sd] = startDate.split("-").map(Number);
//             setSchedule(Array.from({ length: durationNum }, (_, i) => {
//                 const { y, m, d } = addMonthsToYMD(sy, sm - 1, sd, i);
//                 return { _id: `slot_${i}`, month: getMonthLabel(y, m), dueDate: ymdToISO({ y, m, d }), amount: base + (i < rem ? 1 : 0), status: "pending", updatedAt: new Date().toISOString().slice(0, 10) };
//             }));
//         }
//     }, [durationNum, grandTotal, startDate, hasCalc, isDailyMode]);

//     // ── Auto-set machine return date ───────────────────────────────────────────
//     useEffect(() => {
//         if (schedule.length > 0) setMachineReturnDate(schedule[schedule.length - 1].dueDate);
//     }, [schedule]);


//     // useEffect(() => {
//     //     const checkAuth = async () => {
//     //         const token = localStorage.getItem("token");

//     //         if (!token) {
//     //             router.replace("/login");
//     //             return;
//     //         }

//     //         try {
//     //             const res = await fetch("/api/auth/verify-token", {
//     //                 method: "POST",
//     //                 headers: {
//     //                     "Content-Type": "application/json",
//     //                     Authorization: `Bearer ${token}`,
//     //                     "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
//     //                 },
//     //             });

//     //             const data = await res.json();

//     //             if (!data.success) {
//     //                 localStorage.removeItem("token");
//     //                 router.replace("/login");
//     //                 return;
//     //             }

//     //             const role = data.user.role;
//     //             setUser(data.user);

//     //             // 🔥 ROLE BASED REDIRECT
//     //             if (role === "Admin1") {
//     //                 return;
//     //             } else if (role === "employee") {
//     //                 return;
//     //             } else {
//     //                 localStorage.removeItem("token");
//     //                 router.replace("/login");
//     //             }

//     //         } catch (err) {
//     //             console.log("Token verify error:", err);
//     //             localStorage.removeItem("token");
//     //             router.replace("/login");
//     //         } finally {
//     //             setLoading(false);
//     //         }
//     //     };

//     //     checkAuth();
//     // }, [router]);

//     // ── Summary values ─────────────────────────────────────────────────────────

//     useEffect(() => {
//         const checkAuth = async () => {
//             const token = localStorage.getItem("token");

//             if (!token) {
//                 router.replace("/login");
//                 return;
//             }

//             try {
//                 const res = await fetch("/api/auth/verify-token", {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${token}`,
//                         "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
//                     },
//                 });

//                 const data = await res.json();

//                 // ❌ invalid token
//                 if (!data.success) {
//                     localStorage.removeItem("token");
//                     router.replace("/login");
//                     return;
//                 }

//                 const role = data.user?.role;
//                 // ✅ allow only these roles
//                 if (role === "Admin1" || role === "employee") {
//                     return; // do nothing ✅
//                 }

//                 // ❌ any other role → logout
//                 localStorage.removeItem("token");
//                 router.replace("/login");

//             } catch (err) {
//                 console.log("Token verify error:", err);
//                 localStorage.removeItem("token");
//                 router.replace("/login");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         checkAuth();
//     }, [router]);

//     const paidRentTotal = useMemo(() => schedule.filter(r => r.status === "paid").reduce((s, r) => s + r.amount, 0), [schedule]);
//     const pendingRentTotal = useMemo(() => schedule.filter(r => r.status === "pending").reduce((s, r) => s + r.amount, 0), [schedule]);
//     const nextBillingDate = schedule.find(r => r.status === "pending")?.dueDate ?? null;
//     const rentalEndDate = schedule.length > 0 ? schedule[schedule.length - 1].dueDate : null;
//     const progressPct = grandTotal > 0 ? Math.min(100, Math.round((paidRentTotal / grandTotal) * 100)) : 0;
//     const progressColor = progressPct >= 100 ? "bg-emerald-500" : progressPct >= 60 ? "bg-sky-500" : progressPct >= 30 ? "bg-amber-400" : "bg-rose-400";

//     function toggleStatus(id) {
//         setSchedule(prev => prev.map(r => r._id === id ? { ...r, status: r.status === "paid" ? "pending" : "paid", updatedAt: new Date().toISOString().slice(0, 10) } : r));
//     }

//     const addAccessory = () => setAccessories([...accessories, { name: "" }]);
//     const removeAccessory = (i) => { const a = [...accessories]; a.splice(i, 1); setAccessories(a); };
//     const handleAccessoryChange = (i, value) => { const a = [...accessories]; a[i].name = value; setAccessories(a); };

//     // ── Per-step validation ────────────────────────────────────────────────────
//     function validateStep(s) {
//         const e = {};
//         if (s === 1) {
//             if (!name.trim()) e.name = "Patient name is required";
//             if (!phone.trim()) e.phone = "Primary phone is required";
//             else if (!/^\d{10}$/.test(phone.trim())) e.phone = "Enter a valid 10-digit phone number";
//             if (!altPhone.trim()) e.altPhone = "Alternate phone is required";
//             else if (!/^\d{10}$/.test(altPhone.trim())) e.altPhone = "Enter a valid 10-digit number";
//             if (!whatsapp.trim()) e.whatsapp = "WhatsApp number is required";
//             else if (!/^\d{10}$/.test(whatsapp.trim())) e.whatsapp = "Enter a valid 10-digit number";
//             if (!dob.trim()) e.dob = "Date of birth is required";
//             if (!address.trim()) e.address = "Address is required";
//         }
//         if (s === 2) {
//             if (!doctorId) e.doctorId = "Please select a doctor or source";
//             if (doctorId === "others" && !otherSource.trim()) e.otherSource = "Please enter referral source";
//             if (!selectedBranch) e.selectedBranch = "Please select a branch";
//             if (!machineId) e.machineId = "Please select a machine";
//             if (!employeeId) e.employeeId = "Please select an employee";
//             if (employeeId === "others" && !otherEmployee.trim()) e.otherEmployee = "Please enter employee name";
//         }
//         if (s === 3) {
//             if (!duration) e.duration = "Please select a rental duration";
//             if (!rentPerPeriod || rentPerPeriod <= 0) e.perPeriodRent = `Enter the ${isDailyMode ? "per day" : "per month"} rent amount`;
//             if (security < 0) e.securityAmount = "Security amount cannot be negative";
//             // ✅ FIX: use `e` not `errors` for paymentMode and paymentAcc
//             if (!paymentMode) e.paymentMode = "Select payment mode";
//             if (paymentMode === "online" && !paymentAcc.trim()) e.paymentAcc = "Enter account / UPI details";
//             if (!startDate) e.startDate = "Please select a start date";
//         }
//         return e;
//     }

//     function next() {
//         const errs = validateStep(step);
//         if (Object.keys(errs).length) { setErrors(errs); return; }
//         setErrors({});
//         setStep(s => s + 1);
//         window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//     function back() {
//         setErrors({});
//         setStep(s => s - 1);
//         window.scrollTo({ top: 0, behavior: "smooth" });
//     }

//     // ── Submit ─────────────────────────────────────────────────────────────────
//     async function handleSubmit() {
//         setLoading(true);
//         const payload = {
//             name: name.trim(), phone: phone.trim(), altPhone: altPhone.trim(),
//             whatsapp: whatsapp.trim(), address: address.trim(), dob, age, review,
//             otherSource: otherSource.trim(),
//             refMachine: machineId,
//             refDoctor: doctorId === "others" ? "000000000000000000000000" : doctorId,
//             refEmployee: employeeId === "others" ? "000000000000000000000000" : employeeId,
//             otherEmployee: otherEmployee.trim(),
//             branch: selectedBranch,
//             paymentType: "rent",
//             rentPerPeriod,
//             accessories: accessories.filter(a => a.name.trim()).map(a => ({ name: a.name })),
//             grandTotal,
//             securityAmount: security,
//             paymentMode,
//             paymentAcc,
//             duration, startDate,
//             ...(machineReturnDate ? { returnDate: machineReturnDate } : {}),
//             monthlyRent: schedule.map(({ month, dueDate, amount, status, updatedAt }) => ({ month, dueDate, amount, status, updatedAt })),
//         };
//         try {
//             const res = await fetch("/api/patients", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json", "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
//                 body: JSON.stringify(payload),
//             });
//             if (!res.ok) throw new Error(await res.text());
//             generatePatientPDF(payload, schedule, {
//                 doctorName,
//                 machineName,
//                 employeeName,
//                 durationLabel,
//                 slNo
//             });
//             setSubmitted(true);
//             // onSuccess?.(payload);
//         } catch (err) {
//             console.error(err);
//             setSubmitted(true);
//         } finally {
//             setLoading(false);
//         }
//     }

//     function resetForm() {
//         setStep(1);
//         setName(""); setPhone(""); setAltPhone(""); setWhatsapp("");
//         setDob(""); setAge(""); setAddress(""); setReview(false);
//         setDoctorId(""); setOtherSource(""); setMachineId(""); setEmployeeId(""); setOtherEmployee("");
//         setSelectedBranch(""); setBranchMachines([]);
//         setAccessories([{ name: "" }]);
//         setPerPeriodRent(""); setSecurityAmount(""); setPaymentMode(""); setPaymentAcc(""); setDuration("");
//         setStartDate(todayISO()); setMachineReturnDate("");
//         setSchedule([]); setErrors({}); setSubmitted(false);
//     }

//     // ── Lookup helpers ─────────────────────────────────────────────────────────
//     const doctorName = doctorId === "others"
//         ? (otherSource ? `Others (${otherSource})` : "Others")
//         : (doctors.find(d => d._id === doctorId)?.name || "—");
//     const machineName = branchMachines.find(m => m._id === machineId)?.name || "—";
//     const slNo = branchMachines.find(m => m._id === machineId)?.serialNumber || "—";
//     const employeeName = employeeId === "others"
//         ? (otherEmployee ? `Others (${otherEmployee})` : "Others")
//         : (employees.find(e => e._id === employeeId)?.name || "—");
//     const durationLabel = duration
//         ? isDailyMode ? `${durationNum} day${durationNum > 1 ? "s" : ""}` : `${durationNum} month${durationNum > 1 ? "s" : ""}`
//         : "—";
//     const paymentModeLabel = paymentMode === "cash"
//         ? "Cash"
//         : paymentMode === "online"
//             ? `Online${paymentAcc ? ` — ${paymentAcc}` : ""}`
//             : "—";

//     // ── Success screen ─────────────────────────────────────────────────────────
//     if (submitted) {
//         return (
//             <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
//                 <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-10 max-w-sm w-full text-center">
//                     <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
//                         <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                         </svg>
//                     </div>
//                     <h2 className="text-xl font-bold text-slate-800 mb-1">Patient Registered!</h2>
//                     <p className="text-sm text-slate-500 mb-6">
//                         <span className="font-semibold text-slate-700">{name}</span> saved with{" "}
//                         <span className="font-semibold text-teal-600">{schedule.length} rental{schedule.length !== 1 ? "s" : ""}</span>.
//                     </p>
//                     {nextBillingDate && (
//                         <div className="flex justify-between items-center bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-3">
//                             <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Next billing</span>
//                             <span className="text-sm font-bold font-mono text-amber-800">{fmtDateShort(nextBillingDate)}</span>
//                         </div>
//                     )}
//                     {machineReturnDate && (
//                         <div className="flex justify-between items-center bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 mb-3">
//                             <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Machine return</span>
//                             <span className="text-sm font-bold font-mono text-rose-800">{fmtDateShort(machineReturnDate)}</span>
//                         </div>
//                     )}
//                     {security > 0 && (
//                         <div className="flex justify-between items-center bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 mb-6">
//                             <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Security (refundable)</span>
//                             <span className="text-sm font-bold font-mono text-emerald-800">{fmt(security)}</span>
//                         </div>
//                     )}
//                     <button onClick={resetForm} className="w-full py-3 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 transition-colors">
//                         Register another patient
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     // ── RENDER ─────────────────────────────────────────────────────────────────
//     return (
//         <div className="min-h-screen bg-slate-50">
//             <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6">

//                 {/* Header */}
//                 <div className="flex items-center gap-3 mb-6">
//                     <div className="w-10 h-10 bg-teal-600 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
//                         <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                         </svg>
//                     </div>
//                     <div>
//                         <h1 className="text-lg font-bold text-slate-900 leading-tight">New Patient Record</h1>
//                         <p className="text-xs text-slate-400">Machine rental &amp; payment registration</p>
//                     </div>
//                 </div>

//                 <StepBar current={step} />

//                 {/* Card */}
//                 <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

//                     {/* Card header */}
//                     <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50/70">
//                         <span className="text-base">{STEPS[step - 1].icon}</span>
//                         <div>
//                             <p className="text-sm font-bold text-slate-700">{STEPS[step - 1].title}</p>
//                             <p className="text-[10px] text-slate-400 font-medium">Step {step} of {STEPS.length}</p>
//                         </div>
//                     </div>

//                     <div className="p-5 sm:p-6">

//                         {/* ─── STEP 1: Patient Info ─────────────────────────────────── */}
//                         {step === 1 && (
//                             <div className="flex flex-col gap-4">
//                                 <div>
//                                     <FieldLabel required>Patient Name</FieldLabel>
//                                     <TextInput type="text" placeholder="e.g. Arjun Mehta"
//                                         value={name} onChange={e => setName(e.target.value)} error={errors.name} />
//                                     <ErrorMsg msg={errors.name} />
//                                 </div>
//                                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                                     <div>
//                                         <FieldLabel required>Primary Phone</FieldLabel>
//                                         <TextInput type="tel" placeholder="9876543210"
//                                             value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
//                                             error={errors.phone} maxLength={10} />
//                                         <ErrorMsg msg={errors.phone} />
//                                     </div>
//                                     <div>
//                                         <FieldLabel required>Alternate Phone</FieldLabel>
//                                         <TextInput type="tel" placeholder="9876543210"
//                                             value={altPhone} onChange={e => setAltPhone(e.target.value.replace(/\D/g, ""))}
//                                             error={errors.altPhone} maxLength={10} />
//                                         <ErrorMsg msg={errors.altPhone} />
//                                     </div>
//                                     <div>
//                                         <FieldLabel required>WhatsApp Number</FieldLabel>
//                                         <TextInput type="tel" placeholder="9876543210"
//                                             value={whatsapp} onChange={e => setWhatsapp(e.target.value.replace(/\D/g, ""))}
//                                             error={errors.whatsapp} maxLength={10} />
//                                         <ErrorMsg msg={errors.whatsapp} />
//                                     </div>
//                                 </div>
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                     <div>
//                                         <FieldLabel required>Date of Birth</FieldLabel>
//                                         <TextInput type="date" value={dob}
//                                             onChange={(e) => {
//                                                 const v = e.target.value; setDob(v);
//                                                 if (v) {
//                                                     const birth = new Date(v); const today = new Date();
//                                                     let a = today.getFullYear() - birth.getFullYear();
//                                                     const md = today.getMonth() - birth.getMonth();
//                                                     if (md < 0 || (md === 0 && today.getDate() < birth.getDate())) a--;
//                                                     setAge(a);
//                                                 }
//                                             }} error={errors.dob} />
//                                         <ErrorMsg msg={errors.dob} />
//                                     </div>
//                                     <div>
//                                         <FieldLabel>Age (auto-calculated)</FieldLabel>
//                                         <TextInput type="number" value={age || ""} disabled className="opacity-60" />
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <FieldLabel required>Address</FieldLabel>
//                                     <TextareaInput placeholder="House no., Street, City, State, Pincode"
//                                         value={address} onChange={e => setAddress(e.target.value)} error={errors.address} />
//                                     <ErrorMsg msg={errors.address} />
//                                 </div>

//                                 <div className="p-4 border rounded-lg bg-white shadow-sm">
//                                     <h3 className="font-semibold text-gray-800 mb-2">Google Review Status</h3>
//                                     <div className="flex gap-4 items-center">
//                                         <label className="flex items-center gap-2">
//                                             <input type="radio" name="review" checked={review === true} onChange={() => setReview(true)} />
//                                             <span className="text-green-600 font-medium">Yes</span>
//                                         </label>
//                                         <label className="flex items-center gap-2">
//                                             <input type="radio" name="review" checked={review === false} onChange={() => setReview(false)} />
//                                             <span className="text-red-500 font-medium">No</span>
//                                         </label>
//                                     </div>
//                                     {!review && (
//                                         <p className="mt-3 text-sm text-orange-600">
//                                             ⚠ Please collect Google review during machine return/uninstall.
//                                         </p>
//                                     )}
//                                 </div>
//                             </div>
//                         )}

//                         {/* ─── STEP 2: Assignment ───────────────────────────────────── */}
//                         {step === 2 && (
//                             <div className="flex flex-col gap-5">

//                                 <div>
//                                     <FieldLabel required>Referred By / Lead By</FieldLabel>
//                                     {doctorsLoading ? (
//                                         <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-400">
//                                             <Spinner /> Loading doctors…
//                                         </div>
//                                     ) : (
//                                         <SelectInput value={doctorId}
//                                             onChange={e => { setDoctorId(e.target.value); if (e.target.value !== "others") setOtherSource(""); }}
//                                             error={errors.doctorId}>
//                                             <option value="">Select doctor</option>
//                                             {doctors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
//                                             <option value="others">Others</option>
//                                         </SelectInput>
//                                     )}
//                                     <ErrorMsg msg={errors.doctorId} />
//                                     {doctorId === "others" && (
//                                         <div className="mt-3">
//                                             <FieldLabel required>Enter Source</FieldLabel>
//                                             <TextInput type="text" placeholder="Enter referral source"
//                                                 value={otherSource} onChange={e => setOtherSource(e.target.value)}
//                                                 error={errors.otherSource} />
//                                             <ErrorMsg msg={errors.otherSource} />
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div>
//                                     <FieldLabel required>Region / Branch</FieldLabel>
//                                     <p className="text-[11px] text-slate-400 mb-2">Select a branch to see available machines</p>
//                                     <SelectInput value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)} error={errors.selectedBranch}>
//                                         <option value="">Choose a branch…</option>
//                                         {["Odisha", "Kolkata", "Ranchi", "Patna", "Bangalore"].map(b => (
//                                             <option key={b} value={b}>{b}</option>
//                                         ))}
//                                     </SelectInput>
//                                     <ErrorMsg msg={errors.selectedBranch} />
//                                 </div>

//                                 <div>
//                                     <FieldLabel required>Machine</FieldLabel>
//                                     {!selectedBranch ? (
//                                         <div className="flex items-center gap-2 px-3 py-2.5 border border-dashed border-slate-200 rounded-xl text-sm text-slate-400 bg-slate-50">
//                                             <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
//                                                 <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                                                 <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                                             </svg>
//                                             Select a branch first to see machines
//                                         </div>
//                                     ) : branchMachinesLoading ? (
//                                         <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-400">
//                                             <Spinner /> Loading machines for {selectedBranch}…
//                                         </div>
//                                     ) : branchMachines.length === 0 ? (
//                                         <div className="flex items-center gap-2 px-3 py-2.5 border border-amber-200 bg-amber-50 rounded-xl text-sm text-amber-700">
//                                             <span>⚠</span> No machines available in {selectedBranch}
//                                         </div>
//                                     ) : (
//                                         <SelectInput value={machineId} onChange={e => setMachineId(e.target.value)} error={errors.machineId}>
//                                             <option value="">Select machine</option>
//                                             {branchMachines.map(m => (
//                                                 <option key={m._id} value={m._id}>
//                                                     {m.name}{m.serialNumber ? ` — ${m.serialNumber}` : ""}
//                                                 </option>
//                                             ))}
//                                         </SelectInput>
//                                     )}
//                                     <ErrorMsg msg={errors.machineId} />
//                                 </div>

//                                 <div>
//                                     <div className="flex items-center justify-between mb-2">
//                                         <FieldLabel>Extra Accessories <span className="text-slate-400 font-normal normal-case tracking-normal text-xs">(optional)</span></FieldLabel>
//                                         <button type="button" onClick={addAccessory}
//                                             className="text-xs font-semibold text-teal-600 border border-teal-200 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-all">
//                                             + Add Accessory
//                                         </button>
//                                     </div>
//                                     {accessories.map((item, index) => (
//                                         <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 mb-2">
//                                             <TextInput type="text" placeholder="Accessory name" value={item.name}
//                                                 onChange={e => handleAccessoryChange(index, e.target.value)} />
//                                             <button type="button" onClick={() => removeAccessory(index)}
//                                                 className="flex items-center justify-center w-10 h-10 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 transition-all self-start">
//                                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                                                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                                                 </svg>
//                                             </button>
//                                         </div>
//                                     ))}
//                                 </div>

//                                 {!user && (
//                                     <div>
//                                         <FieldLabel required>Installed By</FieldLabel>
//                                         {employeesLoading ? (
//                                             <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-400">
//                                                 <Spinner /> Loading employees…
//                                             </div>
//                                         ) : (
//                                             <SelectInput value={employeeId}
//                                                 onChange={e => { setEmployeeId(e.target.value); if (e.target.value !== "others") setOtherEmployee(""); }}
//                                                 error={errors.employeeId}>
//                                                 <option value="">Select employee</option>
//                                                 {employees.map(em => <option key={em._id} value={em._id}>{em.name}</option>)}
//                                                 <option value="others">Others</option>
//                                             </SelectInput>
//                                         )}
//                                         <ErrorMsg msg={errors.employeeId} />
//                                         {employeeId === "others" && (
//                                             <div className="mt-3">
//                                                 <FieldLabel required>Enter Name</FieldLabel>
//                                                 <TextInput type="text" placeholder="Enter employee name"
//                                                     value={otherEmployee} onChange={e => setOtherEmployee(e.target.value)}
//                                                     error={errors.otherEmployee} />
//                                                 <ErrorMsg msg={errors.otherEmployee} />
//                                             </div>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         )}

//                         {/* ─── STEP 3: Rental Setup ─────────────────────────────────── */}
//                         {step === 3 && (
//                             <div className="flex flex-col gap-6">
//                                 <div>
//                                     <div className="flex items-center gap-2 mb-3">
//                                         <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</div>
//                                         <p className="text-sm font-bold text-slate-700">Select Rental Duration</p>
//                                     </div>
//                                     <DurationPicker value={duration} onChange={(val) => {
//                                         setDuration(val);
//                                         if (val.startsWith("d:")) setStartDate(todayISO());
//                                         else setStartDate(sameDayNextMonth());
//                                     }} error={errors.duration} />
//                                     <ErrorMsg msg={errors.duration} />
//                                 </div>

//                                 <div>
//                                     <div className="flex items-center gap-2 mb-3">
//                                         <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</div>
//                                         <p className="text-sm font-bold text-slate-700">Payment Mode</p>
//                                     </div>
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                         <div>
//                                             <FieldLabel required>Payment Type</FieldLabel>
//                                             <SelectInput
//                                                 value={paymentMode}
//                                                 onChange={(e) => {
//                                                     setPaymentMode(e.target.value);
//                                                     if (e.target.value !== "online") setPaymentAcc("");
//                                                 }}
//                                                 error={errors.paymentMode}
//                                             >
//                                                 <option value="">Select</option>
//                                                 <option value="cash">Cash</option>
//                                                 <option value="online">Online</option>
//                                             </SelectInput>
//                                             <ErrorMsg msg={errors.paymentMode} />
//                                         </div>
//                                         {paymentMode === "online" && (
//                                             <div>
//                                                 <FieldLabel required>Account / UPI / Bank Details</FieldLabel>
//                                                 <TextInput
//                                                     type="text"
//                                                     placeholder="e.g. SBI A/c 1234 / GPay / PhonePe / UPI ID"
//                                                     value={paymentAcc}
//                                                     onChange={(e) => setPaymentAcc(e.target.value)}
//                                                     error={errors.paymentAcc}
//                                                 />
//                                                 <ErrorMsg msg={errors.paymentAcc} />
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <div className="flex items-center gap-2 mb-3">
//                                         <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</div>
//                                         <p className="text-sm font-bold text-slate-700">Rental Charges</p>
//                                     </div>
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                         <div>
//                                             <FieldLabel required>Rent per {isDailyMode ? "day" : isMonthMode ? "month" : "period"}</FieldLabel>
//                                             <div className="relative">
//                                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 pointer-events-none">₹</span>
//                                                 <TextInput type="number" placeholder={isDailyMode ? "e.g. 500" : "e.g. 4000"} min="0" step="1"
//                                                     value={perPeriodRent} onChange={e => setPerPeriodRent(e.target.value)}
//                                                     error={errors.perPeriodRent} className="pl-7" />
//                                             </div>
//                                             <ErrorMsg msg={errors.perPeriodRent} />
//                                             {rentPerPeriod > 0 && durationNum > 0 && (
//                                                 <p className="mt-1 text-[10px] text-teal-600 font-medium">
//                                                     {fmt(rentPerPeriod)} × {durationNum} {isDailyMode ? "day" : "month"}{durationNum > 1 ? "s" : ""} = {fmt(rentTotal)}
//                                                 </p>
//                                             )}
//                                         </div>
//                                         <div>
//                                             <FieldLabel>Security Deposit <span className="ml-1.5 inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5 normal-case tracking-normal">↩ refundable</span></FieldLabel>
//                                             <div className="relative">
//                                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 pointer-events-none">₹</span>
//                                                 <TextInput type="number" placeholder="0" min="0" step="1"
//                                                     value={securityAmount} onChange={e => setSecurityAmount(e.target.value)}
//                                                     error={errors.securityAmount} className="pl-7" />
//                                             </div>
//                                             <ErrorMsg msg={errors.securityAmount} />
//                                             <p className="mt-1 text-[10px] text-emerald-600 font-medium">Collected upfront, returned at rental end.</p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {rentPerPeriod > 0 && (
//                                     <div className="rounded-xl border border-slate-200 bg-slate-50/70 divide-y divide-slate-100 overflow-hidden">
//                                         <div className="flex justify-between items-center px-4 py-2.5">
//                                             <span className="text-xs font-semibold text-slate-500">Rent ({fmt(rentPerPeriod)} × {durationNum || "—"} {isDailyMode ? "days" : "months"})</span>
//                                             <span className="text-sm font-bold font-mono text-slate-700">{fmt(rentTotal)}</span>
//                                         </div>
//                                         <div className="flex justify-between items-center px-4 py-3 bg-teal-50">
//                                             <div>
//                                                 <p className="text-sm font-bold text-teal-800">Grand Total</p>
//                                                 {durationNum > 0 && grandTotal > 0 && (
//                                                     <p className="text-[10px] text-teal-600 font-medium mt-0.5">
//                                                         ÷ {durationNum} {isDailyMode ? "days" : "months"} = {fmt(perInstalment)}/rental
//                                                         {instalmentRem > 0 && ` (+₹1 first ${instalmentRem})`}
//                                                     </p>
//                                                 )}
//                                             </div>
//                                             <span className="text-base font-bold font-mono text-teal-700">{fmt(grandTotal)}</span>
//                                         </div>
//                                         {security > 0 && (
//                                             <div className="flex justify-between items-center px-4 py-2.5 bg-emerald-50">
//                                                 <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
//                                                     <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                                                         <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                                                     </svg>
//                                                     Security deposit (refundable · not in rentals)
//                                                 </span>
//                                                 <span className="text-sm font-bold font-mono text-emerald-700">{fmt(security)}</span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 )}

//                                 <div>
//                                     <div className="flex items-center gap-2 mb-3">
//                                         <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">4</div>
//                                         <p className="text-sm font-bold text-slate-700">Rental Dates</p>
//                                     </div>
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                         <div>
//                                             <FieldLabel required>Rental start date
//                                                 <span className="ml-1 text-teal-500 font-bold normal-case tracking-normal text-[10px]">
//                                                     {isDailyMode ? "auto: today" : "auto: same day next month"}
//                                                 </span>
//                                             </FieldLabel>
//                                             <TextInput type="date" value={startDate} onChange={e => setStartDate(e.target.value)} error={errors.startDate} />
//                                             <p className="mt-1 text-[10px] text-slate-400">{isDailyMode ? "Daily due dates start from this date." : "Each month's due date follows this day."}</p>
//                                         </div>
//                                         <div>
//                                             <FieldLabel>Machine return date <span className="ml-1 text-amber-500 font-bold normal-case tracking-normal text-[10px]">auto: last due date</span></FieldLabel>
//                                             <TextInput type="date" value={machineReturnDate} onChange={e => setMachineReturnDate(e.target.value)} />
//                                             <p className="mt-1 text-[10px] text-slate-400">Auto-set to last rental date. Adjust if needed.</p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {hasCalc && (
//                                     <div className="flex flex-wrap gap-2">
//                                         <InfoChip label="Duration" value={durationLabel} color="violet" />
//                                         <InfoChip label="Per rental" value={fmt(perInstalment)} color="teal" />
//                                         <InfoChip label="Grand total" value={fmt(grandTotal)} color="rose" />
//                                         {security > 0 && <InfoChip label="Security" value={fmt(security)} color="emerald" />}
//                                         {nextBillingDate && <InfoChip label="First billing" value={fmtDateShort(nextBillingDate)} color="amber" />}
//                                         {machineReturnDate && <InfoChip label="Return date" value={fmtDateShort(machineReturnDate)} color="sky" />}
//                                     </div>
//                                 )}

//                                 {schedule.length > 0 && (
//                                     <div>
//                                         <div className="flex items-start gap-3 bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 mb-2">
//                                             <svg className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                                                 <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                             </svg>
//                                             <p className="text-xs text-teal-700 leading-relaxed">
//                                                 <span className="font-bold">{durationNum} rental{durationNum > 1 ? "s" : ""} · {fmt(perInstalment)}/rental · {fmt(grandTotal)} grand total</span>.{" "}
//                                                 {isDailyMode ? `Daily billing from ${fmtDateShort(startDate)}.` : `Due on the ${startDate.split("-")[2].replace(/^0/, "")}th of each month.`}
//                                                 {instalmentRem > 0 && ` First ${instalmentRem} rental${instalmentRem > 1 ? "s" : ""} are ₹1 more.`}
//                                             </p>
//                                         </div>
//                                         <InstalmentTable schedule={schedule} onToggle={toggleStatus} isDailyMode={isDailyMode} />
//                                     </div>
//                                 )}
//                             </div>
//                         )}

//                         {/* ─── STEP 4: Review & Save ────────────────────────────────── */}
//                         {step === 4 && (
//                             <div className="flex flex-col gap-5">

//                                 {/* ── Patient Information ── */}
//                                 <div>
//                                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Patient Information</p>
//                                     <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 divide-y divide-slate-100">
//                                         <ReviewRow label="Name" value={name} />
//                                         <ReviewRow label="Primary Phone" value={phone} />
//                                         <ReviewRow label="Alternate Phone" value={altPhone} />
//                                         <ReviewRow label="WhatsApp" value={whatsapp} />
//                                         <ReviewRow label="Date of Birth" value={fmtDateShort(dob)} />
//                                         <ReviewRow label="Age" value={age ? `${age} yrs` : "—"} />
//                                         <ReviewRow label="Address" value={address || "—"} />
//                                         {/* ✅ ADDED: Google Review status in review */}
//                                         <ReviewRow label="Google Review" badge={review ? "yes" : "no"} />
//                                     </div>
//                                 </div>

//                                 {/* ── Assignment ── */}
//                                 <div>
//                                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Assignment</p>
//                                     <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 divide-y divide-slate-100">
//                                         {/* ✅ FIXED: doctorName now includes otherSource when "others" */}
//                                         <ReviewRow label="Referred By" value={doctorName} />
//                                         <ReviewRow label="Branch" value={selectedBranch || "—"} />
//                                         <ReviewRow label="Machine" value={machineName} />
//                                         {/* ✅ FIXED: employeeName now includes otherEmployee when "others" */}
//                                         <ReviewRow label="Installed By" value={employeeName} />
//                                         {accessories.filter(a => a.name.trim()).length > 0
//                                             ? accessories.filter(a => a.name.trim()).map((a, i) => (
//                                                 <ReviewRow key={i} label={`Accessory ${i + 1}`} value={a.name} />
//                                             ))
//                                             : <ReviewRow label="Accessories" value="None" />
//                                         }
//                                     </div>
//                                 </div>

//                                 {/* ── Rental Details ── */}
//                                 <div>
//                                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Rental Details</p>
//                                     <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 divide-y divide-slate-100">
//                                         <ReviewRow label="Duration" value={durationLabel} />
//                                         <ReviewRow label={`Rent per ${isDailyMode ? "day" : "month"}`} value={fmt(rentPerPeriod)} />
//                                         <ReviewRow label="Grand Total" value={fmt(grandTotal)} />
//                                         <ReviewRow label="Per Rental" value={`${fmt(perInstalment)}${instalmentRem > 0 ? ` (+₹1 first ${instalmentRem})` : ""}`} />
//                                         {security > 0 && <ReviewRow label="Security (refundable)" value={fmt(security)} />}
//                                         {/* ✅ ADDED: Payment mode & account details in review */}
//                                         <ReviewRow label="Payment Mode" value={paymentModeLabel} />
//                                         <ReviewRow label="Start Date" value={fmtDateShort(startDate)} />
//                                         <ReviewRow label="Rental Ends" value={rentalEndDate ? fmtDateShort(rentalEndDate) : "—"} />
//                                         {machineReturnDate && <ReviewRow label="Machine Return" value={fmtDateShort(machineReturnDate)} />}
//                                     </div>
//                                 </div>

//                                 {/* ── Recovery progress ── */}
//                                 <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5">
//                                     <div className="flex justify-between text-xs text-slate-500 mb-2">
//                                         <span className="font-semibold">Recovery progress</span>
//                                         <span className="font-bold text-slate-700 font-mono">{fmt(paidRentTotal)} of {fmt(grandTotal)}</span>
//                                     </div>
//                                     <div className="flex items-center gap-3">
//                                         <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
//                                             <div className={`h-full rounded-full transition-all duration-500 ${progressColor}`} style={{ width: `${progressPct}%` }} />
//                                         </div>
//                                         <span className="text-xs font-bold font-mono text-slate-500 w-9 text-right">{progressPct}%</span>
//                                     </div>
//                                 </div>

//                                 {/* ── Summary chips ── */}
//                                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                                     {[
//                                         { label: "Grand total", value: fmt(grandTotal), cls: "text-slate-800" },
//                                         { label: "Security", value: fmt(security), cls: "text-emerald-600" },
//                                         { label: "Rent collected", value: fmt(paidRentTotal), cls: "text-emerald-600" },
//                                         { label: "Rent pending", value: fmt(pendingRentTotal), cls: pendingRentTotal > 0 ? "text-amber-600" : "text-emerald-600" },
//                                     ].map(s => (
//                                         <div key={s.label} className="bg-white border border-slate-100 rounded-xl px-3 py-2.5">
//                                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{s.label}</p>
//                                             <p className={`text-base font-bold font-mono ${s.cls}`}>{s.value}</p>
//                                         </div>
//                                     ))}
//                                 </div>

//                                 {/* ── Rental schedule ── */}
//                                 {schedule.length > 0 && (
//                                     <div>
//                                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Rental Schedule Preview</p>
//                                         <InstalmentTable schedule={schedule} onToggle={null} isDailyMode={isDailyMode} />
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>

//                     {/* Footer nav */}
//                     <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50/50">
//                         {step > 1 ? (
//                             <button type="button" onClick={back}
//                                 className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all">
//                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                                     <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//                                 </svg>
//                                 Back
//                             </button>
//                         ) : <div />}

//                         {step < STEPS.length ? (
//                             <button type="button" onClick={next}
//                                 className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 active:scale-[0.99] transition-all shadow-sm">
//                                 Continue
//                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                                     <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                                 </svg>
//                             </button>
//                         ) : (
//                             <button type="button" onClick={handleSubmit} disabled={loading}
//                                 className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 active:scale-[0.99] transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
//                                 {loading ? (
//                                     <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
//                                     </svg>
//                                 ) : (
//                                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z" />
//                                         <polyline points="17 21 17 13 7 13 7 21" />
//                                         <polyline points="7 3 7 8 15 8" />
//                                     </svg>
//                                 )}
//                                 {loading ? "Saving…" : "Save Patient Record"}
//                             </button>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


"use client";
import { useState, useEffect, useMemo } from "react";
import { generatePatientPDF } from "@/lib/generatePatientPDF";
import { useRouter } from "next/navigation";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const fmt = (v) => "₹" + (Math.round(Number(v) || 0)).toLocaleString("en-IN");

const fmtDateShort = (iso) => {
    if (!iso) return "—";
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
    });
};

const getMonthLabel = (y, m) => `${MONTH_NAMES[m]} ${y}`;

function addMonthsToYMD(year, month, day, n) {
    let totalMonths = month + n;
    let y = year + Math.floor(totalMonths / 12);
    let m = totalMonths % 12;
    const maxDay = new Date(y, m + 1, 0).getDate();
    const d = Math.min(day, maxDay);
    return { y, m, d };
}

function ymdToISO({ y, m, d }) {
    return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function sameDayNextMonth() {
    const now = new Date();
    const day = now.getDate();
    const nextM = now.getMonth() + 1;
    const y = nextM > 11 ? now.getFullYear() + 1 : now.getFullYear();
    const m = nextM % 12;
    const maxDay = new Date(y, m + 1, 0).getDate();
    const d = Math.min(day, maxDay);
    return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function todayISO() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

// ─── Duration options ─────────────────────────────────────────────────────────
const DAY_OPTIONS = [1, 3, 7, 15];
const MONTH_OPTIONS = [1, 2, 3];

// ─── Step config ──────────────────────────────────────────────────────────────
const STEPS = [
    { id: 1, title: "Patient Info", icon: "👤", short: "Patient" },
    { id: 2, title: "Assignment", icon: "🩺", short: "Assign" },
    { id: 3, title: "Rental Setup", icon: "📋", short: "Rental" },
    { id: 4, title: "Review & Save", icon: "✅", short: "Review" },
];

// ─── Reusable atoms ───────────────────────────────────────────────────────────
function FieldLabel({ children, required }) {
    return (
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            {children}
            {required && <span className="text-rose-400 ml-1">*</span>}
        </label>
    );
}

function TextInput({ error, className = "", ...props }) {
    return (
        <input
            {...props}
            className={[
                "w-full px-3 py-2.5 text-sm bg-white border rounded-xl text-slate-800",
                "placeholder-slate-300 transition-all outline-none",
                "focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500",
                "hover:border-slate-300",
                error ? "border-rose-300 bg-rose-50/50" : "border-slate-200",
                className,
            ].join(" ")}
        />
    );
}

function TextareaInput({ error, className = "", ...props }) {
    return (
        <textarea
            {...props}
            rows={3}
            className={[
                "w-full px-3 py-2.5 text-sm bg-white border rounded-xl text-slate-800 resize-none",
                "placeholder-slate-300 transition-all outline-none",
                "focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500",
                "hover:border-slate-300",
                error ? "border-rose-300 bg-rose-50/50" : "border-slate-200",
                className,
            ].join(" ")}
        />
    );
}

function SelectInput({ error, children, className = "", ...props }) {
    return (
        <select
            {...props}
            className={[
                "w-full px-3 py-2.5 text-sm bg-white border rounded-xl text-slate-800",
                "transition-all outline-none appearance-none cursor-pointer",
                "focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500",
                "hover:border-slate-300",
                `bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_12px_center] pr-8`,
                error ? "border-rose-300 bg-rose-50/50" : "border-slate-200",
                className,
            ].join(" ")}
        >
            {children}
        </select>
    );
}

function ErrorMsg({ msg }) {
    if (!msg) return null;
    return (
        <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
            <span>⚠</span> {msg}
        </p>
    );
}

function InfoChip({ label, value, color }) {
    const colors = {
        teal: "bg-teal-50   border-teal-200   [&_.cv]:text-teal-900   text-teal-600",
        violet: "bg-violet-50 border-violet-200 [&_.cv]:text-violet-900 text-violet-600",
        amber: "bg-amber-50  border-amber-200  [&_.cv]:text-amber-900  text-amber-600",
        sky: "bg-sky-50    border-sky-200    [&_.cv]:text-sky-900    text-sky-600",
        rose: "bg-rose-50   border-rose-200   [&_.cv]:text-rose-900   text-rose-600",
        emerald: "bg-emerald-50 border-emerald-200 [&_.cv]:text-emerald-900 text-emerald-600",
    };
    return (
        <div className={`flex flex-col gap-0.5 border rounded-xl px-3.5 py-2.5 flex-1 min-w-[110px] ${colors[color] || colors.teal}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{label}</span>
            <span className="cv text-sm font-bold font-mono">{value}</span>
        </div>
    );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
    return (
        <svg className="w-4 h-4 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
    );
}

// ─── Step Progress Bar ────────────────────────────────────────────────────────
function StepBar({ current }) {
    return (
        <div className="flex items-center gap-0 mb-8 select-none">
            {STEPS.map((step, idx) => {
                const done = current > step.id;
                const active = current === step.id;
                return (
                    <div key={step.id} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center gap-1">
                            <div className={[
                                "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2",
                                done ? "bg-teal-600 border-teal-600 text-white" : "",
                                active ? "bg-white border-teal-600 text-teal-700 shadow-md shadow-teal-100" : "",
                                !done && !active ? "bg-white border-slate-200 text-slate-400" : "",
                            ].join(" ")}>
                                {done ? (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <span className="text-xs">{step.icon}</span>
                                )}
                            </div>
                            <span className={`text-[10px] font-semibold whitespace-nowrap hidden sm:block
                ${active ? "text-teal-700" : done ? "text-teal-500" : "text-slate-400"}`}>
                                {step.short}
                            </span>
                        </div>
                        {idx < STEPS.length - 1 && (
                            <div className="flex-1 h-0.5 mx-1 mb-4 sm:mb-5 rounded-full transition-all duration-500"
                                style={{ background: done ? "#0d9488" : "#e2e8f0" }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ─── Review row ───────────────────────────────────────────────────────────────
function ReviewRow({ label, value, badge }) {
    return (
        <div className="flex justify-between items-start py-2.5 border-b border-slate-50 last:border-0 gap-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex-shrink-0">{label}</span>
            <span className="text-sm font-medium text-slate-700 text-right">
                {badge ? (
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-0.5 ${badge === "yes"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}>
                        {badge === "yes" ? "✓ Yes" : "✗ No"}
                    </span>
                ) : value || <span className="text-slate-300">—</span>}
            </span>
        </div>
    );
}

// ─── Rental table ─────────────────────────────────────────────────────────
function InstalmentTable({ schedule, onToggle, isDailyMode }) {
    const paidCount = schedule.filter(r => r.status === "paid").length;
    const pendingCount = schedule.filter(r => r.status === "pending").length;
    const scheduleTotal = schedule.reduce((s, r) => s + r.amount, 0);

    return (
        <div className="rounded-xl border border-slate-100 overflow-hidden mt-2">
            <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {paidCount} paid
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> {pendingCount} pending
                </span>
                <span className="ml-auto text-xs text-slate-400 font-medium font-mono">
                    {schedule.length} {isDailyMode ? "rental" : "months"} · Total {fmt(scheduleTotal)}
                </span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                    <thead>
                        <tr className="border-b border-slate-100 bg-white">
                            {["#", isDailyMode ? "Period" : "Month", "Due Date", "Amount", "Status", onToggle ? "Action" : ""].map((h, i) => (
                                <th key={i} className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-2.5">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {schedule.map((r, i) => (
                            <tr key={r._id} className={`transition-colors ${r.status === "paid" ? "bg-emerald-50/30" : "bg-white hover:bg-slate-50/70"}`}>
                                <td className="px-4 py-3 text-xs text-slate-400">{i + 1}</td>
                                <td className="px-4 py-3 text-sm font-semibold text-slate-700">{r.month}</td>
                                <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{fmtDateShort(r.dueDate)}</td>
                                <td className="px-4 py-3 text-sm font-bold font-mono text-slate-800 whitespace-nowrap">{fmt(r.amount)}</td>
                                <td className="px-4 py-3">
                                    {r.status === "paid"
                                        ? <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-0.5">✓ Paid</span>
                                        : <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5">⏳ Pending</span>
                                    }
                                </td>
                                {onToggle && (
                                    <td className="px-4 py-3">
                                        <button
                                            type="button"
                                            onClick={() => onToggle(r._id)}
                                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all
                        ${r.status === "paid"
                                                    ? "bg-white border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50"
                                                    : "bg-white border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-400"}`}
                                        >
                                            {r.status === "paid" ? "Undo" : "Mark paid"}
                                        </button>
                                    </td>
                                )}
                                {!onToggle && <td />}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Duration Picker ──────────────────────────────────────────────────────────
function DurationPicker({ value, onChange, error }) {
    return (
        <div className={`rounded-xl border p-3 ${error ? "border-rose-300 bg-rose-50/30" : "border-slate-200 bg-slate-50/50"}`}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Days</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
                {DAY_OPTIONS.map(n => {
                    const active = value === `d:${n}`;
                    return (
                        <button key={n} type="button" onClick={() => onChange(`d:${n}`)}
                            className={`w-10 h-10 rounded-lg text-xs font-bold border transition-all
                ${active ? "bg-teal-600 border-teal-600 text-white shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-700"}`}>
                            {n}d
                        </button>
                    );
                })}
            </div>
            <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or Months</span>
                <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="flex flex-wrap gap-1.5">
                {MONTH_OPTIONS.map(n => {
                    const active = value === `m:${n}`;
                    return (
                        <button key={n} type="button" onClick={() => onChange(`m:${n}`)}
                            className={`px-4 h-10 rounded-lg text-xs font-bold border transition-all
                ${active ? "bg-teal-600 border-teal-600 text-white shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-700"}`}>
                            {n} Month{n > 1 ? "s" : ""}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export default function PatientForm({ onSuccess, user }) {
    const router = useRouter();
    const [step, setStep] = useState(1);

    // Step 1 — Patient Info
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [altPhone, setAltPhone] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [dob, setDob] = useState("");
    const [age, setAge] = useState("");
    const [address, setAddress] = useState("");
    const [review, setReview] = useState(false);

    // Step 2 — Assignment
    const [doctors, setDoctors] = useState([]);
    const [doctorsLoading, setDoctorsLoading] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [employeesLoading, setEmployeesLoading] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [branchMachines, setBranchMachines] = useState([]);
    const [branchMachinesLoading, setBranchMachinesLoading] = useState(false);

    const [doctorId, setDoctorId] = useState("");
    const [otherSource, setOtherSource] = useState("");
    const [machineId, setMachineId] = useState("");
    const [accessories, setAccessories] = useState([{ name: "" }]);
    const [employeeId, setEmployeeId] = useState(user?.id || "");
    const [otherEmployee, setOtherEmployee] = useState("");

    // Step 3 — Rental Setup
    const [perPeriodRent, setPerPeriodRent] = useState("");
    const [securityAmount, setSecurityAmount] = useState("");
    const [paymentMode, setPaymentMode] = useState("");
    const [paymentAcc, setPaymentAcc] = useState("");
    const [duration, setDuration] = useState("");
    const [startDate, setStartDate] = useState(() => todayISO());
    const [machineReturnDate, setMachineReturnDate] = useState("");
    const [schedule, setSchedule] = useState([]);

    // UI
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // ── Fetch doctors & employees when Step 2 mounts ───────────────────────────
    useEffect(() => {
        if (step !== 2) return;

        setDoctorsLoading(true);
        fetch("/api/doctors", { headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY } })
            .then(r => r.json())
            .then(data => setDoctors(Array.isArray(data) ? data : []))
            .catch(() => setDoctors([]))
            .finally(() => setDoctorsLoading(false));

        setEmployeesLoading(true);
        fetch("/api/employees", { headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY } })
            .then(r => r.json())
            .then(data => setEmployees(Array.isArray(data) ? data : []))
            .catch(() => setEmployees([]))
            .finally(() => setEmployeesLoading(false));
    }, [step]);

    // ── Fetch branch machines when branch is selected ──────────────────────────
    useEffect(() => {
        if (!selectedBranch) { setBranchMachines([]); return; }
        setMachineId("");
        setBranchMachinesLoading(true);
        fetch(`/api/branches/machines?branch=${encodeURIComponent(selectedBranch)}`, {
            headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }
        })
            .then(r => r.json())
            .then(data => setBranchMachines(Array.isArray(data) ? data : []))
            .catch(() => setBranchMachines([]))
            .finally(() => setBranchMachinesLoading(false));
    }, [selectedBranch]);

    // ── Derived rental values ──────────────────────────────────────────────────
    const isDailyMode = duration.startsWith("d:");
    const isMonthMode = duration.startsWith("m:");
    const durationNum = parseInt(duration.slice(2), 10) || 0;
    const rentPerPeriod = parseInt(perPeriodRent, 10) || 0;
    const security = parseInt(securityAmount, 10) || 0;
    // ── For daily mode: grandTotal = rentPerPeriod (single payment, no multiplication)
    // ── For month mode: grandTotal = rentPerPeriod * durationNum (unchanged)
    const rentTotal = isDailyMode ? rentPerPeriod : rentPerPeriod * durationNum;
    const grandTotal = rentTotal;
    const perInstalment = isDailyMode ? grandTotal : (durationNum > 0 ? Math.floor(grandTotal / durationNum) : 0);
    const instalmentRem = isDailyMode ? 0 : (durationNum > 0 ? grandTotal % durationNum : 0);
    const hasCalc = rentPerPeriod > 0 && durationNum > 0;

    // ── Rebuild schedule ───────────────────────────────────────────────────────
    useEffect(() => {
        if (!hasCalc || grandTotal <= 0 || durationNum <= 0) { setSchedule([]); return; }

        if (isDailyMode) {
            // ── Single rental due after N days from startDate ──────────────
            const [sy, sm, sd] = startDate.split("-").map(Number);
            const date = new Date(sy, sm - 1, sd);
            date.setDate(date.getDate() + durationNum);
            const dueDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
            setSchedule([{
                _id: "slot_0",
                month: `Day ${durationNum}`,
                dueDate,
                amount: grandTotal,
                status: "pending",
                updatedAt: new Date().toISOString().slice(0, 10),
            }]);
        } else {
            // ── Monthly schedule (unchanged) ───────────────────────────────────
            const base = Math.floor(grandTotal / durationNum);
            const rem = grandTotal % durationNum;
            const [sy, sm, sd] = startDate.split("-").map(Number);
            setSchedule(Array.from({ length: durationNum }, (_, i) => {
                const { y, m, d } = addMonthsToYMD(sy, sm - 1, sd, i);
                return { _id: `slot_${i}`, month: getMonthLabel(y, m), dueDate: ymdToISO({ y, m, d }), amount: base + (i < rem ? 1 : 0), status: "pending", updatedAt: new Date().toISOString().slice(0, 10) };
            }));
        }
    }, [durationNum, grandTotal, startDate, hasCalc, isDailyMode]);

    // ── Auto-set machine return date ───────────────────────────────────────────
    useEffect(() => {
        if (schedule.length > 0) setMachineReturnDate(schedule[schedule.length - 1].dueDate);
    }, [schedule]);


    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                router.replace("/login");
                return;
            }

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

                // ❌ invalid token
                if (!data.success) {
                    localStorage.removeItem("token");
                    router.replace("/login");
                    return;
                }

                const role = data.user?.role;
                // ✅ allow only these roles
                if (role === "Admin1" || role === "employee") {
                    return; // do nothing ✅
                }

                // ❌ any other role → logout
                localStorage.removeItem("token");
                router.replace("/login");

            } catch (err) {
                console.log("Token verify error:", err);
                localStorage.removeItem("token");
                router.replace("/login");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    const paidRentTotal = useMemo(() => schedule.filter(r => r.status === "paid").reduce((s, r) => s + r.amount, 0), [schedule]);
    const pendingRentTotal = useMemo(() => schedule.filter(r => r.status === "pending").reduce((s, r) => s + r.amount, 0), [schedule]);
    const nextBillingDate = schedule.find(r => r.status === "pending")?.dueDate ?? null;
    const rentalEndDate = schedule.length > 0 ? schedule[schedule.length - 1].dueDate : null;
    const progressPct = grandTotal > 0 ? Math.min(100, Math.round((paidRentTotal / grandTotal) * 100)) : 0;
    const progressColor = progressPct >= 100 ? "bg-emerald-500" : progressPct >= 60 ? "bg-sky-500" : progressPct >= 30 ? "bg-amber-400" : "bg-rose-400";

    function toggleStatus(id) {
        setSchedule(prev => prev.map(r => r._id === id ? { ...r, status: r.status === "paid" ? "pending" : "paid", updatedAt: new Date().toISOString().slice(0, 10) } : r));
    }

    const addAccessory = () => setAccessories([...accessories, { name: "" }]);
    const removeAccessory = (i) => { const a = [...accessories]; a.splice(i, 1); setAccessories(a); };
    const handleAccessoryChange = (i, value) => { const a = [...accessories]; a[i].name = value; setAccessories(a); };

    // ── Per-step validation ────────────────────────────────────────────────────
    function validateStep(s) {
        const e = {};
        if (s === 1) {
            if (!name.trim()) e.name = "Patient name is required";
            if (!phone.trim()) e.phone = "Primary phone is required";
            else if (!/^\d{10}$/.test(phone.trim())) e.phone = "Enter a valid 10-digit phone number";
            if (!altPhone.trim()) e.altPhone = "Alternate phone is required";
            else if (!/^\d{10}$/.test(altPhone.trim())) e.altPhone = "Enter a valid 10-digit number";
            if (!whatsapp.trim()) e.whatsapp = "WhatsApp number is required";
            else if (!/^\d{10}$/.test(whatsapp.trim())) e.whatsapp = "Enter a valid 10-digit number";
            if (!dob.trim()) e.dob = "Date of birth is required";
            if (!address.trim()) e.address = "Address is required";
        }
        if (s === 2) {
            if (!doctorId) e.doctorId = "Please select a doctor or source";
            if (doctorId === "others" && !otherSource.trim()) e.otherSource = "Please enter referral source";
            if (!selectedBranch) e.selectedBranch = "Please select a branch";
            if (!machineId) e.machineId = "Please select a machine";
            if (!employeeId) e.employeeId = "Please select an employee";
            if (employeeId === "others" && !otherEmployee.trim()) e.otherEmployee = "Please enter employee name";
        }
        if (s === 3) {
            if (!duration) e.duration = "Please select a rental duration";
            if (!rentPerPeriod || rentPerPeriod <= 0) e.perPeriodRent = `Enter the ${isDailyMode ? "per period" : "per month"} rent amount`;
            if (security < 0) e.securityAmount = "Security amount cannot be negative";
            if (!paymentMode) e.paymentMode = "Select payment mode";
            if (paymentMode === "online" && !paymentAcc.trim()) e.paymentAcc = "Enter account / UPI details";
            if (!startDate) e.startDate = "Please select a start date";
        }
        return e;
    }

    function next() {
        const errs = validateStep(step);
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setStep(s => s + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    function back() {
        setErrors({});
        setStep(s => s - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // ── Submit ─────────────────────────────────────────────────────────────────
    async function handleSubmit() {
        setLoading(true);
        const payload = {
            name: name.trim(), phone: phone.trim(), altPhone: altPhone.trim(),
            whatsapp: whatsapp.trim(), address: address.trim(), dob, age, review,
            otherSource: otherSource.trim(),
            refMachine: machineId,
            refDoctor: doctorId === "others" ? "000000000000000000000000" : doctorId,
            refEmployee: employeeId === "others" ? "000000000000000000000000" : employeeId,
            otherEmployee: otherEmployee.trim(),
            branch: selectedBranch,
            paymentType: "rent",
            rentPerPeriod,
            accessories: accessories.filter(a => a.name.trim()).map(a => ({ name: a.name })),
            grandTotal,
            securityAmount: security,
            paymentMode,
            paymentAcc,
            duration, startDate,
            ...(machineReturnDate ? { returnDate: machineReturnDate } : {}),
            monthlyRent: schedule.map(({ month, dueDate, amount, status, updatedAt }) => ({ month, dueDate, amount, status, updatedAt })),
        };
        try {
            const res = await fetch("/api/patients", {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(await res.text());
            generatePatientPDF(payload, schedule, {
                doctorName,
                machineName,
                employeeName,
                durationLabel,
                slNo
            });
            setSubmitted(true);
            // onSuccess?.(payload);
        } catch (err) {
            console.error(err);
            setSubmitted(true);
        } finally {
            setLoading(false);
        }
    }

    function resetForm() {
        setStep(1);
        setName(""); setPhone(""); setAltPhone(""); setWhatsapp("");
        setDob(""); setAge(""); setAddress(""); setReview(false);
        setDoctorId(""); setOtherSource(""); setMachineId(""); setEmployeeId(""); setOtherEmployee("");
        setSelectedBranch(""); setBranchMachines([]);
        setAccessories([{ name: "" }]);
        setPerPeriodRent(""); setSecurityAmount(""); setPaymentMode(""); setPaymentAcc(""); setDuration("");
        setStartDate(todayISO()); setMachineReturnDate("");
        setSchedule([]); setErrors({}); setSubmitted(false);
    }

    // ── Lookup helpers ─────────────────────────────────────────────────────────
    const doctorName = doctorId === "others"
        ? (otherSource ? `Others (${otherSource})` : "Others")
        : (doctors.find(d => d._id === doctorId)?.name || "—");
    const machineName = branchMachines.find(m => m._id === machineId)?.name || "—";
    const slNo = branchMachines.find(m => m._id === machineId)?.serialNumber || "—";
    const employeeName = employeeId === "others"
        ? (otherEmployee ? `Others (${otherEmployee})` : "Others")
        : (employees.find(e => e._id === employeeId)?.name || "—");
    const durationLabel = duration
        ? isDailyMode ? `${durationNum} day${durationNum > 1 ? "s" : ""}` : `${durationNum} month${durationNum > 1 ? "s" : ""}`
        : "—";
    const paymentModeLabel = paymentMode === "cash"
        ? "Cash"
        : paymentMode === "online"
            ? `Online${paymentAcc ? ` — ${paymentAcc}` : ""}`
            : "—";

    // ── Success screen ─────────────────────────────────────────────────────────
    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-10 max-w-sm w-full text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-1">Patient Registered!</h2>
                    <p className="text-sm text-slate-500 mb-6">
                        <span className="font-semibold text-slate-700">{name}</span> saved with{" "}
                        <span className="font-semibold text-teal-600">{schedule.length} rental{schedule.length !== 1 ? "s" : ""}</span>.
                    </p>
                    {nextBillingDate && (
                        <div className="flex justify-between items-center bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-3">
                            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Next billing</span>
                            <span className="text-sm font-bold font-mono text-amber-800">{fmtDateShort(nextBillingDate)}</span>
                        </div>
                    )}
                    {machineReturnDate && (
                        <div className="flex justify-between items-center bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 mb-3">
                            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Machine return</span>
                            <span className="text-sm font-bold font-mono text-rose-800">{fmtDateShort(machineReturnDate)}</span>
                        </div>
                    )}
                    {security > 0 && (
                        <div className="flex justify-between items-center bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 mb-6">
                            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Security (refundable)</span>
                            <span className="text-sm font-bold font-mono text-emerald-800">{fmt(security)}</span>
                        </div>
                    )}
                    <button onClick={resetForm} className="w-full py-3 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 transition-colors">
                        Register another patient
                    </button>
                </div>
            </div>
        );
    }

    // ── RENDER ─────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6">

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-teal-600 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 leading-tight">New Patient Record</h1>
                        <p className="text-xs text-slate-400">Machine rental &amp; payment registration</p>
                    </div>
                </div>

                <StepBar current={step} />

                {/* Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                    {/* Card header */}
                    <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50/70">
                        <span className="text-base">{STEPS[step - 1].icon}</span>
                        <div>
                            <p className="text-sm font-bold text-slate-700">{STEPS[step - 1].title}</p>
                            <p className="text-[10px] text-slate-400 font-medium">Step {step} of {STEPS.length}</p>
                        </div>
                    </div>

                    <div className="p-5 sm:p-6">

                        {/* ─── STEP 1: Patient Info ─────────────────────────────────── */}
                        {step === 1 && (
                            <div className="flex flex-col gap-4">
                                <div>
                                    <FieldLabel required>Patient Name</FieldLabel>
                                    <TextInput type="text" placeholder="e.g. Arjun Mehta"
                                        value={name} onChange={e => setName(e.target.value)} error={errors.name} />
                                    <ErrorMsg msg={errors.name} />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <FieldLabel required>Primary Phone</FieldLabel>
                                        <TextInput type="tel" placeholder="9876543210"
                                            value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                                            error={errors.phone} maxLength={10} />
                                        <ErrorMsg msg={errors.phone} />
                                    </div>
                                    <div>
                                        <FieldLabel required>Alternate Phone</FieldLabel>
                                        <TextInput type="tel" placeholder="9876543210"
                                            value={altPhone} onChange={e => setAltPhone(e.target.value.replace(/\D/g, ""))}
                                            error={errors.altPhone} maxLength={10} />
                                        <ErrorMsg msg={errors.altPhone} />
                                    </div>
                                    <div>
                                        <FieldLabel required>WhatsApp Number</FieldLabel>
                                        <TextInput type="tel" placeholder="9876543210"
                                            value={whatsapp} onChange={e => setWhatsapp(e.target.value.replace(/\D/g, ""))}
                                            error={errors.whatsapp} maxLength={10} />
                                        <ErrorMsg msg={errors.whatsapp} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <FieldLabel required>Date of Birth</FieldLabel>
                                        <TextInput type="date" value={dob}
                                            onChange={(e) => {
                                                const v = e.target.value; setDob(v);
                                                if (v) {
                                                    const birth = new Date(v); const today = new Date();
                                                    let a = today.getFullYear() - birth.getFullYear();
                                                    const md = today.getMonth() - birth.getMonth();
                                                    if (md < 0 || (md === 0 && today.getDate() < birth.getDate())) a--;
                                                    setAge(a);
                                                }
                                            }} error={errors.dob} />
                                        <ErrorMsg msg={errors.dob} />
                                    </div>
                                    <div>
                                        <FieldLabel>Age (auto-calculated)</FieldLabel>
                                        <TextInput type="number" value={age || ""} disabled className="opacity-60" />
                                    </div>
                                </div>
                                <div>
                                    <FieldLabel required>Address</FieldLabel>
                                    <TextareaInput placeholder="House no., Street, City, State, Pincode"
                                        value={address} onChange={e => setAddress(e.target.value)} error={errors.address} />
                                    <ErrorMsg msg={errors.address} />
                                </div>

                                <div className="p-4 border rounded-lg bg-white shadow-sm">
                                    <h3 className="font-semibold text-gray-800 mb-2">Google Review Status</h3>
                                    <div className="flex gap-4 items-center">
                                        <label className="flex items-center gap-2">
                                            <input type="radio" name="review" checked={review === true} onChange={() => setReview(true)} />
                                            <span className="text-green-600 font-medium">Yes</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="radio" name="review" checked={review === false} onChange={() => setReview(false)} />
                                            <span className="text-red-500 font-medium">No</span>
                                        </label>
                                    </div>
                                    {!review && (
                                        <p className="mt-3 text-sm text-orange-600">
                                            ⚠ Please collect Google review during machine return/uninstall.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ─── STEP 2: Assignment ───────────────────────────────────── */}
                        {step === 2 && (
                            <div className="flex flex-col gap-5">

                                <div>
                                    <FieldLabel required>Referred By / Lead By</FieldLabel>
                                    {doctorsLoading ? (
                                        <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-400">
                                            <Spinner /> Loading doctors…
                                        </div>
                                    ) : (
                                        <SelectInput value={doctorId}
                                            onChange={e => { setDoctorId(e.target.value); if (e.target.value !== "others") setOtherSource(""); }}
                                            error={errors.doctorId}>
                                            <option value="">Select doctor</option>
                                            {doctors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                                            <option value="others">Others</option>
                                        </SelectInput>
                                    )}
                                    <ErrorMsg msg={errors.doctorId} />
                                    {doctorId === "others" && (
                                        <div className="mt-3">
                                            <FieldLabel required>Enter Source</FieldLabel>
                                            <TextInput type="text" placeholder="Enter referral source"
                                                value={otherSource} onChange={e => setOtherSource(e.target.value)}
                                                error={errors.otherSource} />
                                            <ErrorMsg msg={errors.otherSource} />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <FieldLabel required>Region / Branch</FieldLabel>
                                    <p className="text-[11px] text-slate-400 mb-2">Select a branch to see available machines</p>
                                    <SelectInput value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)} error={errors.selectedBranch}>
                                        <option value="">Choose a branch…</option>
                                        {["Odisha", "Kolkata", "Ranchi", "Patna", "Bangalore"].map(b => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </SelectInput>
                                    <ErrorMsg msg={errors.selectedBranch} />
                                </div>

                                <div>
                                    <FieldLabel required>Machine</FieldLabel>
                                    {!selectedBranch ? (
                                        <div className="flex items-center gap-2 px-3 py-2.5 border border-dashed border-slate-200 rounded-xl text-sm text-slate-400 bg-slate-50">
                                            <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Select a branch first to see machines
                                        </div>
                                    ) : branchMachinesLoading ? (
                                        <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-400">
                                            <Spinner /> Loading machines for {selectedBranch}…
                                        </div>
                                    ) : branchMachines.length === 0 ? (
                                        <div className="flex items-center gap-2 px-3 py-2.5 border border-amber-200 bg-amber-50 rounded-xl text-sm text-amber-700">
                                            <span>⚠</span> No machines available in {selectedBranch}
                                        </div>
                                    ) : (
                                        <SelectInput value={machineId} onChange={e => setMachineId(e.target.value)} error={errors.machineId}>
                                            <option value="">Select machine</option>
                                            {branchMachines.map(m => (
                                                <option key={m._id} value={m._id}>
                                                    {m.name}{m.serialNumber ? ` — ${m.serialNumber}` : ""}
                                                </option>
                                            ))}
                                        </SelectInput>
                                    )}
                                    <ErrorMsg msg={errors.machineId} />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <FieldLabel>Extra Accessories <span className="text-slate-400 font-normal normal-case tracking-normal text-xs">(optional)</span></FieldLabel>
                                        <button type="button" onClick={addAccessory}
                                            className="text-xs font-semibold text-teal-600 border border-teal-200 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-all">
                                            + Add Accessory
                                        </button>
                                    </div>
                                    {accessories.map((item, index) => (
                                        <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 mb-2">
                                            <TextInput type="text" placeholder="Accessory name" value={item.name}
                                                onChange={e => handleAccessoryChange(index, e.target.value)} />
                                            <button type="button" onClick={() => removeAccessory(index)}
                                                className="flex items-center justify-center w-10 h-10 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 transition-all self-start">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {!user && (
                                    <div>
                                        <FieldLabel required>Installed By</FieldLabel>
                                        {employeesLoading ? (
                                            <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-400">
                                                <Spinner /> Loading employees…
                                            </div>
                                        ) : (
                                            <SelectInput value={employeeId}
                                                onChange={e => { setEmployeeId(e.target.value); if (e.target.value !== "others") setOtherEmployee(""); }}
                                                error={errors.employeeId}>
                                                <option value="">Select employee</option>
                                                {employees.map(em => <option key={em._id} value={em._id}>{em.name}</option>)}
                                                <option value="others">Others</option>
                                            </SelectInput>
                                        )}
                                        <ErrorMsg msg={errors.employeeId} />
                                        {employeeId === "others" && (
                                            <div className="mt-3">
                                                <FieldLabel required>Enter Name</FieldLabel>
                                                <TextInput type="text" placeholder="Enter employee name"
                                                    value={otherEmployee} onChange={e => setOtherEmployee(e.target.value)}
                                                    error={errors.otherEmployee} />
                                                <ErrorMsg msg={errors.otherEmployee} />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ─── STEP 3: Rental Setup ─────────────────────────────────── */}
                        {step === 3 && (
                            <div className="flex flex-col gap-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</div>
                                        <p className="text-sm font-bold text-slate-700">Select Rental Duration</p>
                                    </div>
                                    <DurationPicker value={duration} onChange={(val) => {
                                        setDuration(val);
                                        if (val.startsWith("d:")) setStartDate(todayISO());
                                        else setStartDate(sameDayNextMonth());
                                    }} error={errors.duration} />
                                    <ErrorMsg msg={errors.duration} />
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</div>
                                        <p className="text-sm font-bold text-slate-700">Payment Mode</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <FieldLabel required>Payment Type</FieldLabel>
                                            <SelectInput
                                                value={paymentMode}
                                                onChange={(e) => {
                                                    setPaymentMode(e.target.value);
                                                    if (e.target.value !== "online") setPaymentAcc("");
                                                }}
                                                error={errors.paymentMode}
                                            >
                                                <option value="">Select</option>
                                                <option value="cash">Cash</option>
                                                <option value="online">Online</option>
                                            </SelectInput>
                                            <ErrorMsg msg={errors.paymentMode} />
                                        </div>
                                        {paymentMode === "online" && (
                                            <div>
                                                <FieldLabel required>Account / UPI / Bank Details</FieldLabel>
                                                <TextInput
                                                    type="text"
                                                    placeholder="e.g. SBI A/c 1234 / GPay / PhonePe / UPI ID"
                                                    value={paymentAcc}
                                                    onChange={(e) => setPaymentAcc(e.target.value)}
                                                    error={errors.paymentAcc}
                                                />
                                                <ErrorMsg msg={errors.paymentAcc} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</div>
                                        <p className="text-sm font-bold text-slate-700">Rental Charges</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <FieldLabel required>Rent {isDailyMode ? `(due after ${durationNum} day${durationNum > 1 ? "s" : ""})` : isMonthMode ? "per month" : "per period"}</FieldLabel>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 pointer-events-none">₹</span>
                                                <TextInput type="number" placeholder={isDailyMode ? "e.g. 2000" : "e.g. 4000"} min="0" step="1"
                                                    value={perPeriodRent} onChange={e => setPerPeriodRent(e.target.value)}
                                                    error={errors.perPeriodRent} className="pl-7" />
                                            </div>
                                            <ErrorMsg msg={errors.perPeriodRent} />
                                            {rentPerPeriod > 0 && durationNum > 0 && (
                                                <p className="mt-1 text-[10px] text-teal-600 font-medium">
                                                    {isDailyMode
                                                        ? `${fmt(rentPerPeriod)} due after ${durationNum} day${durationNum > 1 ? "s" : ""}`
                                                        : `${fmt(rentPerPeriod)} × ${durationNum} month${durationNum > 1 ? "s" : ""} = ${fmt(rentTotal)}`
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <FieldLabel>Security Deposit <span className="ml-1.5 inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5 normal-case tracking-normal">↩ refundable</span></FieldLabel>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 pointer-events-none">₹</span>
                                                <TextInput type="number" placeholder="0" min="0" step="1"
                                                    value={securityAmount} onChange={e => setSecurityAmount(e.target.value)}
                                                    error={errors.securityAmount} className="pl-7" />
                                            </div>
                                            <ErrorMsg msg={errors.securityAmount} />
                                            <p className="mt-1 text-[10px] text-emerald-600 font-medium">Collected upfront, returned at rental end.</p>
                                        </div>
                                    </div>
                                </div>

                                {rentPerPeriod > 0 && (
                                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 divide-y divide-slate-100 overflow-hidden">
                                        <div className="flex justify-between items-center px-4 py-2.5">
                                            <span className="text-xs font-semibold text-slate-500">
                                                {isDailyMode
                                                    ? `Rent (due after ${durationNum || "—"} day${durationNum > 1 ? "s" : ""})`
                                                    : `Rent (${fmt(rentPerPeriod)} × ${durationNum || "—"} months)`
                                                }
                                            </span>
                                            <span className="text-sm font-bold font-mono text-slate-700">{fmt(rentTotal)}</span>
                                        </div>
                                        <div className="flex justify-between items-center px-4 py-3 bg-teal-50">
                                            <div>
                                                <p className="text-sm font-bold text-teal-800">Grand Total</p>
                                                {durationNum > 0 && grandTotal > 0 && (
                                                    <p className="text-[10px] text-teal-600 font-medium mt-0.5">
                                                        {isDailyMode
                                                            ? `1 rental · due on ${fmtDateShort(schedule[0]?.dueDate)}`
                                                            : `÷ ${durationNum} month${durationNum > 1 ? "s" : ""} = ${fmt(perInstalment)}/rental${instalmentRem > 0 ? ` (+₹1 first ${instalmentRem})` : ""}`
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <span className="text-base font-bold font-mono text-teal-700">{fmt(grandTotal)}</span>
                                        </div>
                                        {security > 0 && (
                                            <div className="flex justify-between items-center px-4 py-2.5 bg-emerald-50">
                                                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                    </svg>
                                                    Security deposit (refundable · not in rentals)
                                                </span>
                                                <span className="text-sm font-bold font-mono text-emerald-700">{fmt(security)}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">4</div>
                                        <p className="text-sm font-bold text-slate-700">Rental Dates</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <FieldLabel required>Rental start date
                                                <span className="ml-1 text-teal-500 font-bold normal-case tracking-normal text-[10px]">
                                                    {isDailyMode ? "auto: today" : "auto: same day next month"}
                                                </span>
                                            </FieldLabel>
                                            <TextInput type="date" value={startDate} onChange={e => setStartDate(e.target.value)} error={errors.startDate} />
                                            <p className="mt-1 text-[10px] text-slate-400">
                                                {isDailyMode
                                                    ? `Payment due ${durationNum} day${durationNum > 1 ? "s" : ""} after this date.`
                                                    : "Each month's due date follows this day."
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <FieldLabel>Machine return date <span className="ml-1 text-amber-500 font-bold normal-case tracking-normal text-[10px]">auto: last due date</span></FieldLabel>
                                            <TextInput type="date" value={machineReturnDate} onChange={e => setMachineReturnDate(e.target.value)} />
                                            <p className="mt-1 text-[10px] text-slate-400">Auto-set to last rental date. Adjust if needed.</p>
                                        </div>
                                    </div>
                                </div>

                                {hasCalc && (
                                    <div className="flex flex-wrap gap-2">
                                        <InfoChip label="Duration" value={durationLabel} color="violet" />
                                        <InfoChip label="Grand total" value={fmt(grandTotal)} color="rose" />
                                        {security > 0 && <InfoChip label="Security" value={fmt(security)} color="emerald" />}
                                        {nextBillingDate && <InfoChip label="Due date" value={fmtDateShort(nextBillingDate)} color="amber" />}
                                        {machineReturnDate && <InfoChip label="Return date" value={fmtDateShort(machineReturnDate)} color="sky" />}
                                    </div>
                                )}

                                {schedule.length > 0 && (
                                    <div>
                                        <div className="flex items-start gap-3 bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 mb-2">
                                            <svg className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-xs text-teal-700 leading-relaxed">
                                                {isDailyMode
                                                    ? <span className="font-bold">1 rental · {fmt(grandTotal)} due on {fmtDateShort(schedule[0]?.dueDate)} ({durationNum} day{durationNum > 1 ? "s" : ""} from start).</span>
                                                    : <><span className="font-bold">{durationNum} rental{durationNum > 1 ? "s" : ""} · {fmt(perInstalment)}/rental · {fmt(grandTotal)} grand total</span>.{" "}
                                                        {`Due on the ${startDate.split("-")[2].replace(/^0/, "")}th of each month.`}
                                                        {instalmentRem > 0 && ` First ${instalmentRem} rental${instalmentRem > 1 ? "s" : ""} are ₹1 more.`}
                                                    </>
                                                }
                                            </p>
                                        </div>
                                        <InstalmentTable schedule={schedule} onToggle={toggleStatus} isDailyMode={isDailyMode} />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ─── STEP 4: Review & Save ────────────────────────────────── */}
                        {step === 4 && (
                            <div className="flex flex-col gap-5">

                                {/* ── Patient Information ── */}
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Patient Information</p>
                                    <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 divide-y divide-slate-100">
                                        <ReviewRow label="Name" value={name} />
                                        <ReviewRow label="Primary Phone" value={phone} />
                                        <ReviewRow label="Alternate Phone" value={altPhone} />
                                        <ReviewRow label="WhatsApp" value={whatsapp} />
                                        <ReviewRow label="Date of Birth" value={fmtDateShort(dob)} />
                                        <ReviewRow label="Age" value={age ? `${age} yrs` : "—"} />
                                        <ReviewRow label="Address" value={address || "—"} />
                                        <ReviewRow label="Google Review" badge={review ? "yes" : "no"} />
                                    </div>
                                </div>

                                {/* ── Assignment ── */}
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Assignment</p>
                                    <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 divide-y divide-slate-100">
                                        <ReviewRow label="Referred By" value={doctorName} />
                                        <ReviewRow label="Branch" value={selectedBranch || "—"} />
                                        <ReviewRow label="Machine" value={machineName} />
                                        <ReviewRow label="Installed By" value={employeeName} />
                                        {accessories.filter(a => a.name.trim()).length > 0
                                            ? accessories.filter(a => a.name.trim()).map((a, i) => (
                                                <ReviewRow key={i} label={`Accessory ${i + 1}`} value={a.name} />
                                            ))
                                            : <ReviewRow label="Accessories" value="None" />
                                        }
                                    </div>
                                </div>

                                {/* ── Rental Details ── */}
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Rental Details</p>
                                    <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 divide-y divide-slate-100">
                                        <ReviewRow label="Duration" value={durationLabel} />
                                        <ReviewRow label={isDailyMode ? `Rent (due after ${durationNum} days)` : "Rent per month"} value={fmt(rentPerPeriod)} />
                                        <ReviewRow label="Grand Total" value={fmt(grandTotal)} />
                                        {!isDailyMode && <ReviewRow label="Per Rental" value={`${fmt(perInstalment)}${instalmentRem > 0 ? ` (+₹1 first ${instalmentRem})` : ""}`} />}
                                        {security > 0 && <ReviewRow label="Security (refundable)" value={fmt(security)} />}
                                        <ReviewRow label="Payment Mode" value={paymentModeLabel} />
                                        <ReviewRow label="Start Date" value={fmtDateShort(startDate)} />
                                        <ReviewRow label={isDailyMode ? "Payment Due On" : "Rental Ends"} value={rentalEndDate ? fmtDateShort(rentalEndDate) : "—"} />
                                        {machineReturnDate && <ReviewRow label="Machine Return" value={fmtDateShort(machineReturnDate)} />}
                                    </div>
                                </div>

                                {/* ── Recovery progress ── */}
                                <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5">
                                    <div className="flex justify-between text-xs text-slate-500 mb-2">
                                        <span className="font-semibold">Recovery progress</span>
                                        <span className="font-bold text-slate-700 font-mono">{fmt(paidRentTotal)} of {fmt(grandTotal)}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full transition-all duration-500 ${progressColor}`} style={{ width: `${progressPct}%` }} />
                                        </div>
                                        <span className="text-xs font-bold font-mono text-slate-500 w-9 text-right">{progressPct}%</span>
                                    </div>
                                </div>

                                {/* ── Summary chips ── */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {[
                                        { label: "Grand total", value: fmt(grandTotal), cls: "text-slate-800" },
                                        { label: "Security", value: fmt(security), cls: "text-emerald-600" },
                                        { label: "Rent collected", value: fmt(paidRentTotal), cls: "text-emerald-600" },
                                        { label: "Rent pending", value: fmt(pendingRentTotal), cls: pendingRentTotal > 0 ? "text-amber-600" : "text-emerald-600" },
                                    ].map(s => (
                                        <div key={s.label} className="bg-white border border-slate-100 rounded-xl px-3 py-2.5">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{s.label}</p>
                                            <p className={`text-base font-bold font-mono ${s.cls}`}>{s.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* ── Rental schedule ── */}
                                {schedule.length > 0 && (
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Rental Schedule Preview</p>
                                        <InstalmentTable schedule={schedule} onToggle={null} isDailyMode={isDailyMode} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer nav */}
                    <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50/50">
                        {step > 1 ? (
                            <button type="button" onClick={back}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                                Back
                            </button>
                        ) : <div />}

                        {step < STEPS.length ? (
                            <button type="button" onClick={next}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 active:scale-[0.99] transition-all shadow-sm">
                                Continue
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        ) : (
                            <button type="button" onClick={handleSubmit} disabled={loading}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 active:scale-[0.99] transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
                                {loading ? (
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z" />
                                        <polyline points="17 21 17 13 7 13 7 21" />
                                        <polyline points="7 3 7 8 15 8" />
                                    </svg>
                                )}
                                {loading ? "Saving…" : "Save Patient Record"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}