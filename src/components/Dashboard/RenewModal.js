// "use client";

// import { useState } from "react";
// import toast from "react-hot-toast";

// export default function RenewModal({ patientId, onClose, onSuccess }) {
//     const [form, setForm] = useState({
//         dueDate: "",
//         amount: "",
//         status: "pending",
//     });

//     const [loading, setLoading] = useState(false);

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             const res = await fetch("/api/patients/renew", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     'x-api-key': process.env.NEXT_PUBLIC_API_KEY
//                 },
//                 body: JSON.stringify({
//                     patientId,
//                     ...form,
//                 }),
//             });

//             const data = await res.json();

//             if (!res.ok || !data.success) {
//                 toast.error(data.message || "Failed to renew");
//                 return;
//             }

//             toast.success("Renewed successfully!");

//             onSuccess?.();
//             onClose();
//         } catch (err) {
//             console.error(err);
//             toast.error("Server error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//             <div className="bg-white w-full max-w-md rounded-lg p-5">

//                 <h2 className="text-lg font-semibold mb-4">Manual Renew</h2>

//                 <form onSubmit={handleSubmit} className="space-y-3">

//                     {/* Due Date */}
//                     <input
//                         type="date"
//                         name="dueDate"
//                         value={form.dueDate}
//                         onChange={handleChange}
//                         className="w-full border p-2 rounded"
//                         required
//                     />

//                     {/* Amount */}
//                     <input
//                         type="number"
//                         name="amount"
//                         placeholder="Amount"
//                         value={form.amount}
//                         onChange={handleChange}
//                         className="w-full border p-2 rounded"
//                         required
//                     />

//                     {/* Status */}
//                     <select
//                         name="status"
//                         value={form.status}
//                         onChange={handleChange}
//                         className="w-full border p-2 rounded"
//                     >
//                         <option value="pending">Pending</option>
//                         <option value="paid">Paid</option>
//                     </select>

//                     {/* Buttons */}
//                     <div className="flex justify-end gap-2 pt-2">
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="px-3 py-1 border rounded"
//                         >
//                             Cancel
//                         </button>

//                         <button
//                             disabled={loading}
//                             className="px-3 py-1 bg-blue-600 text-white rounded"
//                         >
//                             {loading ? "Saving..." : "Save"}
//                         </button>
//                     </div>

//                 </form>
//             </div>
//         </div>
//     );
// }


"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function RenewModal({ patientId, onClose, onSuccess }) {
    const [form, setForm] = useState({
        dueDate: "",
        amount: "",
        status: "pending",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/patients/renew", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
                },
                body: JSON.stringify({
                    patientId,
                    ...form,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                toast.error(data.message || "Failed to renew");
                return;
            }

            toast.success("Renewed successfully!");

            onSuccess?.();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">

            {/* Card */}
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">

                {/* Header */}
                <div className="px-5 py-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Manual Renew
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        Update due date, amount and payment status
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">

                    {/* Due Date */}
                    <div>
                        <label className="text-xs text-gray-500">Due Date</label>
                        <input
                            type="date"
                            name="dueDate"
                            value={form.dueDate}
                            onChange={handleChange}
                            className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="text-xs text-gray-500">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            placeholder="Enter amount"
                            value={form.amount}
                            onChange={handleChange}
                            className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="text-xs text-gray-500">Status</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            disabled={loading}
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}