// "use client";
// import React, { useEffect, useState, useMemo } from "react";
// import { RefreshCcw, Bell, CalendarClock, Activity, ClipboardList, IndianRupee, PackageX, Plus, RotateCcw, Wind, Heart, Cpu, Droplets, Phone, User, AlertCircle, CheckCircle2, Loader2, AlertTriangle, Clock, ChevronDown, ChevronUp, Download, PackageCheck } from "lucide-react";
// import Link from "next/link";
// import * as XLSX from "xlsx";
// import UninstallModal from "@/app/employee/UninstallModal";

// // ── Formatters ────────────────────────────────────────────────────────────────
// const AVATAR_BG = ["bg-teal-500", "bg-indigo-500", "bg-rose-500", "bg-amber-500", "bg-sky-500", "bg-violet-500", "bg-emerald-500", "bg-pink-500"];
// const avatarBg = n => AVATAR_BG[n.charCodeAt(0) % AVATAR_BG.length];
// const initials = n => n.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
// const fmtCurrency = v => `₹${Number(v).toLocaleString("en-IN")}`;
// const fmtINR = n => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
// const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
// const todayStr = () => new Date().toISOString().split("T")[0];
// const diffDays = (a, b = todayStr()) => Math.ceil((new Date(a) - new Date(b)) / 86400000);
// const parseDuration = d => {
//     if (!d) return "—";
//     const [unit, val] = d.split(":");
//     if (unit === "d") return `${val} day${Number(val) > 1 ? "s" : ""}`;
//     if (unit === "m") return `${val} month${Number(val) > 1 ? "s" : ""}`;
//     return d;
// };

// // ── Date group helpers ────────────────────────────────────────────────────────
// function getDateGroupKey(isoDate) {
//     if (!isoDate) return "Unknown";
//     const d = new Date(isoDate);
//     const today = new Date();
//     const yesterday = new Date();
//     yesterday.setDate(today.getDate() - 1);
//     const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
//     if (sameDay(d, today)) return "Today";
//     if (sameDay(d, yesterday)) return "Yesterday";
//     return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
// }

// function groupByDate(list) {
//     const groups = [];
//     const seen = new Map();
//     for (const r of list) {
//         const key = getDateGroupKey(r.createdAt);
//         if (!seen.has(key)) { seen.set(key, groups.length); groups.push({ key, items: [] }); }
//         groups[seen.get(key)].items.push(r);
//     }
//     return groups;
// }

// // ── Payment helpers ───────────────────────────────────────────────────────────
// const paidRentTotal = p => (p.monthlyRent || []).filter(r => r.status === "paid").reduce((s, r) => s + r.amount, 0);
// const pendingRentTotal = p => (p.monthlyRent || []).filter(r => r.status === "pending").reduce((s, r) => s + r.amount, 0);
// const progressPct = p => !p.grandTotal ? 0 : Math.min(100, Math.round((paidRentTotal(p) / p.grandTotal) * 100));

// // ── Transform raw patient → enriched record ───────────────────────────────────
// function transformPatient(p) {
//     const monthlyRent = p.monthlyRent || [];
//     const pendingMonths = monthlyRent.filter(m => m.status === "pending");
//     const paidMonths = monthlyRent.filter(m => m.status === "paid");
//     const paymentDue = pendingMonths.reduce((s, m) => s + (m.amount || 0), 0);
//     const sortedPending = [...pendingMonths].sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0));
//     const nextPending = sortedPending[0] || null;
//     const paymentDueDate = nextPending?.dueDate ? new Date(nextPending.dueDate).toISOString().split("T")[0] : null;
//     const nextUnpaidMonth = nextPending?.month || null;

//     // returnDate comes from DB (set when machine is assigned/returned)
//     const returnDate = p.returnDate ? new Date(p.returnDate).toISOString().split("T")[0] : null;
//     const isReturned = !!p.isReturned;

//     const allPaid = (monthlyRent.length > 0 && pendingMonths.length === 0) || p.paymentType === "fully_paid";

//     // Returned machines are always "Completed" — no overdue/due-soon
//     let status = "Active";
//     if (isReturned) {
//         status = "Completed";
//     } else if (paymentDueDate && diffDays(paymentDueDate) < 0 && paymentDue > 0) {
//         status = "Overdue";
//     } else if (
//         (paymentDueDate && diffDays(paymentDueDate) <= 7 && paymentDue > 0) ||
//         (returnDate && diffDays(returnDate) >= 0 && diffDays(returnDate) <= 7)
//     ) {
//         status = "Due Soon";
//     }
//     if (allPaid) status = "Completed";

//     return {
//         _raw: p,
//         id: p._id,
//         patientName: p.name || "Unknown",
//         age: p.age, phone: p.phone, altPhone: p.altPhone, whatsapp: p.whatsapp,
//         address: p.address, dob: p.dob,
//         paymentType: p.paymentType || null,
//         paymentDue: isReturned ? 0 : paymentDue,   // returned → no pending due shown
//         paymentDueDate: isReturned ? null : paymentDueDate,
//         nextUnpaidMonth: isReturned ? null : nextUnpaidMonth,
//         totalMonths: monthlyRent.length, paidMonths: paidMonths.length, allPaid,
//         returnDate, status, isReturned,
//         machine: p.refMachine?.name || null,
//         machineSerial: p.refMachine?.serialNumber || null,
//         machineType: p.refMachine?.type || null,
//         refDoctor: p.refDoctor?.name || p.otherSource || null,
//         refEmployee: p.refEmployee?.name || p.otherEmployee || null,
//         duration: p.duration, startDate: p.startDate, rentPerPeriod: p.rentPerPeriod,
//         grandTotal: p.grandTotal, securityAmount: p.securityAmount,
//         paymentAcc: p.paymentAcc,
//         paymentMode: p.paymentMode,
//         accessories: p.accessories,
//         createdAt: p.createdAt,
//         monthlyRentRaw: monthlyRent,
//         pct: progressPct(p),
//         totalPaidAmt: paidRentTotal(p),
//         pendingAmt: isReturned ? 0 : pendingRentTotal(p),
//     };
// }

// // ── Machine Icons ─────────────────────────────────────────────────────────────
// const MACHINE_ICONS = { Ventilator: Wind, BiPAP: Wind, CPAP: Heart, Oxygen: Droplets, "BiPAP Auto": Wind, default: Cpu };
// function MachineIcon({ type, size = 14 }) {
//     const Icon = MACHINE_ICONS[type] || MACHINE_ICONS.default;
//     return <Icon size={size} />;
// }

// // ── Atoms ─────────────────────────────────────────────────────────────────────
// function Avatar({ name, size = "sm" }) {
//     const sz = { lg: "w-12 h-12 text-base", md: "w-9 h-9 text-sm", sm: "w-8 h-8 text-xs" }[size];
//     return (
//         <div className={`${sz} ${avatarBg(name)} rounded-full flex items-center justify-center text-white font-bold shrink-0 select-none`}>
//             {initials(name)}
//         </div>
//     );
// }

// function PaymentBadge({ variant }) {
//     const map = {
//         paid: ["bg-emerald-50 text-emerald-700 border-emerald-200", "Paid"],
//         pending: ["bg-amber-50 text-amber-700 border-amber-200", "Pending"],
//         fully_paid: ["bg-sky-50 text-sky-700 border-sky-200", "Fully Paid"],
//         rent: ["bg-violet-50 text-violet-700 border-violet-200", "Rent"],
//         returned: ["bg-gray-100 text-gray-600 border-gray-300", "Returned"],
//     };
//     const [cls, label] = map[variant] || ["bg-gray-100 text-gray-600 border-gray-200", variant];
//     return <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${cls}`}>{label}</span>;
// }

// function StatusBadge({ status, allPaid, isReturned }) {
//     if (isReturned) {
//         return (
//             <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-gray-100 text-gray-600 border-gray-300">
//                 <PackageCheck size={10} /> Returned
//             </span>
//         );
//     }
//     if (status === "Completed" && allPaid) {
//         return (
//             <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
//                 <CheckCircle2 size={10} /> Fully Paid
//             </span>
//         );
//     }
//     const map = {
//         "Due Soon": "bg-amber-50 text-amber-700 border-amber-200",
//         Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
//         Completed: "bg-slate-100 text-slate-500 border-slate-200",
//         Overdue: "bg-red-50 text-red-600 border-red-200",
//     };
//     const dot = { "Due Soon": "bg-amber-400", Active: "bg-emerald-500", Completed: "bg-slate-400", Overdue: "bg-red-500" };
//     return (
//         <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${map[status] || map.Active}`}>
//             <span className={`w-1.5 h-1.5 rounded-full ${dot[status] || dot.Active}`} />
//             {status}
//         </span>
//     );
// }

// function ProgressBar({ pct }) {
//     const color = pct === 100 ? "bg-emerald-500" : pct >= 60 ? "bg-sky-500" : pct >= 30 ? "bg-amber-400" : "bg-rose-400";
//     return (
//         <div className="flex items-center gap-2 w-full">
//             <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
//                 <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
//             </div>
//             <span className="text-xs text-gray-500 shrink-0 tabular-nums">{pct}%</span>
//         </div>
//     );
// }

// // ── Next Payment Cell ─────────────────────────────────────────────────────────
// function NextPaymentCell({ r }) {
//     if (r.isReturned) {
//         return (
//             <div className="flex items-center gap-1.5">
//                 <PackageCheck size={13} className="text-gray-400" />
//                 <span className="text-[12px] text-gray-500 font-semibold">Returned</span>
//             </div>
//         );
//     }
//     if (r.paymentDue === 0 || !r.paymentDueDate) {
//         return (
//             <div className="flex flex-col gap-1">
//                 <div className="flex items-center gap-1.5">
//                     <CheckCircle2 size={13} className="text-emerald-500" />
//                     <span className="text-[12px] text-emerald-700 font-bold">All Paid</span>
//                 </div>
//                 {r.totalMonths > 0 && <span className="text-[10px] text-slate-400">{r.paidMonths}/{r.totalMonths} paid</span>}
//             </div>
//         );
//     }
//     const days = diffDays(r.paymentDueDate);
//     const overdue = days < 0;
//     const isToday = days === 0;
//     const urgent = days > 0 && days <= 3;
//     const soon = days > 3 && days <= 7;
//     let pillCls = "bg-slate-50 border-slate-200 text-slate-500";
//     let amtCls = "text-slate-800";
//     if (overdue || isToday) { pillCls = "bg-red-50 border-red-200 text-red-700"; amtCls = "text-red-600"; }
//     else if (urgent) { pillCls = "bg-amber-50 border-amber-200 text-amber-800"; amtCls = "text-amber-700"; }
//     else if (soon) { pillCls = "bg-orange-50 border-orange-200 text-orange-700"; amtCls = "text-orange-600"; }
//     return (
//         <div className="flex flex-col gap-0.5">
//             <div className={`font-bold text-[13px] ${amtCls}`}>
//                 {fmtINR(r.paymentDue)}
//                 {!overdue && (
//                     <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border w-fit ml-1 ${pillCls}`}>
//                         <Clock size={8} /> {isToday ? "Due today" : `in ${days}d`}
//                     </span>
//                 )}
//             </div>
//             <div className="text-xs text-slate-600">{fmtDate(r.paymentDueDate)}</div>
//             {overdue && (
//                 <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border w-fit mt-0.5 bg-red-50 border-red-200 text-red-700">
//                     <AlertTriangle size={8} /> {Math.abs(days)}d overdue
//                 </span>
//             )}
//             {r.nextUnpaidMonth && <span className="text-[10px] text-slate-400">{r.nextUnpaidMonth}</span>}
//             {r.totalMonths > 0 && <span className="text-[10px] text-slate-400">{r.paidMonths}/{r.totalMonths} paid</span>}
//         </div>
//     );
// }

// // ── Return Date Cell ──────────────────────────────────────────────────────────
// function ReturnDateCell({ returnDate, isReturned }) {
//     if (isReturned) {
//         return (
//             <div className="flex flex-col gap-0.5">
//                 {returnDate && <div className="text-[12px] font-semibold text-gray-500">{fmtDate(returnDate)}</div>}
//                 <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border w-fit bg-gray-100 border-gray-200 text-gray-500">
//                     <PackageCheck size={8} /> Returned
//                 </span>
//             </div>
//         );
//     }
//     if (!returnDate) return <span className="text-[11px] text-slate-300">Not set</span>;
//     const days = diffDays(returnDate);
//     const overdue = days < 0;
//     const isToday = days === 0;
//     const urgent = days > 0 && days <= 3;
//     const soon = days > 3 && days <= 7;
//     let pillCls = "bg-slate-50 border-slate-200 text-slate-500";
//     let dateCls = "text-slate-700";
//     if (overdue || isToday) { pillCls = "bg-red-50 border-red-200 text-red-700"; dateCls = "text-red-600"; }
//     else if (urgent) { pillCls = "bg-violet-50 border-violet-200 text-violet-800"; dateCls = "text-violet-700"; }
//     else if (soon) { pillCls = "bg-blue-50 border-blue-200 text-blue-700"; dateCls = "text-blue-700"; }
//     return (
//         <div className="flex flex-col gap-0.5">
//             <div className={`font-semibold text-[12px] ${dateCls}`}>{fmtDate(returnDate)}</div>
//             {!overdue && (
//                 <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border w-fit mt-0.5 ${pillCls}`}>
//                     <RotateCcw size={8} /> {isToday ? "Today" : `in ${days}d`}
//                 </span>
//             )}
//             {overdue && (
//                 <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border w-fit mt-0.5 bg-red-50 border-red-200 text-red-700">
//                     <AlertTriangle size={8} /> {Math.abs(days)}d overdue
//                 </span>
//             )}
//         </div>
//     );
// }

// // ── Stat Card ─────────────────────────────────────────────────────────────────
// function StatCard({ label, value, sub, Icon, accentBg, accentText }) {
//     return (
//         <div className="bg-white rounded-2xl border border-slate-100 p-3 sm:p-4 flex flex-col gap-2 shadow-sm">
//             <div className="flex items-center justify-between">
//                 <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">{label}</span>
//                 <span className={`p-1.5 rounded-xl ${accentBg} ${accentText} flex shrink-0`}><Icon size={14} /></span>
//             </div>
//             <div>
//                 <div className="text-[18px] sm:text-[22px] font-black text-slate-900 leading-none">{value}</div>
//                 {sub && <div className="text-[10px] text-slate-400 mt-1">{sub}</div>}
//             </div>
//         </div>
//     );
// }

// // ── Alert Modal ───────────────────────────────────────────────────────────────
// function AlertModal({ records, onClose }) {
//     const urgent = records
//         .filter(r => {
//             // Skip returned and completed machines entirely
//             if (r.isReturned || r.status === "Completed") return false;
//             const pd = r.paymentDueDate ? diffDays(r.paymentDueDate) : 99;
//             const rd = r.returnDate ? diffDays(r.returnDate) : 99;
//             return pd <= 7 || rd <= 7;
//         })
//         .sort((a, b) => {
//             const da = Math.min(a.paymentDueDate ? diffDays(a.paymentDueDate) : 99, a.returnDate ? diffDays(a.returnDate) : 99);
//             const db = Math.min(b.paymentDueDate ? diffDays(b.paymentDueDate) : 99, b.returnDate ? diffDays(b.returnDate) : 99);
//             return da - db;
//         });
//     const overdueList = urgent.filter(r => r.status === "Overdue");
//     const dueSoonList = urgent.filter(r => r.status === "Due Soon" || r.status === "Active");

//     return (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50" onClick={onClose}>
//             <div className="w-full sm:max-w-lg mx-2 sm:mx-0" onClick={e => e.stopPropagation()}>
//                 <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
//                     <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 shrink-0">
//                         <div className="w-9 h-9 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
//                             <Bell size={16} className="text-amber-700" />
//                         </div>
//                         <div className="flex-1">
//                             <h2 className="font-extrabold text-amber-900 text-sm">Action Required</h2>
//                             <p className="text-[11px] text-amber-600 font-medium">Next 7 days · {urgent.length} alert{urgent.length !== 1 ? "s" : ""}</p>
//                         </div>
//                         <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-amber-500 hover:text-amber-800 hover:bg-amber-100 transition-colors text-xl leading-none shrink-0">&times;</button>
//                     </div>
//                     <div className="overflow-y-auto flex-1">
//                         {urgent.length === 0 ? (
//                             <div className="flex flex-col items-center justify-center py-12 px-6 gap-3">
//                                 <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
//                                     <CheckCircle2 size={24} className="text-emerald-600" />
//                                 </div>
//                                 <p className="text-sm font-bold text-slate-700">All clear!</p>
//                                 <p className="text-xs text-slate-400 text-center">No urgent actions in the next 7 days.</p>
//                             </div>
//                         ) : (
//                             <div className="p-4 flex flex-col gap-4">
//                                 {overdueList.length > 0 && (
//                                     <div>
//                                         <div className="flex items-center gap-2 mb-2">
//                                             <AlertTriangle size={12} className="text-red-500" />
//                                             <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest">Overdue</span>
//                                             <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full">{overdueList.length}</span>
//                                         </div>
//                                         <div className="flex flex-col gap-2">{overdueList.map(r => <AlertCard key={r.id} r={r} />)}</div>
//                                     </div>
//                                 )}
//                                 {dueSoonList.length > 0 && (
//                                     <div>
//                                         <div className="flex items-center gap-2 mb-2">
//                                             <Clock size={12} className="text-amber-500" />
//                                             <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest">Due Soon</span>
//                                             <span className="text-[10px] bg-amber-100 text-amber-600 font-bold px-1.5 py-0.5 rounded-full">{dueSoonList.length}</span>
//                                         </div>
//                                         <div className="flex flex-col gap-2">{dueSoonList.map(r => <AlertCard key={r.id} r={r} />)}</div>
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// function AlertCard({ r }) {
//     const pdDays = r.paymentDueDate ? diffDays(r.paymentDueDate) : null;
//     const rdDays = r.returnDate ? diffDays(r.returnDate) : null;
//     const isOverdue = r.status === "Overdue";
//     return (
//         <div className={`rounded-2xl border p-3.5 flex items-start gap-3 ${isOverdue ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
//             <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isOverdue ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"}`}>
//                 <MachineIcon type={r.machineType} size={15} />
//             </div>
//             <div className="flex-1 min-w-0">
//                 <div className="flex items-start justify-between gap-2">
//                     <div>
//                         <p className="text-sm font-bold text-slate-900 leading-tight">{r.patientName}</p>
//                         {r.phone && <p className="text-[11px] text-slate-400 mt-0.5">{r.phone}</p>}
//                     </div>
//                     <StatusBadge status={r.status} allPaid={r.allPaid} isReturned={r.isReturned} />
//                 </div>
//                 {r.machine && (
//                     <div className="flex items-center gap-1 mt-1.5">
//                         <span className="text-slate-400"><MachineIcon type={r.machineType} size={11} /></span>
//                         <span className="text-[11px] text-slate-500 font-medium">{r.machine}</span>
//                     </div>
//                 )}
//                 <div className="flex flex-col gap-1 mt-2">
//                     {pdDays !== null && pdDays <= 7 && r.paymentDue > 0 && (
//                         <div className={`flex items-center gap-1.5 text-[12px] font-semibold ${pdDays < 0 ? "text-red-700" : "text-amber-700"}`}>
//                             <IndianRupee size={11} />
//                             <span>{fmtINR(r.paymentDue)}</span>
//                             <span className="font-normal text-[11px]">— {pdDays < 0 ? `${Math.abs(pdDays)}d overdue` : pdDays === 0 ? "due today" : `due in ${pdDays}d`}</span>
//                             {r.nextUnpaidMonth && <span className="text-[10px] text-slate-400 font-normal">({r.nextUnpaidMonth})</span>}
//                         </div>
//                     )}
//                     {rdDays !== null && rdDays <= 7 && (
//                         <div className={`flex items-center gap-1.5 text-[12px] font-semibold ${rdDays < 0 ? "text-red-700" : "text-blue-700"}`}>
//                             <RotateCcw size={11} />
//                             <span>Machine return</span>
//                             <span className="font-normal text-[11px]">— {rdDays < 0 ? `${Math.abs(rdDays)}d overdue` : rdDays === 0 ? "today" : `in ${rdDays}d`}</span>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// // ── Modal ─────────────────────────────────────────────────────────────────────
// function Modal({ title, onClose, children }) {
//     return (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0" onClick={onClose}>
//             <div className="p-2 bg-white rounded-3xl w-full sm:w-auto">
//                 <div className="bg-white w-full sm:max-w-2xl max-h-[94vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
//                     <div className="sticky top-0 bg-white z-10 flex justify-between items-center px-5 sm:px-6 py-4 border-b border-gray-100 rounded-t-3xl sm:rounded-t-2xl">
//                         <h2 className="font-bold text-gray-800 text-base">{title}</h2>
//                         <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-xl leading-none">&times;</button>
//                     </div>
//                     {children}
//                 </div>
//             </div>
//         </div>
//     );
// }

// // ── Return Banner ─────────────────────────────────────────────────────────────
// function ReturnDateBanner({ returnDate, isReturned }) {
//     if (isReturned) {
//         return (
//             <div className="text-center rounded-lg border text-sm py-2 px-4 font-medium bg-gray-50 border-gray-200 text-gray-600">
//                 📦 Machine returned{returnDate ? ` — ${fmtDate(returnDate)}` : ""}
//             </div>
//         );
//     }
//     if (!returnDate) return null;
//     const days = diffDays(returnDate);
//     const overdue = days < 0;
//     const cls = overdue ? "bg-red-50 border-red-200 text-red-800" : days <= 7 ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-sky-50 border-sky-200 text-sky-800";
//     return (
//         <div className={`text-center rounded-lg border text-sm py-2 px-4 font-medium ${cls}`}>
//             📅 Return: {fmtDate(returnDate)}
//             {overdue ? ` — ${Math.abs(days)}d overdue` : days === 0 ? " — Today!" : ` — in ${days}d`}
//         </div>
//     );
// }

// // ── Patient Detail Modal ──────────────────────────────────────────────────────
// function PatientDetail({ record: r, onClose, setSelected, setPatients, onMarkReturned }) {
//     const p = r._raw;
//     const [savingRentIds, setSavingRentIds] = useState([]);
//     const paidCnt = r.monthlyRentRaw.filter(x => x.status === "paid").length;
//     const pendCnt = r.monthlyRentRaw.filter(x => x.status === "pending").length;

//     const markRentPaid = async (patientId, rentId) => {
//         try {
//             setSavingRentIds(prev => [...prev, rentId]);
//             const res = await fetch(`/api/patients/${patientId}`, {
//                 method: "PATCH",
//                 headers: { "Content-Type": "application/json", "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
//                 body: JSON.stringify({ rentId })
//             });
//             if (!res.ok) throw new Error("Failed");
//             const updated = await res.json();
//             setPatients(prev => prev.map(pt => pt._id === updated._id ? updated : pt));
//             setSelected(transformPatient(updated));
//         } catch (err) {
//             console.error(err);
//             alert("Failed to update rent");
//         } finally {
//             setSavingRentIds(prev => prev.filter(id => id !== rentId));
//         }
//     };

//     return (
//         <Modal title="Patient Details" onClose={onClose}>
//             <div className="p-5 sm:p-6 flex flex-col gap-6">
//                 <div className="flex items-center gap-4">
//                     <div className={`w-14 h-14 ${avatarBg(r.patientName)} rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0`}>
//                         {initials(r.patientName)}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                         <h3 className="text-lg font-bold text-gray-900">{r.patientName}</h3>
//                         <p className="text-sm text-gray-500">{r.phone}</p>
//                         {r.altPhone && <p className="text-xs text-gray-400">Alt: {r.altPhone}</p>}
//                         {r.whatsapp && <p className="text-xs text-gray-400">WhatsApp: {r.whatsapp}</p>}
//                         <div className="flex flex-wrap gap-1.5 mt-1.5">
//                             <PaymentBadge variant={r.paymentType} />
//                             <StatusBadge status={r.status} allPaid={r.allPaid} isReturned={r.isReturned} />
//                         </div>
//                         <div className="text-sm text-slate-600">
//                             <span className="font-semibold">Payment:</span>{" "}
//                             {r.paymentMode}
//                             {r?.paymentAcc && (
//                                 <span className="ml-1 text-slate-500">({r.paymentAcc})</span>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 <ReturnDateBanner returnDate={r.returnDate} isReturned={r.isReturned} />

//                 {!r.isReturned && r.paymentDue > 0 && r.paymentDueDate && (
//                     <div className={`rounded-2xl border px-5 py-4 ${diffDays(r.paymentDueDate) < 0 ? "bg-red-50 border-red-200" : diffDays(r.paymentDueDate) <= 7 ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200"}`}>
//                         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Next Payment Due</p>
//                         <NextPaymentCell r={r} />
//                     </div>
//                 )}

//                 {(r.address || r.dob || r.age) && (
//                     <div>
//                         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Personal Info</p>
//                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                             {r.address && <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 col-span-2 sm:col-span-3"><p className="text-xs text-gray-400 font-medium mb-0.5">📍 Address</p><p className="text-sm font-semibold text-gray-700">{r.address}</p></div>}
//                             {r.dob && <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3"><p className="text-xs text-gray-400 font-medium mb-0.5">🎂 Date of Birth</p><p className="text-sm font-semibold text-gray-700">{fmtDate(r.dob)}</p></div>}
//                             {r.age && <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3"><p className="text-xs text-gray-400 font-medium mb-0.5">🧑 Age</p><p className="text-sm font-semibold text-gray-700">{r.age} yrs</p></div>}
//                         </div>
//                     </div>
//                 )}

//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                     {[["🩺", "Referred By", r.refDoctor || "—", null], ["⚙️", "Machine", r.machine, r.machineSerial], ["👤", "Installed By", r.refEmployee || "—", null]].map(([icon, label, val, serial]) => (
//                         <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
//                             <p className="text-xs text-gray-400 font-medium mb-0.5">{icon} {label}</p>
//                             <p className="text-sm font-semibold text-gray-700 truncate">{val || "—"}</p>
//                             {serial && <p className="text-xs text-gray-500 font-mono mt-0.5">{serial}</p>}
//                         </div>
//                     ))}
//                 </div>

//                 <div>
//                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Rental Details</p>
//                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                         <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3"><p className="text-xs text-gray-400 font-medium mb-0.5">📆 Start Date</p><p className="text-sm font-semibold text-gray-700">{fmtDate(r.startDate)}</p></div>
//                         <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3"><p className="text-xs text-gray-400 font-medium mb-0.5">⏱ Duration</p><p className="text-sm font-semibold text-gray-700">{parseDuration(r.duration)}</p></div>
//                         <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3"><p className="text-xs text-gray-400 font-medium mb-0.5">💰 Rent / Period</p><p className="text-sm font-semibold text-gray-700">{fmtCurrency(r.rentPerPeriod)}</p></div>
//                         {r.returnDate && (
//                             <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
//                                 <p className="text-xs text-gray-400 font-medium mb-0.5">📦 Return Date</p>
//                                 <p className={`text-sm font-semibold ${r.isReturned ? "text-gray-500" : "text-gray-700"}`}>{fmtDate(r.returnDate)}</p>
//                                 {r.isReturned && <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">✓ Returned</p>}
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {r.accessories?.filter(a => a.name?.trim()).length > 0 && (
//                     <div>
//                         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Accessories</p>
//                         <div className="border border-gray-100 rounded-xl overflow-hidden">
//                             <table className="w-full text-sm">
//                                 <thead><tr className="bg-slate-50 border-b border-gray-100">{["#", "Name"].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2.5">{h}</th>)}</tr></thead>
//                                 <tbody className="divide-y divide-gray-50">
//                                     {r.accessories.filter(a => a.name?.trim()).map((acc, i) => (
//                                         <tr key={acc._id || i}><td className="px-4 py-2.5 text-xs text-gray-400">{i + 1}</td><td className="px-4 py-2.5 text-sm text-gray-700">{acc.name}</td></tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 )}

//                 <div>
//                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Payment Summary</p>
//                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
//                         {[["Grand Total", fmtCurrency(r.grandTotal), "text-gray-800"], ["Security Paid", fmtCurrency(r.securityAmount || 0), "text-indigo-600"], ["Rent Collected", fmtCurrency(paidRentTotal(p)), "text-emerald-600"], ["Pending", fmtCurrency(r.pendingAmt), r.pendingAmt > 0 ? "text-amber-600" : "text-emerald-600"]].map(([label, val, color]) => (
//                             <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5"><p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p><p className={`text-base font-bold ${color}`}>{val}</p></div>
//                         ))}
//                     </div>
//                     {r.paymentType === "rent" && (
//                         <div>
//                             <div className="flex justify-between text-xs text-gray-500 mb-1.5"><span>Recovery Progress</span><span className="font-semibold">{fmtCurrency(r.totalPaidAmt)} of {fmtCurrency(r.grandTotal)}</span></div>
//                             <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden"><div className={`h-2 rounded-full ${r.pct === 100 ? "bg-emerald-500" : r.pct >= 60 ? "bg-sky-500" : "bg-amber-400"}`} style={{ width: `${r.pct}%` }} /></div>
//                             <p className="text-xs text-gray-400 mt-1">{r.pct}% recovered</p>
//                         </div>
//                     )}
//                 </div>

//                 {r.monthlyRentRaw.length > 0 && (
//                     <div>
//                         <div className="flex items-center justify-between mb-3">
//                             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rent Schedule</p>
//                             <div className="flex gap-1.5">
//                                 {paidCnt > 0 && <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">{paidCnt} paid</span>}
//                                 {pendCnt > 0 && <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">{pendCnt} pending</span>}
//                             </div>
//                         </div>
//                         <div className="border border-gray-100 rounded-xl overflow-hidden">
//                             <table className="w-full text-sm">
//                                 <thead><tr className="bg-slate-50 border-b border-gray-100">{["#", "Period", "Due Date", "Amount", "Status", "Action"].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2.5">{h}</th>)}</tr></thead>
//                                 <tbody className="divide-y divide-gray-50">
//                                     {r.monthlyRentRaw.map((rent, i) => {
//                                         const rentDays = rent.dueDate ? diffDays(new Date(rent.dueDate).toISOString().split("T")[0]) : null;
//                                         const isOverdueRent = !r.isReturned && rent.status === "pending" && rentDays !== null && rentDays < 0;
//                                         return (
//                                             <tr key={rent._id} className={rent.status === "pending" ? (isOverdueRent ? "bg-red-50/40" : "bg-amber-50/40") : ""}>
//                                                 <td className="px-4 py-2.5 text-xs text-gray-400">{i + 1}</td>
//                                                 <td className="px-4 py-2.5 text-sm text-gray-600">{rent.month || "—"}</td>
//                                                 <td className="px-4 py-2.5"><div className="text-sm font-medium text-gray-700">{fmtDate(rent.dueDate)}</div>{isOverdueRent && <span className="text-[10px] text-red-600 font-bold">{Math.abs(rentDays)}d overdue</span>}</td>
//                                                 <td className="px-4 py-2.5 text-sm font-bold text-gray-800">{fmtCurrency(rent.amount)}</td>
//                                                 <td className="px-4 py-2.5"><PaymentBadge variant={rent.status} /></td>
//                                                 <td className="px-4 py-2.5">
//                                                     {!r.isReturned && rent.status === "pending" ? (
//                                                         <button onClick={() => markRentPaid(p._id, rent._id)} disabled={savingRentIds.includes(rent._id)} className={`text-xs px-2 py-1 rounded-md text-white ${savingRentIds.includes(rent._id) ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600"}`}>
//                                                             {savingRentIds.includes(rent._id) ? "..." : "Mark Paid"}
//                                                         </button>
//                                                     ) : <span className="text-xs text-gray-400">—</span>}
//                                                 </td>
//                                             </tr>
//                                         );
//                                     })}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 )}

//                 {r.isReturned ? (
//                     <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4">
//                         <span className="text-2xl">📦</span>
//                         <div><p className="text-sm font-bold text-gray-700">Machine Returned</p><p className="text-xs text-gray-500 mt-0.5">This machine has been returned by the patient.</p></div>
//                     </div>
//                 ) : (
//                     <button onClick={() => onMarkReturned(r.id)} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gray-800 text-white text-sm font-bold hover:bg-gray-900 transition-colors">
//                         <PackageCheck size={16} /> Mark Machine as Returned
//                     </button>
//                 )}

//                 <p className="text-xs text-gray-400 text-right">Registered {fmtDate(r.createdAt)}</p>
//             </div>
//         </Modal>
//     );
// }

// // ── Mobile Card ───────────────────────────────────────────────────────────────
// function MobileCard({ r, onClick, onMarkReturned }) {
//     const [expanded, setExpanded] = useState(false);
//     const [returning, setReturning] = useState(false);
//     const borderCls = r.isReturned ? "border-gray-200 opacity-75" : r.status === "Overdue" ? "border-red-200" : r.status === "Due Soon" ? "border-amber-200" : "border-slate-100";

//     const handleReturn = async (e) => {
//         e.stopPropagation();
//         setReturning(true);
//         await onMarkReturned(r.id);
//         setReturning(false);
//     };

//     return (
//         <div className={`bg-white border ${borderCls} rounded-2xl shadow-sm overflow-hidden`}>
//             <div className="flex items-center gap-3 px-4 pt-4 pb-3 cursor-pointer" onClick={onClick}>
//                 <Avatar name={r.patientName} size="md" />
//                 <div className="flex-1 min-w-0">
//                     <p className="text-sm font-bold text-gray-800 truncate">{r.patientName}</p>
//                     <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5 flex-wrap">
//                         {r.age && <span className="flex items-center gap-0.5"><User size={9} />{r.age}y</span>}
//                         {r.phone && <span className="flex items-center gap-0.5"><Phone size={9} />{r.phone}</span>}
//                     </div>
//                 </div>
//                 <StatusBadge status={r.status} allPaid={r.allPaid} isReturned={r.isReturned} />
//             </div>

//             {r.machine && (
//                 <div className="mx-4 mb-3 flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
//                     <span className="text-slate-400"><MachineIcon type={r.machineType} size={13} /></span>
//                     <span className="text-[12px] font-semibold text-slate-700">{r.machine}</span>
//                     {r.machineSerial && <span className="text-[10px] text-slate-400 ml-auto">{r.machineSerial}</span>}
//                 </div>
//             )}

//             <div className="grid grid-cols-2 gap-px bg-slate-100 mx-4 mb-3 rounded-xl overflow-hidden cursor-pointer" onClick={onClick}>
//                 <div className="bg-white px-3 py-2.5 rounded-l-xl">
//                     <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Next Payment</div>
//                     <NextPaymentCell r={r} />
//                 </div>
//                 <div className="bg-white px-3 py-2.5 rounded-r-xl">
//                     <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Return Date</div>
//                     <ReturnDateCell returnDate={r.returnDate} isReturned={r.isReturned} />
//                 </div>
//             </div>

//             <div className="px-4 pb-3">
//                 {r.isReturned ? (
//                     <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
//                         <PackageCheck size={14} className="text-gray-500" />
//                         <span className="text-xs font-semibold text-gray-600">Machine Returned</span>
//                         {r.returnDate && <span className="text-[10px] text-gray-400 ml-auto">{fmtDate(r.returnDate)}</span>}
//                     </div>
//                 ) : (
//                     <button onClick={handleReturn} disabled={returning} className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-gray-800 text-white text-xs font-bold hover:bg-gray-900 transition-colors disabled:opacity-50">
//                         {returning ? <Loader2 size={13} className="animate-spin" /> : <PackageCheck size={13} />}
//                         {returning ? "Updating…" : "Mark as Returned"}
//                     </button>
//                 )}
//             </div>

//             {(r.refEmployee || r.refDoctor) && (
//                 <>
//                     <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between px-4 py-2.5 border-t border-slate-50 text-[11px] text-slate-400 hover:bg-slate-50 transition-colors">
//                         <span>More details</span>
//                         {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
//                     </button>
//                     {expanded && (
//                         <div className="px-4 pb-4 pt-1 flex flex-col gap-1.5 border-t border-slate-50">
//                             {r.refEmployee && <div className="flex items-center justify-between"><span className="text-[10px] text-slate-400">Installed By</span><span className="text-[11px] font-semibold text-slate-700">{r.refEmployee}</span></div>}
//                             {r.refDoctor && <div className="flex items-center justify-between"><span className="text-[10px] text-slate-400">Referred By</span><span className="text-[11px] font-semibold text-slate-700">{r.refDoctor}</span></div>}
//                             <div className="flex items-center justify-between"><span className="text-[10px] text-slate-400">Duration</span><span className="text-[11px] font-semibold text-slate-700">{parseDuration(r.duration)}</span></div>
//                             <div className="flex items-center justify-between"><span className="text-[10px] text-slate-400">Payment</span><PaymentBadge variant={r.paymentType} /></div>
//                             <button onClick={onClick} className="text-[10px] text-teal-600 font-semibold text-left mt-1">View full details →</button>
//                         </div>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// }

// // ── Desktop Table Row ─────────────────────────────────────────────────────────
// function TableRow({ r, index, onClick, onMarkReturned }) {
//     const [returning, setReturning] = useState(false);

//     const handleReturn = async (e) => {
//         e.stopPropagation();
//         setReturning(true);
//         await onMarkReturned(r.id);
//         setReturning(false);
//     };

//     return (
//         <tr onClick={onClick} className={`hover:bg-slate-50 transition-colors cursor-pointer group border-b border-slate-50 last:border-0 ${r.allPaid ? "bg-emerald-50/20" : ""} ${r.isReturned ? "opacity-60" : ""}`}>
//             <td className="px-4 py-3.5 text-xs text-gray-400 font-mono">{index + 1}</td>
//             <td className="px-4 py-3.5">
//                 <div className="flex items-center gap-2.5">
//                     <Avatar name={r.patientName} />
//                     <div className="min-w-0">
//                         <div className="flex items-center gap-1.5">
//                             <p className="text-sm font-semibold text-gray-800 truncate">{r.patientName}</p>
//                             {r.allPaid && !r.isReturned && <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full px-1.5 py-0.5 whitespace-nowrap">100%</span>}
//                             {r.isReturned && <span className="text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200 rounded-full px-1.5 py-0.5 whitespace-nowrap flex items-center gap-0.5"><PackageCheck size={9} /> Returned</span>}
//                         </div>
//                         <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
//                             {r.age && <><User size={9} />{r.age}y</>}
//                             {r.age && r.phone && <span className="mx-0.5">·</span>}
//                             {r.phone && <><Phone size={9} />{r.phone}</>}
//                         </div>
//                     </div>
//                 </div>
//             </td>
//             <td className="px-2 py-3.5">
//                 {r.machine ? (
//                     <div>
//                         <div className="flex items-center gap-1.5">
//                             <span className="text-slate-400"><MachineIcon type={r.machineType} /></span>
//                             <p className="text-sm text-gray-600 max-w-[130px] truncate">{r.machine}</p>
//                         </div>
//                         {r.machineSerial && <p className="text-xs font-mono text-gray-400">{r.machineSerial}</p>}
//                     </div>
//                 ) : <span className="text-xs text-slate-300">—</span>}
//             </td>
//             <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{r.refDoctor || <span className="text-gray-400 italic">—</span>}</td>
//             <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{r.refEmployee || "—"}</td>
//             <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{parseDuration(r.duration)}</td>
//             <td className="px-4 py-3.5"><NextPaymentCell r={r} /></td>


//             {/* Return Date + Returned button */}
//             <td className="p-0">
//                 <div className=" items-start gap-2">
//                     <ReturnDateCell returnDate={r.returnDate} isReturned={r.isReturned} />
//                     {/* {!r.isReturned && (
//                         <button
//                             onClick={handleReturn}
//                             disabled={returning}
//                             title="Mark machine as returned"
//                             className="flex items-center gap-1 text-[11px] font-bold px-2 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all disabled:opacity-50 whitespace-nowrap shrink-0"
//                         >
//                             {returning ? <Loader2 size={11} className="animate-spin" /> : <PackageCheck size={11} />}
//                             {returning ? "…" : "Returned"}
//                         </button>
//                     )} */}
//                 </div>
//             </td>

//             <td className="px-4 py-3.5">
//                 <div className="flex flex-col gap-1">
//                     <StatusBadge status={r.status} allPaid={r.allPaid} isReturned={r.isReturned} />
//                     <PaymentBadge variant={r.paymentType} />
//                 </div>
//             </td>
//             <td className="px-4 py-3.5 min-w-[130px]">
//                 {r.paymentType === "fully_paid" ? <span className="text-xs text-emerald-600 font-semibold">✅ Complete</span> : <ProgressBar pct={r.pct} />}
//             </td>
//             <td className="px-4 py-3.5">
//                 <svg className="w-4 h-4 text-gray-300 group-hover:text-teal-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//             </td>
//         </tr>
//     );
// }

// // ── Main ──────────────────────────────────────────────────────────────────────
// export default function PatientsTable() {
//     const [search, setSearch] = useState("");
//     const [statusFilter, setStatusFilter] = useState("all");
//     const [typeFilter, setTypeFilter] = useState("all");
//     const [selected, setSelected] = useState(null);
//     const [patients, setPatients] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [refresh, setRefresh] = useState(0);
//     const [showAlerts, setShowAlerts] = useState(false);
//     const [uninstallTarget, setUninstallTarget] = useState(null); // raw patient object for UninstallModal

//     // Opens UninstallModal — actual API call is handled inside the modal
//     const markReturned = (patientId) => {
//         const raw = patients.find(p => p._id === patientId);
//         if (raw) setUninstallTarget(raw);
//     };

//     // Called by UninstallModal after successful uninstall
//     const handleUninstallSuccess = (updated) => {
//         setPatients(prev => prev.map(pt => pt._id === updated._id ? updated : pt));
//         if (selected?.id === updated._id) setSelected(transformPatient(updated));
//         setUninstallTarget(null);
//     };

//     function downloadMonthWise() {
//         const wb = XLSX.utils.book_new();
//         const monthMap = {};
//         records.forEach(r => {
//             r.monthlyRentRaw.forEach(slot => {
//                 const key = slot.month || "Unknown";
//                 if (!monthMap[key]) monthMap[key] = [];
//                 monthMap[key].push({ "Patient Name": r.patientName, "Phone": r.phone || "", "Machine": r.machine || "", "Referred By": r.refDoctor || "", "Installed By": r.refEmployee || "", "Period": slot.month || "", "Due Date": slot.dueDate || "", "Amount (₹)": slot.amount || 0, "Status": slot.status === "paid" ? "Paid" : "Pending", "Duration": parseDuration(r.duration), "Grand Total (₹)": r.grandTotal || 0, "Security (₹)": r.securityAmount || 0, "Overall Status": r.status, "Returned": r.isReturned ? "Yes" : "No" });
//             });
//         });
//         const sortedMonths = Object.keys(monthMap).sort((a, b) => { const da = new Date(a), db = new Date(b); if (!isNaN(da) && !isNaN(db)) return da - db; return a.localeCompare(b); });
//         if (sortedMonths.length === 0) {
//             const rows = records.map(r => ({ "Patient Name": r.patientName, "Phone": r.phone || "", "Machine": r.machine || "", "Referred By": r.refDoctor || "", "Installed By": r.refEmployee || "", "Duration": parseDuration(r.duration), "Grand Total (₹)": r.grandTotal || 0, "Paid (₹)": r.totalPaidAmt || 0, "Pending (₹)": r.pendingAmt || 0, "Security (₹)": r.securityAmount || 0, "Status": r.status, "Start Date": r.startDate || "", "Return Date": r.returnDate || "", "Returned": r.isReturned ? "Yes" : "No" }));
//             const ws = XLSX.utils.json_to_sheet(rows); styleSheet(ws, rows.length); XLSX.utils.book_append_sheet(wb, ws, "All Patients");
//         } else {
//             sortedMonths.forEach(month => { const rows = monthMap[month]; const sheetName = month.replace(/[\\/*?[\]:]/g, "").slice(0, 31); const ws = XLSX.utils.json_to_sheet(rows); styleSheet(ws, rows.length); XLSX.utils.book_append_sheet(wb, ws, sheetName); });
//             const summaryRows = records.map(r => ({ "Patient Name": r.patientName, "Phone": r.phone || "", "Machine": r.machine || "", "Referred By": r.refDoctor || "", "Installed By": r.refEmployee || "", "Duration": parseDuration(r.duration), "Total Instalments": r.totalMonths, "Paid Instalments": r.paidMonths, "Grand Total (₹)": r.grandTotal || 0, "Collected (₹)": r.totalPaidAmt || 0, "Pending (₹)": r.pendingAmt || 0, "Security (₹)": r.securityAmount || 0, "Status": r.status, "Start Date": r.startDate || "", "Return Date": r.returnDate || "", "Returned": r.isReturned ? "Yes" : "No" }));
//             const summaryWs = XLSX.utils.json_to_sheet(summaryRows); styleSheet(summaryWs, summaryRows.length); XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");
//         }
//         XLSX.writeFile(wb, `patient-records-${new Date().toISOString().split("T")[0]}.xlsx`);
//     }

//     function styleSheet(ws, rowCount) {
//         const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
//         const colCount = range.e.c + 1;
//         ws["!cols"] = Array.from({ length: colCount }, () => ({ wch: 20 }));
//         for (let c = 0; c < colCount; c++) { const cellRef = XLSX.utils.encode_cell({ r: 0, c }); if (ws[cellRef]) ws[cellRef].s = { font: { bold: true, name: "Arial", sz: 10 }, fill: { fgColor: { rgb: "0F766E" }, patternType: "solid" }, alignment: { horizontal: "center", vertical: "center", wrapText: true }, border: { bottom: { style: "thin", color: { rgb: "CCCCCC" } } } }; }
//         for (let r = 1; r <= rowCount; r++) { for (let c = 0; c < colCount; c++) { const cellRef = XLSX.utils.encode_cell({ r, c }); if (ws[cellRef]) ws[cellRef].s = { font: { name: "Arial", sz: 10 }, fill: { fgColor: { rgb: r % 2 === 0 ? "F8FAFC" : "FFFFFF" }, patternType: "solid" }, alignment: { vertical: "center" } }; } }
//     }

//     useEffect(() => {
//         async function fetchPatients() {
//             setLoading(true); setError(null);
//             try {
//                 const res = await fetch("/api/patients", { headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY } });
//                 if (!res.ok) throw new Error(`Failed to fetch (${res.status})`);
//                 const data = await res.json();
//                 setPatients(Array.isArray(data) ? data : []);
//             } catch (err) { setError(err.message); }
//             finally { setLoading(false); }
//         }
//         fetchPatients();
//     }, [refresh]);

//     const records = useMemo(() =>
//         patients.map(transformPatient).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
//         [patients]
//     );

//     const stats = useMemo(() => {
//         // Only count non-returned, non-completed records for active stats
//         const activeNonReturned = records.filter(r => !r.isReturned && r.status !== "Completed");
//         return {
//             total: records.length,
//             active: activeNonReturned.length,
//             totalDue: activeNonReturned.reduce((s, r) => s + (r.paymentDue || 0), 0),
//             dueSoon: activeNonReturned.filter(r => r.paymentDueDate && diffDays(r.paymentDueDate) <= 7 && r.paymentDue > 0).length,
//             returnSoon: activeNonReturned.filter(r => r.returnDate && diffDays(r.returnDate) >= 0 && diffDays(r.returnDate) <= 7).length,
//             overdue: activeNonReturned.filter(r => r.status === "Overdue").length,
//         };
//     }, [records]);

//     const statusCounts = useMemo(() => ({
//         all: records.length,
//         Active: records.filter(r => r.status === "Active").length,
//         "Due Soon": records.filter(r => r.status === "Due Soon").length,
//         Overdue: records.filter(r => r.status === "Overdue").length,
//         Completed: records.filter(r => r.status === "Completed").length,
//     }), [records]);

//     const filtered = useMemo(() => {
//         let list = records;
//         if (statusFilter !== "all") list = list.filter(r => r.status === statusFilter);
//         if (typeFilter === "rent") list = list.filter(r => r.paymentType === "rent");
//         else if (typeFilter === "fully_paid") list = list.filter(r => r.paymentType === "fully_paid");
//         else if (typeFilter === "returned") list = list.filter(r => r.isReturned);
//         if (search.trim()) {
//             const q = search.toLowerCase();
//             list = list.filter(r => r.patientName?.toLowerCase().includes(q) || r.machine?.toLowerCase().includes(q) || r.refDoctor?.toLowerCase().includes(q) || r.refEmployee?.toLowerCase().includes(q) || r.phone?.includes(q) || r.altPhone?.includes(q) || r.address?.toLowerCase().includes(q));
//         }
//         return list;
//     }, [records, statusFilter, typeFilter, search]);

//     const footerTotal = filtered.reduce((s, r) => s + (r.grandTotal || 0), 0);
//     const footerCollected = filtered.reduce((s, r) => s + r.totalPaidAmt, 0);
//     const footerPending = filtered.reduce((s, r) => s + r.pendingAmt, 0);
//     // Fix: use + not || for correct alert count
//     const alertCount = stats.dueSoon || stats.returnSoon || stats.overdue;

//     return (
//         <div className="min-h-screen bg-slate-50 flex flex-col">
//             <header className="bg-white border-b border-slate-200 shadow-sm shrink-0 z-30 sticky top-0">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-3">
//                     <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//                         <div className="flex items-center gap-3 shrink-0">
//                             <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center shadow-sm shrink-0">
//                                 <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
//                             </div>
//                             <div>
//                                 <h1 className="font-bold text-gray-900 text-base leading-tight">Patient Records</h1>
//                                 <p className="text-xs text-gray-400 hidden sm:block">Machine rental &amp; payment tracker</p>
//                             </div>
//                         </div>
//                         <div className="relative flex-1 sm:max-w-sm sm:ml-2">
//                             <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" /></svg>
//                             <input className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-50" placeholder="Search patient, doctor, machine, address…" value={search} onChange={e => setSearch(e.target.value)} />
//                         </div>
//                         <div className="flex items-center gap-2 sm:ml-auto">
//                             <button onClick={() => setShowAlerts(s => !s)} className={`relative p-2 rounded-xl transition-colors ${showAlerts ? "bg-amber-100 text-amber-700" : "hover:bg-slate-100 text-slate-500"}`}>
//                                 <Bell size={18} />
//                                 {alertCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">{alertCount}</span>}
//                             </button>
//                             <button onClick={() => setRefresh(n => n + 1)} disabled={loading} className="flex items-center gap-1.5 text-xs bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 cursor-pointer hover:bg-amber-100 transition-colors disabled:opacity-50">
//                                 <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
//                                 <span className="hidden sm:inline">Refresh</span>
//                             </button>
//                             <button onClick={downloadMonthWise} disabled={records.length === 0} className="flex items-center gap-1.5 text-xs bg-emerald-50 border border-emerald-300 rounded-xl px-3 py-2 cursor-pointer hover:bg-emerald-100 transition-colors disabled:opacity-40">
//                                 <Download size={14} className="text-emerald-700" />
//                                 <span className="hidden sm:inline text-emerald-800 font-semibold">Download</span>
//                             </button>
//                             <Link href="/form" className="flex items-center gap-1.5 bg-teal-600 text-white rounded-xl px-3 py-2 text-xs font-bold shadow hover:bg-teal-700 transition-colors">
//                                 <Plus size={14} /> <span className="hidden sm:inline">Add Patient</span>
//                             </Link>
//                             <span className="hidden sm:inline text-xs text-gray-400 shrink-0 ml-1">{filtered.length} / {records.length}</span>
//                         </div>
//                     </div>
//                     <div className="flex flex-wrap gap-1.5 items-center">
//                         {[{ key: "all", label: "All" }, { key: "Active", label: "Active" }, { key: "Due Soon", label: "Due Soon" }, { key: "Overdue", label: "Overdue" }, { key: "Completed", label: "Completed" }].map(f => (
//                             <button key={f.key} onClick={() => setStatusFilter(f.key)} className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-colors flex items-center gap-1 ${statusFilter === f.key ? "bg-teal-600 text-white border-teal-600" : "bg-white text-gray-600 border-gray-200 hover:border-teal-300"}`}>
//                                 {f.label}
//                                 {f.key !== "all" && statusCounts[f.key] > 0 && <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${statusFilter === f.key ? "bg-teal-500 text-white" : "bg-slate-100 text-slate-500"}`}>{statusCounts[f.key]}</span>}
//                             </button>
//                         ))}
//                         <span className="w-px h-4 bg-gray-200 mx-0.5" />
//                         {[{ key: "all", label: "All Types" }, { key: "rent", label: "Rent" }, { key: "fully_paid", label: "Fully Paid" }, { key: "returned", label: "Returned" }].map(f => (
//                             <button key={f.key} onClick={() => setTypeFilter(f.key)} className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-colors ${typeFilter === f.key ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"}`}>{f.label}</button>
//                         ))}
//                         <span className="sm:hidden text-xs text-gray-400 ml-auto">{filtered.length} / {records.length}</span>
//                     </div>
//                 </div>
//             </header>

//             <div className="flex-1">
//                 <div className="max-w-9xl mx-auto px-1 sm:px-2 lg:px-2 py-4 flex flex-col gap-4">
//                     {loading && <div className="flex items-center justify-center py-24"><Loader2 size={26} className="animate-spin text-teal-600" /><span className="ml-3 text-slate-400 text-sm">Loading patients…</span></div>}
//                     {!loading && error && (
//                         <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
//                             <AlertCircle size={17} className="text-red-500 shrink-0 mt-0.5" />
//                             <div className="flex-1"><div className="font-bold text-sm text-red-700">Failed to load data</div><div className="text-xs text-red-400">{error}</div></div>
//                             <button onClick={() => setRefresh(n => n + 1)} className="text-xs font-bold text-red-600 hover:underline">Retry</button>
//                         </div>
//                     )}
//                     {!loading && !error && (
//                         <>
//                             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
//                                 <StatCard label="Total Records" value={stats.total} Icon={ClipboardList} accentBg="bg-teal-100" accentText="text-teal-700" />
//                                 <StatCard label="Active Rentals" value={stats.active} Icon={Activity} accentBg="bg-emerald-100" accentText="text-emerald-700" sub={`${records.length - stats.active} completed/returned`} />
//                                 <StatCard label="Pending Amount" value={fmtINR(stats.totalDue)} Icon={IndianRupee} accentBg="bg-amber-100" accentText="text-amber-700" sub="Active rentals only" />
//                                 <StatCard label="Due in 7 Days" value={stats.dueSoon} Icon={CalendarClock} accentBg="bg-red-100" accentText="text-red-600" sub="Payment collections" />
//                                 <StatCard label="Returns in 7 Days" value={stats.returnSoon} Icon={PackageX} accentBg="bg-violet-100" accentText="text-violet-700" sub="Machine pickups" />
//                                 <StatCard label="Overdue" value={stats.overdue} Icon={AlertTriangle} accentBg="bg-rose-100" accentText="text-rose-700" sub="Need attention" />
//                             </div>

//                             <p className="text-xs text-slate-400">{filtered.length} record{filtered.length !== 1 ? "s" : ""}{search && ` matching "${search}"`}</p>

//                             {filtered.length === 0 && records.length === 0 && (
//                                 <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
//                                     <p className="text-sm text-gray-400 italic mb-2">No patients found.</p>
//                                     <Link href="/form" className="flex items-center gap-1.5 bg-teal-600 text-white rounded-xl px-4 py-2 text-xs font-bold"><Plus size={13} /> Add first patient</Link>
//                                 </div>
//                             )}
//                             {filtered.length === 0 && records.length > 0 && <div className="text-center py-16 text-slate-400 text-sm">No records match your search or filter.</div>}

//                             {filtered.length > 0 && (() => {
//                                 const groups = groupByDate(filtered);
//                                 let globalIndex = 0;
//                                 return (
//                                     <>
//                                         <div className="flex flex-col gap-5 lg:hidden">
//                                             {groups.map(group => (
//                                                 <div key={group.key}>
//                                                     <div className="flex items-center gap-2 mb-2.5">
//                                                         <span className={`text-[11px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border ${group.key === "Today" ? "bg-teal-50 text-teal-700 border-teal-200" : group.key === "Yesterday" ? "bg-violet-50 text-violet-700 border-violet-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>{group.key}</span>
//                                                         <span className="text-[10px] text-slate-400 font-medium">{group.items.length} record{group.items.length !== 1 ? "s" : ""}</span>
//                                                         <div className="flex-1 h-px bg-slate-100" />
//                                                     </div>
//                                                     <div className="flex flex-col gap-3">
//                                                         {group.items.map(r => <MobileCard key={r.id} r={r} onClick={() => setSelected(r)} onMarkReturned={markReturned} />)}
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>

//                                         <div className="hidden lg:block bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
//                                             <div className="overflow-x-auto">
//                                                 <table className="w-full text-sm min-w-[1100px]">
//                                                     <thead>
//                                                         <tr className="bg-slate-50 border-b border-gray-100">
//                                                             {["#", "Patient", "Machine", "Referred By", "Installed By", "Duration", "Next Payment", "Return Date", "Status", "Progress", ""].map(h => (
//                                                                 <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
//                                                             ))}
//                                                         </tr>
//                                                     </thead>
//                                                     <tbody className="divide-y divide-gray-50">
//                                                         {groups.map(group => (
//                                                             <React.Fragment key={`group-${group.key}`}>
//                                                                 <tr>
//                                                                     <td colSpan={11} className="px-4 py-2 bg-slate-50 border-y border-slate-100">
//                                                                         <div className="flex items-center gap-2">
//                                                                             <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border ${group.key === "Today" ? "bg-teal-50 text-teal-700 border-teal-200" : group.key === "Yesterday" ? "bg-violet-50 text-violet-700 border-violet-200" : "bg-white text-slate-500 border-slate-200"}`}>{group.key}</span>
//                                                                             <span className="text-[10px] text-slate-400">{group.items.length} record{group.items.length !== 1 ? "s" : ""}</span>
//                                                                         </div>
//                                                                     </td>
//                                                                 </tr>
//                                                                 {group.items.map(r => {
//                                                                     const idx = globalIndex++;
//                                                                     return <TableRow key={r.id} r={r} index={idx} onClick={() => setSelected(r)} onMarkReturned={markReturned} />;
//                                                                 })}
//                                                             </React.Fragment>
//                                                         ))}
//                                                     </tbody>
//                                                 </table>
//                                             </div>
//                                             <div className="border-t border-gray-100 bg-slate-50 px-4 py-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
//                                                 <span className="font-medium">{filtered.length} patient{filtered.length !== 1 ? "s" : ""}</span>
//                                                 <span className="text-gray-300">·</span>
//                                                 <span>Grand Total: <strong className="text-gray-700">{fmtCurrency(footerTotal)}</strong></span>
//                                                 <span className="text-gray-300">·</span>
//                                                 <span>Collected: <strong className="text-emerald-600">{fmtCurrency(footerCollected)}</strong></span>
//                                                 <span className="text-gray-300">·</span>
//                                                 <span>Pending: <strong className="text-amber-600">{fmtCurrency(footerPending)}</strong></span>
//                                             </div>
//                                         </div>
//                                     </>
//                                 );
//                             })()}
//                         </>
//                     )}
//                 </div>
//             </div>

//             {showAlerts && <AlertModal records={records} onClose={() => setShowAlerts(false)} />}

//             {selected && (
//                 <PatientDetail
//                     record={selected}
//                     onClose={() => setSelected(null)}
//                     setPatients={setPatients}
//                     setSelected={setSelected}
//                     onMarkReturned={markReturned}
//                 />
//             )}

//             {uninstallTarget && (
//                 <UninstallModal
//                     patient={uninstallTarget}
//                     onCancel={() => setUninstallTarget(null)}
//                     onSuccess={handleUninstallSuccess}
//                 />
//             )}
//         </div>
//     );
// }











"use client";
import React, { useEffect, useState, useMemo } from "react";
import { RefreshCcw, Bell, CalendarClock, Activity, ClipboardList, IndianRupee, PackageX, Plus, RotateCcw, Wind, Heart, Cpu, Droplets, Phone, User, AlertCircle, CheckCircle2, Loader2, AlertTriangle, Clock, ChevronDown, ChevronUp, Download, PackageCheck } from "lucide-react";
import Link from "next/link";
import * as XLSX from "xlsx";
import UninstallModal from "@/app/employee/UninstallModal";
import RenewalModal from "./../RenewModal";

// ── Formatters ────────────────────────────────────────────────────────────────
const AVATAR_BG = ["bg-teal-500", "bg-indigo-500", "bg-rose-500", "bg-amber-500", "bg-sky-500", "bg-violet-500", "bg-emerald-500", "bg-pink-500"];
const avatarBg = n => AVATAR_BG[n.charCodeAt(0) % AVATAR_BG.length];
const initials = n => n.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
const fmtCurrency = v => `₹${Number(v).toLocaleString("en-IN")}`;
const fmtINR = n => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
const todayStr = () => new Date().toISOString().split("T")[0];
const diffDays = (a, b = todayStr()) => Math.ceil((new Date(a) - new Date(b)) / 86400000);
const parseDuration = d => {
    if (!d) return "—";
    const [unit, val] = d.split(":");
    if (unit === "d") return `${val} day${Number(val) > 1 ? "s" : ""}`;
    if (unit === "m") return `${val} month${Number(val) > 1 ? "s" : ""}`;
    return d;
};

// ── Date group helpers ────────────────────────────────────────────────────────
function getDateGroupKey(isoDate) {
    if (!isoDate) return "Unknown";
    const d = new Date(isoDate);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    if (sameDay(d, today)) return "Today";
    if (sameDay(d, yesterday)) return "Yesterday";
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function groupByDate(list) {
    const groups = [];
    const seen = new Map();
    for (const r of list) {
        const key = getDateGroupKey(r.createdAt);
        if (!seen.has(key)) { seen.set(key, groups.length); groups.push({ key, items: [] }); }
        groups[seen.get(key)].items.push(r);
    }
    return groups;
}

// ── Payment helpers ───────────────────────────────────────────────────────────
const paidRentTotal = p => (p.monthlyRent || []).filter(r => r.status === "paid").reduce((s, r) => s + r.amount, 0);
const pendingRentTotal = p => (p.monthlyRent || []).filter(r => r.status === "pending").reduce((s, r) => s + r.amount, 0);
const progressPct = p => !p.grandTotal ? 0 : Math.min(100, Math.round((paidRentTotal(p) / p.grandTotal) * 100));

// ── Transform raw patient → enriched record ───────────────────────────────────
function transformPatient(p) {

    const monthlyRent = p.monthlyRent || [];
    const pendingMonths = monthlyRent.filter(m => m.status === "pending");
    const paidMonths = monthlyRent.filter(m => m.status === "paid");
    const paymentDue = pendingMonths.reduce((s, m) => s + (m.amount || 0), 0);
    const sortedPending = [...pendingMonths].sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0));
    const nextPending = sortedPending[0] || null;
    const paymentDueDate = nextPending?.dueDate ? new Date(nextPending.dueDate).toISOString().split("T")[0] : null;
    const nextUnpaidMonth = nextPending?.month || null;

    const returnDate = p.returnDate ? new Date(p.returnDate).toISOString().split("T")[0] : null;
    const isReturned = !!p.isReturned;

    const allPaid = (monthlyRent.length > 0 && pendingMonths.length === 0) || p.paymentType === "fully_paid";

    let status = "Active";
    if (isReturned) {
        status = "Completed";
    } else if (paymentDueDate && diffDays(paymentDueDate) < 0 && paymentDue > 0) {
        status = "Overdue";
    } else if (
        (paymentDueDate && diffDays(paymentDueDate) <= 7 && paymentDue > 0) ||
        (returnDate && diffDays(returnDate) >= 0 && diffDays(returnDate) <= 7)
    ) {
        status = "Due Soon";
    }
    if (allPaid) status = "Completed";

    return {
        _raw: p,
        id: p._id,
        patientName: p.name || "Unknown",
        age: p.age, phone: p.phone, altPhone: p.altPhone, whatsapp: p.whatsapp,
        address: p.address, dob: p.dob,
        reviewGiven: p.reviewGiven,
        paymentType: p.paymentType || null,
        paymentDue: isReturned ? 0 : paymentDue,
        paymentDueDate: isReturned ? null : paymentDueDate,
        nextUnpaidMonth: isReturned ? null : nextUnpaidMonth,
        totalMonths: monthlyRent.length, paidMonths: paidMonths.length, allPaid,
        returnDate, status, isReturned,
        machine: p.refMachine?.name || null,
        machineSerial: p.refMachine?.serialNumber || null,
        machineType: p.refMachine?.type || null,
        refDoctor: p.refDoctor?.name || p.otherSource || null,
        refEmployee: p.refEmployee?.name || p.otherEmployee || null,
        duration: p.duration, startDate: p.startDate, rentPerPeriod: p.rentPerPeriod,
        grandTotal: p.grandTotal, securityAmount: p.securityAmount,
        paymentAcc: p.paymentAcc,
        paymentMode: p.paymentMode,
        accessories: p.accessories,
        createdAt: p.createdAt,
        monthlyRentRaw: monthlyRent,
        pct: progressPct(p),
        totalPaidAmt: paidRentTotal(p),
        pendingAmt: isReturned ? 0 : pendingRentTotal(p),
    };
}

// ── Machine Icons ─────────────────────────────────────────────────────────────
const MACHINE_ICONS = { Ventilator: Wind, BiPAP: Wind, CPAP: Heart, Oxygen: Droplets, "BiPAP Auto": Wind, default: Cpu };
function MachineIcon({ type, size = 14 }) {
    const Icon = MACHINE_ICONS[type] || MACHINE_ICONS.default;
    return <Icon size={size} />;
}

// ── Atoms ─────────────────────────────────────────────────────────────────────
function Avatar({ name, size = "sm" }) {
    const sz = { lg: "w-12 h-12 text-base", md: "w-9 h-9 text-sm", sm: "w-8 h-8 text-xs" }[size];
    return (
        <div className={`${sz} ${avatarBg(name)} rounded-full flex items-center justify-center text-white font-bold shrink-0 select-none`}>
            {initials(name)}
        </div>
    );
}

function PaymentBadge({ variant }) {
    const map = {
        paid: ["bg-emerald-50 text-emerald-700 border-emerald-200", "Paid"],
        pending: ["bg-amber-50 text-amber-700 border-amber-200", "Pending"],
        fully_paid: ["bg-sky-50 text-sky-700 border-sky-200", "Fully Paid"],
        rent: ["bg-violet-50 text-violet-700 border-violet-200", "Rent"],
        returned: ["bg-gray-100 text-gray-600 border-gray-300", "Returned"],
    };
    const [cls, label] = map[variant] || ["bg-gray-100 text-gray-600 border-gray-200", variant];
    return <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${cls}`}>{label}</span>;
}

function StatusBadge({ status, allPaid, isReturned }) {
    if (isReturned) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-gray-100 text-gray-600 border-gray-300">
                <PackageCheck size={10} /> Returned
            </span>
        );
    }
    if (status === "Completed" && allPaid) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                <CheckCircle2 size={10} /> Fully Paid
            </span>
        );
    }
    const map = {
        "Due Soon": "bg-amber-50 text-amber-700 border-amber-200",
        Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Completed: "bg-slate-100 text-slate-500 border-slate-200",
        Overdue: "bg-red-50 text-red-600 border-red-200",
    };
    const dot = { "Due Soon": "bg-amber-400", Active: "bg-emerald-500", Completed: "bg-slate-400", Overdue: "bg-red-500" };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${map[status] || map.Active}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dot[status] || dot.Active}`} />
            {status}
        </span>
    );
}

function ProgressBar({ pct }) {
    const color = pct === 100 ? "bg-emerald-500" : pct >= 60 ? "bg-sky-500" : pct >= 30 ? "bg-amber-400" : "bg-rose-400";
    return (
        <div className="flex items-center gap-2 w-full">
            <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-gray-500 shrink-0 tabular-nums">{pct}%</span>
        </div>
    );
}

// ── Next Payment Cell ─────────────────────────────────────────────────────────
function NextPaymentCell({ r }) {
    if (r.isReturned) {
        return (
            <div className="flex items-center gap-1.5">
                <PackageCheck size={13} className="text-gray-400" />
                <span className="text-[12px] text-gray-500 font-semibold">Returned</span>
            </div>
        );
    }
    if (r.paymentDue === 0 || !r.paymentDueDate) {
        return (
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span className="text-[12px] text-emerald-700 font-bold">All Paid</span>
                </div>
                {r.totalMonths > 0 && <span className="text-[10px] text-slate-400">{r.paidMonths}/{r.totalMonths} paid</span>}
            </div>
        );
    }
    const days = diffDays(r.paymentDueDate);
    const overdue = days < 0;
    const isToday = days === 0;
    const urgent = days > 0 && days <= 3;
    const soon = days > 3 && days <= 7;
    let pillCls = "bg-slate-50 border-slate-200 text-slate-500";
    let amtCls = "text-slate-800";
    if (overdue || isToday) { pillCls = "bg-red-50 border-red-200 text-red-700"; amtCls = "text-red-600"; }
    else if (urgent) { pillCls = "bg-amber-50 border-amber-200 text-amber-800"; amtCls = "text-amber-700"; }
    else if (soon) { pillCls = "bg-orange-50 border-orange-200 text-orange-700"; amtCls = "text-orange-600"; }
    return (
        <div className="flex flex-col gap-0.5">
            <div className={`font-bold text-[13px] ${amtCls}`}>
                {fmtINR(r.paymentDue)}
                {!overdue && (
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border w-fit ml-1 ${pillCls}`}>
                        <Clock size={8} /> {isToday ? "Due today" : `in ${days}d`}
                    </span>
                )}
            </div>
            <div className="text-xs text-slate-600">{fmtDate(r.paymentDueDate)}</div>
            {overdue && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border w-fit mt-0.5 bg-red-50 border-red-200 text-red-700">
                    <AlertTriangle size={8} /> {Math.abs(days)}d overdue
                </span>
            )}
            {r.nextUnpaidMonth && <span className="text-[10px] text-slate-400">{r.nextUnpaidMonth}</span>}
            {r.totalMonths > 0 && <span className="text-[10px] text-slate-400">{r.paidMonths}/{r.totalMonths} paid</span>}
        </div>
    );
}

// ── Return Date Cell ──────────────────────────────────────────────────────────
function ReturnDateCell({ returnDate, isReturned }) {
    if (isReturned) {
        return (
            <div className="flex flex-col gap-0.5">
                {returnDate && <div className="text-[12px] font-semibold text-gray-500">{fmtDate(returnDate)}</div>}
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border w-fit bg-gray-100 border-gray-200 text-gray-500">
                    <PackageCheck size={8} /> Returned
                </span>
            </div>
        );
    }
    if (!returnDate) return <span className="text-[11px] text-slate-300">Not set</span>;
    const days = diffDays(returnDate);
    const overdue = days < 0;
    const isToday = days === 0;
    const urgent = days > 0 && days <= 3;
    const soon = days > 3 && days <= 7;
    let pillCls = "bg-slate-50 border-slate-200 text-slate-500";
    let dateCls = "text-slate-700";
    if (overdue || isToday) { pillCls = "bg-red-50 border-red-200 text-red-700"; dateCls = "text-red-600"; }
    else if (urgent) { pillCls = "bg-violet-50 border-violet-200 text-violet-800"; dateCls = "text-violet-700"; }
    else if (soon) { pillCls = "bg-blue-50 border-blue-200 text-blue-700"; dateCls = "text-blue-700"; }
    return (
        <div className="flex flex-col gap-0.5">
            <div className={`font-semibold text-[12px] ${dateCls}`}>{fmtDate(returnDate)}</div>
            {!overdue && (
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border w-fit mt-0.5 ${pillCls}`}>
                    <RotateCcw size={8} /> {isToday ? "Today" : `in ${days}d`}
                </span>
            )}
            {overdue && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border w-fit mt-0.5 bg-red-50 border-red-200 text-red-700">
                    <AlertTriangle size={8} /> {Math.abs(days)}d overdue
                </span>
            )}
        </div>
    );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, Icon, accentBg, accentText }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-3 sm:p-4 flex flex-col gap-2 shadow-sm">
            <div className="flex items-center justify-between">
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">{label}</span>
                <span className={`p-1.5 rounded-xl ${accentBg} ${accentText} flex shrink-0`}><Icon size={14} /></span>
            </div>
            <div>
                <div className="text-[18px] sm:text-[22px] font-black text-slate-900 leading-none">{value}</div>
                {sub && <div className="text-[10px] text-slate-400 mt-1">{sub}</div>}
            </div>
        </div>
    );
}

// ── Alert Modal ───────────────────────────────────────────────────────────────
function AlertModal({ records, onClose }) {
    const urgent = records
        .filter(r => {
            if (r.isReturned || r.status === "Completed") return false;
            const pd = r.paymentDueDate ? diffDays(r.paymentDueDate) : 99;
            const rd = r.returnDate ? diffDays(r.returnDate) : 99;
            return pd <= 7 || rd <= 7;
        })
        .sort((a, b) => {
            const da = Math.min(a.paymentDueDate ? diffDays(a.paymentDueDate) : 99, a.returnDate ? diffDays(a.returnDate) : 99);
            const db = Math.min(b.paymentDueDate ? diffDays(b.paymentDueDate) : 99, b.returnDate ? diffDays(b.returnDate) : 99);
            return da - db;
        });
    const overdueList = urgent.filter(r => r.status === "Overdue");
    const dueSoonList = urgent.filter(r => r.status === "Due Soon" || r.status === "Active");

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50" onClick={onClose}>
            <div className="w-full sm:max-w-lg mx-2 sm:mx-0" onClick={e => e.stopPropagation()}>
                <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
                    <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 shrink-0">
                        <div className="w-9 h-9 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                            <Bell size={16} className="text-amber-700" />
                        </div>
                        <div className="flex-1">
                            <h2 className="font-extrabold text-amber-900 text-sm">Action Required</h2>
                            <p className="text-[11px] text-amber-600 font-medium">Next 7 days · {urgent.length} alert{urgent.length !== 1 ? "s" : ""}</p>
                        </div>
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-amber-500 hover:text-amber-800 hover:bg-amber-100 transition-colors text-xl leading-none shrink-0">&times;</button>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {urgent.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 px-6 gap-3">
                                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <CheckCircle2 size={24} className="text-emerald-600" />
                                </div>
                                <p className="text-sm font-bold text-slate-700">All clear!</p>
                                <p className="text-xs text-slate-400 text-center">No urgent actions in the next 7 days.</p>
                            </div>
                        ) : (
                            <div className="p-4 flex flex-col gap-4">
                                {overdueList.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <AlertTriangle size={12} className="text-red-500" />
                                            <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest">Overdue</span>
                                            <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full">{overdueList.length}</span>
                                        </div>
                                        <div className="flex flex-col gap-2">{overdueList.map(r => <AlertCard key={r.id} r={r} />)}</div>
                                    </div>
                                )}
                                {dueSoonList.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock size={12} className="text-amber-500" />
                                            <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest">Due Soon</span>
                                            <span className="text-[10px] bg-amber-100 text-amber-600 font-bold px-1.5 py-0.5 rounded-full">{dueSoonList.length}</span>
                                        </div>
                                        <div className="flex flex-col gap-2">{dueSoonList.map(r => <AlertCard key={r.id} r={r} />)}</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function AlertCard({ r }) {
    const pdDays = r.paymentDueDate ? diffDays(r.paymentDueDate) : null;
    const rdDays = r.returnDate ? diffDays(r.returnDate) : null;
    const isOverdue = r.status === "Overdue";
    return (
        <div className={`rounded-2xl border p-3.5 flex items-start gap-3 ${isOverdue ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isOverdue ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"}`}>
                <MachineIcon type={r.machineType} size={15} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <p className="text-sm font-bold text-slate-900 leading-tight">{r.patientName}</p>
                        {r.phone && <p className="text-[11px] text-slate-400 mt-0.5">{r.phone}</p>}
                    </div>
                    <StatusBadge status={r.status} allPaid={r.allPaid} isReturned={r.isReturned} />
                </div>
                {r.machine && (
                    <div className="flex items-center gap-1 mt-1.5">
                        <span className="text-slate-400"><MachineIcon type={r.machineType} size={11} /></span>
                        <span className="text-[11px] text-slate-500 font-medium">{r.machine}</span>
                    </div>
                )}
                <div className="flex flex-col gap-1 mt-2">
                    {pdDays !== null && pdDays <= 7 && r.paymentDue > 0 && (
                        <div className={`flex items-center gap-1.5 text-[12px] font-semibold ${pdDays < 0 ? "text-red-700" : "text-amber-700"}`}>
                            <IndianRupee size={11} />
                            <span>{fmtINR(r.paymentDue)}</span>
                            <span className="font-normal text-[11px]">— {pdDays < 0 ? `${Math.abs(pdDays)}d overdue` : pdDays === 0 ? "due today" : `due in ${pdDays}d`}</span>
                            {r.nextUnpaidMonth && <span className="text-[10px] text-slate-400 font-normal">({r.nextUnpaidMonth})</span>}
                        </div>
                    )}
                    {rdDays !== null && rdDays <= 7 && (
                        <div className={`flex items-center gap-1.5 text-[12px] font-semibold ${rdDays < 0 ? "text-red-700" : "text-blue-700"}`}>
                            <RotateCcw size={11} />
                            <span>Machine return</span>
                            <span className="font-normal text-[11px]">— {rdDays < 0 ? `${Math.abs(rdDays)}d overdue` : rdDays === 0 ? "today" : `in ${rdDays}d`}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0" onClick={onClose}>
            <div className=" bg-white rounded-3xl p-4 w-full sm:w-auto">
                <div className="bg-white w-full sm:max-w-2xl max-h-[90vh]  overflow-y-auto" onClick={e => e.stopPropagation()}>
                    <div className="sticky top-0 bg-white z-10 flex justify-between items-center px-5 sm:px-6 py-4 border-b border-gray-100 ">
                        <h2 className="font-bold text-gray-800 text-base">{title}</h2>
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-50 hover:text-gray-700 hover:bg-gray-100 transition-colors text-xl leading-none p-2 bg-black">&times;</button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}

// ── Return Banner ─────────────────────────────────────────────────────────────
function ReturnDateBanner({ returnDate, isReturned }) {
    if (isReturned) {
        return (
            <div className="text-center rounded-lg border text-sm py-2 px-4 font-medium bg-gray-50 border-gray-200 text-gray-600">
                📦 Machine returned{returnDate ? ` — ${fmtDate(returnDate)}` : ""}
            </div>
        );
    }
    if (!returnDate) return null;
    const days = diffDays(returnDate);
    const overdue = days < 0;
    const cls = overdue ? "bg-red-50 border-red-200 text-red-800" : days <= 7 ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-sky-50 border-sky-200 text-sky-800";
    return (
        <div className={`text-center rounded-lg border text-sm py-2 px-4 font-medium ${cls}`}>
            📅 Return: {fmtDate(returnDate)}
            {overdue ? ` — ${Math.abs(days)}d overdue` : days === 0 ? " — Today!" : ` — in ${days}d`}
        </div>
    );
}

// ── Patient Detail Modal ──────────────────────────────────────────────────────
function PatientDetail({ record: r, onClose, setSelected, setPatients, onMarkReturned, onRenew }) {
    const p = r._raw;
    const [savingRentIds, setSavingRentIds] = useState([]);
    const paidCnt = r.monthlyRentRaw.filter(x => x.status === "paid").length;
    const pendCnt = r.monthlyRentRaw.filter(x => x.status === "pending").length;

    const markRentPaid = async (patientId, rentId) => {
        try {
            setSavingRentIds(prev => [...prev, rentId]);
            const res = await fetch(`/api/patients/${patientId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
                body: JSON.stringify({ rentId })
            });
            if (!res.ok) throw new Error("Failed");
            const updated = await res.json();
            setPatients(prev => prev.map(pt => pt._id === updated._id ? updated : pt));
            setSelected(transformPatient(updated));
        } catch (err) {
            console.error(err);
            alert("Failed to update rent");
        } finally {
            setSavingRentIds(prev => prev.filter(id => id !== rentId));
        }
    };


    return (
        <Modal title="Patient Details" onClose={onClose}>
            <div className="p-2 sm:p-2 flex flex-col gap-2 ">
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 ${avatarBg(r.patientName)} rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0`}>
                        {initials(r.patientName)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900">{r.patientName}</h3>
                        <p className="text-sm text-gray-500">{r.phone}</p>
                        {r.altPhone && <p className="text-xs text-gray-400">Alt: {r.altPhone}</p>}
                        {r.whatsapp && <p className="text-xs text-gray-400">WhatsApp: {r.whatsapp}</p>}
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                            <PaymentBadge variant={r.paymentType} />
                            <StatusBadge status={r.status} allPaid={r.allPaid} isReturned={r.isReturned} />
                        </div>
                        <div className="text-sm text-slate-600">
                            <span className="font-semibold">Payment:</span>{" "}
                            {r.paymentMode}
                            {r?.paymentAcc && (
                                <span className="ml-1 text-slate-500">({r.paymentAcc})</span>
                            )}
                        </div>

                        <div>Google Review Given ? : {r.reviewGiven != null ? (r.reviewGiven ? "Yes" : "No") : "—"}</div>
                    </div>
                </div>

                <ReturnDateBanner returnDate={r.returnDate} isReturned={r.isReturned} />

                {!r.isReturned && r.paymentDue > 0 && r.paymentDueDate && (
                    <div className={`rounded-2xl border px-5 py-4 ${diffDays(r.paymentDueDate) < 0 ? "bg-red-50 border-red-200" : diffDays(r.paymentDueDate) <= 7 ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200"}`}>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Next Payment Due</p>
                        <NextPaymentCell r={r} />
                    </div>
                )}

                {(r.address || r.dob || r.age) && (
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Personal Info</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {r.address && <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 col-span-2 sm:col-span-3"><p className="text-xs text-gray-400 font-medium mb-0.5">📍 Address</p><p className="text-sm font-semibold text-gray-700">{r.address}</p></div>}
                            {r.dob && <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3"><p className="text-xs text-gray-400 font-medium mb-0.5">🎂 Date of Birth</p><p className="text-sm font-semibold text-gray-700">{fmtDate(r.dob)}</p></div>}
                            {r.age && <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3"><p className="text-xs text-gray-400 font-medium mb-0.5">🧑 Age</p><p className="text-sm font-semibold text-gray-700">{r.age} yrs</p></div>}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[["🩺", "Referred By", r.refDoctor || "—", null], ["⚙️", "Machine", r.machine, r.machineSerial], ["👤", "Installed By", r.refEmployee || "—", null]].map(([icon, label, val, serial]) => (
                        <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                            <p className="text-xs text-gray-400 font-medium mb-0.5">{icon} {label}</p>
                            <p className="text-sm font-semibold text-gray-700 truncate">{val || "—"}</p>
                            {serial && <p className="text-xs text-gray-500 font-mono mt-0.5">{serial}</p>}
                        </div>
                    ))}
                </div>

                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Rental Details</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3"><p className="text-xs text-gray-400 font-medium mb-0.5">📆 Start Date</p><p className="text-sm font-semibold text-gray-700">{fmtDate(r.startDate)}</p></div>
                        <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3"><p className="text-xs text-gray-400 font-medium mb-0.5">⏱ Duration</p><p className="text-sm font-semibold text-gray-700">{parseDuration(r.duration)}</p></div>
                        <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3"><p className="text-xs text-gray-400 font-medium mb-0.5">💰 Rent / Period</p><p className="text-sm font-semibold text-gray-700">{fmtCurrency(r.rentPerPeriod)}</p></div>
                        {r.returnDate && (
                            <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                                <p className="text-xs text-gray-400 font-medium mb-0.5">📦 Return Date</p>
                                <p className={`text-sm font-semibold ${r.isReturned ? "text-gray-500" : "text-gray-700"}`}>{fmtDate(r.returnDate)}</p>
                                {r.isReturned && <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">✓ Returned</p>}
                            </div>
                        )}
                    </div>
                </div>

                {r.accessories?.filter(a => a.name?.trim()).length > 0 && (
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Accessories</p>
                        <div className="border border-gray-100 rounded-xl overflow-hidden">
                            <table className="w-full text-sm">
                                <thead><tr className="bg-slate-50 border-b border-gray-100">{["#", "Name"].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2.5">{h}</th>)}</tr></thead>
                                <tbody className="divide-y divide-gray-50">
                                    {r.accessories.filter(a => a.name?.trim()).map((acc, i) => (
                                        <tr key={acc._id || i}><td className="px-4 py-2.5 text-xs text-gray-400">{i + 1}</td><td className="px-4 py-2.5 text-sm text-gray-700">{acc.name}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Payment Summary</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        {[["Grand Total", fmtCurrency(r.grandTotal), "text-gray-800"], ["Security Paid", fmtCurrency(r.securityAmount || 0), "text-indigo-600"], ["Rent Collected", fmtCurrency(paidRentTotal(p)), "text-emerald-600"], ["Pending", fmtCurrency(r.pendingAmt), r.pendingAmt > 0 ? "text-amber-600" : "text-emerald-600"]].map(([label, val, color]) => (
                            <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5"><p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p><p className={`text-base font-bold ${color}`}>{val}</p></div>
                        ))}
                    </div>
                    {r.paymentType === "rent" && (
                        <div>
                            <div className="flex justify-between text-xs text-gray-500 mb-1.5"><span>Recovery Progress</span><span className="font-semibold">{fmtCurrency(r.totalPaidAmt)} of {fmtCurrency(r.grandTotal)}</span></div>
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden"><div className={`h-2 rounded-full ${r.pct === 100 ? "bg-emerald-500" : r.pct >= 60 ? "bg-sky-500" : "bg-amber-400"}`} style={{ width: `${r.pct}%` }} /></div>
                            <p className="text-xs text-gray-400 mt-1">{r.pct}% recovered</p>
                        </div>
                    )}
                </div>

                {r.monthlyRentRaw.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rent Schedule</p>
                            <div className="flex gap-1.5">
                                {paidCnt > 0 && <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">{paidCnt} paid</span>}
                                {pendCnt > 0 && <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">{pendCnt} pending</span>}
                            </div>
                        </div>
                        <div className="border border-gray-100 rounded-xl overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="bg-slate-50 border-b border-gray-100">{["#", "Period", "Due Date", "Amount", "Status", "Action"].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2.5">{h}</th>)}</tr></thead>
                                <tbody className="divide-y divide-gray-50">
                                    {r.monthlyRentRaw.map((rent, i) => {
                                        const rentDays = rent.dueDate ? diffDays(new Date(rent.dueDate).toISOString().split("T")[0]) : null;
                                        const isOverdueRent = !r.isReturned && rent.status === "pending" && rentDays !== null && rentDays < 0;
                                        return (
                                            <tr key={rent._id} className={rent.status === "pending" ? (isOverdueRent ? "bg-red-50/40" : "bg-amber-50/40") : ""}>
                                                <td className="px-4 py-2.5 text-xs text-gray-400">{i + 1}</td>
                                                <td className="px-4 py-2.5 text-sm text-gray-600">{rent.month || "—"}</td>
                                                <td className="px-4 py-2.5"><div className="text-sm font-medium text-gray-700">{fmtDate(rent.dueDate)}</div>{isOverdueRent && <span className="text-[10px] text-red-600 font-bold">{Math.abs(rentDays)}d overdue</span>}</td>
                                                <td className="px-4 py-2.5 text-sm font-bold text-gray-800">{fmtCurrency(rent.amount)}</td>
                                                <td className="px-4 py-2.5"><PaymentBadge variant={rent.status} /></td>
                                                <td className="px-4 py-2.5">
                                                    {!r.isReturned && rent.status === "pending" ? (
                                                        <button onClick={() => markRentPaid(p._id, rent._id)} disabled={savingRentIds.includes(rent._id)} className={`text-xs px-2 py-1 rounded-md text-white ${savingRentIds.includes(rent._id) ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600"}`}>
                                                            {savingRentIds.includes(rent._id) ? "..." : "Mark Paid"}
                                                        </button>
                                                    ) : <span className="text-xs text-gray-400">—</span>}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── Action Buttons ── */}
                {r.isReturned ? (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4">
                            <span className="text-2xl">📦</span>
                            <div><p className="text-sm font-bold text-gray-700">Machine Returned</p><p className="text-xs text-gray-500 mt-0.5">This machine has been returned by the patient.</p></div>
                        </div>
                        {/* Renew button — available even after return */}
                        <button
                            onClick={() => onRenew(r.id)}
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-colors"
                        >
                            🔄 Renew Rental
                        </button>
                    </div>
                ) : (
                    <div className="flex md:flex-row flex-col gap-2">
                        {/* Renew button */}
                        <button
                            onClick={() => onRenew(r.id)}
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-colors"
                        >
                            🔄 Renew Rental
                        </button>
                        {/* Mark Returned button */}
                        <button
                            onClick={() => onMarkReturned(r.id)}
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gray-800 text-white text-sm font-bold hover:bg-gray-900 transition-colors"
                        >
                            <PackageCheck size={16} /> Mark Machine as Returned
                        </button>
                    </div>
                )}

                <p className="text-xs text-gray-400 text-right">Registered {fmtDate(r.createdAt)}</p>
            </div>
        </Modal>
    );
}

// ── Mobile Card ───────────────────────────────────────────────────────────────
function MobileCard({ r, onClick, onMarkReturned, onRenew }) {
    const [expanded, setExpanded] = useState(false);
    const [returning, setReturning] = useState(false);
    const borderCls = r.isReturned ? "border-gray-200 opacity-75" : r.status === "Overdue" ? "border-red-200" : r.status === "Due Soon" ? "border-amber-200" : "border-slate-100";

    const handleReturn = async (e) => {
        e.stopPropagation();
        setReturning(true);
        await onMarkReturned(r.id);
        setReturning(false);
    };

    return (
        <div className={`bg-white border ${borderCls} rounded-2xl shadow-sm overflow-hidden`}>
            <div className="flex items-center gap-3 px-4 pt-4 pb-3 cursor-pointer" onClick={onClick}>
                <Avatar name={r.patientName} size="md" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{r.patientName}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5 flex-wrap">
                        {r.age && <span className="flex items-center gap-0.5"><User size={9} />{r.age}y</span>}
                        {r.phone && <span className="flex items-center gap-0.5"><Phone size={9} />{r.phone}</span>}
                    </div>
                </div>
                <StatusBadge status={r.status} allPaid={r.allPaid} isReturned={r.isReturned} />
            </div>

            {r.machine && (
                <div className="mx-4 mb-3 flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                    <span className="text-slate-400"><MachineIcon type={r.machineType} size={13} /></span>
                    <span className="text-[12px] font-semibold text-slate-700">{r.machine}</span>
                    {r.machineSerial && <span className="text-[10px] text-slate-400 ml-auto">{r.machineSerial}</span>}
                </div>
            )}

            <div className="grid grid-cols-2 gap-px bg-slate-100 mx-4 mb-3 rounded-xl overflow-hidden cursor-pointer" onClick={onClick}>
                <div className="bg-white px-3 py-2.5 rounded-l-xl">
                    <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Next Payment</div>
                    <NextPaymentCell r={r} />
                </div>
                <div className="bg-white px-3 py-2.5 rounded-r-xl">
                    <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Return Date</div>
                    <ReturnDateCell returnDate={r.returnDate} isReturned={r.isReturned} />
                </div>
            </div>

            <div className="px-4 pb-3 flex flex-col gap-2">
                {/* Renew button — always visible */}
                <button
                    onClick={e => { e.stopPropagation(); onRenew(r.id); }}
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-colors"
                >
                    🔄 Renew
                </button>

                {r.isReturned ? (
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                        <PackageCheck size={14} className="text-gray-500" />
                        <span className="text-xs font-semibold text-gray-600">Machine Returned</span>
                        {r.returnDate && <span className="text-[10px] text-gray-400 ml-auto">{fmtDate(r.returnDate)}</span>}
                    </div>
                ) : (
                    <button onClick={handleReturn} disabled={returning} className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-gray-800 text-white text-xs font-bold hover:bg-gray-900 transition-colors disabled:opacity-50">
                        {returning ? <Loader2 size={13} className="animate-spin" /> : <PackageCheck size={13} />}
                        {returning ? "Updating…" : "Mark as Returned"}
                    </button>
                )}
            </div>

            {(r.refEmployee || r.refDoctor) && (
                <>
                    <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between px-4 py-2.5 border-t border-slate-50 text-[11px] text-slate-400 hover:bg-slate-50 transition-colors">
                        <span>More details</span>
                        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                    {expanded && (
                        <div className="px-4 pb-4 pt-1 flex flex-col gap-1.5 border-t border-slate-50">
                            {r.refEmployee && <div className="flex items-center justify-between"><span className="text-[10px] text-slate-400">Installed By</span><span className="text-[11px] font-semibold text-slate-700">{r.refEmployee}</span></div>}
                            {r.refDoctor && <div className="flex items-center justify-between"><span className="text-[10px] text-slate-400">Referred By</span><span className="text-[11px] font-semibold text-slate-700">{r.refDoctor}</span></div>}
                            <div className="flex items-center justify-between"><span className="text-[10px] text-slate-400">Duration</span><span className="text-[11px] font-semibold text-slate-700">{parseDuration(r.duration)}</span></div>
                            <div className="flex items-center justify-between"><span className="text-[10px] text-slate-400">Payment</span><PaymentBadge variant={r.paymentType} /></div>
                            <button onClick={onClick} className="text-[10px] text-teal-600 font-semibold text-left mt-1">View full details →</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// ── Desktop Table Row ─────────────────────────────────────────────────────────
function TableRow({ r, index, onClick, onMarkReturned, onRenew }) {
    const [returning, setReturning] = useState(false);

    const handleReturn = async (e) => {
        e.stopPropagation();
        setReturning(true);
        await onMarkReturned(r.id);
        setReturning(false);
    };



    return (
        <tr onClick={onClick} className={`hover:bg-slate-50 transition-colors cursor-pointer group border-b border-slate-50 last:border-0 ${r.allPaid ? "bg-emerald-50/20" : ""} ${r.isReturned ? "opacity-60" : ""}`}>
            <td className="px-4 py-3.5 text-xs text-gray-400 font-mono">{index + 1}</td>
            <td className="px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                    <Avatar name={r.patientName} />
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-gray-800 truncate">{r.patientName}</p>
                            {r.allPaid && !r.isReturned && <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full px-1.5 py-0.5 whitespace-nowrap">100%</span>}
                            {r.isReturned && <span className="text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200 rounded-full px-1.5 py-0.5 whitespace-nowrap flex items-center gap-0.5"><PackageCheck size={9} /> Returned</span>}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                            {r.age && <><User size={9} />{r.age}y</>}
                            {r.age && r.phone && <span className="mx-0.5">·</span>}
                            {r.phone && <><Phone size={9} />{r.phone}</>}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-2 py-3.5">
                {r.machine ? (
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-slate-400"><MachineIcon type={r.machineType} /></span>
                            <p className="text-sm text-gray-600 max-w-[130px] truncate">{r.machine}</p>
                        </div>
                        {r.machineSerial && <p className="text-xs font-mono text-gray-400">{r.machineSerial}</p>}
                    </div>
                ) : <span className="text-xs text-slate-300">—</span>}
            </td>
            <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{r.refDoctor || <span className="text-gray-400 italic">—</span>}</td>
            <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{r.refEmployee || "—"}</td>
            <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{parseDuration(r.duration)}</td>
            <td className="px-4 py-3.5"><NextPaymentCell r={r} /></td>
            <td className="p-0">
                <div className="items-start gap-2">
                    <ReturnDateCell returnDate={r.returnDate} isReturned={r.isReturned} />
                </div>
            </td>
            <td className="px-4 py-3.5">
                <div className="flex flex-col gap-1">
                    <StatusBadge status={r.status} allPaid={r.allPaid} isReturned={r.isReturned} />
                    <PaymentBadge variant={r.paymentType} />
                </div>
            </td>
            <td className="px-4 py-3.5 min-w-[130px]">
                {r.paymentType === "fully_paid" ? <span className="text-xs text-emerald-600 font-semibold">✅ Complete</span> : <ProgressBar pct={r.pct} />}
            </td>


        </tr>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PatientsTable() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [selected, setSelected] = useState(null);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(0);
    const [showAlerts, setShowAlerts] = useState(false);
    const [uninstallTarget, setUninstallTarget] = useState(null);
    const [renewTarget, setRenewTarget] = useState(null); // raw patient object for RenewalModal

    // Opens UninstallModal
    const markReturned = (patientId) => {
        const raw = patients.find(p => p._id === patientId);
        if (raw) setUninstallTarget(raw);
    };

    // Opens RenewalModal
    const renewPatient = (patientId) => {
        const raw = patients.find(p => p._id === patientId);
        if (raw) setRenewTarget(raw);
    };

    // Called by UninstallModal after successful uninstall
    const handleUninstallSuccess = (updated) => {
        setPatients(prev => prev.map(pt => pt._id === updated._id ? updated : pt));
        if (selected?.id === updated._id) setSelected(transformPatient(updated));
        setUninstallTarget(null);
    };

    function downloadMonthWise() {
        const wb = XLSX.utils.book_new();
        const monthMap = {};
        records.forEach(r => {
            r.monthlyRentRaw.forEach(slot => {
                const key = slot.month || "Unknown";
                if (!monthMap[key]) monthMap[key] = [];
                monthMap[key].push({ "Patient Name": r.patientName, "Phone": r.phone || "", "Machine": r.machine || "", "Referred By": r.refDoctor || "", "Installed By": r.refEmployee || "", "Period": slot.month || "", "Due Date": slot.dueDate || "", "Amount (₹)": slot.amount || 0, "Status": slot.status === "paid" ? "Paid" : "Pending", "Duration": parseDuration(r.duration), "Grand Total (₹)": r.grandTotal || 0, "Security (₹)": r.securityAmount || 0, "Overall Status": r.status, "Returned": r.isReturned ? "Yes" : "No" });
            });
        });
        const sortedMonths = Object.keys(monthMap).sort((a, b) => { const da = new Date(a), db = new Date(b); if (!isNaN(da) && !isNaN(db)) return da - db; return a.localeCompare(b); });
        if (sortedMonths.length === 0) {
            const rows = records.map(r => ({ "Patient Name": r.patientName, "Phone": r.phone || "", "Machine": r.machine || "", "Referred By": r.refDoctor || "", "Installed By": r.refEmployee || "", "Duration": parseDuration(r.duration), "Grand Total (₹)": r.grandTotal || 0, "Paid (₹)": r.totalPaidAmt || 0, "Pending (₹)": r.pendingAmt || 0, "Security (₹)": r.securityAmount || 0, "Status": r.status, "Start Date": r.startDate || "", "Return Date": r.returnDate || "", "Returned": r.isReturned ? "Yes" : "No" }));
            const ws = XLSX.utils.json_to_sheet(rows); styleSheet(ws, rows.length); XLSX.utils.book_append_sheet(wb, ws, "All Patients");
        } else {
            sortedMonths.forEach(month => { const rows = monthMap[month]; const sheetName = month.replace(/[\\/*?[\]:]/g, "").slice(0, 31); const ws = XLSX.utils.json_to_sheet(rows); styleSheet(ws, rows.length); XLSX.utils.book_append_sheet(wb, ws, sheetName); });
            const summaryRows = records.map(r => ({ "Patient Name": r.patientName, "Phone": r.phone || "", "Machine": r.machine || "", "Referred By": r.refDoctor || "", "Installed By": r.refEmployee || "", "Duration": parseDuration(r.duration), "Total Instalments": r.totalMonths, "Paid Instalments": r.paidMonths, "Grand Total (₹)": r.grandTotal || 0, "Collected (₹)": r.totalPaidAmt || 0, "Pending (₹)": r.pendingAmt || 0, "Security (₹)": r.securityAmount || 0, "Status": r.status, "Start Date": r.startDate || "", "Return Date": r.returnDate || "", "Returned": r.isReturned ? "Yes" : "No" }));
            const summaryWs = XLSX.utils.json_to_sheet(summaryRows); styleSheet(summaryWs, summaryRows.length); XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");
        }
        XLSX.writeFile(wb, `patient-records-${new Date().toISOString().split("T")[0]}.xlsx`);
    }

    function styleSheet(ws, rowCount) {
        const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
        const colCount = range.e.c + 1;
        ws["!cols"] = Array.from({ length: colCount }, () => ({ wch: 20 }));
        for (let c = 0; c < colCount; c++) { const cellRef = XLSX.utils.encode_cell({ r: 0, c }); if (ws[cellRef]) ws[cellRef].s = { font: { bold: true, name: "Arial", sz: 10 }, fill: { fgColor: { rgb: "0F766E" }, patternType: "solid" }, alignment: { horizontal: "center", vertical: "center", wrapText: true }, border: { bottom: { style: "thin", color: { rgb: "CCCCCC" } } } }; }
        for (let r = 1; r <= rowCount; r++) { for (let c = 0; c < colCount; c++) { const cellRef = XLSX.utils.encode_cell({ r, c }); if (ws[cellRef]) ws[cellRef].s = { font: { name: "Arial", sz: 10 }, fill: { fgColor: { rgb: r % 2 === 0 ? "F8FAFC" : "FFFFFF" }, patternType: "solid" }, alignment: { vertical: "center" } }; } }
    }

    useEffect(() => {
        async function fetchPatients() {
            setLoading(true); setError(null);
            try {
                const res = await fetch("/api/patients", { headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY } });
                if (!res.ok) throw new Error(`Failed to fetch (${res.status})`);
                const data = await res.json();

                setPatients(Array.isArray(data) ? data : []);
            } catch (err) { setError(err.message); }
            finally { setLoading(false); }
        }
        fetchPatients();
    }, [refresh]);

    const records = useMemo(() =>
        patients.map(transformPatient).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        [patients]
    );

    const stats = useMemo(() => {
        const activeNonReturned = records.filter(r => !r.isReturned && r.status !== "Completed");
        return {
            total: records.length,
            active: activeNonReturned.length,
            totalDue: activeNonReturned.reduce((s, r) => s + (r.paymentDue || 0), 0),
            dueSoon: activeNonReturned.filter(r => r.paymentDueDate && diffDays(r.paymentDueDate) <= 7 && r.paymentDue > 0).length,
            returnSoon: activeNonReturned.filter(r => r.returnDate && diffDays(r.returnDate) >= 0 && diffDays(r.returnDate) <= 7).length,
            overdue: activeNonReturned.filter(r => r.status === "Overdue").length,
        };
    }, [records]);

    const statusCounts = useMemo(() => ({
        all: records.length,
        Active: records.filter(r => r.status === "Active").length,
        "Due Soon": records.filter(r => r.status === "Due Soon").length,
        Overdue: records.filter(r => r.status === "Overdue").length,
        Completed: records.filter(r => r.status === "Completed").length,
    }), [records]);

    const filtered = useMemo(() => {
        let list = records;
        if (statusFilter !== "all") list = list.filter(r => r.status === statusFilter);
        if (typeFilter === "rent") list = list.filter(r => r.paymentType === "rent");
        else if (typeFilter === "fully_paid") list = list.filter(r => r.paymentType === "fully_paid");
        else if (typeFilter === "returned") list = list.filter(r => r.isReturned);
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(r => r.patientName?.toLowerCase().includes(q) || r.machine?.toLowerCase().includes(q) || r.refDoctor?.toLowerCase().includes(q) || r.refEmployee?.toLowerCase().includes(q) || r.phone?.includes(q) || r.altPhone?.includes(q) || r.address?.toLowerCase().includes(q));
        }
        return list;
    }, [records, statusFilter, typeFilter, search]);

    const footerTotal = filtered.reduce((s, r) => s + (r.grandTotal || 0), 0);
    const footerCollected = filtered.reduce((s, r) => s + r.totalPaidAmt, 0);
    const footerPending = filtered.reduce((s, r) => s + r.pendingAmt, 0);
    const alertCount = stats.dueSoon || stats.returnSoon || stats.overdue;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white border-b border-slate-200 shadow-sm shrink-0 z-30 sticky top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900 text-base leading-tight">Patient Records</h1>
                                <p className="text-xs text-gray-400 hidden sm:block">Machine rental &amp; payment tracker</p>
                            </div>
                        </div>
                        <div className="relative flex-1 sm:max-w-sm sm:ml-2">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" /></svg>
                            <input className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-50" placeholder="Search patient, doctor, machine, address…" value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-2 sm:ml-auto">
                            <button onClick={() => setShowAlerts(s => !s)} className={`relative p-2 rounded-xl transition-colors ${showAlerts ? "bg-amber-100 text-amber-700" : "hover:bg-slate-100 text-slate-500"}`}>
                                <Bell size={18} />
                                {alertCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">{alertCount}</span>}
                            </button>
                            <button onClick={() => setRefresh(n => n + 1)} disabled={loading} className="flex items-center gap-1.5 text-xs bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 cursor-pointer hover:bg-amber-100 transition-colors disabled:opacity-50">
                                <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
                                <span className="hidden sm:inline">Refresh</span>
                            </button>
                            <button onClick={downloadMonthWise} disabled={records.length === 0} className="flex items-center gap-1.5 text-xs bg-emerald-50 border border-emerald-300 rounded-xl px-3 py-2 cursor-pointer hover:bg-emerald-100 transition-colors disabled:opacity-40">
                                <Download size={14} className="text-emerald-700" />
                                <span className="hidden sm:inline text-emerald-800 font-semibold">Download</span>
                            </button>
                            <Link href="/form" className="flex items-center gap-1.5 bg-teal-600 text-white rounded-xl px-3 py-2 text-xs font-bold shadow hover:bg-teal-700 transition-colors">
                                <Plus size={14} /> <span className="hidden sm:inline">Add Patient</span>
                            </Link>
                            <span className="hidden sm:inline text-xs text-gray-400 shrink-0 ml-1">{filtered.length} / {records.length}</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 items-center">
                        {[{ key: "all", label: "All" }, { key: "Active", label: "Active" }, { key: "Due Soon", label: "Due Soon" }, { key: "Overdue", label: "Overdue" }, { key: "Completed", label: "Completed" }].map(f => (
                            <button key={f.key} onClick={() => setStatusFilter(f.key)} className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-colors flex items-center gap-1 ${statusFilter === f.key ? "bg-teal-600 text-white border-teal-600" : "bg-white text-gray-600 border-gray-200 hover:border-teal-300"}`}>
                                {f.label}
                                {f.key !== "all" && statusCounts[f.key] > 0 && <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${statusFilter === f.key ? "bg-teal-500 text-white" : "bg-slate-100 text-slate-500"}`}>{statusCounts[f.key]}</span>}
                            </button>
                        ))}
                        <span className="w-px h-4 bg-gray-200 mx-0.5" />
                        {[{ key: "all", label: "All Types" }, { key: "rent", label: "Rent" }, { key: "fully_paid", label: "Fully Paid" }, { key: "returned", label: "Returned" }].map(f => (
                            <button key={f.key} onClick={() => setTypeFilter(f.key)} className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-colors ${typeFilter === f.key ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"}`}>{f.label}</button>
                        ))}
                        <span className="sm:hidden text-xs text-gray-400 ml-auto">{filtered.length} / {records.length}</span>
                    </div>
                </div>
            </header>

            <div className="flex-1">
                <div className="max-w-9xl mx-auto px-1 sm:px-2 lg:px-2 py-4 flex flex-col gap-4">
                    {loading && <div className="flex items-center justify-center py-24"><Loader2 size={26} className="animate-spin text-teal-600" /><span className="ml-3 text-slate-400 text-sm">Loading patients…</span></div>}
                    {!loading && error && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                            <AlertCircle size={17} className="text-red-500 shrink-0 mt-0.5" />
                            <div className="flex-1"><div className="font-bold text-sm text-red-700">Failed to load data</div><div className="text-xs text-red-400">{error}</div></div>
                            <button onClick={() => setRefresh(n => n + 1)} className="text-xs font-bold text-red-600 hover:underline">Retry</button>
                        </div>
                    )}
                    {!loading && !error && (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                                <StatCard label="Total Records" value={stats.total} Icon={ClipboardList} accentBg="bg-teal-100" accentText="text-teal-700" />
                                <StatCard label="Active Rentals" value={stats.active} Icon={Activity} accentBg="bg-emerald-100" accentText="text-emerald-700" sub={`${records.length - stats.active} completed/returned`} />
                                <StatCard label="Pending Amount" value={fmtINR(stats.totalDue)} Icon={IndianRupee} accentBg="bg-amber-100" accentText="text-amber-700" sub="Active rentals only" />
                                <StatCard label="Due in 7 Days" value={stats.dueSoon} Icon={CalendarClock} accentBg="bg-red-100" accentText="text-red-600" sub="Payment collections" />
                                <StatCard label="Returns in 7 Days" value={stats.returnSoon} Icon={PackageX} accentBg="bg-violet-100" accentText="text-violet-700" sub="Machine pickups" />
                                <StatCard label="Overdue" value={stats.overdue} Icon={AlertTriangle} accentBg="bg-rose-100" accentText="text-rose-700" sub="Need attention" />
                            </div>

                            <p className="text-xs text-slate-400">{filtered.length} record{filtered.length !== 1 ? "s" : ""}{search && ` matching "${search}"`}</p>

                            {filtered.length === 0 && records.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                                    <p className="text-sm text-gray-400 italic mb-2">No patients found.</p>
                                    <Link href="/form" className="flex items-center gap-1.5 bg-teal-600 text-white rounded-xl px-4 py-2 text-xs font-bold"><Plus size={13} /> Add first patient</Link>
                                </div>
                            )}
                            {filtered.length === 0 && records.length > 0 && <div className="text-center py-16 text-slate-400 text-sm">No records match your search or filter.</div>}

                            {filtered.length > 0 && (() => {
                                const groups = groupByDate(filtered);
                                let globalIndex = 0;
                                return (
                                    <>
                                        {/* ── Mobile Cards ── */}
                                        <div className="flex flex-col gap-5 lg:hidden">
                                            {groups.map(group => (
                                                <div key={group.key}>
                                                    <div className="flex items-center gap-2 mb-2.5">
                                                        <span className={`text-[11px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border ${group.key === "Today" ? "bg-teal-50 text-teal-700 border-teal-200" : group.key === "Yesterday" ? "bg-violet-50 text-violet-700 border-violet-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>{group.key}</span>
                                                        <span className="text-[10px] text-slate-400 font-medium">{group.items.length} record{group.items.length !== 1 ? "s" : ""}</span>
                                                        <div className="flex-1 h-px bg-slate-100" />
                                                    </div>
                                                    <div className="flex flex-col gap-3">
                                                        {group.items.map(r => (
                                                            <MobileCard
                                                                key={r.id}
                                                                r={r}
                                                                onClick={() => setSelected(r)}
                                                                onMarkReturned={markReturned}
                                                                onRenew={renewPatient}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* ── Desktop Table ── */}
                                        <div className="hidden lg:block bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm min-w-[1100px]">
                                                    <thead>
                                                        <tr className="bg-slate-50 border-b border-gray-100">
                                                            {["#", "Patient", "Machine", "Referred By", "Installed By", "Duration", "Next Payment", "Return Date", "Status", "Progress",].map(h => (
                                                                <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-50">
                                                        {groups.map(group => (
                                                            <React.Fragment key={`group-${group.key}`}>
                                                                <tr>
                                                                    <td colSpan={12} className="px-4 py-2 bg-slate-50 border-y border-slate-100">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border ${group.key === "Today" ? "bg-teal-50 text-teal-700 border-teal-200" : group.key === "Yesterday" ? "bg-violet-50 text-violet-700 border-violet-200" : "bg-white text-slate-500 border-slate-200"}`}>{group.key}</span>
                                                                            <span className="text-[10px] text-slate-400">{group.items.length} record{group.items.length !== 1 ? "s" : ""}</span>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                {group.items.map(r => {
                                                                    const idx = globalIndex++;
                                                                    return (
                                                                        <TableRow
                                                                            key={r.id}
                                                                            r={r}
                                                                            index={idx}
                                                                            onClick={() => setSelected(r)}
                                                                            onMarkReturned={markReturned}

                                                                        />
                                                                    );
                                                                })}
                                                            </React.Fragment>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="border-t border-gray-100 bg-slate-50 px-4 py-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                                <span className="font-medium">{filtered.length} patient{filtered.length !== 1 ? "s" : ""}</span>
                                                <span className="text-gray-300">·</span>
                                                <span>Grand Total: <strong className="text-gray-700">{fmtCurrency(footerTotal)}</strong></span>
                                                <span className="text-gray-300">·</span>
                                                <span>Collected: <strong className="text-emerald-600">{fmtCurrency(footerCollected)}</strong></span>
                                                <span className="text-gray-300">·</span>
                                                <span>Pending: <strong className="text-amber-600">{fmtCurrency(footerPending)}</strong></span>
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </>
                    )}
                </div>
            </div>

            {showAlerts && <AlertModal records={records} onClose={() => setShowAlerts(false)} />}

            {selected && (
                <PatientDetail
                    record={selected}
                    onClose={() => setSelected(null)}
                    setPatients={setPatients}
                    setSelected={setSelected}
                    onMarkReturned={markReturned}
                    onRenew={renewPatient}
                />
            )}

            {uninstallTarget && (
                <UninstallModal
                    patient={uninstallTarget}
                    onCancel={() => setUninstallTarget(null)}
                    onSuccess={handleUninstallSuccess}
                />
            )}

            {/* ── RenewalModal ── */}
            {renewTarget && (
                <RenewalModal
                    patientId={renewTarget._id}
                    onClose={() => setRenewTarget(null)}
                    onSuccess={() => {
                        setRenewTarget(null);
                        setRefresh(n => n + 1); // re-fetch updated data
                    }}
                />
            )}
        </div>
    );
}