// "use client";
// import { useState, useEffect } from "react";
// import {
//     Plus, Pencil, Trash2, X, Settings2, CheckCircle2,
//     CircleDashed, Wrench, AlertTriangle, CalendarClock,
//     Filter, ChevronDown, Search, MapPin
// } from "lucide-react";
// import LoadingDots from "@/components/Loading";

// const STATUS_OPTIONS = [
//     { value: "in_use", label: "In Use", icon: CheckCircle2, bg: "#dcfce7", color: "#16a34a", border: "#bbf7d0", dot: "#22c55e" },
//     { value: "available", label: "Available", icon: CircleDashed, bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0", dot: "#94a3b8" },
//     { value: "broken", label: "Broken", icon: AlertTriangle, bg: "#fee2e2", color: "#dc2626", border: "#fecaca", dot: "#ef4444" },
//     { value: "maintenance", label: "Maintenance", icon: Wrench, bg: "#fef9c3", color: "#ca8a04", border: "#fde68a", dot: "#eab308" },
//     { value: "reserved", label: "Reserved", icon: CalendarClock, bg: "#ede9fe", color: "#7c3aed", border: "#ddd6fe", dot: "#8b5cf6" },
// ];

// const BRANCHES = ["Odisha", "Kolkata", "Ranchi", "Patna", "Bangalore"];

// const EMPTY_FORM = { name: "", type: "", serial: "", status: "available", branch: "" };
// const getStatus = (val) => STATUS_OPTIONS.find((s) => s.value === val) || STATUS_OPTIONS[1];

// export default function MachineManager() {
//     const [machines, setMachines] = useState([]);
//     const [form, setForm] = useState(EMPTY_FORM);
//     const [editId, setEditId] = useState(null);
//     const [showModal, setShowModal] = useState(false);
//     const [deleteId, setDeleteId] = useState(null);
//     const [filterStatus, setFilter] = useState("all");
//     const [filterBranch, setFilterBranch] = useState("all");
//     const [search, setSearch] = useState("");
//     const [showFilter, setShowFilter] = useState(false);
//     const [loadingMachines, setLoadingMachines] = useState(false);
//     const [uploading, setUploading] = useState(false);
//     const [deleting, setDeleting] = useState(false);

//     const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowModal(true); };
//     const openEdit = (m) => {
//         setForm({ name: m.name, type: m.type, serial: m.serial, status: m.status, branch: m.branch || "" });
//         setEditId(m.id);
//         setShowModal(true);
//     };

//     const fetchMachines = async () => {
//         try {
//             setLoadingMachines(true);
//             const res = await fetch("/api/machines", {
//                 headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }
//             });
//             if (!res.ok) throw new Error("Failed to fetch machines");
//             const data = await res.json();
//             if (!Array.isArray(data)) throw new Error("Invalid API response");
//             const formatted = data.map((m) => ({
//                 id: m._id,
//                 name: m.name,
//                 type: m.type,
//                 serial: m.serialNumber,
//                 status: m.status,
//                 branch: m.branch || "",
//             }));
//             setMachines(formatted);
//         } catch (error) {
//             console.error("Fetch machines error:", error);
//         } finally {
//             setLoadingMachines(false);
//         }
//     };

//     useEffect(() => { fetchMachines(); }, []);

//     const handleSubmit = async () => {
//         if (!form.name || !form.serial) return;
//         const payload = {
//             name: form.name,
//             type: form.type,
//             serialNumber: form.serial,
//             status: form.status,
//             branch: form.branch,
//         };
//         try {
//             setUploading(true);
//             if (editId) {
//                 await fetch("/api/machines", {
//                     method: "PUT",
//                     headers: { "Content-Type": "application/json", "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
//                     body: JSON.stringify({ id: editId, ...payload })
//                 });
//             } else {
//                 await fetch("/api/machines", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json", "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
//                     body: JSON.stringify(payload)
//                 });
//             }
//             await fetchMachines();
//             setShowModal(false);
//             setForm(EMPTY_FORM);
//             setEditId(null);
//         } catch (error) {
//             console.error("Machine save failed:", error);
//         } finally {
//             setUploading(false);
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!id) return;
//         try {
//             setDeleting(true);
//             await fetch("/api/machines", {
//                 method: "DELETE",
//                 headers: { "Content-Type": "application/json", "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
//                 body: JSON.stringify({ id })
//             });
//             await fetchMachines();
//             setDeleteId(null);
//         } catch (error) {
//             console.error("Failed to delete machine:", error);
//         } finally {
//             setDeleting(false);
//         }
//     };

//     const counts = STATUS_OPTIONS.reduce((a, s) => ({ ...a, [s.value]: machines.filter((m) => m.status === s.value).length }), {});

//     const filtered = machines
//         .filter((m) => filterStatus === "all" || m.status === filterStatus)
//         .filter((m) => filterBranch === "all" || m.branch === filterBranch)
//         .filter((m) => !search ||
//             m.name.toLowerCase().includes(search.toLowerCase()) ||
//             m.serial.toLowerCase().includes(search.toLowerCase()) ||
//             (m.type || "").toLowerCase().includes(search.toLowerCase()) ||
//             (m.branch || "").toLowerCase().includes(search.toLowerCase())
//         );

//     return (
//         <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f0f4f8", minHeight: "100vh" }}>
//             <style>{`
//         .slide-up { animation: slideUp .24s cubic-bezier(.16,1,.3,1) both; }
//         @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
//         @keyframes slideUp { from { opacity:0; transform:translateY(20px) scale(.97) } to { opacity:1; transform:none } }

//         .card { background:#fff; border-radius:16px; box-shadow:0 1px 4px rgba(0,0,0,.07),0 4px 20px rgba(0,0,0,.04); }
//         .btn  { display:inline-flex; align-items:center; justify-content:center; gap:6px; border:none; border-radius:10px; cursor:pointer; font-family:inherit; font-weight:600; transition:all .15s; }
//         .btn-primary { background:#1a3658; color:#fff; padding:10px 20px; font-size:14px; }
//         .btn-primary:hover { background:#142b46; transform:translateY(-1px); box-shadow:0 4px 12px rgba(26,54,88,.3); }
//         .btn-ghost   { background:#f1f5f9; color:#475569; padding:9px 16px; font-size:13px; border:1.5px solid #e2e8f0; }
//         .btn-ghost:hover { background:#e8edf4; }
//         .btn-red     { background:#fef2f2; color:#dc2626; padding:9px 16px; font-size:13px; border:1.5px solid #fecaca; }
//         .btn-red:hover { background:#fee2e2; }
//         .btn-icon    { background:#f1f5f9; color:#64748b; padding:8px; border-radius:9px; border:1.5px solid #e2e8f0; }
//         .btn-icon:hover { background:#e2e8f0; color:#1e293b; }
//         .btn-icon-red { background:#fef2f2; color:#dc2626; padding:8px; border-radius:9px; border:1.5px solid #fecaca; }
//         .btn-icon-red:hover { background:#fee2e2; }

//         .input { width:100%; border:1.5px solid #e2e8f0; border-radius:10px; padding:10px 14px; font-size:14px; font-family:inherit; color:#1e293b; outline:none; transition:border-color .15s, box-shadow .15s; background:#fff; box-sizing:border-box; }
//         .input:focus { border-color:#1a3658; box-shadow:0 0 0 3px rgba(26,54,88,.1); }
//         .input-mono { font-family:'DM Mono', monospace; font-size:13px; }
//         .input::placeholder { color:#94a3b8; }

//         .table-row { border-bottom:1px solid #f1f5f9; transition:background .12s; }
//         .table-row:last-child { border-bottom:none; }
//         .table-row:hover { background:#f8faff; }

//         .status-pill { display:inline-flex; align-items:center; gap:5px; padding:4px 11px; border-radius:20px; font-size:12px; font-weight:600; border:1.5px solid; white-space:nowrap; }
//         .branch-pill { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; background:#f0f9ff; color:#0369a1; border:1.5px solid #bae6fd; white-space:nowrap; }
//         .status-toggle { display:flex; align-items:center; gap:7px; padding:7px 14px; border-radius:10px; font-size:13px; font-weight:500; cursor:pointer; border:1.5px solid; transition:all .15s; font-family:inherit; width:100%; }
//         .branch-btn { display:flex; align-items:center; justify-content:center; padding:8px 14px; border-radius:9px; font-size:13px; font-weight:600; cursor:pointer; border:1.5px solid #e2e8f0; background:#f8fafc; color:#475569; transition:all .15s; font-family:inherit; flex:1; }
//         .branch-btn:hover { border-color:#94a3b8; background:#f1f5f9; }
//         .branch-btn.active { background:#eff6ff; color:#1d4ed8; border-color:#bfdbfe; }

//         .overlay { position:fixed; inset:0; background:rgba(10,18,32,.5); backdrop-filter:blur(5px); display:flex; align-items:center; justify-content:center; z-index:100; padding:16px; }
//         .modal   { background:#fff; border-radius:20px; width:100%; max-width:460px; box-shadow:0 30px 80px rgba(0,0,0,.22); overflow:hidden; max-height:90vh; overflow-y:auto; }

//         .search-wrap { position:relative; }
//         .search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#94a3b8; }
//         .search-input { padding-left:38px !important; }

//         .filter-bar { display:flex; gap:8px; flex-wrap:wrap; }
//         .f-btn { padding:6px 14px; border-radius:8px; font-size:12px; font-weight:600; cursor:pointer; border:1.5px solid #e2e8f0; background:#fff; color:#64748b; transition:all .15s; font-family:inherit; white-space:nowrap; }
//         .f-btn:hover { border-color:#94a3b8; }
//         .f-btn.active { background:#1a3658; color:#fff; border-color:#1a3658; }

//         .branch-select-wrap { position:relative; flex-shrink:0; }
//         .branch-select { appearance:none; -webkit-appearance:none; border:1.5px solid #e2e8f0; border-radius:10px; padding:9px 36px 9px 34px; font-size:13px; font-family:inherit; font-weight:600; color:#1e293b; background:#fff; outline:none; cursor:pointer; transition:border-color .15s, box-shadow .15s; min-width:148px; }
//         .branch-select:focus { border-color:#1a3658; box-shadow:0 0 0 3px rgba(26,54,88,.1); }
//         .branch-select.has-value { border-color:#0369a1; background:#f0f9ff; color:#0369a1; }
//         .branch-select-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); pointer-events:none; color:#94a3b8; }
//         .branch-select.has-value ~ .branch-select-icon { color:#0369a1; }
//         .branch-chevron { position:absolute; right:10px; top:50%; transform:translateY(-50%); pointer-events:none; color:#94a3b8; }
//         .machine-card:hover { box-shadow:0 4px 16px rgba(0,0,0,.08); }

//         @media (max-width: 640px) {
//           .desktop-table { display:none !important; }
//           .mobile-cards  { display:flex !important; }
//           .stat-grid     { grid-template-columns: repeat(3, 1fr) !important; }
//           .header-row    { flex-direction:column !important; align-items:flex-start !important; gap:12px !important; }
//           .header-row .btn-primary { width:100%; }
//           .toolbar       { flex-direction:column !important; }
//           .filter-mobile-toggle { display:flex !important; }
//           .filter-bar-wrap { display: none; }
//           .filter-bar-wrap.open { display:block !important; }
//         }
//         @media (min-width: 641px) {
//           .mobile-cards  { display:none !important; }
//           .filter-mobile-toggle { display:none !important; }
//         }
//       `}</style>

//             {/* ── HEADER ─────────────────────────────────── */}
//             <div style={{ background: "linear-gradient(135deg,#1a3658 0%,#0f2240 100%)", color: "#fff", paddingBottom: 24 }}>
//                 <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px 0" }}>
//                     <div className="header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
//                         <div>
//                             <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-.5px" }}>Machine Manager</h1>
//                         </div>
//                         <button className="btn btn-primary" onClick={openAdd} style={{ background: "#fff", color: "#1a3658", flexShrink: 0 }}>
//                             <Plus size={16} /> Add Machine
//                         </button>
//                     </div>

//                     {/* Stat cards */}
//                     <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10 }}>
//                         {[{ label: "Total", value: machines.length, color: "#93c5fd" },
//                         ...STATUS_OPTIONS.map((s) => ({ label: s.label, value: counts[s.value] || 0, color: s.dot }))
//                         ].map((s) => (
//                             <div key={s.label} style={{ background: "rgba(255,255,255,.09)", borderRadius: 12, padding: "12px 14px", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.1)" }}>
//                                 <div style={{ fontSize: 10, fontWeight: 700, color: "#94b8d8", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>{s.label}</div>
//                                 <div style={{ fontSize: 26, fontWeight: 700, color: s.color, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>{s.value}</div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* ── MAIN ───────────────────────────────────── */}
//             <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>

//                 {/* Toolbar */}
//                 <div className="toolbar" style={{ display: "flex", gap: 10, marginBottom: 16 }}>
//                     <div className="search-wrap" style={{ flex: 1 }}>
//                         <Search size={15} className="search-icon" />
//                         <input className="input search-input" placeholder="Search by name, type, serial or branch…" value={search} onChange={(e) => setSearch(e.target.value)} />
//                     </div>

//                     {/* Branch dropdown */}
//                     <div className="branch-select-wrap">
//                         <MapPin size={14} className="branch-select-icon" />
//                         <select
//                             className={`branch-select${filterBranch !== "all" ? " has-value" : ""}`}
//                             value={filterBranch}
//                             onChange={(e) => setFilterBranch(e.target.value)}
//                         >
//                             <option value="all">All Branches</option>
//                             {BRANCHES.map((b) => (
//                                 <option key={b} value={b}>{b}</option>
//                             ))}
//                         </select>
//                         <ChevronDown size={13} className="branch-chevron" />
//                     </div>

//                     <button className="btn btn-ghost filter-mobile-toggle" onClick={() => setShowFilter(!showFilter)} style={{ gap: 6, flexShrink: 0 }}>
//                         <Filter size={14} /> Filter <ChevronDown size={13} style={{ transform: showFilter ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
//                     </button>
//                 </div>

//                 {/* Filter bar */}
//                 <div className={`filter-bar-wrap ${showFilter ? "open" : ""}`} style={{ marginBottom: 16 }}>
//                     <div className="filter-bar">
//                         <button className={`f-btn ${filterStatus === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All ({machines.length})</button>
//                         {STATUS_OPTIONS.map((s) => (
//                             <button key={s.value} className={`f-btn ${filterStatus === s.value ? "active" : ""}`} onClick={() => setFilter(s.value)}>
//                                 {s.label} ({counts[s.value] || 0})
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Desktop Table */}
//                 <div className="card desktop-table" style={{ overflow: "hidden" }}>
//                     {loadingMachines ? <LoadingDots /> :
//                         <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
//                             <thead>
//                                 <tr style={{ background: "#f8fafc", borderBottom: "2px solid #f1f5f9" }}>
//                                     {["Machine", "Type", "Serial Number", "Branch", "Status", ""].map((h, i) => (
//                                         <th key={i} style={{ padding: "12px 18px", textAlign: i === 5 ? "right" : "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".08em" }}>{h}</th>
//                                     ))}
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {filtered.map((m) => {
//                                     const st = getStatus(m.status);
//                                     const Icon = st.icon;
//                                     return (
//                                         <tr key={m.id} className="table-row">
//                                             <td style={{ padding: "14px 18px" }}>
//                                                 <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                                                     <div style={{ width: 38, height: 38, borderRadius: 10, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                                                         <Settings2 size={18} color="#6366f1" />
//                                                     </div>
//                                                     <span style={{ fontWeight: 600, color: "#0f172a" }}>{m.name}</span>
//                                                 </div>
//                                             </td>
//                                             <td style={{ padding: "14px 18px", color: "#64748b" }}>{m.type || "—"}</td>
//                                             <td style={{ padding: "14px 18px" }}>
//                                                 <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, background: "#f8fafc", border: "1px solid #e2e8f0", padding: "3px 10px", borderRadius: 6, color: "#475569" }}>{m.serial}</span>
//                                             </td>
//                                             <td style={{ padding: "14px 18px" }}>
//                                                 {m.branch
//                                                     ? <span className="branch-pill"><MapPin size={10} />{m.branch}</span>
//                                                     : <span style={{ color: "#cbd5e1", fontSize: 13 }}>—</span>
//                                                 }
//                                             </td>
//                                             <td style={{ padding: "14px 18px" }}>
//                                                 <span className="status-pill" style={{ background: st.bg, color: st.color, borderColor: st.border }}>
//                                                     <Icon size={12} />{st.label}
//                                                 </span>
//                                             </td>
//                                             <td style={{ padding: "14px 18px", textAlign: "right" }}>
//                                                 <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
//                                                     <button className="btn btn-icon" onClick={() => openEdit(m)} title="Edit"><Pencil size={15} /></button>
//                                                     <button className="btn btn-icon-red" onClick={() => setDeleteId(m.id)} title="Delete"><Trash2 size={15} /></button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                                 {filtered.length === 0 && (
//                                     <tr><td colSpan="6" style={{ textAlign: "center", padding: "52px 20px", color: "#94a3b8" }}>
//                                         <Settings2 size={36} style={{ margin: "0 auto 12px", display: "block", opacity: .35 }} />
//                                         <div style={{ fontWeight: 600, fontSize: 15, color: "#64748b", marginBottom: 4 }}>No machines found</div>
//                                         <div style={{ fontSize: 13 }}>{filterStatus !== "all" ? "Try a different filter" : "Click 'Add Machine' to get started"}</div>
//                                     </td></tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     }
//                 </div>

//                 {/* Mobile Cards */}
//                 <div className="mobile-cards" style={{ flexDirection: "column", gap: 12 }}>
//                     {filtered.length === 0 && (
//                         <div className="card" style={{ textAlign: "center", padding: "48px 20px", color: "#94a3b8" }}>
//                             <Settings2 size={32} style={{ margin: "0 auto 10px", display: "block", opacity: .35 }} />
//                             <div style={{ fontWeight: 600, color: "#64748b", marginBottom: 4 }}>No machines found</div>
//                             <div style={{ fontSize: 13 }}>Click 'Add Machine' to get started</div>
//                         </div>
//                     )}
//                     {filtered.map((m) => {
//                         const st = getStatus(m.status);
//                         const Icon = st.icon;
//                         return (
//                             <div key={m.id} className="machine-card fade-in">
//                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
//                                     <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                                         <div style={{ width: 40, height: 40, borderRadius: 10, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                                             <Settings2 size={19} color="#6366f1" />
//                                         </div>
//                                         <div>
//                                             <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 15 }}>{m.name}</div>
//                                             <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{m.type || "No type"}</div>
//                                         </div>
//                                     </div>
//                                     <div style={{ display: "flex", gap: 6 }}>
//                                         <button className="btn btn-icon" onClick={() => openEdit(m)}><Pencil size={14} /></button>
//                                         <button className="btn btn-icon-red" onClick={() => setDeleteId(m.id)}><Trash2 size={14} /></button>
//                                     </div>
//                                 </div>
//                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
//                                     <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, background: "#f8fafc", border: "1px solid #e2e8f0", padding: "3px 10px", borderRadius: 6, color: "#475569" }}>{m.serial}</span>
//                                     <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
//                                         {m.branch && <span className="branch-pill"><MapPin size={10} />{m.branch}</span>}
//                                         <span className="status-pill" style={{ background: st.bg, color: st.color, borderColor: st.border }}>
//                                             <Icon size={12} /> {st.label}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>

//             {/* ── ADD / EDIT MODAL ──────────────────────── */}
//             {showModal && (
//                 <div className="overlay fade-in" onClick={() => setShowModal(false)}>
//                     <div className="modal slide-up" onClick={(e) => e.stopPropagation()}>
//                         {/* Modal header */}
//                         <div style={{ padding: "22px 24px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                             <div>
//                                 <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a" }}>{editId ? "Edit Machine" : "Add New Machine"}</h2>
//                                 <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 3 }}>{editId ? "Update the details below" : "Register a new machine."}</p>
//                             </div>
//                             <button className="btn btn-icon" onClick={() => setShowModal(false)}><X size={16} /></button>
//                         </div>

//                         {/* Modal body */}
//                         <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>

//                             {/* Text fields */}
//                             {[
//                                 { label: "Machine Name", key: "name", placeholder: "e.g. CNC Lathe X200", required: true },
//                                 { label: "Machine Type", key: "type", placeholder: "e.g. CNC, Press, Conveyor" },
//                                 { label: "Serial Number", key: "serial", placeholder: "e.g. SN-001-2024", required: true, mono: true },
//                             ].map((f) => (
//                                 <div key={f.key}>
//                                     <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>
//                                         {f.label} {f.required && <span style={{ color: "#ef4444" }}>*</span>}
//                                     </label>
//                                     <input
//                                         className={`input${f.mono ? " input-mono" : ""}`}
//                                         placeholder={f.placeholder}
//                                         value={form[f.key]}
//                                         onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
//                                     />
//                                 </div>
//                             ))}

//                             {/* Branch Location */}
//                             <div>
//                                 <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>
//                                     <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><MapPin size={11} /> Branch Location</span>
//                                 </label>
//                                 <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//                                     {BRANCHES.map((b) => {
//                                         const active = form.branch === b;
//                                         return (
//                                             <button
//                                                 key={b}
//                                                 type="button"
//                                                 className={`branch-btn${active ? " active" : ""}`}
//                                                 style={{ flex: "0 0 calc(33% - 6px)" }}
//                                                 onClick={() => setForm({ ...form, branch: active ? "" : b })}
//                                             >
//                                                 {active && <MapPin size={12} style={{ marginRight: 4 }} />}
//                                                 {b}
//                                             </button>
//                                         );
//                                     })}
//                                 </div>
//                             </div>

//                             {/* Status */}
//                             <div>
//                                 <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>Status</label>
//                                 <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
//                                     {STATUS_OPTIONS.map((s) => {
//                                         const Icon = s.icon;
//                                         const active = form.status === s.value;
//                                         return (
//                                             <button key={s.value} className="status-toggle" onClick={() => setForm({ ...form, status: s.value })}
//                                                 style={{ background: active ? s.bg : "#f8fafc", color: active ? s.color : "#475569", borderColor: active ? s.border : "#e2e8f0" }}>
//                                                 <Icon size={15} />
//                                                 <span style={{ flex: 1, textAlign: "left" }}>{s.label}</span>
//                                                 {active && <CheckCircle2 size={15} style={{ color: s.color }} />}
//                                             </button>
//                                         );
//                                     })}
//                                 </div>
//                             </div>

//                             {/* Actions */}
//                             <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
//                                 <button className="btn btn-ghost" onClick={() => setShowModal(false)} style={{ flex: 1 }} disabled={uploading}>
//                                     Cancel
//                                 </button>
//                                 <button
//                                     className="btn btn-primary"
//                                     onClick={handleSubmit}
//                                     disabled={!form.name || !form.serial || uploading}
//                                     style={{ flex: 2, opacity: (!form.name || !form.serial || uploading) ? 0.5 : 1 }}
//                                 >
//                                     {uploading ? "Saving…" : editId ? <><Pencil size={14} /> Save Changes</> : <><Plus size={14} /> Add Machine</>}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* ── DELETE CONFIRM MODAL ──────────────────── */}
//             {deleteId && (
//                 <div className="overlay fade-in" onClick={() => setDeleteId(null)}>
//                     <div className="modal slide-up" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 380 }}>
//                         <div style={{ padding: "28px 24px 24px", display: "flex", flexDirection: "column", gap: 0 }}>
//                             <div style={{ width: 50, height: 50, borderRadius: 14, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
//                                 <Trash2 size={22} color="#dc2626" />
//                             </div>
//                             <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Delete Machine?</h2>
//                             <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 24 }}>This will permanently remove the machine record. This action cannot be undone.</p>
//                             <div style={{ display: "flex", gap: 10 }}>
//                                 <button className="btn btn-ghost" onClick={() => setDeleteId(null)} style={{ flex: 1 }}><X size={14} /> Cancel</button>
//                                 <button
//                                     className="btn btn-red"
//                                     onClick={() => handleDelete(deleteId)}
//                                     style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
//                                     disabled={deleting}
//                                 >
//                                     {deleting ? "Deleting…" : <><Trash2 size={14} /> Delete</>}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

"use client";
import { useState, useEffect } from "react";
import {
    Plus, Pencil, Trash2, X, Settings2, CheckCircle2,
    CircleDashed, Wrench, AlertTriangle, CalendarClock,
    Filter, ChevronDown, Search, MapPin
} from "lucide-react";
import LoadingDots from "@/components/Loading";

const STATUS_OPTIONS = [
    { value: "in_use", label: "In Use", icon: CheckCircle2, bg: "#dcfce7", color: "#16a34a", border: "#bbf7d0", dot: "#22c55e" },
    { value: "available", label: "Available", icon: CircleDashed, bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0", dot: "#94a3b8" },
    { value: "broken", label: "Broken", icon: AlertTriangle, bg: "#fee2e2", color: "#dc2626", border: "#fecaca", dot: "#ef4444" },
    { value: "maintenance", label: "Maintenance", icon: Wrench, bg: "#fef9c3", color: "#ca8a04", border: "#fde68a", dot: "#eab308" },
    { value: "reserved", label: "Reserved", icon: CalendarClock, bg: "#ede9fe", color: "#7c3aed", border: "#ddd6fe", dot: "#8b5cf6" },
];

const BRANCHES = ["Odisha", "Kolkata", "Ranchi", "Patna", "Bangalore"];

// Color for each branch card in the header
const BRANCH_COLORS = ["#60a5fa", "#34d399", "#f59e0b", "#f87171", "#a78bfa"];

const EMPTY_FORM = { name: "", type: "", serial: "", status: "available", branch: "" };
const getStatus = (val) => STATUS_OPTIONS.find((s) => s.value === val) || STATUS_OPTIONS[1];

export default function MachineManager() {
    const [machines, setMachines] = useState([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [editId, setEditId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [filterStatus, setFilter] = useState("all");
    const [filterBranch, setFilterBranch] = useState("all");
    const [search, setSearch] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [loadingMachines, setLoadingMachines] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowModal(true); };
    const openEdit = (m) => {
        setForm({ name: m.name, type: m.type, serial: m.serial, status: m.status, branch: m.branch || "" });
        setEditId(m.id);
        setShowModal(true);
    };

    const fetchMachines = async () => {
        try {
            setLoadingMachines(true);
            const res = await fetch("/api/machines", {
                headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }
            });
            if (!res.ok) throw new Error("Failed to fetch machines");
            const data = await res.json();
            if (!Array.isArray(data)) throw new Error("Invalid API response");
            const formatted = data.map((m) => ({
                id: m._id,
                name: m.name,
                type: m.type,
                serial: m.serialNumber,
                status: m.status,
                branch: m.branch || "",
            }));
            setMachines(formatted);
        } catch (error) {
            console.error("Fetch machines error:", error);
        } finally {
            setLoadingMachines(false);
        }
    };

    useEffect(() => { fetchMachines(); }, []);

    const handleSubmit = async () => {
        if (!form.name || !form.serial) return;
        const payload = {
            name: form.name,
            type: form.type,
            serialNumber: form.serial,
            status: form.status,
            branch: form.branch,
        };
        try {
            setUploading(true);
            if (editId) {
                await fetch("/api/machines", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
                    body: JSON.stringify({ id: editId, ...payload })
                });
            } else {
                await fetch("/api/machines", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
                    body: JSON.stringify(payload)
                });
            }
            await fetchMachines();
            setShowModal(false);
            setForm(EMPTY_FORM);
            setEditId(null);
        } catch (error) {
            console.error("Machine save failed:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!id) return;
        try {
            setDeleting(true);
            await fetch("/api/machines", {
                method: "DELETE",
                headers: { "Content-Type": "application/json", "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
                body: JSON.stringify({ id })
            });
            await fetchMachines();
            setDeleteId(null);
        } catch (error) {
            console.error("Failed to delete machine:", error);
        } finally {
            setDeleting(false);
        }
    };

    // Machines visible in the selected branch (used for status breakdown)
    const branchMachines = filterBranch === "all" ? machines : machines.filter((m) => m.branch === filterBranch);

    // Status counts for the selected branch (shown in breakdown bar)
    const statusCounts = STATUS_OPTIONS.reduce((acc, s) => ({
        ...acc,
        [s.value]: branchMachines.filter((m) => m.status === s.value).length,
    }), {});

    // Branch machine counts for header stat cards
    const branchCounts = BRANCHES.reduce((acc, b) => ({
        ...acc,
        [b]: machines.filter((m) => m.branch === b).length,
    }), {});

    // Final filtered list for table
    const filtered = machines
        .filter((m) => filterBranch === "all" || m.branch === filterBranch)
        .filter((m) => filterStatus === "all" || m.status === filterStatus)
        .filter((m) => !search ||
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.serial.toLowerCase().includes(search.toLowerCase()) ||
            (m.type || "").toLowerCase().includes(search.toLowerCase()) ||
            (m.branch || "").toLowerCase().includes(search.toLowerCase())
        );

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f0f4f8", minHeight: "100vh" }}>
            <style>{`
        .slide-up { animation: slideUp .24s cubic-bezier(.16,1,.3,1) both; }
        @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px) scale(.97) } to { opacity:1; transform:none } }

        .card { background:#fff; border-radius:16px; box-shadow:0 1px 4px rgba(0,0,0,.07),0 4px 20px rgba(0,0,0,.04); }
        .btn  { display:inline-flex; align-items:center; justify-content:center; gap:6px; border:none; border-radius:10px; cursor:pointer; font-family:inherit; font-weight:600; transition:all .15s; }
        .btn-primary { background:#1a3658; color:#fff; padding:10px 20px; font-size:14px; }
        .btn-primary:hover { background:#142b46; transform:translateY(-1px); box-shadow:0 4px 12px rgba(26,54,88,.3); }
        .btn-ghost   { background:#f1f5f9; color:#475569; padding:9px 16px; font-size:13px; border:1.5px solid #e2e8f0; }
        .btn-ghost:hover { background:#e8edf4; }
        .btn-red     { background:#fef2f2; color:#dc2626; padding:9px 16px; font-size:13px; border:1.5px solid #fecaca; }
        .btn-red:hover { background:#fee2e2; }
        .btn-icon    { background:#f1f5f9; color:#64748b; padding:8px; border-radius:9px; border:1.5px solid #e2e8f0; }
        .btn-icon:hover { background:#e2e8f0; color:#1e293b; }
        .btn-icon-red { background:#fef2f2; color:#dc2626; padding:8px; border-radius:9px; border:1.5px solid #fecaca; }
        .btn-icon-red:hover { background:#fee2e2; }

        .input { width:100%; border:1.5px solid #e2e8f0; border-radius:10px; padding:10px 14px; font-size:14px; font-family:inherit; color:#1e293b; outline:none; transition:border-color .15s, box-shadow .15s; background:#fff; box-sizing:border-box; }
        .input:focus { border-color:#1a3658; box-shadow:0 0 0 3px rgba(26,54,88,.1); }
        .input-mono { font-family:'DM Mono', monospace; font-size:13px; }
        .input::placeholder { color:#94a3b8; }

        .table-row { border-bottom:1px solid #f1f5f9; transition:background .12s; }
        .table-row:last-child { border-bottom:none; }
        .table-row:hover { background:#f8faff; }

        .status-pill { display:inline-flex; align-items:center; gap:5px; padding:4px 11px; border-radius:20px; font-size:12px; font-weight:600; border:1.5px solid; white-space:nowrap; }
        .branch-pill { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; background:#f0f9ff; color:#0369a1; border:1.5px solid #bae6fd; white-space:nowrap; }
        .status-toggle { display:flex; align-items:center; gap:7px; padding:7px 14px; border-radius:10px; font-size:13px; font-weight:500; cursor:pointer; border:1.5px solid; transition:all .15s; font-family:inherit; width:100%; }
        .branch-btn { display:flex; align-items:center; justify-content:center; padding:8px 14px; border-radius:9px; font-size:13px; font-weight:600; cursor:pointer; border:1.5px solid #e2e8f0; background:#f8fafc; color:#475569; transition:all .15s; font-family:inherit; flex:1; }
        .branch-btn:hover { border-color:#94a3b8; background:#f1f5f9; }
        .branch-btn.active { background:#eff6ff; color:#1d4ed8; border-color:#bfdbfe; }

        .overlay { position:fixed; inset:0; background:rgba(10,18,32,.5); backdrop-filter:blur(5px); display:flex; align-items:center; justify-content:center; z-index:100; padding:16px; }
        .modal   { background:#fff; border-radius:20px; width:100%; max-width:460px; box-shadow:0 30px 80px rgba(0,0,0,.22); overflow:hidden; max-height:90vh; overflow-y:auto; }

        .search-wrap { position:relative; }
        .search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#94a3b8; }
        .search-input { padding-left:38px !important; }

        .filter-bar { display:flex; gap:8px; flex-wrap:wrap; }
        .f-btn { padding:6px 14px; border-radius:8px; font-size:12px; font-weight:600; cursor:pointer; border:1.5px solid #e2e8f0; background:#fff; color:#64748b; transition:all .15s; font-family:inherit; white-space:nowrap; }
        .f-btn:hover { border-color:#94a3b8; }
        .f-btn.active { background:#1a3658; color:#fff; border-color:#1a3658; }

        /* Branch stat cards in header */
        .branch-stat-card { background:rgba(255,255,255,.09); border-radius:12px; padding:12px 14px; border:1.5px solid rgba(255,255,255,.1); cursor:pointer; transition:all .18s; }
        .branch-stat-card:hover { background:rgba(255,255,255,.15); border-color:rgba(255,255,255,.25); }
        .branch-stat-card.active { background:rgba(255,255,255,.2); border-color:rgba(255,255,255,.45); box-shadow:0 0 0 2px rgba(255,255,255,.15); }

        /* Status breakdown strip */
        .breakdown-strip { background:rgba(255,255,255,.07); border-radius:12px; padding:12px 16px; border:1px solid rgba(255,255,255,.1); margin-top:12px; }
        .breakdown-item { background:rgba(255,255,255,.08); border-radius:9px; padding:8px 10px; border:1px solid rgba(255,255,255,.08); flex:1; min-width:0; }

        .machine-card:hover { box-shadow:0 4px 16px rgba(0,0,0,.08); }

        @media (max-width: 640px) {
          .desktop-table { display:none !important; }
          .mobile-cards  { display:flex !important; }
          .stat-grid     { grid-template-columns: repeat(3, 1fr) !important; }
          .header-row    { flex-direction:column !important; align-items:flex-start !important; gap:12px !important; }
          .header-row .btn-primary { width:100%; }
          .toolbar       { flex-direction:column !important; }
          .filter-mobile-toggle { display:none !important; }
          .filter-bar-wrap { display:none !important; }
          .breakdown-strip { padding:8px 10px !important; }
          .breakdown-grid { grid-template-columns: repeat(5, 1fr) !important; gap:4px !important; }
          .breakdown-item { padding:5px 6px !important; }
          .breakdown-item-label { display:none !important; }
          .breakdown-item-val { font-size:14px !important; }
          .breakdown-title { font-size:9px !important; margin-bottom:5px !important; }
        }
        @media (min-width: 641px) {
          .mobile-cards  { display:none !important; }
          .filter-mobile-toggle { display:none !important; }
        }
      `}</style>

            {/* ── HEADER ─────────────────────────────────── */}
            <div style={{ background: "linear-gradient(135deg,#1a3658 0%,#0f2240 100%)", color: "#fff", paddingBottom: 24 }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px 0" }}>
                    <div className="header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <div>
                            <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-.5px" }}>Machine Manager</h1>
                        </div>
                        <button className="btn btn-primary" onClick={openAdd} style={{ background: "#fff", color: "#1a3658", flexShrink: 0 }}>
                            <Plus size={16} /> Add Machine
                        </button>
                    </div>

                    {/* ── Branch Stat Cards (replaces old status stat cards) ── */}
                    <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
                        {/* "All" card */}
                        <div
                            className={`branch-stat-card${filterBranch === "all" ? " active" : ""}`}
                            onClick={() => { setFilterBranch("all"); setFilter("all"); }}
                        >
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#94b8d8", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>All</div>
                            <div style={{ fontSize: 26, fontWeight: 700, color: "#93c5fd", fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>{machines.length}</div>
                        </div>

                        {/* One card per branch */}
                        {BRANCHES.map((b, i) => (
                            <div
                                key={b}
                                className={`branch-stat-card${filterBranch === b ? " active" : ""}`}
                                onClick={() => { setFilterBranch(b); setFilter("all"); }}
                            >
                                <div style={{ fontSize: 10, fontWeight: 700, color: "#94b8d8", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4, display: "flex", alignItems: "center", gap: 3 }}>
                                    <MapPin size={9} style={{ opacity: .7 }} />{b}
                                </div>
                                <div style={{ fontSize: 26, fontWeight: 700, color: BRANCH_COLORS[i], fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>
                                    {branchCounts[b] || 0}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Status Breakdown Strip (appears below branch cards) ── */}
                    <div className="breakdown-strip">
                        <div className="breakdown-title" style={{ fontSize: 10, fontWeight: 700, color: "#94b8d8", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>
                            {filterBranch === "all" ? "All Branches" : filterBranch} — Status Breakdown
                        </div>
                        <div className="breakdown-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                            {STATUS_OPTIONS.map((s) => {
                                const Icon = s.icon;
                                const count = statusCounts[s.value] || 0;
                                const isActive = filterStatus === s.value;
                                return (
                                    <div
                                        key={s.value}
                                        className="breakdown-item"
                                        onClick={() => setFilter(isActive ? "all" : s.value)}
                                        style={{
                                            cursor: "pointer",
                                            outline: isActive ? `2px solid ${s.dot}` : "none",
                                            outlineOffset: 1,
                                            transition: "outline .15s",
                                        }}
                                    >
                                        <div className="breakdown-item-label" style={{ fontSize: 10, color: "rgba(255,255,255,.5)", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block", flexShrink: 0 }} />
                                            {s.label}
                                        </div>
                                        <div className="breakdown-item-val" style={{ fontSize: 20, fontWeight: 700, color: s.dot, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>
                                            {count}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MAIN ───────────────────────────────────── */}
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>

                {/* Toolbar */}
                <div className="toolbar" style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                    <div className="search-wrap" style={{ flex: 1 }}>
                        <Search size={15} className="search-icon" />
                        <input className="input search-input" placeholder="Search by name, type, serial or branch…" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>

                {/* Status filter bar (desktop only — mobile uses breakdown strip in header) */}
                <div className="filter-bar-wrap" style={{ marginBottom: 16 }}>
                    <div className="filter-bar">
                        <button className={`f-btn ${filterStatus === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
                            All ({branchMachines.length})
                        </button>
                        {STATUS_OPTIONS.map((s) => (
                            <button key={s.value} className={`f-btn ${filterStatus === s.value ? "active" : ""}`} onClick={() => setFilter(filterStatus === s.value ? "all" : s.value)}>
                                {s.label} ({statusCounts[s.value] || 0})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="card desktop-table" style={{ overflow: "hidden" }}>
                    {loadingMachines ? <LoadingDots /> :
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                            <thead>
                                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #f1f5f9" }}>
                                    {["Machine", "Type", "Serial Number", "Branch", "Status", ""].map((h, i) => (
                                        <th key={i} style={{ padding: "12px 18px", textAlign: i === 5 ? "right" : "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".08em" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((m) => {
                                    const st = getStatus(m.status);
                                    const Icon = st.icon;
                                    return (
                                        <tr key={m.id} className="table-row">
                                            <td style={{ padding: "14px 18px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                    <div style={{ width: 38, height: 38, borderRadius: 10, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                        <Settings2 size={18} color="#6366f1" />
                                                    </div>
                                                    <span style={{ fontWeight: 600, color: "#0f172a" }}>{m.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: "14px 18px", color: "#64748b" }}>{m.type || "—"}</td>
                                            <td style={{ padding: "14px 18px" }}>
                                                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, background: "#f8fafc", border: "1px solid #e2e8f0", padding: "3px 10px", borderRadius: 6, color: "#475569" }}>{m.serial}</span>
                                            </td>
                                            <td style={{ padding: "14px 18px" }}>
                                                {m.branch
                                                    ? <span className="branch-pill"><MapPin size={10} />{m.branch}</span>
                                                    : <span style={{ color: "#cbd5e1", fontSize: 13 }}>—</span>
                                                }
                                            </td>
                                            <td style={{ padding: "14px 18px" }}>
                                                <span className="status-pill" style={{ background: st.bg, color: st.color, borderColor: st.border }}>
                                                    <Icon size={12} />{st.label}
                                                </span>
                                            </td>
                                            <td style={{ padding: "14px 18px", textAlign: "right" }}>
                                                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                                    <button className="btn btn-icon" onClick={() => openEdit(m)} title="Edit"><Pencil size={15} /></button>
                                                    <button className="btn btn-icon-red" onClick={() => setDeleteId(m.id)} title="Delete"><Trash2 size={15} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filtered.length === 0 && (
                                    <tr><td colSpan="6" style={{ textAlign: "center", padding: "52px 20px", color: "#94a3b8" }}>
                                        <Settings2 size={36} style={{ margin: "0 auto 12px", display: "block", opacity: .35 }} />
                                        <div style={{ fontWeight: 600, fontSize: 15, color: "#64748b", marginBottom: 4 }}>No machines found</div>
                                        <div style={{ fontSize: 13 }}>{filterStatus !== "all" || filterBranch !== "all" ? "Try a different filter" : "Click 'Add Machine' to get started"}</div>
                                    </td></tr>
                                )}
                            </tbody>
                        </table>
                    }
                </div>

                {/* Mobile Cards */}
                <div className="mobile-cards" style={{ flexDirection: "column", gap: 12 }}>
                    {filtered.length === 0 && (
                        <div className="card" style={{ textAlign: "center", padding: "48px 20px", color: "#94a3b8" }}>
                            <Settings2 size={32} style={{ margin: "0 auto 10px", display: "block", opacity: .35 }} />
                            <div style={{ fontWeight: 600, color: "#64748b", marginBottom: 4 }}>No machines found</div>
                            <div style={{ fontSize: 13 }}>Click 'Add Machine' to get started</div>
                        </div>
                    )}
                    {filtered.map((m) => {
                        const st = getStatus(m.status);
                        const Icon = st.icon;
                        return (
                            <div key={m.id} className="machine-card fade-in">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <Settings2 size={19} color="#6366f1" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 15 }}>{m.name}</div>
                                            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{m.type || "No type"}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: 6 }}>
                                        <button className="btn btn-icon" onClick={() => openEdit(m)}><Pencil size={14} /></button>
                                        <button className="btn btn-icon-red" onClick={() => setDeleteId(m.id)}><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, background: "#f8fafc", border: "1px solid #e2e8f0", padding: "3px 10px", borderRadius: 6, color: "#475569" }}>{m.serial}</span>
                                    <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                                        {m.branch && <span className="branch-pill"><MapPin size={10} />{m.branch}</span>}
                                        <span className="status-pill" style={{ background: st.bg, color: st.color, borderColor: st.border }}>
                                            <Icon size={12} /> {st.label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── ADD / EDIT MODAL ──────────────────────── */}
            {showModal && (
                <div className="overlay fade-in" onClick={() => setShowModal(false)}>
                    <div className="modal slide-up" onClick={(e) => e.stopPropagation()}>
                        <div style={{ padding: "22px 24px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a" }}>{editId ? "Edit Machine" : "Add New Machine"}</h2>
                                <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 3 }}>{editId ? "Update the details below" : "Register a new machine."}</p>
                            </div>
                            <button className="btn btn-icon" onClick={() => setShowModal(false)}><X size={16} /></button>
                        </div>

                        <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
                            {[
                                { label: "Machine Name", key: "name", placeholder: "e.g. CNC Lathe X200", required: true },
                                { label: "Machine Type", key: "type", placeholder: "e.g. CNC, Press, Conveyor" },
                                { label: "Serial Number", key: "serial", placeholder: "e.g. SN-001-2024", required: true, mono: true },
                            ].map((f) => (
                                <div key={f.key}>
                                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>
                                        {f.label} {f.required && <span style={{ color: "#ef4444" }}>*</span>}
                                    </label>
                                    <input
                                        className={`input${f.mono ? " input-mono" : ""}`}
                                        placeholder={f.placeholder}
                                        value={form[f.key]}
                                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                                    />
                                </div>
                            ))}

                            <div>
                                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><MapPin size={11} /> Branch Location</span>
                                </label>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    {BRANCHES.map((b) => {
                                        const active = form.branch === b;
                                        return (
                                            <button
                                                key={b}
                                                type="button"
                                                className={`branch-btn${active ? " active" : ""}`}
                                                style={{ flex: "0 0 calc(33% - 6px)" }}
                                                onClick={() => setForm({ ...form, branch: active ? "" : b })}
                                            >
                                                {active && <MapPin size={12} style={{ marginRight: 4 }} />}
                                                {b}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>Status</label>
                                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                    {STATUS_OPTIONS.map((s) => {
                                        const Icon = s.icon;
                                        const active = form.status === s.value;
                                        return (
                                            <button key={s.value} className="status-toggle" onClick={() => setForm({ ...form, status: s.value })}
                                                style={{ background: active ? s.bg : "#f8fafc", color: active ? s.color : "#475569", borderColor: active ? s.border : "#e2e8f0" }}>
                                                <Icon size={15} />
                                                <span style={{ flex: 1, textAlign: "left" }}>{s.label}</span>
                                                {active && <CheckCircle2 size={15} style={{ color: s.color }} />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                                <button className="btn btn-ghost" onClick={() => setShowModal(false)} style={{ flex: 1 }} disabled={uploading}>Cancel</button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSubmit}
                                    disabled={!form.name || !form.serial || uploading}
                                    style={{ flex: 2, opacity: (!form.name || !form.serial || uploading) ? 0.5 : 1 }}
                                >
                                    {uploading ? "Saving…" : editId ? <><Pencil size={14} /> Save Changes</> : <><Plus size={14} /> Add Machine</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── DELETE CONFIRM MODAL ──────────────────── */}
            {deleteId && (
                <div className="overlay fade-in" onClick={() => setDeleteId(null)}>
                    <div className="modal slide-up" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 380 }}>
                        <div style={{ padding: "28px 24px 24px", display: "flex", flexDirection: "column", gap: 0 }}>
                            <div style={{ width: 50, height: 50, borderRadius: 14, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                                <Trash2 size={22} color="#dc2626" />
                            </div>
                            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Delete Machine?</h2>
                            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 24 }}>This will permanently remove the machine record. This action cannot be undone.</p>
                            <div style={{ display: "flex", gap: 10 }}>
                                <button className="btn btn-ghost" onClick={() => setDeleteId(null)} style={{ flex: 1 }}><X size={14} /> Cancel</button>
                                <button
                                    className="btn btn-red"
                                    onClick={() => handleDelete(deleteId)}
                                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                                    disabled={deleting}
                                >
                                    {deleting ? "Deleting…" : <><Trash2 size={14} /> Delete</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}