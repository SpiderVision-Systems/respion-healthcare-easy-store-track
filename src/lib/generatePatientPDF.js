// // // // /**
// // // //  * generatePatientPDF.js
// // // //  * 
// // // //  * Drop this file into your project (e.g. /lib/generatePatientPDF.js)
// // // //  * Install dependency: npm install jspdf
// // // //  * 
// // // //  * Usage (call after successful save in PatientForm.jsx):
// // // //  *   import { generatePatientPDF } from "@/lib/generatePatientPDF";
// // // //  *   generatePatientPDF(payload, schedule);   // auto-downloads
// // // //  */

// // // // import { jsPDF } from "jspdf";

// // // // // ── Helpers ────────────────────────────────────────────────────────────────────
// // // // const fmt = (v) => "Rs. " + (Math.round(Number(v) || 0)).toLocaleString("en-IN");

// // // // const fmtDateShort = (iso) => {
// // // //   if (!iso) return "—";
// // // //   const [y, m, d] = iso.split("-").map(Number);
// // // //   return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
// // // //     day: "numeric", month: "short", year: "numeric",
// // // //   });
// // // // };

// // // // const BLUE = [21, 101, 192];   // #1565C0
// // // // const LIGHT_BLUE = [25, 118, 210];   // #1976D2
// // // // const BORDER_BLUE = [30, 136, 229];   // #1E88E5
// // // // const WHITE = [255, 255, 255];
// // // // const BLACK = [0, 0, 0];
// // // // const GREY_LINE = [180, 180, 180];

// // // // // ── Page 1 ────────────────────────────────────────────────────────────────────
// // // // function drawPage1(doc, data, schedule) {
// // // //   const W = 210, H = 297;  // A4 mm
// // // //   const M = 14;             // margin

// // // //   // Outer borders
// // // //   doc.setDrawColor(...BORDER_BLUE);
// // // //   doc.setLineWidth(0.8);
// // // //   doc.rect(3, 3, W - 6, H - 6);
// // // //   doc.setLineWidth(0.5);
// // // //   doc.rect(5, 5, W - 10, H - 10);

// // // //   // ── Header ──
// // // //   doc.setFont("helvetica", "bold");
// // // //   doc.setFontSize(20);
// // // //   doc.setTextColor(...BLUE);
// // // //   doc.text("Respion Healthcare At Home", W / 2, 18, { align: "center" });

// // // //   doc.setFont("helvetica", "normal");
// // // //   doc.setFontSize(8);
// // // //   doc.setTextColor(70, 70, 70);
// // // //   doc.text(
// // // //     "\u2709  healthcareathome247@gmail.com        \uD83D\uDCF1  9937144165",
// // // //     W / 2, 24, { align: "center" }
// // // //   );

// // // //   doc.setDrawColor(...BORDER_BLUE);
// // // //   doc.setLineWidth(0.4);
// // // //   doc.line(M, 27, W - M, 27);

// // // //   // ── Date & SL row ──
// // // //   let y = 34;
// // // //   doc.setFont("helvetica", "normal");
// // // //   doc.setFontSize(8.5);
// // // //   doc.setTextColor(...BLACK);
// // // //   doc.text("Date :", M, y);
// // // //   // date boxes
// // // //   for (let i = 0; i < 8; i++) {
// // // //     doc.rect(M + 20 + i * 8, y - 5, 7, 7);
// // // //   }
// // // //   // SL box
// // // //   doc.rect(W - M - 55, y - 6, 50, 8);
// // // //   doc.setFont("helvetica", "bold");
// // // //   doc.text(`SL. No. : ${data.sl_no || "______"}`, W - M - 53, y - 1);

// // // //   // ── Field lines ──
// // // //   const fieldLine = (label, value, fy, xl = M, labelW = 52) => {
// // // //     doc.setFont("helvetica", "bold");
// // // //     doc.setFontSize(8.5);
// // // //     doc.setTextColor(...BLACK);
// // // //     doc.text(label, xl, fy);
// // // //     doc.setFont("helvetica", "normal");
// // // //     doc.setTextColor(30, 30, 30);
// // // //     doc.text(String(value || ""), xl + labelW, fy);
// // // //     doc.setDrawColor(...GREY_LINE);
// // // //     doc.setLineWidth(0.3);
// // // //     doc.line(xl + labelW, fy + 1, W - M, fy + 1);
// // // //   };

// // // //   y = 43;
// // // //   // Patient Name + SL right side
// // // //   doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(...BLACK);
// // // //   doc.text("Patient Name", M, y);
// // // //   doc.setFont("helvetica", "normal"); doc.setTextColor(30, 30, 30);
// // // //   doc.text(data.name || "", M + 52, y);
// // // //   doc.setDrawColor(...GREY_LINE); doc.setLineWidth(0.3);
// // // //   doc.line(M + 52, y + 1, W - M - 60, y + 1);
// // // //   doc.setFont("helvetica", "bold");
// // // //   doc.text("SL. No. :", W - M - 58, y);
// // // //   doc.setFont("helvetica", "normal");
// // // //   doc.text(data.sl_no || "___", W - M - 30, y);

// // // //   y += 10; fieldLine("Registered Mob. No.", data.phone, y, M, 64);
// // // //   y += 10;
// // // //   doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(...BLACK);
// // // //   doc.text("Permanent Address :", M, y);
// // // //   doc.setFont("helvetica", "normal"); doc.setTextColor(30, 30, 30);
// // // //   const addrLine1 = (data.address || "").substring(0, 60);
// // // //   doc.text(addrLine1, M + 64, y);
// // // //   doc.line(M + 64, y + 1, W - M, y + 1);
// // // //   y += 7; doc.line(M, y + 1, W - M, y + 1);

// // // //   y += 10; fieldLine("Mob No. :", data.alt_phone || data.whatsapp, y, M, 30);
// // // //   y += 10;
// // // //   doc.setFont("helvetica", "bold"); doc.text("Present Address :", M, y);
// // // //   doc.line(M + 58, y + 1, W - M, y + 1);
// // // //   y += 7; doc.line(M, y + 1, W - M, y + 1);

// // // //   y += 10; fieldLine("Mob. No. :", data.whatsapp, y, M, 30);

// // // //   y += 10;
// // // //   doc.setFont("helvetica", "bold"); doc.text("Proof of Identity :", M, y);
// // // //   doc.line(M + 60, y + 1, M + 120, y + 1);
// // // //   doc.text("No. :", M + 124, y);
// // // //   doc.line(M + 140, y + 1, W - M, y + 1);

// // // //   y += 10;
// // // //   doc.setFont("helvetica", "bold"); doc.text("Proof of Address :", M, y);
// // // //   doc.line(M + 60, y + 1, M + 120, y + 1);
// // // //   doc.text("No. :", M + 124, y);
// // // //   doc.line(M + 140, y + 1, W - M, y + 1);

// // // //   y += 7;
// // // //   doc.setFont("helvetica", "bold"); doc.setFontSize(9);
// // // //   doc.text("Machine Details :", M, y);

// // // //   // ── Machine table ──
// // // //   y += 3;
// // // //   const tableX = M;
// // // //   const tableW = W - 2 * M;
// // // //   const cols = [14, tableW - 14 - 32 - 36, 32, 36];
// // // //   const headers = ["SL.No.", "Product Description", "Duration", "Charges"];
// // // //   const rowH = 10;
// // // //   const headH = 9;

// // // //   // Header
// // // //   doc.setFillColor(...LIGHT_BLUE);
// // // //   doc.setDrawColor(...BORDER_BLUE);
// // // //   doc.setLineWidth(0.4);
// // // //   let cx = tableX;
// // // //   headers.forEach((h, i) => {
// // // //     doc.rect(cx, y, cols[i], headH, "FD");
// // // //     doc.setFont("helvetica", "bold"); doc.setFontSize(7.5);
// // // //     doc.setTextColor(...WHITE);
// // // //     doc.text(h, cx + cols[i] / 2, y + 5.5, { align: "center" });
// // // //     cx += cols[i];
// // // //   });

// // // //   // Rows — machine + accessories + blanks
// // // //   const accessories = Array.isArray(data.accessories) ? data.accessories.filter(Boolean) : [];
// // // //   const machineRows = [
// // // //     { sl: "1", product: data.machine_name || "", duration: data.duration_label || "", charges: data.rent_per_period_fmt || "" },
// // // //     { sl: "2", product: accessories.slice(0, 2).join(", "), duration: "", charges: "" },
// // // //     { sl: "3", product: accessories.slice(2, 4).join(", "), duration: "", charges: "" },
// // // //     { sl: "4", product: "", duration: "", charges: "" },
// // // //   ];

// // // //   machineRows.forEach((row, ri) => {
// // // //     const ry = y + headH + ri * rowH;
// // // //     cx = tableX;
// // // //     [row.sl, row.product, row.duration, row.charges].forEach((val, ci) => {
// // // //       doc.setFillColor(...WHITE);
// // // //       doc.setDrawColor(...BORDER_BLUE);
// // // //       doc.rect(cx, ry, cols[ci], rowH, "FD");
// // // //       doc.setFont("helvetica", "normal"); doc.setFontSize(7.5);
// // // //       doc.setTextColor(...BLACK);
// // // //       const txt = String(val || "").substring(0, 50);
// // // //       doc.text(txt, cx + cols[ci] / 2, ry + 6, { align: "center" });
// // // //       cx += cols[ci];
// // // //     });
// // // //   });

// // // //   const tableBottom = y + headH + machineRows.length * rowH;

// // // //   // ── Notes box ──
// // // //   const notesY = tableBottom + 4;
// // // //   doc.setDrawColor(...BORDER_BLUE);
// // // //   doc.setLineWidth(0.6);
// // // //   doc.roundedRect(M, notesY, W - 2 * M, 22, 2, 2);

// // // //   // ── Summary info ──
// // // //   const sumY = notesY + 28;
// // // //   doc.setFont("helvetica", "bold"); doc.setFontSize(8);
// // // //   doc.setTextColor(...BLUE);
// // // //   doc.text(`Grand Total: ${data.grand_total_fmt || ""}`, M, sumY);
// // // //   doc.text(`Security: ${data.security_fmt || ""}`, M + 70, sumY);
// // // //   doc.text(`Referred By: ${data.doctor_name || ""}`, M + 130, sumY);

// // // //   if (schedule && schedule.length > 0) {
// // // //     const nextDue = schedule.find(r => r.status === "pending");
// // // //     if (nextDue) {
// // // //       doc.setFontSize(7.5);
// // // //       doc.text(`Next Billing: ${fmtDateShort(nextDue.dueDate)}`, M, sumY + 7);
// // // //     }
// // // //     const last = schedule[schedule.length - 1];
// // // //     doc.text(`Machine Return: ${fmtDateShort(last.dueDate)}`, M + 70, sumY + 7);
// // // //     doc.text(`Branch: ${data.branch || ""}`, M + 145, sumY + 7);
// // // //   }

// // // //   // ── Signature row ──
// // // //   const sigY = H - 16;
// // // //   doc.setTextColor(...BLACK);
// // // //   doc.setFont("helvetica", "bold"); doc.setFontSize(7.5);
// // // //   doc.text("Receiver's Name       :", M, sigY);
// // // //   doc.setDrawColor(...GREY_LINE); doc.setLineWidth(0.3);
// // // //   doc.line(M + 52, sigY + 1, M + 100, sigY + 1);
// // // //   doc.text("Installed by :", M + 108, sigY);
// // // //   doc.line(M + 136, sigY + 1, W - M, sigY + 1);

// // // //   doc.text("Receiver's Signature :", M, sigY + 7);
// // // //   doc.line(M + 52, sigY + 8, M + 100, sigY + 8);
// // // //   doc.setFont("helvetica", "normal");
// // // //   doc.text(data.employee_name || "", M + 136, sigY + 7);
// // // // }

// // // // // ── Page 2: Terms & Conditions ─────────────────────────────────────────────────
// // // // function drawPage2(doc, data) {
// // // //   const W = 210, H = 297;
// // // //   const M = 14;

// // // //   // Borders
// // // //   doc.setDrawColor(...BORDER_BLUE);
// // // //   doc.setLineWidth(0.8);
// // // //   doc.rect(3, 3, W - 6, H - 6);
// // // //   doc.setLineWidth(0.5);
// // // //   doc.rect(5, 5, W - 10, H - 10);

// // // //   // Title
// // // //   const titleW = 60, titleX = (W - titleW) / 2;
// // // //   doc.setFillColor(...BLUE);
// // // //   doc.roundedRect(titleX, 10, titleW, 11, 2, 2, "F");
// // // //   doc.setFont("helvetica", "bold"); doc.setFontSize(11);
// // // //   doc.setTextColor(...WHITE);
// // // //   doc.text("Terms & Conditions", W / 2, 17.5, { align: "center" });

// // // //   const terms = [
// // // //     "Customer have to deposit a security amount equivalent to the price of the unit and one month rent as per monthly rental cycle before picking up the unit for rental. The monthly rent can be in Cash and security as Cheque.",
// // // //     "First month rental payment by customer at the time of delivery and installation by cash, credit card, online transfer to be paid in advance.",
// // // //     "In case Cheque is not honored, penalty charge of Rs 1,000 + 24% p.a. interest for the period for which the amount not received will be charged.",
// // // //     "In case of late payment by customer, penalty charge of Rs. 1000+24 % p.a. interest for the period for which the amount not received will be charged.",
// // // //     "In case of 2nd incident of late payment, Respion Healthcare At Home reserves the right to pick the unit back from the patient without any prior intimation.",
// // // //     "If the machine is not returned by customer after renewal or return date the he/she has to pay full amount for another one month and also the delayed days after 3 days will be chargable of an amount of Rs. 100 per day as late fee.",
// // // //     "Customer to ensure functionality, testing usage and comfort ability of equipment before renting the same.",
// // // //     "It will be the complete responsibility of the customer to ensure that the rental unit is maintained in good condition.",
// // // //     "In case of a functional failure of the units, customer will have to bear the service cost if it is established that the damage is due to customer negligence.",
// // // //     "Customer will be liable for any physical or functional damage to the unit.",
// // // //     "In case of a physical damage due to customer negligence, customer will have to buy the unit. In such a scenario, half of the rental amount would be adjusted. If the customer does not want to buy the unit, he will bear the cost of repairs.",
// // // //     "Any verbal commitment/communication by a Respion Healthcare At Home employee will not be legally binding and the company will only insist on the terms and conditions mentioned in the invoice.",
// // // //     "Health Care At Home does not undertake any liability for any loss caused due to malfunction of the rental unit or its accessories.",
// // // //     "Use of ventilator on rent either at home or during transportation, will be as per Physician's advice and under supervision of a ICU Nursing Assistant, which will be arranged by the customer.",
// // // //     "Disputes, if any, which may arise in regard to settlement of claim shall be subjected to jurisdiction of courts at Bhubaneswar.",
// // // //     "Customer is renting the invoiced equipment exactly as per the prescription of his Physician.",
// // // //     "Rent Non-Refundable : Rental amount will not be refunded if rented machine is returned by the customer prematurely from the agreement period.",
// // // //   ];

// // // //   let y = 26;
// // // //   doc.setTextColor(...BLACK);

// // // //   terms.forEach((term, i) => {
// // // //     const isBold = i === 16;
// // // //     doc.setFont("helvetica", isBold ? "bold" : "normal");
// // // //     doc.setFontSize(7);

// // // //     const lines = doc.splitTextToSize(term, W - 2 * M - 12);
// // // //     const blockH = lines.length * 4.5 + 2;

// // // //     if (y + blockH > H - 35) return;

// // // //     doc.setFont("helvetica", "bold"); doc.setFontSize(7);
// // // //     doc.text(`${i + 1}.`, M, y);
// // // //     doc.setFont("helvetica", isBold ? "bold" : "normal");
// // // //     doc.text(lines, M + 10, y);
// // // //     y += blockH;
// // // //   });

// // // //   // Signature section
// // // //   const sigY = H - 24;
// // // //   doc.setFont("helvetica", "bold"); doc.setFontSize(7.5);
// // // //   doc.setTextColor(...BLACK);
// // // //   doc.text("Receiver's Name        :", M, sigY);
// // // //   doc.setDrawColor(...GREY_LINE); doc.setLineWidth(0.3);
// // // //   doc.line(M + 58, sigY + 1, M + 115, sigY + 1);
// // // //   doc.text("Installed by :", M + 125, sigY);
// // // //   doc.line(M + 152, sigY + 1, W - M, sigY + 1);

// // // //   doc.text("Receiver's Signature   :", M, sigY + 8);
// // // //   doc.line(M + 58, sigY + 9, M + 115, sigY + 9);
// // // //   doc.text("Signature", M + 125, sigY + 8);

// // // //   doc.text("Relationship with Patient :", M, sigY + 16);
// // // //   doc.line(M + 68, sigY + 17, M + 115, sigY + 17);
// // // // }

// // // // // ── Main export ────────────────────────────────────────────────────────────────
// // // // /**
// // // //  * @param {Object} payload  – the same payload sent to /api/patients
// // // //  * @param {Array}  schedule – the schedule array from state
// // // //  * @param {Object} meta     – optional { doctorName, machineName, employeeName, durationLabel, slNo }
// // // //  */
// // // // export function generatePatientPDF(payload, schedule = [], meta = {}) {
// // // //   const doc = new jsPDF({ unit: "mm", format: "a4" });

// // // //   const data = {
// // // //     sl_no: meta.slNo || "—",
// // // //     name: payload.name || "",
// // // //     phone: payload.phone || "",
// // // //     alt_phone: payload.altPhone || "",
// // // //     whatsapp: payload.whatsapp || "",
// // // //     address: payload.address || "",
// // // //     doctor_name: meta.doctorName || payload.otherSource || "—",
// // // //     branch: payload.branch || "",
// // // //     machine_name: meta.machineName || "—",
// // // //     duration_label: meta.durationLabel || "—",
// // // //     rent_per_period_fmt: fmt(payload.rentPerPeriod),
// // // //     accessories: (payload.accessories || []).map(a => a.name || a),
// // // //     grand_total_fmt: fmt(payload.grandTotal),
// // // //     security_fmt: fmt(payload.securityAmount),
// // // //     employee_name: meta.employeeName || payload.otherEmployee || "—",
// // // //     start_date: fmtDateShort(payload.startDate),
// // // //     return_date: fmtDateShort(payload.returnDate),
// // // //   };

// // // //   drawPage1(doc, data, schedule);
// // // //   doc.addPage();
// // // //   drawPage2(doc, data);

// // // //   const fileName = `patient_${(payload.name || "record").replace(/\s+/g, "_")}_${Date.now()}.pdf`;
// // // //   doc.save(fileName);
// // // // }




// // // /**
// // //  * generatePatientPDF.js
// // //  *
// // //  * Drop into /lib/generatePatientPDF.js
// // //  * Install: npm install jspdf
// // //  *
// // //  * Usage:
// // //  *   import { generatePatientPDF } from "@/lib/generatePatientPDF";
// // //  *   generatePatientPDF(payload, schedule, { doctorName, machineName, employeeName, durationLabel, slNo });
// // //  */

// // // import { jsPDF } from "jspdf";

// // // // ─── Color Palette ────────────────────────────────────────────────────────────
// // // const C = {
// // //   primary: [13, 148, 136],   // teal-600  #0D9488
// // //   primaryDark: [15, 118, 110],   // teal-700
// // //   primaryLight: [204, 251, 241],  // teal-100
// // //   accent: [20, 184, 166],   // teal-500
// // //   white: [255, 255, 255],
// // //   black: [15, 23, 42],     // slate-900
// // //   textMain: [30, 41, 59],     // slate-800
// // //   textMid: [71, 85, 105],    // slate-600
// // //   textSoft: [100, 116, 139],  // slate-500
// // //   textFaint: [148, 163, 184],  // slate-400
// // //   divider: [226, 232, 240],  // slate-200
// // //   bgAlt: [248, 250, 252],  // slate-50
// // //   bgCard: [241, 245, 249],  // slate-100
// // //   success: [5, 150, 105],    // emerald-600
// // //   successBg: [209, 250, 229],  // emerald-100
// // //   warning: [217, 119, 6],    // amber-600
// // //   warningBg: [254, 243, 199],  // amber-100
// // //   danger: [220, 38, 38],    // red-600
// // //   dangerBg: [254, 226, 226],  // red-100
// // //   violet: [124, 58, 237],
// // //   violetBg: [237, 233, 254],
// // // };

// // // // ─── Helpers ──────────────────────────────────────────────────────────────────
// // // const fmt = (v) => "Rs." + (Math.round(Number(v) || 0)).toLocaleString("en-IN");
// // // const fmtShort = (v) => (Math.round(Number(v) || 0)).toLocaleString("en-IN");

// // // const fmtDate = (iso) => {
// // //   if (!iso) return "—";
// // //   const [y, m, d] = iso.split("-").map(Number);
// // //   return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
// // //     day: "numeric", month: "short", year: "numeric",
// // //   });
// // // };

// // // function setFill(doc, rgb) { doc.setFillColor(rgb[0], rgb[1], rgb[2]); }
// // // function setDraw(doc, rgb) { doc.setDrawColor(rgb[0], rgb[1], rgb[2]); }
// // // function setColor(doc, rgb) { doc.setTextColor(rgb[0], rgb[1], rgb[2]); }

// // // /** Draw a filled rounded rect */
// // // function filledRR(doc, x, y, w, h, r, fill, stroke) {
// // //   setFill(doc, fill);
// // //   if (stroke) { setDraw(doc, stroke); doc.setLineWidth(0.3); doc.roundedRect(x, y, w, h, r, r, "FD"); }
// // //   else doc.roundedRect(x, y, w, h, r, r, "F");
// // // }

// // // /** Draw a simple horizontal rule */
// // // function hRule(doc, x, y, w, color = C.divider, lw = 0.3) {
// // //   setDraw(doc, color);
// // //   doc.setLineWidth(lw);
// // //   doc.line(x, y, x + w, y);
// // // }

// // // /** Pill badge */
// // // function badge(doc, text, x, y, bg, fg, fontSize = 6.5) {
// // //   doc.setFontSize(fontSize);
// // //   const tw = doc.getTextWidth(text);
// // //   const pw = tw + 6, ph = 5;
// // //   filledRR(doc, x, y - 3.8, pw, ph, 2, bg);
// // //   setColor(doc, fg);
// // //   doc.setFont("helvetica", "bold");
// // //   doc.text(text, x + 3, y, { baseline: "middle" });
// // //   return pw;
// // // }

// // // /** Two-column label + value row */
// // // function infoRow(doc, label, value, x, y, pageW, M, options = {}) {
// // //   const { bold = false, labelColor = C.textFaint, valueColor = C.textMain } = options;
// // //   doc.setFontSize(7.5);
// // //   doc.setFont("helvetica", "bold");
// // //   setColor(doc, labelColor);
// // //   doc.text(label, x, y);
// // //   doc.setFont("helvetica", bold ? "bold" : "normal");
// // //   setColor(doc, valueColor);
// // //   const maxW = pageW - M - x - 40;
// // //   const lines = doc.splitTextToSize(String(value || "—"), maxW);
// // //   doc.text(lines[0], x + 38, y);
// // //   return lines.length > 1 ? 4 * (lines.length - 1) : 0;
// // // }

// // // // ════════════════════════════════════════════════════════════════════════════
// // // // PAGE 1 — Invoice / Rental Agreement
// // // // ════════════════════════════════════════════════════════════════════════════
// // // function drawPage1(doc, data, schedule) {
// // //   const W = 210, H = 297, M = 12;
// // //   const CW = W - 2 * M; // content width

// // //   // ── Background teal accent strip (top) ─────────────────────────────
// // //   setFill(doc, C.primary);
// // //   doc.rect(0, 0, W, 38, "F");

// // //   // ── Company header ──────────────────────────────────────────────────
// // //   // Logo circle
// // //   filledRR(doc, M, 7, 22, 22, 3, C.primaryLight);
// // //   setColor(doc, C.primary);
// // //   doc.setFont("helvetica", "bold");
// // //   doc.setFontSize(9);
// // //   doc.text("HC", M + 11, 16.5, { align: "center" });
// // //   doc.setFontSize(6.5);
// // //   doc.text("@Home", M + 11, 22, { align: "center" });

// // //   // Company name + tagline
// // //   setColor(doc, C.white);
// // //   doc.setFont("helvetica", "bold");
// // //   doc.setFontSize(17);
// // //   doc.text("Respion Healthcare At Home", M + 26, 16);
// // //   doc.setFont("helvetica", "normal");
// // //   doc.setFontSize(8);
// // //   doc.text("Professional Home Medical Equipment Rental Services", M + 26, 23);

// // //   // Contact right-aligned
// // //   doc.setFontSize(7.5);
// // //   doc.text("healthcareathome247@gmail.com", W - M, 15, { align: "right" });
// // //   doc.text("+91 99371 44165  |  www.healthcareathome.in", W - M, 21.5, { align: "right" });

// // //   // ── Document type ribbon ────────────────────────────────────────────
// // //   filledRR(doc, M, 30, 52, 8, 2, C.primaryDark);
// // //   setColor(doc, C.white);
// // //   doc.setFont("helvetica", "bold");
// // //   doc.setFontSize(8);
// // //   doc.text("RENTAL AGREEMENT & INVOICE", M + 26, 35.5, { align: "center" });

// // //   // SL / Date right
// // //   doc.setFont("helvetica", "normal");
// // //   doc.setFontSize(7.5);
// // //   setColor(doc, C.white);
// // //   doc.text(`Invoice No: ${data.sl_no}`, W - M, 34, { align: "right" });
// // //   doc.text(`Date: ${data.start_date}`, W - M, 29, { align: "right" });

// // //   let y = 48; // content starts

// // //   // ── Two-column info block ────────────────────────────────────────────
// // //   // Left card — Patient details
// // //   const cardH = 58;
// // //   filledRR(doc, M, y, 90, cardH, 3, C.bgAlt, C.divider);
// // //   // Card header
// // //   filledRR(doc, M, y, 90, 9, 3, C.bgCard);
// // //   setFill(doc, C.bgCard);
// // //   doc.rect(M, y + 5, 90, 4, "F"); // flatten bottom corners
// // //   setColor(doc, C.primary);
// // //   doc.setFont("helvetica", "bold");
// // //   doc.setFontSize(7.5);
// // //   doc.text("PATIENT INFORMATION", M + 45, y + 6, { align: "center" });

// // //   const pi = (lbl, val, row) => {
// // //     const iy = y + 13 + row * 8;
// // //     doc.setFontSize(7);
// // //     doc.setFont("helvetica", "bold");
// // //     setColor(doc, C.textFaint);
// // //     doc.text(lbl, M + 3, iy);
// // //     doc.setFont("helvetica", "normal");
// // //     setColor(doc, C.textMain);
// // //     const lines = doc.splitTextToSize(String(val || "—"), 52);
// // //     doc.text(lines[0], M + 3, iy + 4);
// // //   };

// // //   pi("FULL NAME", data.name, 0);
// // //   pi("DATE OF BIRTH", data.dob + (data.age ? `  (Age: ${data.age} yrs)` : ""), 1);
// // //   pi("PRIMARY PHONE", data.phone, 2);
// // //   pi("ALT / WHATSAPP", `${data.alt_phone}  /  ${data.whatsapp}`, 3);

// // //   // Address — taller
// // //   const addrY = y + 49;
// // //   doc.setFontSize(7);
// // //   doc.setFont("helvetica", "bold");
// // //   setColor(doc, C.textFaint);
// // //   doc.text("ADDRESS", M + 3, addrY);
// // //   doc.setFont("helvetica", "normal");
// // //   setColor(doc, C.textMain);
// // //   const addrLines = doc.splitTextToSize(data.address || "—", 80);
// // //   doc.text(addrLines.slice(0, 2), M + 3, addrY + 4);

// // //   // Right card — Assignment details
// // //   const rx = M + 95;
// // //   filledRR(doc, rx, y, 90, cardH, 3, C.bgAlt, C.divider);
// // //   filledRR(doc, rx, y, 90, 9, 3, C.bgCard);
// // //   setFill(doc, C.bgCard);
// // //   doc.rect(rx, y + 5, 90, 4, "F");
// // //   setColor(doc, C.primary);
// // //   doc.setFont("helvetica", "bold");
// // //   doc.setFontSize(7.5);
// // //   doc.text("ASSIGNMENT DETAILS", rx + 45, y + 6, { align: "center" });

// // //   const ai = (lbl, val, row) => {
// // //     const iy = y + 13 + row * 8;
// // //     doc.setFontSize(7);
// // //     doc.setFont("helvetica", "bold");
// // //     setColor(doc, C.textFaint);
// // //     doc.text(lbl, rx + 3, iy);
// // //     doc.setFont("helvetica", "normal");
// // //     setColor(doc, C.textMain);
// // //     doc.text(String(val || "—").substring(0, 34), rx + 3, iy + 4);
// // //   };

// // //   ai("REFERRED BY / DOCTOR", data.doctor_name, 0);
// // //   ai("BRANCH / REGION", data.branch, 1);
// // //   ai("MACHINE ASSIGNED", data.machine_name, 2);
// // //   ai("INSTALLED BY", data.employee_name, 3);

// // //   // Google review badge
// // //   const grY = y + 49;
// // //   doc.setFontSize(7);
// // //   doc.setFont("helvetica", "bold");
// // //   setColor(doc, C.textFaint);
// // //   doc.text("GOOGLE REVIEW", rx + 3, grY);
// // //   if (data.google_review) {
// // //     badge(doc, "✓ Collected", rx + 3, grY + 5, C.successBg, C.success, 7);
// // //   } else {
// // //     badge(doc, "⚠ Pending — collect at return", rx + 3, grY + 5, C.warningBg, C.warning, 7);
// // //   }

// // //   y += cardH + 6;

// // //   // ── Machine & Accessories Table ─────────────────────────────────────
// // //   filledRR(doc, M, y, CW, 8, 2, C.primary);
// // //   setColor(doc, C.white);
// // //   doc.setFont("helvetica", "bold");
// // //   doc.setFontSize(7.5);
// // //   doc.text("EQUIPMENT & ACCESSORIES", M + CW / 2, y + 5, { align: "center" });

// // //   y += 8;
// // //   // Table columns: #, Description, Duration, Rent/Period, Total
// // //   const cols = [9, 76, 28, 28, 28];
// // //   const heads = ["#", "Product / Description", "Duration", "Rate/Period", "Total Amount"];
// // //   const tH = 8;

// // //   // Header row
// // //   setFill(doc, C.bgCard);
// // //   setDraw(doc, C.divider);
// // //   doc.setLineWidth(0.2);
// // //   let cx = M;
// // //   cols.forEach((cw, i) => {
// // //     doc.rect(cx, y, cw, tH, "FD");
// // //     doc.setFont("helvetica", "bold");
// // //     doc.setFontSize(6.5);
// // //     setColor(doc, C.textMid);
// // //     doc.text(heads[i], cx + cw / 2, y + 5, { align: "center" });
// // //     cx += cw;
// // //   });

// // //   y += tH;
// // //   // Machine row
// // //   const machineRows = [];
// // //   machineRows.push({
// // //     sl: "1",
// // //     desc: data.machine_name,
// // //     dur: data.duration_label,
// // //     rate: fmt(data.rent_per_period),
// // //     total: fmt(data.grand_total_raw),
// // //     bold: true,
// // //   });

// // //   // Accessories
// // //   const accs = Array.isArray(data.accessories) ? data.accessories.filter(a => String(a).trim()) : [];
// // //   accs.forEach((a, i) => {
// // //     machineRows.push({
// // //       sl: String(i + 2),
// // //       desc: String(a).trim(),
// // //       dur: "—",
// // //       rate: "Included",
// // //       total: "—",
// // //       bold: false,
// // //     });
// // //   });

// // //   // Blank rows to fill up to 5
// // //   while (machineRows.length < 5) {
// // //     machineRows.push({ sl: String(machineRows.length + 1), desc: "", dur: "", rate: "", total: "", bold: false });
// // //   }

// // //   machineRows.forEach((row, ri) => {
// // //     const ry = y + ri * tH;
// // //     const bg = row.bold ? C.primaryLight : (ri % 2 === 0 ? C.white : C.bgAlt);
// // //     cx = M;
// // //     setFill(doc, bg);
// // //     doc.rect(M, ry, CW, tH, "F");
// // //     setDraw(doc, C.divider);
// // //     doc.setLineWidth(0.15);
// // //     // vertical dividers
// // //     let dvx = M;
// // //     cols.forEach(cw => { doc.line(dvx, ry, dvx, ry + tH); dvx += cw; });
// // //     doc.line(dvx, ry, dvx, ry + tH);
// // //     // bottom
// // //     doc.line(M, ry + tH, M + CW, ry + tH);

// // //     const vals = [row.sl, row.desc, row.dur, row.rate, row.total];
// // //     cx = M;
// // //     vals.forEach((v, ci) => {
// // //       doc.setFont("helvetica", row.bold && ci > 0 ? "bold" : "normal");
// // //       doc.setFontSize(7);
// // //       setColor(doc, row.bold ? C.primary : C.textMain);
// // //       const align = ci === 0 ? "center" : ci >= 2 ? "center" : "left";
// // //       const tx = ci === 1 ? cx + 2 : cx + cols[ci] / 2;
// // //       doc.text(String(v || "").substring(0, 40), tx, ry + 5, { align });
// // //       cx += cols[ci];
// // //     });
// // //   });

// // //   y += machineRows.length * tH + 2;

// // //   // ── Financial Summary ────────────────────────────────────────────────
// // //   // Left: payment info block
// // //   const fsY = y;
// // //   filledRR(doc, M, fsY, 90, 38, 3, C.bgAlt, C.divider);

// // //   const pm = (lbl, val, row, valColor = C.textMain) => {
// // //     const iy = fsY + 5 + row * 8;
// // //     doc.setFontSize(7);
// // //     doc.setFont("helvetica", "bold");
// // //     setColor(doc, C.textFaint);
// // //     doc.text(lbl, M + 3, iy);
// // //     doc.setFont("helvetica", "normal");
// // //     setColor(doc, valColor);
// // //     doc.text(String(val || "—"), M + 3, iy + 4);
// // //   };

// // //   pm("PAYMENT MODE", data.payment_mode_label, 0);
// // //   pm("START DATE", data.start_date, 1);
// // //   pm("RENTAL END DATE", data.return_date, 2);
// // //   pm("MACHINE RETURN", data.machine_return, 3);

// // //   // Right: totals box
// // //   const tx2 = M + 95;
// // //   filledRR(doc, tx2, fsY, 90, 38, 3, C.bgAlt, C.divider);

// // //   // Grand total big display
// // //   filledRR(doc, tx2 + 2, fsY + 2, 86, 12, 2, C.primary);
// // //   setColor(doc, C.white);
// // //   doc.setFont("helvetica", "bold");
// // //   doc.setFontSize(7);
// // //   doc.text("GRAND TOTAL (Rental)", tx2 + 44, fsY + 7, { align: "center" });
// // //   doc.setFontSize(11);
// // //   doc.text(fmt(data.grand_total_raw), tx2 + 44, fsY + 12.5, { align: "center" });

// // //   // Sub totals
// // //   const stRow = (lbl, val, row, valC = C.textMain) => {
// // //     const sy = fsY + 18 + row * 7;
// // //     doc.setFontSize(7);
// // //     doc.setFont("helvetica", "bold");
// // //     setColor(doc, C.textFaint);
// // //     doc.text(lbl, tx2 + 3, sy);
// // //     doc.setFont("helvetica", "normal");
// // //     setColor(doc, valC);
// // //     doc.text(String(val || "—"), W - M - 2, sy, { align: "right" });
// // //   };

// // //   stRow("Security Deposit (Refundable)", fmt(data.security_raw), 0, C.success);
// // //   stRow(`Per Instalment (${data.duration_label})`, fmt(data.per_instalment), 1, C.primary);
// // //   stRow("Instalments", `${data.instalment_count} total`, 2, C.textMid);

// // //   y = fsY + 42;

// // //   // ── Dates & Billing info strip ────────────────────────────────────────
// // //   filledRR(doc, M, y, CW, 10, 2, C.bgCard, C.divider);
// // //   const chips = [
// // //     { label: "START", val: data.start_date, color: C.primary },
// // //     { label: "FIRST BILLING", val: data.first_billing, color: C.warning },
// // //     { label: "RENTAL END", val: data.return_date, color: C.danger },
// // //     { label: "MACHINE RETURN", val: data.machine_return, color: C.violet },
// // //   ];
// // //   const chipW = CW / chips.length;
// // //   chips.forEach((chip, i) => {
// // //     const cx2 = M + i * chipW;
// // //     doc.setFontSize(6);
// // //     doc.setFont("helvetica", "bold");
// // //     setColor(doc, chip.color);
// // //     doc.text(chip.label, cx2 + chipW / 2, y + 3.5, { align: "center" });
// // //     doc.setFont("helvetica", "normal");
// // //     setColor(doc, C.textMain);
// // //     doc.setFontSize(7);
// // //     doc.text(chip.val || "—", cx2 + chipW / 2, y + 8, { align: "center" });
// // //     if (i > 0) { setDraw(doc, C.divider); doc.setLineWidth(0.2); doc.line(cx2, y + 1, cx2, y + 9); }
// // //   });

// // //   y += 14;

// // //   // ── Instalment Schedule Table ─────────────────────────────────────────
// // //   if (schedule && schedule.length > 0) {
// // //     filledRR(doc, M, y, CW, 7, 2, C.primary);
// // //     setColor(doc, C.white);
// // //     doc.setFont("helvetica", "bold");
// // //     doc.setFontSize(7);
// // //     doc.text(`INSTALMENT SCHEDULE  (${schedule.length} ${data.is_daily ? "Days" : "Months"})`, M + CW / 2, y + 4.5, { align: "center" });

// // //     y += 7;
// // //     const sCols = [10, 46, 38, 28, 28, 25];
// // //     const sHeads = ["#", data.is_daily ? "Day" : "Month", "Due Date", "Amount", "Status", "Collected"];
// // //     const sH = 7;

// // //     // header
// // //     setFill(doc, C.bgCard);
// // //     setDraw(doc, C.divider);
// // //     doc.setLineWidth(0.15);
// // //     let scx = M;
// // //     sCols.forEach((cw, i) => {
// // //       doc.rect(scx, y, cw, sH, "FD");
// // //       doc.setFont("helvetica", "bold");
// // //       doc.setFontSize(6);
// // //       setColor(doc, C.textMid);
// // //       doc.text(sHeads[i], scx + cw / 2, y + 4.5, { align: "center" });
// // //       scx += cw;
// // //     });

// // //     y += sH;

// // //     // rows — max 12 on page 1, rest overflow to page 2 (handled there)
// // //     const maxOnPage1 = Math.min(schedule.length, 12);
// // //     schedule.slice(0, maxOnPage1).forEach((row, ri) => {
// // //       const ry = y + ri * sH;
// // //       const isPaid = row.status === "paid";
// // //       const bg = isPaid ? C.successBg : (ri % 2 === 0 ? C.white : C.bgAlt);
// // //       setFill(doc, bg);
// // //       doc.rect(M, ry, CW, sH, "F");
// // //       setDraw(doc, C.divider);
// // //       doc.setLineWidth(0.1);
// // //       let sdx = M;
// // //       sCols.forEach(cw => { doc.line(sdx, ry, sdx, ry + sH); sdx += cw; });
// // //       doc.line(sdx, ry, sdx, ry + sH);
// // //       doc.line(M, ry + sH, M + CW, ry + sH);

// // //       const statusText = isPaid ? "PAID" : "PENDING";
// // //       const vals = [
// // //         String(ri + 1),
// // //         row.month,
// // //         fmtDate(row.dueDate),
// // //         fmt(row.amount),
// // //         statusText,
// // //         isPaid ? fmtDate(row.updatedAt || row.dueDate) : "—",
// // //       ];
// // //       sdx = M;
// // //       vals.forEach((v, ci) => {
// // //         doc.setFont("helvetica", ci === 4 ? "bold" : "normal");
// // //         doc.setFontSize(6.5);
// // //         const vc = ci === 4 ? (isPaid ? C.success : C.warning) : C.textMain;
// // //         setColor(doc, vc);
// // //         doc.text(String(v), sdx + sCols[ci] / 2, ry + 4.5, { align: "center" });
// // //         sdx += sCols[ci];
// // //       });
// // //     });

// // //     y += maxOnPage1 * sH;

// // //     if (schedule.length > maxOnPage1) {
// // //       doc.setFontSize(6.5);
// // //       doc.setFont("helvetica", "italic");
// // //       setColor(doc, C.textFaint);
// // //       doc.text(`… ${schedule.length - maxOnPage1} more instalments continued on next page`, M + CW / 2, y + 4, { align: "center" });
// // //       y += 8;
// // //     }
// // //   }

// // //   // ── Summary totals bar ────────────────────────────────────────────────
// // //   const summaryY = y + 3;
// // //   const paidCount = (schedule || []).filter(r => r.status === "paid").length;
// // //   const paidTotal = (schedule || []).filter(r => r.status === "paid").reduce((s, r) => s + r.amount, 0);
// // //   const pendCount = (schedule || []).filter(r => r.status === "pending").length;
// // //   const pendTotal = (schedule || []).filter(r => r.status === "pending").reduce((s, r) => s + r.amount, 0);

// // //   const summaryItems = [
// // //     { label: "GRAND TOTAL", val: fmt(data.grand_total_raw), bg: C.primary, fg: C.white },
// // //     { label: "SECURITY", val: fmt(data.security_raw), bg: C.successBg, fg: C.success },
// // //     { label: "PAID", val: fmt(paidTotal), bg: C.successBg, fg: C.success },
// // //     { label: "PENDING", val: fmt(pendTotal), bg: C.warningBg, fg: C.warning },
// // //   ];

// // //   const siW = CW / summaryItems.length;
// // //   summaryItems.forEach((si, i) => {
// // //     filledRR(doc, M + i * siW + (i > 0 ? 1 : 0), summaryY, siW - (i > 0 ? 1 : 0), 13, 2, si.bg);
// // //     doc.setFont("helvetica", "bold");
// // //     doc.setFontSize(6);
// // //     setColor(doc, si.bg === C.primary ? C.primaryLight : si.fg);
// // //     doc.text(si.label, M + i * siW + siW / 2, summaryY + 4, { align: "center" });
// // //     doc.setFontSize(9);
// // //     setColor(doc, si.fg === C.white ? C.white : si.fg);
// // //     doc.text(si.val, M + i * siW + siW / 2, summaryY + 10.5, { align: "center" });
// // //   });

// // //   y = summaryY + 17;

// // //   // ── Signature section ─────────────────────────────────────────────────
// // //   const sigY = Math.max(y + 4, H - 28);
// // //   hRule(doc, M, sigY, CW, C.divider, 0.3);

// // //   const sigCols = [CW / 3, CW / 3, CW / 3];
// // //   const sigLabels = ["Receiver's Name", "Receiver's Signature", "Installed By / Employee"];
// // //   sigLabels.forEach((sl, i) => {
// // //     const sx = M + i * (CW / 3);
// // //     doc.setFont("helvetica", "bold");
// // //     doc.setFontSize(7);
// // //     setColor(doc, C.textFaint);
// // //     doc.text(sl, sx + sigCols[i] / 2, sigY + 5, { align: "center" });
// // //     hRule(doc, sx + 4, sigY + 13, sigCols[i] - 8, C.divider, 0.3);
// // //     if (i === 2) {
// // //       doc.setFont("helvetica", "normal");
// // //       setColor(doc, C.textMain);
// // //       doc.text(data.employee_name || "", sx + sigCols[i] / 2, sigY + 12, { align: "center" });
// // //     }
// // //   });

// // //   // ── Footer ────────────────────────────────────────────────────────────
// // //   setFill(doc, C.primary);
// // //   doc.rect(0, H - 8, W, 8, "F");
// // //   setColor(doc, C.white);
// // //   doc.setFont("helvetica", "normal");
// // //   doc.setFontSize(6.5);
// // //   doc.text("Respion Healthcare At Home  |  healthcareathome247@gmail.com  |  +91 99371 44165", W / 2, H - 3.5, { align: "center" });

// // //   // Page number
// // //   doc.setFontSize(6);
// // //   doc.text("Page 1 of 2", W - M, H - 3.5, { align: "right" });
// // // }

// // // // ════════════════════════════════════════════════════════════════════════════
// // // // PAGE 2 — Continued Schedule (if needed) + Terms & Conditions
// // // // ════════════════════════════════════════════════════════════════════════════
// // // function drawPage2(doc, data, schedule) {
// // //   const W = 210, H = 297, M = 12;
// // //   const CW = W - 2 * M;

// // //   // Header strip
// // //   setFill(doc, C.primary);
// // //   doc.rect(0, 0, W, 20, "F");
// // //   setColor(doc, C.white);
// // //   doc.setFont("helvetica", "bold");
// // //   doc.setFontSize(13);
// // //   doc.text("Respion Healthcare At Home", M + 3, 10);
// // //   doc.setFont("helvetica", "normal");
// // //   doc.setFontSize(7.5);
// // //   doc.text(`Patient: ${data.name}  |  Invoice: ${data.sl_no}  |  Date: ${data.start_date}`, M + 3, 16);
// // //   doc.setFont("helvetica", "bold");
// // //   doc.setFontSize(7);
// // //   doc.text("Page 2 of 2", W - M, 13, { align: "right" });

// // //   let y = 26;

// // //   // ── Remaining schedule rows (if > 12) ─────────────────────────────────
// // //   const remaining = (schedule || []).slice(12);
// // //   if (remaining.length > 0) {
// // //     filledRR(doc, M, y, CW, 7, 2, C.primary);
// // //     setColor(doc, C.white);
// // //     doc.setFont("helvetica", "bold");
// // //     doc.setFontSize(7);
// // //     doc.text("INSTALMENT SCHEDULE (CONTINUED)", M + CW / 2, y + 4.5, { align: "center" });
// // //     y += 7;

// // //     const sCols = [10, 46, 38, 28, 28, 25];
// // //     const sHeads = ["#", data.is_daily ? "Day" : "Month", "Due Date", "Amount", "Status", "Collected"];
// // //     const sH = 7;

// // //     setFill(doc, C.bgCard);
// // //     setDraw(doc, C.divider);
// // //     doc.setLineWidth(0.15);
// // //     let scx = M;
// // //     sCols.forEach((cw, i) => {
// // //       doc.rect(scx, y, cw, sH, "FD");
// // //       doc.setFont("helvetica", "bold");
// // //       doc.setFontSize(6);
// // //       setColor(doc, C.textMid);
// // //       doc.text(sHeads[i], scx + cw / 2, y + 4.5, { align: "center" });
// // //       scx += cw;
// // //     });
// // //     y += sH;

// // //     remaining.forEach((row, ri) => {
// // //       const ry = y + ri * sH;
// // //       const isPaid = row.status === "paid";
// // //       const bg = isPaid ? C.successBg : (ri % 2 === 0 ? C.white : C.bgAlt);
// // //       setFill(doc, bg);
// // //       doc.rect(M, ry, CW, sH, "F");
// // //       setDraw(doc, C.divider);
// // //       doc.setLineWidth(0.1);
// // //       let sdx = M;
// // //       sCols.forEach(cw => { doc.line(sdx, ry, sdx, ry + sH); sdx += cw; });
// // //       doc.line(sdx, ry, sdx, ry + sH);
// // //       doc.line(M, ry + sH, M + CW, ry + sH);

// // //       const vals = [
// // //         String(ri + 13),
// // //         row.month,
// // //         fmtDate(row.dueDate),
// // //         fmt(row.amount),
// // //         row.status === "paid" ? "PAID" : "PENDING",
// // //         row.status === "paid" ? fmtDate(row.updatedAt || row.dueDate) : "—",
// // //       ];
// // //       sdx = M;
// // //       vals.forEach((v, ci) => {
// // //         doc.setFont("helvetica", ci === 4 ? "bold" : "normal");
// // //         doc.setFontSize(6.5);
// // //         const vc = ci === 4 ? (isPaid ? C.success : C.warning) : C.textMain;
// // //         setColor(doc, vc);
// // //         doc.text(String(v), sdx + sCols[ci] / 2, ry + 4.5, { align: "center" });
// // //         sdx += sCols[ci];
// // //       });
// // //     });

// // //     y += remaining.length * sH + 6;
// // //   }

// // //   // ── Terms & Conditions ────────────────────────────────────────────────
// // //   filledRR(doc, M, y, CW, 8, 2, C.primary);
// // //   setColor(doc, C.white);
// // //   doc.setFont("helvetica", "bold");
// // //   doc.setFontSize(8.5);
// // //   doc.text("TERMS & CONDITIONS", M + CW / 2, y + 5.5, { align: "center" });
// // //   y += 11;

// // //   const terms = [
// // //     "Customer must deposit a security amount equivalent to the price of the unit and one month's rent before pickup. Monthly rent can be paid in Cash; security may be paid by Cheque.",
// // //     "First month rental payment is due at the time of delivery and installation — payable by cash, card, or online transfer — in advance.",
// // //     "If a cheque is dishonoured, a penalty of Rs.1,000 plus 24% p.a. interest for the outstanding period will be charged.",
// // //     "Late payments attract a penalty of Rs.1,000 plus 24% p.a. interest for the period outstanding.",
// // //     "After a second instance of late payment, Respion Healthcare At Home reserves the right to reclaim the unit without prior notice.",
// // //     "If the machine is not returned by the agreed return date, the customer must pay for a full additional month. Delayed returns beyond 3 days attract a late fee of Rs.100 per day.",
// // //     "The customer must verify functionality, usage comfort, and condition of the equipment before renting.",
// // //     "The customer is solely responsible for maintaining the rental unit in good condition throughout the rental period.",
// // //     "If functional failure is due to customer negligence, the customer bears the service cost.",
// // //     "The customer is liable for any physical or functional damage to the unit.",
// // //     "In case of physical damage due to negligence, the customer must purchase the unit (50% of rental paid is adjusted). If not purchased, the customer bears the full repair cost.",
// // //     "Verbal commitments by any Respion Healthcare At Home employee are not legally binding. Only these written terms and conditions apply.",
// // //     "Respion Healthcare At Home does not accept liability for any loss caused by malfunction of the rental unit or its accessories.",
// // //     "Use of a ventilator on rent — at home or during transport — must be per physician's advice and under ICU nursing supervision, to be arranged by the customer.",
// // //     "Any disputes shall be subject to the jurisdiction of courts at Bhubaneswar only.",
// // //     "The customer confirms they are renting the invoiced equipment exactly as prescribed by their physician.",
// // //     { text: "RENT NON-REFUNDABLE: Rental amounts will not be refunded if the machine is returned before the agreed rental period ends.", bold: true },
// // //   ];

// // //   terms.forEach((term, i) => {
// // //     const isBold = typeof term === "object" && term.bold;
// // //     const text = typeof term === "object" ? term.text : term;

// // //     doc.setFont("helvetica", isBold ? "bold" : "normal");
// // //     doc.setFontSize(6.8);

// // //     const bullet = `${i + 1}.`;
// // //     const lines = doc.splitTextToSize(text, CW - 10);
// // //     const blockH = lines.length * 4.2 + 3;

// // //     if (y + blockH > H - 42) return;

// // //     if (isBold) {
// // //       filledRR(doc, M, y - 1, CW, blockH + 1, 2, C.warningBg);
// // //       setColor(doc, C.warning);
// // //     } else {
// // //       setColor(doc, C.textMain);
// // //     }

// // //     doc.setFont("helvetica", "bold");
// // //     doc.setFontSize(6.8);
// // //     setColor(doc, isBold ? C.warning : C.primary);
// // //     doc.text(bullet, M + 2, y + 3);

// // //     doc.setFont("helvetica", isBold ? "bold" : "normal");
// // //     setColor(doc, isBold ? C.warning : C.textMid);
// // //     doc.text(lines, M + 9, y + 3);
// // //     y += blockH;
// // //   });

// // //   // ── Signature section ─────────────────────────────────────────────────
// // //   const sigY = H - 38;
// // //   hRule(doc, M, sigY, CW, C.divider, 0.4);

// // //   filledRR(doc, M, sigY + 3, CW, 26, 3, C.bgAlt, C.divider);
// // //   setColor(doc, C.primary);
// // //   doc.setFont("helvetica", "bold");
// // //   doc.setFontSize(7);
// // //   doc.text("CUSTOMER ACKNOWLEDGEMENT", M + CW / 2, sigY + 9, { align: "center" });
// // //   doc.setFont("helvetica", "normal");
// // //   setColor(doc, C.textMid);
// // //   doc.setFontSize(6.5);
// // //   doc.text("I have read and agree to the above Terms & Conditions.", M + CW / 2, sigY + 14, { align: "center" });

// // //   const sigCols3 = CW / 3;
// // //   const sigLabels = ["Receiver's Name", "Receiver's Signature", "Relationship with Patient"];
// // //   sigLabels.forEach((sl, i) => {
// // //     const sx = M + i * sigCols3;
// // //     doc.setFont("helvetica", "bold");
// // //     doc.setFontSize(6.5);
// // //     setColor(doc, C.textFaint);
// // //     doc.text(sl, sx + sigCols3 / 2, sigY + 19, { align: "center" });
// // //     hRule(doc, sx + 4, sigY + 27, sigCols3 - 8, C.primary, 0.4);
// // //   });

// // //   // Installed by
// // //   doc.setFontSize(7);
// // //   doc.setFont("helvetica", "bold");
// // //   setColor(doc, C.textFaint);
// // //   doc.text("Installed by", W - M - 35, sigY + 19);
// // //   doc.setFont("helvetica", "normal");
// // //   setColor(doc, C.textMain);
// // //   doc.text(data.employee_name || "", W - M - 35, sigY + 24);

// // //   // ── Footer ────────────────────────────────────────────────────────────
// // //   setFill(doc, C.primary);
// // //   doc.rect(0, H - 8, W, 8, "F");
// // //   setColor(doc, C.white);
// // //   doc.setFont("helvetica", "normal");
// // //   doc.setFontSize(6.5);
// // //   doc.text("Respion Healthcare At Home  |  healthcareathome247@gmail.com  |  +91 99371 44165", W / 2, H - 3.5, { align: "center" });
// // //   doc.setFontSize(6);
// // //   doc.text("Page 2 of 2", W - M, H - 3.5, { align: "right" });
// // // }

// // // // ════════════════════════════════════════════════════════════════════════════
// // // // Main Export
// // // // ════════════════════════════════════════════════════════════════════════════
// // // /**
// // //  * @param {Object} payload  – the payload sent to /api/patients
// // //  * @param {Array}  schedule – instalment schedule array from state
// // //  * @param {Object} meta     – { doctorName, machineName, employeeName, durationLabel, slNo }
// // //  */
// // // export function generatePatientPDF(payload, schedule = [], meta = {}) {
// // //   const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });

// // //   // Derive per-instalment from schedule
// // //   const amounts = schedule.map(r => r.amount);
// // //   const minAmount = amounts.length > 0 ? Math.min(...amounts) : 0;
// // //   const firstBilling = schedule.find(r => r.status === "pending")?.dueDate ?? null;

// // //   const data = {
// // //     // Identity
// // //     sl_no: meta.slNo || "—",
// // //     name: payload.name || "",
// // //     phone: payload.phone || "",
// // //     alt_phone: payload.altPhone || "",
// // //     whatsapp: payload.whatsapp || "",
// // //     address: payload.address || "",
// // //     dob: payload.dob ? fmtDate(payload.dob) : "—",
// // //     age: payload.age ? String(payload.age) : "",
// // //     google_review: payload.review === true,

// // //     // Assignment
// // //     doctor_name: meta.doctorName || payload.otherSource || "—",
// // //     branch: payload.branch || "—",
// // //     machine_name: meta.machineName || "—",
// // //     employee_name: meta.employeeName || payload.otherEmployee || "—",
// // //     accessories: (payload.accessories || []).map(a => a.name || a).filter(Boolean),

// // //     // Rental financials
// // //     rent_per_period: payload.rentPerPeriod || 0,
// // //     grand_total_raw: payload.grandTotal || 0,
// // //     security_raw: payload.securityAmount || 0,
// // //     per_instalment: minAmount,
// // //     instalment_count: schedule.length,
// // //     duration_label: meta.durationLabel || "—",
// // //     is_daily: payload.duration?.startsWith("d:") ?? false,

// // //     // Payment
// // //     payment_mode_label: payload.paymentMode === "cash"
// // //       ? "Cash"
// // //       : payload.paymentMode === "online"
// // //         ? `Online${payload.paymentAcc ? " — " + payload.paymentAcc : ""}`
// // //         : "—",

// // //     // Dates
// // //     start_date: payload.startDate ? fmtDate(payload.startDate) : "—",
// // //     return_date: schedule.length > 0 ? fmtDate(schedule[schedule.length - 1].dueDate) : "—",
// // //     machine_return: payload.returnDate ? fmtDate(payload.returnDate) : (schedule.length > 0 ? fmtDate(schedule[schedule.length - 1].dueDate) : "—"),
// // //     first_billing: firstBilling ? fmtDate(firstBilling) : "—",
// // //   };

// // //   drawPage1(doc, data, schedule);
// // //   doc.addPage();
// // //   drawPage2(doc, data, schedule);

// // //   const fileName = `HAH_Invoice_${(payload.name || "patient").replace(/\s+/g, "_")}_${Date.now()}.pdf`;
// // //   doc.save(fileName);
// // // }


// // import { jsPDF } from "jspdf";

// // // ─── Palette — one teal, clean neutrals ──────────────────────────────────────
// // const C = {
// //   teal: [13, 148, 136],
// //   tealDark: [10, 110, 100],
// //   tealLight: [230, 251, 247],
// //   tealMid: [153, 218, 210],
// //   white: [255, 255, 255],
// //   ink: [15, 23, 42],
// //   inkMid: [51, 65, 85],
// //   inkSoft: [100, 116, 139],
// //   inkFaint: [148, 163, 184],
// //   rule: [213, 219, 227],
// //   bgStripe: [248, 250, 252],
// //   bgCard: [241, 245, 249],
// //   paid: [5, 150, 105],
// //   paidBg: [220, 252, 231],
// //   pending: [161, 98, 7],
// //   pendingBg: [254, 243, 199],
// // };

// // const sf = (d, c) => d.setFillColor(c[0], c[1], c[2]);
// // const sd = (d, c) => d.setDrawColor(c[0], c[1], c[2]);
// // const sc = (d, c) => d.setTextColor(c[0], c[1], c[2]);

// // // Draw filled rect (rounded optional), with optional stroke
// // function box(doc, x, y, w, h, fill, stroke = null, lw = 0.2, r = 0) {
// //   if (fill) { sf(doc, fill); }
// //   if (stroke) { sd(doc, stroke); doc.setLineWidth(lw); }
// //   const mode = fill && stroke ? "FD" : fill ? "F" : "D";
// //   if (r > 0) doc.roundedRect(x, y, w, h, r, r, mode);
// //   else doc.rect(x, y, w, h, mode);
// // }

// // function txt(doc, s, x, y, opts = {}) { doc.text(String(s ?? ''), x, y, opts); }
// // function rule(doc, x, y, w, c = C.rule, lw = 0.2) { sd(doc, c); doc.setLineWidth(lw); doc.line(x, y, x + w, y); }

// // const fmtRs = v => 'Rs.' + (Math.round(Number(v) || 0)).toLocaleString('en-IN');
// // const fmtDt = iso => {
// //   if (!iso) return '—';
// //   const [y, m, d] = iso.split('-').map(Number);
// //   return new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
// // };

// // // Section header: teal bar with white label
// // function sectionBar(doc, x, y, w, label) {
// //   box(doc, x, y, w, 7, C.teal, null, 0, 2);
// //   sf(doc, C.teal); doc.rect(x, y + 4, w, 3, 'F'); // square off bottom corners
// //   doc.setFont('helvetica', 'bold'); doc.setFontSize(7); sc(doc, C.white);
// //   txt(doc, label, x + w / 2, y + 4.9, { align: 'center' });
// // }

// // // Card header: bgCard bar inside a card
// // function cardHeader(doc, x, y, w, label) {
// //   box(doc, x, y, w, 7, C.teal, null, 0, 2);
// //   sf(doc, C.teal); doc.rect(x, y + 4, w, 3, 'F');
// //   doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); sc(doc, C.white);
// //   txt(doc, label, x + w / 2, y + 4.9, { align: 'center' });
// // }

// // // Mini label + value pair inside a card
// // function kv(doc, label, value, x, y, maxW = 50) {
// //   doc.setFont('helvetica', 'bold'); doc.setFontSize(5.8); sc(doc, C.inkFaint);
// //   txt(doc, label, x, y);
// //   doc.setFont('helvetica', 'normal'); doc.setFontSize(7); sc(doc, C.ink);
// //   const lines = doc.splitTextToSize(String(value || '—'), maxW);
// //   txt(doc, lines[0], x, y + 4);
// // }

// // // Table column dividers + row bottom
// // function tableGrid(doc, x, y, cols, h) {
// //   sd(doc, C.rule); doc.setLineWidth(0.12);
// //   let cx = x;
// //   cols.forEach(w => { doc.line(cx, y, cx, y + h); cx += w; });
// //   doc.line(cx, y, cx, y + h);
// //   doc.line(x, y + h, cx, y + h);
// // }

// // // ─────────────────────────────────────────────────────────────────────────────
// // // PAGE 1
// // // ─────────────────────────────────────────────────────────────────────────────
// // function page1(doc, D, sch) {
// //   const W = 210, M = 14, CW = 182;
// //   let y = 0;

// //   // ── Top header band ─────────────────────────────────────────────────────
// //   box(doc, 0, 0, W, 28, C.teal);

// //   // Company
// //   doc.setFont('helvetica', 'bold'); doc.setFontSize(15); sc(doc, C.white);
// //   txt(doc, 'Respion Healthcare At Home', M, 11);
// //   doc.setFont('helvetica', 'normal'); doc.setFontSize(7); sc(doc, C.tealMid);
// //   txt(doc, 'Professional Home Medical Equipment Rental', M, 17);
// //   txt(doc, 'healthcareathome247@gmail.com   +91 99371 44165', M, 23);

// //   // Invoice box — top right
// //   box(doc, W - 60, 3, 48, 22, C.tealDark, null, 0, 3);
// //   doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); sc(doc, C.tealMid);
// //   txt(doc, 'RENTAL INVOICE', W - 36, 9, { align: 'center' });
// //   doc.setFont('helvetica', 'bold'); doc.setFontSize(10); sc(doc, C.white);
// //   txt(doc, '#' + D.invoiceNo, W - 36, 16.5, { align: 'center' });
// //   doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); sc(doc, C.tealMid);
// //   txt(doc, D.startDate, W - 36, 22, { align: 'center' });

// //   y = 33;

// //   // ── Two info cards side-by-side ─────────────────────────────────────────
// //   const cw = 88, c2x = M + cw + 6, CH = 50;

// //   // Left — Patient Details
// //   box(doc, M, y, cw, CH, C.bgStripe, C.rule, 0.2, 2);
// //   cardHeader(doc, M, y, cw, 'PATIENT DETAILS');
// //   kv(doc, 'PATIENT NAME', D.name, M + 3, y + 10, cw - 7);
// //   kv(doc, 'DATE OF BIRTH / AGE', D.dob + (D.age ? ' (Age ' + D.age + ' yrs)' : ''), M + 3, y + 18, cw - 7);
// //   kv(doc, 'PRIMARY PHONE', D.phone, M + 3, y + 26, cw - 7);
// //   kv(doc, 'ALT / WHATSAPP', D.altPhone + ' / ' + D.whatsapp, M + 3, y + 34, cw - 7);
// //   // Address at bottom
// //   doc.setFont('helvetica', 'bold'); doc.setFontSize(5.8); sc(doc, C.inkFaint);
// //   txt(doc, 'ADDRESS', M + 3, y + 42);
// //   doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); sc(doc, C.ink);
// //   const al = doc.splitTextToSize(D.address || '—', cw - 7);
// //   txt(doc, al.slice(0, 2), M + 3, y + 46);

// //   // Right — Rental Assignment
// //   box(doc, c2x, y, cw, CH, C.bgStripe, C.rule, 0.2, 2);
// //   cardHeader(doc, c2x, y, cw, 'RENTAL ASSIGNMENT');
// //   kv(doc, 'BRANCH / REGION', D.branch, c2x + 3, y + 10, cw - 7);
// //   kv(doc, 'MACHINE ASSIGNED', D.machineName, c2x + 3, y + 18, cw - 7);
// //   kv(doc, 'DURATION', D.durationLabel, c2x + 3, y + 26, cw - 7);
// //   kv(doc, 'INSTALLED BY', D.employeeName, c2x + 3, y + 34, cw - 7);
// //   // Google review
// //   doc.setFont('helvetica', 'bold'); doc.setFontSize(5.8); sc(doc, C.inkFaint);
// //   txt(doc, 'GOOGLE REVIEW', c2x + 3, y + 42);
// //   if (D.googleReview) {
// //     box(doc, c2x + 3, y + 43.5, 30, 5, C.paidBg, null, 0, 2);
// //     doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); sc(doc, C.paid);
// //     txt(doc, 'Collected', c2x + 5, y + 47.5);
// //   } else {
// //     box(doc, c2x + 3, y + 43.5, 48, 5, C.pendingBg, null, 0, 2);
// //     doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); sc(doc, C.pending);
// //     txt(doc, 'Pending - collect at return', c2x + 5, y + 47.5);
// //   }

// //   y += CH + 6;

// //   // ── Equipment table ──────────────────────────────────────────────────────
// //   sectionBar(doc, M, y, CW, 'EQUIPMENT & ACCESSORIES');
// //   y += 7;

// //   const TC = [9, 78, 27, 30, 28]; // #, Desc, Duration, Rate/Period, Total
// //   const TH = ['#', 'Product / Description', 'Duration', 'Rate / Period', 'Total'];

// //   // Header row
// //   box(doc, M, y, CW, 7, C.bgCard, C.rule, 0.2);
// //   let cx = M;
// //   TC.forEach((w, i) => {
// //     sd(doc, C.rule); doc.setLineWidth(0.12); doc.line(cx, y, cx, y + 7);
// //     doc.setFont('helvetica', 'bold'); doc.setFontSize(6.2); sc(doc, C.inkMid);
// //     txt(doc, TH[i], cx + w / 2, y + 4.5, { align: 'center' });
// //     cx += w;
// //   });
// //   doc.line(cx, y, cx, y + 7);
// //   sd(doc, C.rule); doc.setLineWidth(0.2); doc.line(M, y + 7, M + CW, y + 7);
// //   y += 7;

// //   const equip = [];
// //   equip.push({ sl: '1', desc: D.machineName, dur: D.durationLabel, rate: fmtRs(D.rentPerPeriod), total: fmtRs(D.grandTotal), hi: true });
// //   (D.accessories || []).forEach((a, i) => {
// //     equip.push({ sl: String(i + 2), desc: a, dur: 'Included', rate: '—', total: '—', hi: false });
// //   });
// //   while (equip.length < 4) equip.push({ sl: String(equip.length + 1), desc: '', dur: '', rate: '', total: '', hi: false });

// //   const rowH = 7;
// //   equip.forEach((r, ri) => {
// //     const bg = r.hi ? C.tealLight : (ri % 2 === 0 ? C.white : C.bgStripe);
// //     box(doc, M, y, CW, rowH, bg);
// //     tableGrid(doc, M, y, TC, rowH);
// //     const vals = [r.sl, r.desc, r.dur, r.rate, r.total];
// //     let dcx = M;
// //     vals.forEach((v, ci) => {
// //       doc.setFont('helvetica', r.hi && ci > 0 ? 'bold' : 'normal');
// //       doc.setFontSize(7);
// //       sc(doc, r.hi && ci > 0 ? C.teal : C.ink);
// //       const ax = ci === 1 ? 'left' : 'center';
// //       const tx = ci === 1 ? dcx + 2 : dcx + TC[ci] / 2;
// //       txt(doc, String(v || '').substring(0, 38), tx, y + rowH / 2 + 1.5, { align: ax });
// //       dcx += TC[ci];
// //     });
// //     y += rowH;
// //   });
// //   sd(doc, C.rule); doc.setLineWidth(0.25); doc.rect(M, y - equip.length * rowH, CW, equip.length * rowH);
// //   y += 5;

// //   // ── Payment + Financials (2-col) ─────────────────────────────────────────
// //   const PCH = 42, pcw = 88, p2x = M + pcw + 6;

// //   // Payment card
// //   box(doc, M, y, pcw, PCH, C.bgStripe, C.rule, 0.2, 2);
// //   cardHeader(doc, M, y, pcw, 'PAYMENT DETAILS');
// //   kv(doc, 'PAYMENT MODE', D.paymentModeLabel, M + 3, y + 10, pcw - 7);
// //   kv(doc, 'START DATE', D.startDate, M + 3, y + 19, pcw - 7);
// //   kv(doc, 'FIRST BILLING', D.firstBilling, M + 3, y + 28, pcw - 7);
// //   kv(doc, 'MACHINE RETURN', D.machineReturn, M + 3, y + 37, pcw - 7);

// //   // Financial card
// //   box(doc, p2x, y, pcw, PCH, C.bgStripe, C.rule, 0.2, 2);
// //   cardHeader(doc, p2x, y, pcw, 'FINANCIAL SUMMARY');

// //   // Grand total pill
// //   box(doc, p2x + 3, y + 9, pcw - 6, 12, C.teal, null, 0, 2);
// //   doc.setFont('helvetica', 'normal'); doc.setFontSize(6); sc(doc, C.tealMid);
// //   txt(doc, 'GRAND TOTAL (RENTAL)', p2x + pcw / 2, y + 13.5, { align: 'center' });
// //   doc.setFont('helvetica', 'bold'); doc.setFontSize(11); sc(doc, C.white);
// //   txt(doc, fmtRs(D.grandTotal), p2x + pcw / 2, y + 20, { align: 'center' });

// //   // Sub-rows
// //   const frow = (label, val, off, vc = C.ink) => {
// //     const fy = y + 25 + off;
// //     doc.setFont('helvetica', 'bold'); doc.setFontSize(6); sc(doc, C.inkFaint);
// //     txt(doc, label, p2x + 3, fy);
// //     doc.setFont('helvetica', 'bold'); doc.setFontSize(7); sc(doc, vc);
// //     txt(doc, String(val || '—'), M + CW, fy, { align: 'right' });
// //   };
// //   frow('Security Deposit (Refundable)', fmtRs(D.security), 0, C.paid);
// //   frow('Per Rental', fmtRs(D.perInstalment), 7, C.teal);
// //   frow('Total Rental', D.instCount + ' payments', 13, C.inkMid);

// //   y += PCH + 5;

// //   // ── Dates strip ──────────────────────────────────────────────────────────
// //   box(doc, M, y, CW, 11, C.bgCard, C.rule, 0.2, 2);
// //   const dchips = [
// //     { lbl: 'START DATE', val: D.startDate, c: C.teal },
// //     { lbl: 'FIRST BILLING', val: D.firstBilling, c: C.pending },
// //     { lbl: 'RENTAL END', val: D.returnDate, c: C.inkMid },
// //     { lbl: 'MACHINE RETURN', val: D.machineReturn, c: C.paid },
// //   ];
// //   const dcw = CW / 4;
// //   dchips.forEach((ch, i) => {
// //     const dx = M + i * dcw;
// //     if (i > 0) { sd(doc, C.rule); doc.setLineWidth(0.15); doc.line(dx, y + 1, dx, y + 10); }
// //     doc.setFont('helvetica', 'bold'); doc.setFontSize(5.8); sc(doc, ch.c);
// //     txt(doc, ch.lbl, dx + dcw / 2, y + 4.2, { align: 'center' });
// //     doc.setFont('helvetica', 'normal'); doc.setFontSize(7); sc(doc, C.ink);
// //     txt(doc, ch.val || '—', dx + dcw / 2, y + 8.5, { align: 'center' });
// //   });

// //   y += 15;

// //   // ── Instalment schedule ──────────────────────────────────────────────────
// //   sectionBar(doc, M, y, CW, 'RENTAL SCHEDULE  (' + sch.length + ' ' + (D.isDaily ? 'Days' : 'Months') + ')');
// //   y += 7;

// //   const SC = [10, 44, 36, 28, 26, 26]; // #, Month, Due Date, Amount, Status, Collected
// //   const SH = ['#', D.isDaily ? 'Day' : 'Month', 'Due Date', 'Amount', 'Status', 'Collected On'];
// //   const SRH = 6.5;

// //   box(doc, M, y, CW, SRH, C.bgCard, C.rule, 0.2);
// //   let shx = M;
// //   SH.forEach((h, i) => {
// //     sd(doc, C.rule); doc.setLineWidth(0.12); doc.line(shx, y, shx, y + SRH);
// //     doc.setFont('helvetica', 'bold'); doc.setFontSize(6); sc(doc, C.inkMid);
// //     txt(doc, h, shx + SC[i] / 2, y + SRH / 2 + 1.5, { align: 'center' });
// //     shx += SC[i];
// //   });
// //   doc.line(shx, y, shx, y + SRH);
// //   sd(doc, C.rule); doc.line(M, y + SRH, M + CW, y + SRH);
// //   y += SRH;

// //   const maxR = Math.min(sch.length, 11);
// //   sch.slice(0, maxR).forEach((row, ri) => {
// //     const isPaid = row.status === 'paid';
// //     const bg = isPaid ? C.paidBg : (ri % 2 === 0 ? C.white : C.bgStripe);
// //     box(doc, M, y, CW, SRH, bg);
// //     tableGrid(doc, M, y, SC, SRH);
// //     const vals = [
// //       String(ri + 1), row.month, fmtDt(row.dueDate),
// //       fmtRs(row.amount), isPaid ? 'PAID' : 'PENDING',
// //       isPaid ? fmtDt(row.updatedAt || row.dueDate) : '—',
// //     ];
// //     let svx = M;
// //     vals.forEach((v, ci) => {
// //       doc.setFont('helvetica', ci === 4 ? 'bold' : 'normal');
// //       doc.setFontSize(6.5);
// //       sc(doc, ci === 4 ? (isPaid ? C.paid : C.pending) : C.ink);
// //       txt(doc, String(v), svx + SC[ci] / 2, y + SRH / 2 + 1.5, { align: 'center' });
// //       svx += SC[ci];
// //     });
// //     y += SRH;
// //   });
// //   sd(doc, C.rule); doc.setLineWidth(0.2); doc.rect(M, y - maxR * SRH, CW, maxR * SRH);

// //   if (sch.length > maxR) {
// //     doc.setFont('helvetica', 'italic'); doc.setFontSize(6); sc(doc, C.inkFaint);
// //     txt(doc, '... ' + (sch.length - maxR) + ' more rentals continued on page 2', M + CW / 2, y + 4, { align: 'center' });
// //     y += 7;
// //   }
// //   y += 4;

// //   // ── Totals bar ───────────────────────────────────────────────────────────
// //   const paidAmt = sch.filter(r => r.status === 'paid').reduce((s, r) => s + r.amount, 0);
// //   const pendAmt = sch.filter(r => r.status === 'pending').reduce((s, r) => s + r.amount, 0);
// //   const bars = [
// //     { lbl: 'GRAND TOTAL', val: fmtRs(D.grandTotal), bg: C.teal, fg: C.white, fw: CW / 4 },
// //     { lbl: 'SECURITY DEP.', val: fmtRs(D.security), bg: C.paidBg, fg: C.paid, fw: CW / 4 },
// //     { lbl: 'COLLECTED', val: fmtRs(paidAmt), bg: C.paidBg, fg: C.paid, fw: CW / 4 },
// //     { lbl: 'OUTSTANDING', val: fmtRs(pendAmt), bg: C.pendingBg, fg: C.pending, fw: CW / 4 },
// //   ];
// //   let bx = M;
// //   bars.forEach((b, i) => {
// //     box(doc, bx + 0.3, y, b.fw - 0.5, 13, b.bg);
// //     doc.setFont('helvetica', 'bold'); doc.setFontSize(5.8); sc(doc, b.fg);
// //     txt(doc, b.lbl, bx + b.fw / 2, y + 4.5, { align: 'center' });
// //     doc.setFontSize(8.5);
// //     txt(doc, b.val, bx + b.fw / 2, y + 10.5, { align: 'center' });
// //     bx += b.fw;
// //   });
// //   sd(doc, C.rule); doc.setLineWidth(0.2); doc.rect(M, y, CW, 13);
// //   y += 17;

// //   // ── Signature strip ──────────────────────────────────────────────────────
// //   rule(doc, M, y, CW, C.rule, 0.25);
// //   y += 5;
// //   const sigW = CW / 3;
// //   ['Receiver\'s Name', 'Receiver\'s Signature', 'Installed By'].forEach((lb, i) => {
// //     const sx = M + i * sigW;
// //     doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); sc(doc, C.inkFaint);
// //     txt(doc, lb, sx + sigW / 2, y, { align: 'center' });
// //     sd(doc, C.rule); doc.setLineWidth(0.25); doc.line(sx + 5, y + 9, sx + sigW - 5, y + 9);
// //     if (i === 2) {
// //       doc.setFont('helvetica', 'normal'); doc.setFontSize(7); sc(doc, C.ink);
// //       txt(doc, D.employeeName || '', sx + sigW / 2, y + 8, { align: 'center' });
// //     }
// //     if (i > 0) { sd(doc, C.rule); doc.setLineWidth(0.15); doc.line(sx, y - 2, sx, y + 11); }
// //   });

// //   // ── Footer ───────────────────────────────────────────────────────────────
// //   box(doc, 0, 285, W, 12, C.teal);
// //   doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); sc(doc, C.tealMid);
// //   txt(doc, 'Respion Healthcare At Home  ·  healthcareathome247@gmail.com  ·  +91 99371 44165', W / 2, 291, { align: 'center' });
// //   doc.setFontSize(6); sc(doc, C.white);
// //   txt(doc, 'Page 1 / 2', W - M, 291, { align: 'right' });
// // }

// // // ─────────────────────────────────────────────────────────────────────────────
// // // PAGE 2
// // // ─────────────────────────────────────────────────────────────────────────────
// // function page2(doc, D, sch) {
// //   const W = 210, M = 14, CW = 182;

// //   // Header
// //   box(doc, 0, 0, W, 18, C.teal);
// //   doc.setFont('helvetica', 'bold'); doc.setFontSize(12); sc(doc, C.white);
// //   txt(doc, 'Respion Healthcare At Home', M, 10);
// //   doc.setFont('helvetica', 'normal'); doc.setFontSize(6.8); sc(doc, C.tealMid);
// //   txt(doc, 'Patient: ' + D.name + '   Invoice: #' + D.invoiceNo + '   ' + D.startDate, M, 15.5);
// //   doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); sc(doc, C.white);
// //   txt(doc, 'Page 2 / 2', W - M, 12, { align: 'right' });

// //   let y = 24;

// //   // Overflow schedule
// //   const rem = sch.slice(11);
// //   if (rem.length > 0) {
// //     sectionBar(doc, M, y, CW, 'RENTAL SCHEDULE (CONTINUED)');
// //     y += 7;
// //     const SC = [10, 44, 36, 28, 26, 26];
// //     const SH = ['#', D.isDaily ? 'Day' : 'Month', 'Due Date', 'Amount', 'Status', 'Collected On'];
// //     const SRH = 6.5;
// //     box(doc, M, y, CW, SRH, C.bgCard, C.rule, 0.2);
// //     let shx = M;
// //     SH.forEach((h, i) => {
// //       sd(doc, C.rule); doc.setLineWidth(0.12); doc.line(shx, y, shx, y + SRH);
// //       doc.setFont('helvetica', 'bold'); doc.setFontSize(6); sc(doc, C.inkMid);
// //       txt(doc, h, shx + SC[i] / 2, y + SRH / 2 + 1.5, { align: 'center' });
// //       shx += SC[i];
// //     });
// //     doc.line(shx, y, shx, y + SRH);
// //     sd(doc, C.rule); doc.line(M, y + SRH, M + CW, y + SRH);
// //     y += SRH;
// //     rem.forEach((row, ri) => {
// //       const isPaid = row.status === 'paid';
// //       const bg = isPaid ? C.paidBg : (ri % 2 === 0 ? C.white : C.bgStripe);
// //       box(doc, M, y, CW, SRH, bg);
// //       tableGrid(doc, M, y, SC, SRH);
// //       const vals = [String(ri + 12), row.month, fmtDt(row.dueDate), fmtRs(row.amount), isPaid ? 'PAID' : 'PENDING', isPaid ? fmtDt(row.updatedAt || row.dueDate) : '—'];
// //       let svx = M;
// //       vals.forEach((v, ci) => {
// //         doc.setFont('helvetica', ci === 4 ? 'bold' : 'normal');
// //         doc.setFontSize(6.5);
// //         sc(doc, ci === 4 ? (isPaid ? C.paid : C.pending) : C.ink);
// //         txt(doc, String(v), svx + SC[ci] / 2, y + SRH / 2 + 1.5, { align: 'center' });
// //         svx += SC[ci];
// //       });
// //       y += SRH;
// //     });
// //     sd(doc, C.rule); doc.setLineWidth(0.2); doc.rect(M, y - rem.length * SRH, CW, rem.length * SRH);
// //     y += 8;
// //   }

// //   // Terms
// //   sectionBar(doc, M, y, CW, 'TERMS & CONDITIONS');
// //   y += 10;

// //   const terms = [
// //     'Customer must pay a security deposit (equivalent to one month\'s rent) plus the first month\'s rent before delivery. Monthly rent may be paid in cash; security may be tendered by cheque.',
// //     'First month\'s rental is due at the time of delivery and installation — payable by cash, card, or online transfer — strictly in advance.',
// //     'Dishonoured cheques attract a penalty of Rs.1,000 plus 24% p.a. interest for the period outstanding.',
// //     'Late payments attract a penalty of Rs.1,000 plus 24% p.a. interest for the period outstanding.',
// //     'After a second late-payment incident, Respion Healthcare At Home may reclaim the unit without prior notice.',
// //     'If the machine is not returned by the agreed return date, the customer is liable for a full additional month\'s rent. Returns delayed beyond 3 days also incur a late fee of Rs.100 per day.',
// //     'The customer must verify functionality, comfort, and condition of the equipment before accepting the rental.',
// //     'The customer is solely responsible for maintaining the rental unit in good condition throughout the rental period.',
// //     'Service costs arising from customer-caused functional failure will be borne by the customer.',
// //     'The customer is liable for any physical or functional damage to the rental unit.',
// //     'Physical damage by customer negligence may require the customer to purchase the unit (50% of rent paid is adjusted). If purchase is declined, full repair cost falls on the customer.',
// //     'Only these written terms are legally binding. Verbal commitments by any Respion Healthcare At Home representative carry no legal weight.',
// //     'Respion Healthcare At Home accepts no liability for losses caused by malfunction of the rental unit or accessories.',
// //     'Ventilators rented for home use or transport must be used per physician\'s prescription under qualified ICU nursing supervision — to be arranged solely by the customer.',
// //     'All disputes are subject exclusively to the jurisdiction of courts in Bhubaneswar.',
// //     'The customer confirms they are renting this equipment exactly as prescribed by their treating physician.',
// //     { text: 'RENT NON-REFUNDABLE: Rental amounts will not be refunded if the machine is returned before the contracted rental period ends.', bold: true },
// //   ];

// //   terms.forEach((t, i) => {
// //     const isBold = typeof t === 'object' && t.bold;
// //     const text2 = typeof t === 'object' ? t.text : t;
// //     const lines = doc.splitTextToSize(text2, CW - 12);
// //     const bh = lines.length * 4 + 3.5;
// //     if (y + bh > 263) return;
// //     if (isBold) {
// //       box(doc, M, y - 1, CW, bh + 1, C.pendingBg, null, 0, 2);
// //     }
// //     // Number bullet
// //     doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5);
// //     sc(doc, isBold ? C.pending : C.teal);
// //     txt(doc, String(i + 1) + '.', M + 2, y + 3);
// //     // Body
// //     doc.setFont('helvetica', isBold ? 'bold' : 'normal');
// //     doc.setFontSize(6.5);
// //     sc(doc, isBold ? C.pending : C.inkMid);
// //     txt(doc, lines, M + 9, y + 3);
// //     y += bh;
// //   });

// //   // // Acknowledgement
// //   // const ackY = 265;
// //   // rule(doc, M, ackY, CW, C.rule, 0.3);
// //   // box(doc, M, ackY + 3, CW, 20, C.bgStripe, C.rule, 0.2, 2);
// //   // doc.setFont('helvetica', 'bold'); doc.setFontSize(7); sc(doc, C.teal);
// //   // txt(doc, 'CUSTOMER ACKNOWLEDGEMENT', M + CW / 2, ackY + 9, { align: 'center' });
// //   // doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); sc(doc, C.inkSoft);
// //   // txt(doc, 'I have read and agree to all Terms & Conditions stated above.', M + CW / 2, ackY + 15, { align: 'center' });


// //   // Acknowledgement / Authorised Signatory Section

// //   const ackY = 265;

// //   // Top line
// //   rule(doc, M, ackY, CW, C.rule, 0.3);

// //   // Background box
// //   box(doc, M, ackY + 3, CW, 28, C.bgStripe, C.rule, 0.2, 2);

// //   // Title
// //   doc.setFont('helvetica', 'bold');
// //   doc.setFontSize(7);
// //   sc(doc, C.teal);
// //   txt(
// //     doc,
// //     'AUTHORISED SIGNATORY',
// //     M + CW / 2,
// //     ackY + 9,
// //     { align: 'center' }
// //   );

// //   // Signature Image
// //   const signatureImg = "/signature.jpeg"; // from public folder

// //   const imgWidth = 45;
// //   const imgHeight = 15;

// //   const imgX = M + (CW - imgWidth) / 2;
// //   const imgY = ackY + 13;

// //   // Add image safely (recommended approach)
// //   const img = new Image();
// //   img.src = signatureImg;

// //   img.onload = function () {
// //     doc.addImage(img, "PNG", imgX, imgY, imgWidth, imgHeight);

// //     // Footer text below signature
// //     doc.setFont('helvetica', 'normal');
// //     doc.setFontSize(6.5);
// //     sc(doc, C.inkSoft);

// //     txt(
// //       doc,
// //       'Authorised Signatory',
// //       M + CW / 2,
// //       ackY + 27,
// //       { align: 'center' }
// //     );
// //   };

// //   const sw = CW / 3;
// //   ['Receiver\'s Name', 'Signature', 'Relation to Patient'].forEach((lb, i) => {
// //     const sx = M + i * sw;
// //     doc.setFont('helvetica', 'bold'); doc.setFontSize(6); sc(doc, C.inkFaint);
// //     txt(doc, lb, sx + sw / 2, ackY + 18.5, { align: 'center' });
// //     sd(doc, C.teal); doc.setLineWidth(0.3); doc.line(sx + 5, ackY + 22, sx + sw - 5, ackY + 22);
// //     if (i > 0) { sd(doc, C.rule); doc.setLineWidth(0.15); doc.line(sx, ackY + 4, sx, ackY + 23); }
// //   });

// //   // Footer
// //   box(doc, 0, 285, W, 12, C.teal);
// //   doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); sc(doc, C.tealMid);
// //   txt(doc, 'Respion Respion Healthcare At Home  ·  healthcareathome247@gmail.com  ·  +91 99371 44165', W / 2, 291, { align: 'center' });
// //   doc.setFontSize(6); sc(doc, C.white);
// //   txt(doc, 'Page 2 / 2', W - M, 291, { align: 'right' });
// // }

// // function generateInvoiceNo(branch = "") {
// //   const now = new Date();

// //   // ── Branch: first 2 letters uppercase ──
// //   const br = (branch || "XX").substring(0, 2).toUpperCase();

// //   // ── Date: DDMM ──
// //   const day = String(now.getDate()).padStart(2, "0");
// //   const month = String(now.getMonth() + 1).padStart(2, "0");

// //   // ── Time: HHMM ──
// //   const hours = String(now.getHours()).padStart(2, "0");
// //   const mins = String(now.getMinutes()).padStart(2, "0");

// //   return `${br}${day}${month}${hours}${mins}`;
// // }

// // // ─── Main ─────────────────────────────────────────────────────────────────────
// // export function generatePatientPDF(payload, schedule = [], meta = {}) {
// //   const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });

// //   // const rawId = payload._id || payload.id || '';
// //   // const invoiceNo = rawId.length >= 6 ? rawId.slice(-6).toUpperCase() : (rawId.toUpperCase() || '000000');

// //   const invoiceNo = generateInvoiceNo(payload.branch);

// //   const firstBilling = schedule.find(r => r.status === 'pending')?.dueDate ?? null;
// //   const amounts = schedule.map(r => r.amount);
// //   const perInstalment = amounts.length > 0 ? Math.min(...amounts) : 0;

// //   const D = {
// //     invoiceNo,
// //     name: payload.name || '',
// //     phone: payload.phone || '',
// //     altPhone: payload.altPhone || '',
// //     whatsapp: payload.whatsapp || '',
// //     dob: payload.dob ? fmtDt(payload.dob) : '—',
// //     age: payload.age ? String(payload.age) : '',
// //     address: payload.address || '',
// //     googleReview: payload.review === true,
// //     branch: payload.branch || '—',
// //     machineName: meta.machineName || '—',
// //     employeeName: meta.employeeName || payload.otherEmployee || '—',
// //     durationLabel: meta.durationLabel || '—',
// //     accessories: (payload.accessories || []).map(a => a.name || a).filter(Boolean),
// //     rentPerPeriod: payload.rentPerPeriod || 0,
// //     grandTotal: payload.grandTotal || 0,
// //     security: payload.securityAmount || 0,
// //     perInstalment,
// //     instCount: schedule.length,
// //     isDaily: payload.duration?.startsWith('d:') ?? false,
// //     paymentModeLabel: payload.paymentMode === 'cash'
// //       ? 'Cash'
// //       : payload.paymentMode === 'online'
// //         ? 'Online' + (payload.paymentAcc ? ' — ' + payload.paymentAcc : '')
// //         : '—',
// //     startDate: payload.startDate ? fmtDt(payload.startDate) : '—',
// //     firstBilling: firstBilling ? fmtDt(firstBilling) : '—',
// //     returnDate: schedule.length > 0 ? fmtDt(schedule[schedule.length - 1].dueDate) : '—',
// //     machineReturn: payload.returnDate ? fmtDt(payload.returnDate) : (schedule.length > 0 ? fmtDt(schedule[schedule.length - 1].dueDate) : '—'),
// //   };

// //   page1(doc, D, schedule);
// //   doc.addPage();
// //   page2(doc, D, schedule);

// //   const fileName = 'Respion_Invoice_' + (payload.name || 'patient').replace(/\s+/g, '_') + '_' + Date.now() + '.pdf';
// //   doc.save(fileName);
// // }



// import { jsPDF } from "jspdf";

// // ─── Palette ──────────────────────────────────────────────────────────────────
// const C = {
//   teal: [13, 148, 136],
//   tealDark: [10, 110, 100],
//   tealLight: [230, 251, 247],
//   tealMid: [153, 218, 210],
//   white: [255, 255, 255],
//   ink: [15, 23, 42],
//   inkMid: [51, 65, 85],
//   inkSoft: [100, 116, 139],
//   inkFaint: [148, 163, 184],
//   rule: [213, 219, 227],
//   bgStripe: [248, 250, 252],
//   bgCard: [241, 245, 249],
//   paid: [5, 150, 105],
//   paidBg: [220, 252, 231],
//   pending: [161, 98, 7],
//   pendingBg: [254, 243, 199],
// };

// const sf = (d, c) => d.setFillColor(c[0], c[1], c[2]);
// const sd = (d, c) => d.setDrawColor(c[0], c[1], c[2]);
// const sc = (d, c) => d.setTextColor(c[0], c[1], c[2]);

// function box(doc, x, y, w, h, fill, stroke = null, lw = 0.2, r = 0) {
//   if (fill) sf(doc, fill);
//   if (stroke) { sd(doc, stroke); doc.setLineWidth(lw); }
//   const mode = fill && stroke ? "FD" : fill ? "F" : "D";
//   if (r > 0) doc.roundedRect(x, y, w, h, r, r, mode);
//   else doc.rect(x, y, w, h, mode);
// }

// function txt(doc, s, x, y, opts = {}) { doc.text(String(s ?? ''), x, y, opts); }
// function rule(doc, x, y, w, c = C.rule, lw = 0.2) { sd(doc, c); doc.setLineWidth(lw); doc.line(x, y, x + w, y); }

// const fmtRs = v => 'Rs.' + (Math.round(Number(v) || 0)).toLocaleString('en-IN');
// const fmtDt = iso => {
//   if (!iso) return '—';
//   const [y, m, d] = iso.split('-').map(Number);
//   return new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
// };

// function sectionBar(doc, x, y, w, label) {
//   box(doc, x, y, w, 7, C.teal, null, 0, 2);
//   sf(doc, C.teal); doc.rect(x, y + 4, w, 3, 'F');
//   doc.setFont('helvetica', 'bold'); doc.setFontSize(7); sc(doc, C.white);
//   txt(doc, label, x + w / 2, y + 4.9, { align: 'center' });
// }

// function cardHeader(doc, x, y, w, label) {
//   box(doc, x, y, w, 7, C.teal, null, 0, 2);
//   sf(doc, C.teal); doc.rect(x, y + 4, w, 3, 'F');
//   doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); sc(doc, C.white);
//   txt(doc, label, x + w / 2, y + 4.9, { align: 'center' });
// }

// function kv(doc, label, value, x, y, maxW = 50) {
//   doc.setFont('helvetica', 'bold'); doc.setFontSize(5.8); sc(doc, C.inkFaint);
//   txt(doc, label, x, y);
//   doc.setFont('helvetica', 'normal'); doc.setFontSize(7); sc(doc, C.ink);
//   const lines = doc.splitTextToSize(String(value || '—'), maxW);
//   txt(doc, lines[0], x, y + 4);
// }

// function tableGrid(doc, x, y, cols, h) {
//   sd(doc, C.rule); doc.setLineWidth(0.12);
//   let cx = x;
//   cols.forEach(w => { doc.line(cx, y, cx, y + h); cx += w; });
//   doc.line(cx, y, cx, y + h);
//   doc.line(x, y + h, cx, y + h);
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // PAGE 1
// // ─────────────────────────────────────────────────────────────────────────────
// function page1(doc, D, sch) {
//   const W = 210, M = 14, CW = 182;
//   let y = 0;

//   // ── Top header band ──────────────────────────────────────────────────────
//   box(doc, 0, 0, W, 28, C.teal);
//   doc.setFont('helvetica', 'bold'); doc.setFontSize(15); sc(doc, C.white);
//   txt(doc, 'Respion Healthcare At Home', M, 11);
//   doc.setFont('helvetica', 'normal'); doc.setFontSize(7); sc(doc, C.tealMid);
//   txt(doc, 'Professional Home Medical Equipment Rental', M, 17);
//   txt(doc, 'healthcareathome247@gmail.com   +91 99371 44165', M, 23);

//   // Invoice box — top right
//   box(doc, W - 60, 3, 48, 22, C.tealDark, null, 0, 3);
//   doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); sc(doc, C.tealMid);
//   txt(doc, 'RENTAL INVOICE', W - 36, 9, { align: 'center' });
//   doc.setFont('helvetica', 'bold'); doc.setFontSize(10); sc(doc, C.white);
//   txt(doc, '#' + D.invoiceNo, W - 36, 16.5, { align: 'center' });
//   doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); sc(doc, C.tealMid);
//   txt(doc, D.startDate, W - 36, 22, { align: 'center' });

//   y = 33;

//   // ── Two info cards ───────────────────────────────────────────────────────
//   const cw = 88, c2x = M + cw + 6, CH = 48;

//   // Left — Patient Details
//   box(doc, M, y, cw, CH, C.bgStripe, C.rule, 0.2, 2);
//   cardHeader(doc, M, y, cw, 'PATIENT DETAILS');
//   kv(doc, 'PATIENT NAME', D.name, M + 3, y + 10, cw - 7);
//   kv(doc, 'DATE OF BIRTH / AGE', D.dob + (D.age ? ' (Age ' + D.age + ' yrs)' : ''), M + 3, y + 19, cw - 7);
//   kv(doc, 'PRIMARY PHONE', D.phone, M + 3, y + 28, cw - 7);
//   kv(doc, 'ALT / WHATSAPP', D.altPhone + ' / ' + D.whatsapp, M + 3, y + 37, cw - 7);
//   doc.setFont('helvetica', 'bold'); doc.setFontSize(5.8); sc(doc, C.inkFaint);
//   txt(doc, 'ADDRESS', M + 3, y + 46);
//   doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); sc(doc, C.ink);
//   const al = doc.splitTextToSize(D.address || '—', cw - 7);
//   txt(doc, al.slice(0, 2), M + 3, y + 50);

//   // Right — Rental Assignment
//   box(doc, c2x, y, cw, CH, C.bgStripe, C.rule, 0.2, 2);
//   cardHeader(doc, c2x, y, cw, 'RENTAL ASSIGNMENT');
//   const lineH = 9;
//   let ry = y + 10;
//   kv(doc, 'BRANCH / REGION', D.branch, c2x + 3, ry, cw - 7); ry += lineH;
//   // Machine name (left half) + Serial No (right half) on same line
//   kv(doc, 'MACHINE ASSIGNED', D.machineName, c2x + 3, ry, (cw - 10) / 2);
//   kv(doc, 'SERIAL NO', D.slNo, c2x + 3 + (cw - 10) / 2 + 4, ry, (cw - 10) / 2); ry += lineH;
//   kv(doc, 'DURATION', D.durationLabel, c2x + 3, ry, cw - 7); ry += lineH;
//   kv(doc, 'INSTALLED BY', D.employeeName, c2x + 3, ry, cw - 7); ry += lineH;

//   // Google review badge
//   doc.setFont('helvetica', 'bold'); doc.setFontSize(5.8); sc(doc, C.inkFaint);
//   txt(doc, 'GOOGLE REVIEW', c2x + 3, ry + 1);
//   if (D.googleReview) {
//     box(doc, c2x + 3, ry + 2.5, 30, 5, C.paidBg, null, 0, 2);
//     doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); sc(doc, C.paid);
//     txt(doc, 'Collected', c2x + 5, ry + 6.5);
//   } else {
//     box(doc, c2x + 3, ry + 2.5, 48, 5, C.pendingBg, null, 0, 2);
//     doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); sc(doc, C.pending);
//     txt(doc, 'Pending — collect at return', c2x + 5, ry + 6.5);
//   }

//   y += CH + 6;

//   // ── Equipment table ──────────────────────────────────────────────────────
//   sectionBar(doc, M, y, CW, 'EQUIPMENT & ACCESSORIES');
//   y += 7;

//   const TC = [9, 78, 27, 30, 28];
//   const TH = ['#', 'Product / Description', 'Duration', 'Rate / Period', 'Total'];

//   box(doc, M, y, CW, 7, C.bgCard, C.rule, 0.2);
//   let cx = M;
//   TC.forEach((w, i) => {
//     sd(doc, C.rule); doc.setLineWidth(0.12); doc.line(cx, y, cx, y + 7);
//     doc.setFont('helvetica', 'bold'); doc.setFontSize(6.2); sc(doc, C.inkMid);
//     txt(doc, TH[i], cx + w / 2, y + 4.5, { align: 'center' });
//     cx += w;
//   });
//   doc.line(cx, y, cx, y + 7);
//   sd(doc, C.rule); doc.setLineWidth(0.2); doc.line(M, y + 7, M + CW, y + 7);
//   y += 7;

//   const equip = [];
//   equip.push({ sl: '1', desc: D.machineName, dur: D.durationLabel, rate: fmtRs(D.rentPerPeriod), total: fmtRs(D.grandTotal), hi: true });
//   (D.accessories || []).forEach((a, i) => {
//     equip.push({ sl: String(i + 2), desc: a, dur: 'Included', rate: '—', total: '—', hi: false });
//   });
//   while (equip.length < 4) equip.push({ sl: String(equip.length + 1), desc: '', dur: '', rate: '', total: '', hi: false });

//   const rowH = 7;
//   equip.forEach((r, ri) => {
//     const bg = r.hi ? C.tealLight : (ri % 2 === 0 ? C.white : C.bgStripe);
//     box(doc, M, y, CW, rowH, bg);
//     tableGrid(doc, M, y, TC, rowH);
//     const vals = [r.sl, r.desc, r.dur, r.rate, r.total];
//     let dcx = M;
//     vals.forEach((v, ci) => {
//       doc.setFont('helvetica', r.hi && ci > 0 ? 'bold' : 'normal');
//       doc.setFontSize(7);
//       sc(doc, r.hi && ci > 0 ? C.teal : C.ink);
//       const ax = ci === 1 ? 'left' : 'center';
//       const tx = ci === 1 ? dcx + 2 : dcx + TC[ci] / 2;
//       txt(doc, String(v || '').substring(0, 38), tx, y + rowH / 2 + 1.5, { align: ax });
//       dcx += TC[ci];
//     });
//     y += rowH;
//   });
//   sd(doc, C.rule); doc.setLineWidth(0.25); doc.rect(M, y - equip.length * rowH, CW, equip.length * rowH);
//   y += 5;

//   // ── Payment + Financials ─────────────────────────────────────────────────
//   const PCH = 42, pcw = 88, p2x = M + pcw + 6;

//   box(doc, M, y, pcw, PCH, C.bgStripe, C.rule, 0.2, 2);
//   cardHeader(doc, M, y, pcw, 'PAYMENT DETAILS');
//   kv(doc, 'PAYMENT MODE', D.paymentModeLabel, M + 3, y + 10, pcw - 7);
//   kv(doc, 'START DATE', D.startDate, M + 3, y + 19, pcw - 7);
//   kv(doc, 'FIRST BILLING', D.firstBilling, M + 3, y + 28, pcw - 7);
//   kv(doc, 'MACHINE RETURN', D.machineReturn, M + 3, y + 37, pcw - 7);

//   box(doc, p2x, y, pcw, PCH, C.bgStripe, C.rule, 0.2, 2);
//   cardHeader(doc, p2x, y, pcw, 'FINANCIAL SUMMARY');
//   box(doc, p2x + 3, y + 9, pcw - 6, 12, C.teal, null, 0, 2);
//   doc.setFont('helvetica', 'normal'); doc.setFontSize(6); sc(doc, C.tealMid);
//   txt(doc, 'GRAND TOTAL (RENTAL)', p2x + pcw / 2, y + 13.5, { align: 'center' });
//   doc.setFont('helvetica', 'bold'); doc.setFontSize(11); sc(doc, C.white);
//   txt(doc, fmtRs(D.grandTotal), p2x + pcw / 2, y + 20, { align: 'center' });

//   const frow = (label, val, off, vc = C.ink) => {
//     const fy = y + 25 + off;
//     doc.setFont('helvetica', 'bold'); doc.setFontSize(6); sc(doc, C.inkFaint);
//     txt(doc, label, p2x + 3, fy);
//     doc.setFont('helvetica', 'bold'); doc.setFontSize(7); sc(doc, vc);
//     txt(doc, String(val || '—'), M + CW, fy, { align: 'right' });
//   };
//   frow('Security Deposit (Refundable)', fmtRs(D.security), 0, C.paid);
//   frow('Per Rental', fmtRs(D.perInstalment), 7, C.teal);
//   frow('Total Rental', D.instCount + ' payments', 13, C.inkMid);

//   y += PCH + 5;

//   // ── Dates strip ──────────────────────────────────────────────────────────
//   box(doc, M, y, CW, 11, C.bgCard, C.rule, 0.2, 2);
//   const dchips = [
//     { lbl: 'START DATE', val: D.startDate, c: C.teal },
//     { lbl: 'FIRST BILLING', val: D.firstBilling, c: C.pending },
//     { lbl: 'RENTAL END', val: D.returnDate, c: C.inkMid },
//     { lbl: 'MACHINE RETURN', val: D.machineReturn, c: C.paid },
//   ];
//   const dcw = CW / 4;
//   dchips.forEach((ch, i) => {
//     const dx = M + i * dcw;
//     if (i > 0) { sd(doc, C.rule); doc.setLineWidth(0.15); doc.line(dx, y + 1, dx, y + 10); }
//     doc.setFont('helvetica', 'bold'); doc.setFontSize(5.8); sc(doc, ch.c);
//     txt(doc, ch.lbl, dx + dcw / 2, y + 4.2, { align: 'center' });
//     doc.setFont('helvetica', 'normal'); doc.setFontSize(7); sc(doc, C.ink);
//     txt(doc, ch.val || '—', dx + dcw / 2, y + 8.5, { align: 'center' });
//   });

//   y += 15;

//   // ── Instalment schedule ──────────────────────────────────────────────────
//   sectionBar(doc, M, y, CW, 'RENTAL SCHEDULE  (' + sch.length + ' ' + (D.isDaily ? 'Days' : 'Months') + ')');
//   y += 7;

//   const SC = [10, 44, 36, 28, 26, 26];
//   const SH = ['#', D.isDaily ? 'Day' : 'Month', 'Due Date', 'Amount', 'Status', 'Collected On'];
//   const SRH = 6.5;

//   box(doc, M, y, CW, SRH, C.bgCard, C.rule, 0.2);
//   let shx = M;
//   SH.forEach((h, i) => {
//     sd(doc, C.rule); doc.setLineWidth(0.12); doc.line(shx, y, shx, y + SRH);
//     doc.setFont('helvetica', 'bold'); doc.setFontSize(6); sc(doc, C.inkMid);
//     txt(doc, h, shx + SC[i] / 2, y + SRH / 2 + 1.5, { align: 'center' });
//     shx += SC[i];
//   });
//   doc.line(shx, y, shx, y + SRH);
//   sd(doc, C.rule); doc.line(M, y + SRH, M + CW, y + SRH);
//   y += SRH;

//   const maxR = Math.min(sch.length, 11);
//   sch.slice(0, maxR).forEach((row, ri) => {
//     const isPaid = row.status === 'paid';
//     const bg = isPaid ? C.paidBg : (ri % 2 === 0 ? C.white : C.bgStripe);
//     box(doc, M, y, CW, SRH, bg);
//     tableGrid(doc, M, y, SC, SRH);
//     const vals = [
//       String(ri + 1), row.month, fmtDt(row.dueDate),
//       fmtRs(row.amount), isPaid ? 'PAID' : 'PENDING',
//       isPaid ? fmtDt(row.updatedAt || row.dueDate) : '—',
//     ];
//     let svx = M;
//     vals.forEach((v, ci) => {
//       doc.setFont('helvetica', ci === 4 ? 'bold' : 'normal');
//       doc.setFontSize(6.5);
//       sc(doc, ci === 4 ? (isPaid ? C.paid : C.pending) : C.ink);
//       txt(doc, String(v), svx + SC[ci] / 2, y + SRH / 2 + 1.5, { align: 'center' });
//       svx += SC[ci];
//     });
//     y += SRH;
//   });
//   sd(doc, C.rule); doc.setLineWidth(0.2); doc.rect(M, y - maxR * SRH, CW, maxR * SRH);

//   if (sch.length > maxR) {
//     doc.setFont('helvetica', 'italic'); doc.setFontSize(6); sc(doc, C.inkFaint);
//     txt(doc, '... ' + (sch.length - maxR) + ' more rentals continued on page 2', M + CW / 2, y + 4, { align: 'center' });
//     y += 7;
//   }
//   y += 4;

//   // ── Totals bar ───────────────────────────────────────────────────────────
//   const paidAmt = sch.filter(r => r.status === 'paid').reduce((s, r) => s + r.amount, 0);
//   const pendAmt = sch.filter(r => r.status === 'pending').reduce((s, r) => s + r.amount, 0);
//   const bars = [
//     { lbl: 'GRAND TOTAL', val: fmtRs(D.grandTotal), bg: C.teal, fg: C.white, fw: CW / 4 },
//     { lbl: 'SECURITY DEP.', val: fmtRs(D.security), bg: C.paidBg, fg: C.paid, fw: CW / 4 },
//     { lbl: 'COLLECTED', val: fmtRs(paidAmt), bg: C.paidBg, fg: C.paid, fw: CW / 4 },
//     { lbl: 'OUTSTANDING', val: fmtRs(pendAmt), bg: C.pendingBg, fg: C.pending, fw: CW / 4 },
//   ];
//   let bx = M;
//   bars.forEach((b) => {
//     box(doc, bx + 0.3, y, b.fw - 0.5, 13, b.bg);
//     doc.setFont('helvetica', 'bold'); doc.setFontSize(5.8); sc(doc, b.fg);
//     txt(doc, b.lbl, bx + b.fw / 2, y + 4.5, { align: 'center' });
//     doc.setFontSize(8.5);
//     txt(doc, b.val, bx + b.fw / 2, y + 10.5, { align: 'center' });
//     bx += b.fw;
//   });
//   sd(doc, C.rule); doc.setLineWidth(0.2); doc.rect(M, y, CW, 13);
//   y += 17;

//   // ── Signature strip ──────────────────────────────────────────────────────
//   rule(doc, M, y, CW, C.rule, 0.25);
//   y += 5;
//   const sigW = CW / 2;
//   ['Receiver\'s Signature', 'Installed By'].forEach((lb, i) => {
//     const sx = M + i * sigW;
//     doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); sc(doc, C.inkFaint);
//     txt(doc, lb, sx + sigW / 2, y, { align: 'center' });
//     sd(doc, C.rule); doc.setLineWidth(0.25); doc.line(sx + 5, y + 9, sx + sigW - 5, y + 9);
//     if (i === 1) {
//       doc.setFont('helvetica', 'normal'); doc.setFontSize(7); sc(doc, C.ink);
//       txt(doc, D.employeeName || '', sx + sigW / 2, y + 8, { align: 'center' });
//     }
//     if (i > 0) { sd(doc, C.rule); doc.setLineWidth(0.15); doc.line(sx, y - 2, sx, y + 11); }
//   });

//   // ── Footer ───────────────────────────────────────────────────────────────
//   box(doc, 0, 285, W, 12, C.teal);
//   doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); sc(doc, C.tealMid);
//   txt(doc, 'Respion Healthcare At Home  ·  healthcareathome247@gmail.com  ·  +91 99371 44165', W / 2, 291, { align: 'center' });
//   doc.setFontSize(6); sc(doc, C.white);
//   txt(doc, 'Page 1 / 2', W - M, 291, { align: 'right' });
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // PAGE 2
// // ─────────────────────────────────────────────────────────────────────────────
// async function page2(doc, D, sch) {
//   const W = 210, M = 14, CW = 182;

//   // Header
//   box(doc, 0, 0, W, 18, C.teal);
//   doc.setFont('helvetica', 'bold'); doc.setFontSize(12); sc(doc, C.white);
//   txt(doc, 'Respion Healthcare At Home', M, 10);
//   doc.setFont('helvetica', 'normal'); doc.setFontSize(6.8); sc(doc, C.tealMid);
//   txt(doc, 'Patient: ' + D.name + '   Invoice: #' + D.invoiceNo + '   ' + D.startDate, M, 15.5);
//   doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); sc(doc, C.white);
//   txt(doc, 'Page 2 / 2', W - M, 12, { align: 'right' });

//   let y = 24;

//   // ── Overflow schedule ────────────────────────────────────────────────────
//   const rem = sch.slice(11);
//   if (rem.length > 0) {
//     sectionBar(doc, M, y, CW, 'RENTAL SCHEDULE (CONTINUED)');
//     y += 7;
//     const SC = [10, 44, 36, 28, 26, 26];
//     const SH = ['#', D.isDaily ? 'Day' : 'Month', 'Due Date', 'Amount', 'Status', 'Collected On'];
//     const SRH = 6.5;
//     box(doc, M, y, CW, SRH, C.bgCard, C.rule, 0.2);
//     let shx = M;
//     SH.forEach((h, i) => {
//       sd(doc, C.rule); doc.setLineWidth(0.12); doc.line(shx, y, shx, y + SRH);
//       doc.setFont('helvetica', 'bold'); doc.setFontSize(6); sc(doc, C.inkMid);
//       txt(doc, h, shx + SC[i] / 2, y + SRH / 2 + 1.5, { align: 'center' });
//       shx += SC[i];
//     });
//     doc.line(shx, y, shx, y + SRH);
//     sd(doc, C.rule); doc.line(M, y + SRH, M + CW, y + SRH);
//     y += SRH;
//     rem.forEach((row, ri) => {
//       const isPaid = row.status === 'paid';
//       const bg = isPaid ? C.paidBg : (ri % 2 === 0 ? C.white : C.bgStripe);
//       box(doc, M, y, CW, SRH, bg);
//       tableGrid(doc, M, y, SC, SRH);
//       const vals = [String(ri + 12), row.month, fmtDt(row.dueDate), fmtRs(row.amount), isPaid ? 'PAID' : 'PENDING', isPaid ? fmtDt(row.updatedAt || row.dueDate) : '—'];
//       let svx = M;
//       vals.forEach((v, ci) => {
//         doc.setFont('helvetica', ci === 4 ? 'bold' : 'normal');
//         doc.setFontSize(6.5);
//         sc(doc, ci === 4 ? (isPaid ? C.paid : C.pending) : C.ink);
//         txt(doc, String(v), svx + SC[ci] / 2, y + SRH / 2 + 1.5, { align: 'center' });
//         svx += SC[ci];
//       });
//       y += SRH;
//     });
//     sd(doc, C.rule); doc.setLineWidth(0.2); doc.rect(M, y - rem.length * SRH, CW, rem.length * SRH);
//     y += 8;
//   }

//   // ── Terms ────────────────────────────────────────────────────────────────
//   sectionBar(doc, M, y, CW, 'TERMS & CONDITIONS');
//   y += 10;

//   const terms = [
//     'Customer must pay a security deposit (equivalent to one month\'s rent) plus the first month\'s rent before delivery. Monthly rent may be paid in cash; security may be tendered by cheque.',
//     'First month\'s rental is due at the time of delivery and installation — payable by cash, card, or online transfer — strictly in advance.',
//     'Dishonoured cheques attract a penalty of Rs.1,000 plus 24% p.a. interest for the period outstanding.',
//     'Late payments attract a penalty of Rs.1,000 plus 24% p.a. interest for the period outstanding.',
//     'After a second late-payment incident, Respion Healthcare At Home may reclaim the unit without prior notice.',
//     'If the machine is not returned by the agreed return date, the customer is liable for a full additional month\'s rent. Returns delayed beyond 3 days also incur a late fee of Rs.100 per day.',
//     'The customer must verify functionality, comfort, and condition of the equipment before accepting the rental.',
//     'The customer is solely responsible for maintaining the rental unit in good condition throughout the rental period.',
//     'Service costs arising from customer-caused functional failure will be borne by the customer.',
//     'The customer is liable for any physical or functional damage to the rental unit.',
//     'Physical damage by customer negligence may require the customer to purchase the unit (50% of rent paid is adjusted). If purchase is declined, full repair cost falls on the customer.',
//     'Only these written terms are legally binding. Verbal commitments by any Respion Healthcare At Home representative carry no legal weight.',
//     'Respion Healthcare At Home accepts no liability for losses caused by malfunction of the rental unit or accessories.',
//     'Ventilators rented for home use or transport must be used per physician\'s prescription under qualified ICU nursing supervision — to be arranged solely by the customer.',
//     'All disputes are subject exclusively to the jurisdiction of courts in Bhubaneswar.',
//     'The customer confirms they are renting this equipment exactly as prescribed by their treating physician.',
//     { text: 'RENT NON-REFUNDABLE: Rental amounts will not be refunded if the machine is returned before the contracted rental period ends.', bold: true },
//   ];

//   terms.forEach((t, i) => {
//     const isBold = typeof t === 'object' && t.bold;
//     const text2 = typeof t === 'object' ? t.text : t;
//     const lines = doc.splitTextToSize(text2, CW - 12);
//     const bh = lines.length * 4 + 3.5;
//     if (y + bh > 263) return;
//     if (isBold) {
//       box(doc, M, y - 1, CW, bh + 1, C.pendingBg, null, 0, 2);
//     }
//     doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5);
//     sc(doc, isBold ? C.pending : C.teal);
//     txt(doc, String(i + 1) + '.', M + 2, y + 3);
//     doc.setFont('helvetica', isBold ? 'bold' : 'normal');
//     doc.setFontSize(6.5);
//     sc(doc, isBold ? C.pending : C.inkMid);
//     txt(doc, lines, M + 9, y + 3);
//     y += bh;
//   });

//   // ── Authorised Signatory ─────────────────────────────────────────────────
//   const ackY = 265;
//   rule(doc, M, ackY, CW, C.rule, 0.3);
//   box(doc, M, ackY + 3, CW, 20, C.bgStripe, C.rule, 0.2, 2);

//   // Title
//   doc.setFont('helvetica', 'bold'); doc.setFontSize(7); sc(doc, C.teal);
//   txt(doc, 'AUTHORISED SIGNATORY', M + CW / 2, ackY + 9, { align: 'center' });

//   // ── Signature image (async, awaited before save) ──────────────────────────
//   const signatureImg = "/signature.jpeg";
//   const imgWidth = 45;
//   const imgHeight = 15;
//   const imgX = M + (CW - imgWidth) / 2;
//   const imgY = ackY + 5;

//   await new Promise((resolve) => {
//     const img = new Image();
//     img.crossOrigin = "anonymous";
//     img.onload = () => {
//       try {
//         doc.addImage(img, "JPEG", imgX, imgY, imgWidth, imgHeight);
//       } catch (e) {
//         console.warn("Signature image could not be added:", e);
//       }
//       resolve();
//     };
//     img.onerror = () => {
//       console.warn("Signature image failed to load — skipping.");
//       resolve(); // don't block PDF save if image is missing
//     };
//     img.src = signatureImg;
//   });

//   // "Authorised Signatory" label below image
//   doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); sc(doc, C.inkSoft);
//   txt(doc, 'Authorised Signatory', M + CW / 2, ackY + 21.5, { align: 'center' });

//   // ── Footer ───────────────────────────────────────────────────────────────
//   box(doc, 0, 285, W, 12, C.teal);
//   doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); sc(doc, C.tealMid);
//   txt(doc, 'Respion Respion Healthcare At Home  ·  healthcareathome247@gmail.com  ·  +91 99371 44165', W / 2, 291, { align: 'center' });
//   doc.setFontSize(6); sc(doc, C.white);
//   txt(doc, 'Page 2 / 2', W - M, 291, { align: 'right' });
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Helpers
// // ─────────────────────────────────────────────────────────────────────────────
// function generateInvoiceNo(branch = "") {
//   const now = new Date();
//   const br = (branch || "XX").substring(0, 2).toUpperCase();
//   const day = String(now.getDate()).padStart(2, "0");
//   const month = String(now.getMonth() + 1).padStart(2, "0");
//   const hours = String(now.getHours()).padStart(2, "0");
//   const mins = String(now.getMinutes()).padStart(2, "0");
//   return `${br}${day}${month}${hours}${mins}`;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // MAIN — async so we can await page2 (signature image load)
// // ─────────────────────────────────────────────────────────────────────────────
// export async function generatePatientPDF(payload, schedule = [], meta = {}) {
//   const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });

//   const invoiceNo = generateInvoiceNo(payload.branch);
//   const firstBilling = schedule.find(r => r.status === 'pending')?.dueDate ?? null;
//   const amounts = schedule.map(r => r.amount);
//   const perInstalment = amounts.length > 0 ? Math.min(...amounts) : 0;

//   const D = {
//     invoiceNo,
//     name: payload.name || '',
//     phone: payload.phone || '',
//     altPhone: payload.altPhone || '',
//     whatsapp: payload.whatsapp || '',
//     dob: payload.dob ? fmtDt(payload.dob) : '—',
//     age: payload.age ? String(payload.age) : '',
//     address: payload.address || '',
//     googleReview: payload.review === true,
//     branch: payload.branch || '—',
//     machineName: meta.machineName || '—',
//     slNo: meta.slNo || '—',       // fixed: was meta.slNo|| '--'
//     employeeName: meta.employeeName || payload.otherEmployee || '—',
//     durationLabel: meta.durationLabel || '—',
//     accessories: (payload.accessories || []).map(a => a.name || a).filter(Boolean),
//     rentPerPeriod: payload.rentPerPeriod || 0,
//     grandTotal: payload.grandTotal || 0,
//     security: payload.securityAmount || 0,
//     perInstalment,
//     instCount: schedule.length,
//     isDaily: payload.duration?.startsWith('d:') ?? false,
//     paymentModeLabel: payload.paymentMode === 'cash'
//       ? 'Cash'
//       : payload.paymentMode === 'online'
//         ? 'Online' + (payload.paymentAcc ? ' — ' + payload.paymentAcc : '')
//         : '—',
//     startDate: payload.startDate ? fmtDt(payload.startDate) : '—',
//     firstBilling: firstBilling ? fmtDt(firstBilling) : '—',
//     returnDate: schedule.length > 0 ? fmtDt(schedule[schedule.length - 1].dueDate) : '—',
//     machineReturn: payload.returnDate
//       ? fmtDt(payload.returnDate)
//       : (schedule.length > 0 ? fmtDt(schedule[schedule.length - 1].dueDate) : '—'),
//   };

//   // Page 1 is synchronous
//   page1(doc, D, schedule);

//   // Page 2 is async — must await so signature loads before doc.save()
//   doc.addPage();
//   await page2(doc, D, schedule);

//   const fileName = 'Respion_Invoice_' + (payload.name || 'patient').replace(/\s+/g, '_') + '_' + Date.now() + '.pdf';
//   doc.save(fileName);
// }



import { jsPDF } from "jspdf";

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  teal: [13, 148, 136],
  tealDark: [10, 110, 100],
  tealLight: [230, 251, 247],
  tealMid: [153, 218, 210],
  white: [255, 255, 255],
  ink: [15, 23, 42],
  inkMid: [51, 65, 85],
  inkSoft: [100, 116, 139],
  inkFaint: [148, 163, 184],
  rule: [213, 219, 227],
  bgStripe: [248, 250, 252],
  bgCard: [241, 245, 249],
  paid: [5, 150, 105],
  paidBg: [220, 252, 231],
  pending: [161, 98, 7],
  pendingBg: [254, 243, 199],
};

const sf = (d, c) => d.setFillColor(c[0], c[1], c[2]);
const sd = (d, c) => d.setDrawColor(c[0], c[1], c[2]);
const sc = (d, c) => d.setTextColor(c[0], c[1], c[2]);

function box(doc, x, y, w, h, fill, stroke = null, lw = 0.2, r = 0) {
  if (fill) sf(doc, fill);
  if (stroke) { sd(doc, stroke); doc.setLineWidth(lw); }
  const mode = fill && stroke ? "FD" : fill ? "F" : "D";
  if (r > 0) doc.roundedRect(x, y, w, h, r, r, mode);
  else doc.rect(x, y, w, h, mode);
}

function txt(doc, s, x, y, opts = {}) { doc.text(String(s ?? ''), x, y, opts); }

function hRule(doc, x, y, w, c = C.rule, lw = 0.2) {
  sd(doc, c); doc.setLineWidth(lw); doc.line(x, y, x + w, y);
}

const fmtRs = v => 'Rs.' + (Math.round(Number(v) || 0)).toLocaleString('en-IN');
const fmtDt = iso => {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

function sectionBar(doc, x, y, w, label) {
  box(doc, x, y, w, 7, C.teal, null, 0, 2);
  sf(doc, C.teal); doc.rect(x, y + 4, w, 3, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(7); sc(doc, C.white);
  txt(doc, label, x + w / 2, y + 4.9, { align: 'center' });
}

function cardHeader(doc, x, y, w, label) {
  box(doc, x, y, w, 7, C.teal, null, 0, 2);
  sf(doc, C.teal); doc.rect(x, y + 4, w, 3, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); sc(doc, C.white);
  txt(doc, label, x + w / 2, y + 4.9, { align: 'center' });
}

// label (5.8pt) + value (7pt) — total slot height = 8.5 mm
function kv(doc, label, value, x, y, maxW) {
  doc.setFont('helvetica', 'bold'); doc.setFontSize(5.8); sc(doc, C.inkFaint);
  txt(doc, label, x, y);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7); sc(doc, C.ink);
  const lines = doc.splitTextToSize(String(value || '—'), maxW);
  txt(doc, lines[0], x, y + 4.2);
}

function tableGrid(doc, x, y, cols, h) {
  sd(doc, C.rule); doc.setLineWidth(0.12);
  let cx = x;
  cols.forEach(w => { doc.line(cx, y, cx, y + h); cx += w; });
  doc.line(cx, y, cx, y + h);
  doc.line(x, y + h, cx, y + h);
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 1
// ─────────────────────────────────────────────────────────────────────────────
function page1(doc, D, sch) {
  const W = 210, M = 14, CW = 182;
  let y = 0;

  // ── Header band (h=28) ───────────────────────────────────────────────────
  box(doc, 0, 0, W, 28, C.teal);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(15); sc(doc, C.white);
  txt(doc, 'Respion Healthcare At Home', M, 11);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7); sc(doc, C.tealMid);
  txt(doc, 'Professional Home Medical Equipment Rental', M, 17);
  txt(doc, 'healthcareathome247@gmail.com   +91 99371 44165', M, 23);

  // Invoice badge
  box(doc, W - 60, 3, 46, 22, C.tealDark, null, 0, 3);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); sc(doc, C.tealMid);
  txt(doc, 'RENTAL INVOICE', W - 37, 9, { align: 'center' });
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); sc(doc, C.white);
  txt(doc, '#' + D.invoiceNo, W - 37, 16.5, { align: 'center' });
  doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); sc(doc, C.tealMid);
  txt(doc, D.startDate, W - 37, 22, { align: 'center' });

  y = 32;

  // ─── Info cards ──────────────────────────────────────────────────────────
  // KVH = 8.5 per row.  PAD = 3 top/bottom inner padding.  HEADER = 7.
  // Left  card: 4 kvs + address label (4mm) + 2 addr lines (9mm) + pads  = 7+3+34+2+4+9+3 = 62
  // Right card: 4 kvs + google badge label (4mm) + badge (6.5mm) + pads  = 7+3+34+2+4+6.5+3 = 59.5 -> 62 to match
  const KVH = 8.5;
  const PAD = 3;
  const cw = 88;
  const c2x = M + cw + 6;
  const CH = 62;

  // ── Left: Patient Details ─────────────────────────────────────────────────
  box(doc, M, y, cw, CH, C.bgStripe, C.rule, 0.2, 2);
  cardHeader(doc, M, y, cw, 'PATIENT DETAILS');
  let ly = y + 7 + PAD;
  kv(doc, 'PATIENT NAME', D.name, M + 3, ly, cw - 6); ly += KVH;
  kv(doc, 'DATE OF BIRTH / AGE', D.dob + (D.age ? '  (Age ' + D.age + ' yrs)' : ''), M + 3, ly, cw - 6); ly += KVH;
  kv(doc, 'PRIMARY PHONE', D.phone, M + 3, ly, cw - 6); ly += KVH;
  kv(doc, 'ALT / WHATSAPP', D.altPhone + ' / ' + D.whatsapp, M + 3, ly, cw - 6); ly += KVH;
  ly += 1;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(5.8); sc(doc, C.inkFaint);
  txt(doc, 'ADDRESS', M + 3, ly);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); sc(doc, C.ink);
  const addrLines = doc.splitTextToSize(D.address || '—', cw - 6);
  txt(doc, addrLines.slice(0, 2), M + 3, ly + 4.2);

  // ── Right: Rental Assignment ──────────────────────────────────────────────
  box(doc, c2x, y, cw, CH, C.bgStripe, C.rule, 0.2, 2);
  cardHeader(doc, c2x, y, cw, 'RENTAL ASSIGNMENT');
  let ry = y + 7 + PAD;

  kv(doc, 'BRANCH / REGION', D.branch, c2x + 3, ry, cw - 6); ry += KVH;

  // Machine + Serial on the same row — each gets half the inner width
  const halfW = Math.floor((cw - 10) / 2);   // ~39 mm each
  const midX = c2x + 3 + halfW + 2;          // x of the divider line
  kv(doc, 'MACHINE ASSIGNED', D.machineName, c2x + 3, ry, halfW);
  kv(doc, 'SERIAL NO', D.slNo, midX + 2, ry, halfW);
  // thin vertical separator
  sd(doc, C.rule); doc.setLineWidth(0.15);
  doc.line(midX, ry - 1, midX, ry + 6.5);
  ry += KVH;

  kv(doc, 'DURATION', D.durationLabel, c2x + 3, ry, cw - 6); ry += KVH;
  kv(doc, 'INSTALLED BY', D.employeeName, c2x + 3, ry, cw - 6); ry += KVH;

  // // Google review badge
  // ry += 1;
  // doc.setFont('helvetica', 'bold'); doc.setFontSize(5.8); sc(doc, C.inkFaint);
  // txt(doc, 'GOOGLE REVIEW', c2x + 3, ry);
  // const badgeY = ry + 2;
  // if (D.googleReview) {
  //   box(doc, c2x + 3, badgeY, 28, 5.5, C.paidBg, null, 0, 1.5);
  //   doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); sc(doc, C.paid);
  //   txt(doc, 'Collected', c2x + 17, badgeY + 3.8, { align: 'center' });
  // } else {
  //   box(doc, c2x + 3, badgeY, cw - 8, 5.5, C.pendingBg, null, 0, 1.5);
  //   doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); sc(doc, C.pending);
  //   txt(doc, 'Pending — collect at return', c2x + 3 + (cw - 8) / 2, badgeY + 3.8, { align: 'center' });
  // }

  y += CH + 5;

  // ── Equipment & Accessories ───────────────────────────────────────────────
  sectionBar(doc, M, y, CW, 'EQUIPMENT & ACCESSORIES');
  y += 7;

  // TC must sum to CW = 182
  const TC = [9, 77, 28, 36, 32];
  const TH = ['#', 'Product / Description', 'Duration', 'Rate / Period', 'Total'];
  const COL_H = 7;

  box(doc, M, y, CW, COL_H, C.bgCard, C.rule, 0.2);
  let cx = M;
  TC.forEach((w, i) => {
    sd(doc, C.rule); doc.setLineWidth(0.12); doc.line(cx, y, cx, y + COL_H);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(6.2); sc(doc, C.inkMid);
    const align = i === 1 ? 'left' : 'center';
    const tx = i === 1 ? cx + 2 : cx + w / 2;
    txt(doc, TH[i], tx, y + COL_H / 2 + 1.8, { align });
    cx += w;
  });
  doc.line(cx, y, cx, y + COL_H);
  sd(doc, C.rule); doc.setLineWidth(0.2); doc.line(M, y + COL_H, M + CW, y + COL_H);
  y += COL_H;

  const equip = [];
  equip.push({ sl: '1', desc: D.machineName, dur: D.durationLabel, rate: fmtRs(D.rentPerPeriod), total: fmtRs(D.grandTotal), hi: true });
  (D.accessories || []).forEach((a, i) => {
    equip.push({ sl: String(i + 2), desc: a, dur: 'Included', rate: '—', total: '—', hi: false });
  });
  while (equip.length < 4) equip.push({ sl: String(equip.length + 1), desc: '', dur: '', rate: '', total: '', hi: false });

  const rowH = 7;
  equip.forEach((r, ri) => {
    const bg = r.hi ? C.tealLight : (ri % 2 === 0 ? C.white : C.bgStripe);
    box(doc, M, y, CW, rowH, bg);
    tableGrid(doc, M, y, TC, rowH);
    const vals = [r.sl, r.desc, r.dur, r.rate, r.total];
    let dcx = M;
    vals.forEach((v, ci) => {
      doc.setFont('helvetica', r.hi && ci > 0 ? 'bold' : 'normal');
      doc.setFontSize(ci === 1 ? 6.8 : 7);
      sc(doc, r.hi && ci > 0 ? C.teal : C.ink);
      const align = ci === 1 ? 'left' : 'center';
      const tx = ci === 1 ? dcx + 2 : dcx + TC[ci] / 2;
      const str = ci === 1
        ? (doc.splitTextToSize(String(v || ''), TC[1] - 4)[0] || '')
        : String(v || '');
      txt(doc, str, tx, y + rowH / 2 + 1.8, { align });
      dcx += TC[ci];
    });
    y += rowH;
  });
  sd(doc, C.rule); doc.setLineWidth(0.25);
  doc.rect(M, y - equip.length * rowH, CW, equip.length * rowH);
  y += 5;

  // ── Payment Details + Financial Summary ───────────────────────────────────
  // PCH: 7 (header) + 3 (pad) + 4×8.5 (kvs) + 3 (pad-bottom) = 47
  const pcw = 88, p2x = M + pcw + 6, PCH = 47;

  box(doc, M, y, pcw, PCH, C.bgStripe, C.rule, 0.2, 2);
  cardHeader(doc, M, y, pcw, 'PAYMENT DETAILS');
  let py = y + 7 + PAD;
  kv(doc, 'PAYMENT MODE', D.paymentModeLabel, M + 3, py, pcw - 6); py += KVH;
  kv(doc, 'START DATE', D.startDate, M + 3, py, pcw - 6); py += KVH;
  kv(doc, 'FIRST BILLING', D.firstBilling, M + 3, py, pcw - 6); py += KVH;
  kv(doc, 'MACHINE RETURN', D.machineReturn, M + 3, py, pcw - 6);

  box(doc, p2x, y, pcw, PCH, C.bgStripe, C.rule, 0.2, 2);
  cardHeader(doc, p2x, y, pcw, 'FINANCIAL SUMMARY');

  // Grand total pill
  const pillY = y + 9;
  box(doc, p2x + 3, pillY, pcw - 6, 13, C.teal, null, 0, 2);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(6); sc(doc, C.tealMid);
  txt(doc, 'GRAND TOTAL (RENTAL)', p2x + pcw / 2, pillY + 4.5, { align: 'center' });
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); sc(doc, C.white);
  txt(doc, fmtRs(D.grandTotal), p2x + pcw / 2, pillY + 11, { align: 'center' });

  // Summary rows — right-align value against right edge of card
  const sumY = pillY + 16;
  [
    { lbl: 'Security Deposit (Refundable)', val: fmtRs(D.security), vc: C.paid },
    { lbl: 'Per Rental', val: fmtRs(D.perInstalment), vc: C.teal },
    { lbl: 'Total Rentals', val: String(D.instCount) + ' payments', vc: C.inkMid },
  ].forEach((r, i) => {
    const fy = sumY + i * 7;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(6); sc(doc, C.inkFaint);
    txt(doc, r.lbl, p2x + 3, fy);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7); sc(doc, r.vc);
    txt(doc, r.val, p2x + pcw - 3, fy, { align: 'right' });
  });

  y += PCH + 5;

  // ── Dates strip ──────────────────────────────────────────────────────────
  const DS_H = 11;
  box(doc, M, y, CW, DS_H, C.bgCard, C.rule, 0.2, 2);
  const dcw = CW / 4;
  [
    { lbl: 'START DATE', val: D.startDate, c: C.teal },
    { lbl: 'FIRST BILLING', val: D.firstBilling, c: C.pending },
    { lbl: 'RENTAL END', val: D.returnDate, c: C.inkMid },
    { lbl: 'MACHINE RETURN', val: D.machineReturn, c: C.paid },
  ].forEach((ch, i) => {
    const dx = M + i * dcw;
    if (i > 0) { sd(doc, C.rule); doc.setLineWidth(0.15); doc.line(dx, y + 1.5, dx, y + DS_H - 1.5); }
    doc.setFont('helvetica', 'bold'); doc.setFontSize(5.8); sc(doc, ch.c);
    txt(doc, ch.lbl, dx + dcw / 2, y + 4.2, { align: 'center' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7); sc(doc, C.ink);
    txt(doc, ch.val || '—', dx + dcw / 2, y + 8.8, { align: 'center' });
  });

  y += DS_H + 5;

  // ── Rental Schedule ───────────────────────────────────────────────────────
  sectionBar(doc, M, y, CW, 'RENTAL SCHEDULE  (' + sch.length + ' ' + (D.isDaily ? 'Days' : 'Months') + ')');
  y += 7;

  // SC must sum to CW = 182
  const SC = [10, 44, 36, 28, 26, 38];
  const SH = ['#', D.isDaily ? 'Day' : 'Month', 'Due Date', 'Amount', 'Status', 'Collected On'];
  const SRH = 6.5;

  box(doc, M, y, CW, SRH, C.bgCard, C.rule, 0.2);
  let shx = M;
  SH.forEach((h, i) => {
    sd(doc, C.rule); doc.setLineWidth(0.12); doc.line(shx, y, shx, y + SRH);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(6); sc(doc, C.inkMid);
    txt(doc, h, shx + SC[i] / 2, y + SRH / 2 + 1.5, { align: 'center' });
    shx += SC[i];
  });
  doc.line(shx, y, shx, y + SRH);
  sd(doc, C.rule); doc.line(M, y + SRH, M + CW, y + SRH);
  y += SRH;

  const maxR = Math.min(sch.length, 11);
  sch.slice(0, maxR).forEach((row, ri) => {
    const isPaid = row.status === 'paid';
    const bg = isPaid ? C.paidBg : (ri % 2 === 0 ? C.white : C.bgStripe);
    box(doc, M, y, CW, SRH, bg);
    tableGrid(doc, M, y, SC, SRH);
    const vals = [
      String(ri + 1), row.month, fmtDt(row.dueDate),
      fmtRs(row.amount), isPaid ? 'PAID' : 'PENDING',
      isPaid ? fmtDt(row.updatedAt || row.dueDate) : '—',
    ];
    let svx = M;
    vals.forEach((v, ci) => {
      doc.setFont('helvetica', ci === 4 ? 'bold' : 'normal');
      doc.setFontSize(6.5);
      sc(doc, ci === 4 ? (isPaid ? C.paid : C.pending) : C.ink);
      txt(doc, String(v), svx + SC[ci] / 2, y + SRH / 2 + 1.5, { align: 'center' });
      svx += SC[ci];
    });
    y += SRH;
  });
  sd(doc, C.rule); doc.setLineWidth(0.2); doc.rect(M, y - maxR * SRH, CW, maxR * SRH);

  if (sch.length > maxR) {
    doc.setFont('helvetica', 'italic'); doc.setFontSize(6); sc(doc, C.inkFaint);
    txt(doc, '... ' + (sch.length - maxR) + ' more rentals continued on page 2', M + CW / 2, y + 4, { align: 'center' });
    y += 7;
  }
  y += 4;

  // ── Totals bar ────────────────────────────────────────────────────────────
  const paidAmt = sch.filter(r => r.status === 'paid').reduce((s, r) => s + r.amount, 0);
  const pendAmt = sch.filter(r => r.status === 'pending').reduce((s, r) => s + r.amount, 0);
  const TBAR_H = 14;
  const fw = CW / 4;
  let bx = M;
  [
    { lbl: 'GRAND TOTAL', val: fmtRs(D.grandTotal), bg: C.teal, fg: C.white },
    { lbl: 'SECURITY DEP.', val: fmtRs(D.security), bg: C.paidBg, fg: C.paid },
    { lbl: 'COLLECTED', val: fmtRs(paidAmt), bg: C.paidBg, fg: C.paid },
    { lbl: 'OUTSTANDING', val: fmtRs(pendAmt), bg: C.pendingBg, fg: C.pending },
  ].forEach(b => {
    box(doc, bx + 0.3, y, fw - 0.6, TBAR_H, b.bg);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(5.8); sc(doc, b.fg);
    txt(doc, b.lbl, bx + fw / 2, y + 5, { align: 'center' });
    doc.setFontSize(8.5);
    txt(doc, b.val, bx + fw / 2, y + 11.5, { align: 'center' });
    bx += fw;
  });
  sd(doc, C.rule); doc.setLineWidth(0.2); doc.rect(M, y, CW, TBAR_H);
  y += TBAR_H + 5;

  // ── Signature strip ───────────────────────────────────────────────────────
  // hRule(doc, M, y, CW, C.rule, 0.25);
  // y += 6;
  // const sigW = CW / 2;
  // ['Receiver\'s Signature', 'Installed By'].forEach((lb, i) => {
  //   const sx = M + i * sigW;
  //   doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); sc(doc, C.inkFaint);
  //   txt(doc, lb, sx + sigW / 2, y, { align: 'center' });
  //   sd(doc, C.rule); doc.setLineWidth(0.25);
  //   doc.line(sx + 8, y + 9, sx + sigW - 8, y + 9);
  //   if (i === 1) {
  //     doc.setFont('helvetica', 'normal'); doc.setFontSize(7); sc(doc, C.ink);
  //     txt(doc, D.employeeName || '', sx + sigW / 2, y + 8, { align: 'center' });
  //   }
  //   if (i > 0) { sd(doc, C.rule); doc.setLineWidth(0.15); doc.line(sx, y - 2, sx, y + 11); }
  // });

  // ── Footer ────────────────────────────────────────────────────────────────
  box(doc, 0, 285, W, 12, C.teal);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); sc(doc, C.tealMid);
  txt(doc, 'Respion Healthcare At Home  ·  healthcareathome247@gmail.com  ·  +91 99371 44165', W / 2, 291, { align: 'center' });
  doc.setFontSize(6); sc(doc, C.white);
  txt(doc, 'Page 1 / 2', W - M, 291, { align: 'right' });
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 2
// ─────────────────────────────────────────────────────────────────────────────
async function page2(doc, D, sch) {
  const W = 210, M = 14, CW = 182;

  // ── Header band ───────────────────────────────────────────────────────────
  box(doc, 0, 0, W, 18, C.teal);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(12); sc(doc, C.white);
  txt(doc, 'Respion Healthcare At Home', M, 10);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(6.8); sc(doc, C.tealMid);
  txt(doc, 'Patient: ' + D.name + '   Invoice: #' + D.invoiceNo + '   ' + D.startDate, M, 15.5);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); sc(doc, C.white);
  txt(doc, 'Page 2 / 2', W - M, 12, { align: 'right' });

  let y = 24;

  // ── Overflow schedule ─────────────────────────────────────────────────────
  const rem = sch.slice(11);
  if (rem.length > 0) {
    sectionBar(doc, M, y, CW, 'RENTAL SCHEDULE (CONTINUED)');
    y += 7;

    const SC = [10, 44, 36, 28, 26, 38];
    const SH = ['#', D.isDaily ? 'Day' : 'Month', 'Due Date', 'Amount', 'Status', 'Collected On'];
    const SRH = 6.5;

    box(doc, M, y, CW, SRH, C.bgCard, C.rule, 0.2);
    let shx = M;
    SH.forEach((h, i) => {
      sd(doc, C.rule); doc.setLineWidth(0.12); doc.line(shx, y, shx, y + SRH);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(6); sc(doc, C.inkMid);
      txt(doc, h, shx + SC[i] / 2, y + SRH / 2 + 1.5, { align: 'center' });
      shx += SC[i];
    });
    doc.line(shx, y, shx, y + SRH);
    sd(doc, C.rule); doc.line(M, y + SRH, M + CW, y + SRH);
    y += SRH;

    rem.forEach((row, ri) => {
      const isPaid = row.status === 'paid';
      const bg = isPaid ? C.paidBg : (ri % 2 === 0 ? C.white : C.bgStripe);
      box(doc, M, y, CW, SRH, bg);
      tableGrid(doc, M, y, SC, SRH);
      const vals = [
        String(ri + 12), row.month, fmtDt(row.dueDate),
        fmtRs(row.amount), isPaid ? 'PAID' : 'PENDING',
        isPaid ? fmtDt(row.updatedAt || row.dueDate) : '—',
      ];
      let svx = M;
      vals.forEach((v, ci) => {
        doc.setFont('helvetica', ci === 4 ? 'bold' : 'normal');
        doc.setFontSize(6.5);
        sc(doc, ci === 4 ? (isPaid ? C.paid : C.pending) : C.ink);
        txt(doc, String(v), svx + SC[ci] / 2, y + SRH / 2 + 1.5, { align: 'center' });
        svx += SC[ci];
      });
      y += SRH;
    });
    sd(doc, C.rule); doc.setLineWidth(0.2); doc.rect(M, y - rem.length * SRH, CW, rem.length * SRH);
    y += 8;
  }

  // ── Terms & Conditions ────────────────────────────────────────────────────
  sectionBar(doc, M, y, CW, 'TERMS & CONDITIONS');
  y += 9;

  // Authorised Signatory box: 26 mm.  Footer: 12 mm.  Gaps: 4+4 = 8 mm.
  // Safe terms bottom = 285 - 12 - 4 - 26 - 4 = 239
  const TERMS_LIMIT = 239;

  const terms = [
    'Customer must pay a security deposit (equivalent to one month\'s rent) plus the first month\'s rent before delivery. Monthly rent may be paid in cash; security may be tendered by cheque.',
    'First month\'s rental is due at the time of delivery and installation — payable by cash, card, or online transfer — strictly in advance.',
    'Dishonoured cheques attract a penalty of Rs.1,000 plus 24% p.a. interest for the period outstanding.',
    'Late payments attract a penalty of Rs.1,000 plus 24% p.a. interest for the period outstanding.',
    'After a second late-payment incident, Respion Healthcare At Home may reclaim the unit without prior notice.',
    'If the machine is not returned by the agreed return date, the customer is liable for a full additional month\'s rent. Returns delayed beyond 3 days also incur a late fee of Rs.100 per day.',
    'The customer must verify functionality, comfort, and condition of the equipment before accepting the rental.',
    'The customer is solely responsible for maintaining the rental unit in good condition throughout the rental period.',
    'Service costs arising from customer-caused functional failure will be borne by the customer.',
    'The customer is liable for any physical or functional damage to the rental unit.',
    'Physical damage by customer negligence may require the customer to purchase the unit (50% of rent paid is adjusted). If purchase is declined, full repair cost falls on the customer.',
    'Only these written terms are legally binding. Verbal commitments by any Respion Healthcare At Home representative carry no legal weight.',
    'Respion Healthcare At Home accepts no liability for losses caused by malfunction of the rental unit or accessories.',
    'Ventilators rented for home use or transport must be used per physician\'s prescription under qualified ICU nursing supervision — to be arranged solely by the customer.',
    'All disputes are subject exclusively to the jurisdiction of courts in Bhubaneswar.',
    'The customer confirms they are renting this equipment exactly as prescribed by their treating physician.',
    { text: 'RENT NON-REFUNDABLE: Rental amounts will not be refunded if the machine is returned before the contracted rental period ends.', bold: true },
  ];

  terms.forEach((t, i) => {
    const isBold = typeof t === 'object' && t.bold;
    const text2 = typeof t === 'object' ? t.text : t;
    doc.setFontSize(6.5);
    const lines = doc.splitTextToSize(text2, CW - 13);
    const bh = lines.length * 4.2 + 3;
    if (y + bh > TERMS_LIMIT) return;
    if (isBold) box(doc, M, y - 1, CW, bh + 1, C.pendingBg, null, 0, 2);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); sc(doc, isBold ? C.pending : C.teal);
    txt(doc, String(i + 1) + '.', M + 2, y + 3.5);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal'); doc.setFontSize(6.5); sc(doc, isBold ? C.pending : C.inkMid);
    txt(doc, lines, M + 10, y + 3.5);
    y += bh;
  });

  // ── Authorised Signatory — always anchored above footer ───────────────────
  // const ACK_H = 26;
  // const ackY = 285 - 12 - 4 - ACK_H;   // = 243

  // hRule(doc, M, ackY, CW, C.rule, 0.3);
  // box(doc, M, ackY + 3, CW, ACK_H, C.bgStripe, C.rule, 0.2, 2);

  // doc.setFont('helvetica', 'bold'); doc.setFontSize(7); sc(doc, C.teal);
  // txt(doc, 'AUTHORISED SIGNATORY', M + CW / 2, ackY + 9, { align: 'center' });

  // // Signature image
  // const imgW = 45, imgH = 13;
  // const imgX = M + (CW - imgW) / 2;
  // const imgY = ackY + 10;

  // await new Promise((resolve) => {
  //   const img = new Image();
  //   img.crossOrigin = "anonymous";
  //   img.onload = () => {
  //     try { doc.addImage(img, "JPEG", imgX, imgY, imgW, imgH); }
  //     catch (e) { console.warn("Signature image could not be added:", e); }
  //     resolve();
  //   };
  //   img.onerror = () => { console.warn("Signature image failed to load — skipping."); resolve(); };
  //   img.src = "/signature.jpeg";
  // });

  // doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); sc(doc, C.inkSoft);
  // txt(doc, 'Authorised Signatory', M + CW / 2, ackY + ACK_H - 1, { align: 'center' });


  const ACK_H = 30;
  const ackY = 285 - 12 - 4 - ACK_H;

  // =======================
  // TITLE
  // =======================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  sc(doc, C.teal);

  txt(
    doc,
    'AUTHORISED SIGNATORY',
    M + CW / 2,
    ackY + 6,
    { align: 'center' }
  );

  // =======================
  // SIGNATURE IMAGE
  // =======================
  const imgW = 45;
  const imgH = 14;

  const imgX = M + (CW - imgW) / 2;
  const imgY = ackY + 10;

  await new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        doc.addImage(img, "JPEG", imgX, imgY, imgW, imgH);
      } catch (e) {
        console.warn("Signature image error:", e);
      }
      resolve();
    };

    img.onerror = () => {
      console.warn("Signature image failed");
      resolve();
    };

    img.src = "/signature.jpeg";
  });

  // =======================
  // FOOTER TEXT
  // =======================
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  sc(doc, C.inkSoft);

  txt(
    doc,
    'Authorised Signatory',
    M + CW / 2,
    ackY + ACK_H - 2,
    { align: 'center' }
  );

  // ── Footer ────────────────────────────────────────────────────────────────
  box(doc, 0, 285, W, 12, C.teal);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); sc(doc, C.tealMid);
  txt(doc, 'Respion Respion Healthcare At Home  ·  healthcareathome247@gmail.com  ·  +91 99371 44165', W / 2, 291, { align: 'center' });
  doc.setFontSize(6); sc(doc, C.white);
  txt(doc, 'Page 2 / 2', W - M, 291, { align: 'right' });
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function generateInvoiceNo(branch = "") {
  const now = new Date();
  const br = (branch || "XX").substring(0, 2).toUpperCase();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const mins = String(now.getMinutes()).padStart(2, "0");
  return `${br}${day}${month}${hours}${mins}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
export async function generatePatientPDF(payload, schedule = [], meta = {}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });

  const invoiceNo = generateInvoiceNo(payload.branch);
  const firstBilling = schedule.find(r => r.status === 'pending')?.dueDate ?? null;
  const amounts = schedule.map(r => r.amount);
  const perInstalment = amounts.length > 0 ? Math.min(...amounts) : 0;

  const D = {
    invoiceNo,
    name: payload.name || '',
    phone: payload.phone || '',
    altPhone: payload.altPhone || '',
    whatsapp: payload.whatsapp || '',
    dob: payload.dob ? fmtDt(payload.dob) : '—',
    age: payload.age ? String(payload.age) : '',
    address: payload.address || '',
    // googleReview: payload.review === true,
    branch: payload.branch || '—',
    machineName: meta.machineName || '—',
    slNo: meta.slNo || '—',
    employeeName: meta.employeeName || payload.otherEmployee || '—',
    durationLabel: meta.durationLabel || '—',
    accessories: (payload.accessories || []).map(a => a.name || a).filter(Boolean),
    rentPerPeriod: payload.rentPerPeriod || 0,
    grandTotal: payload.grandTotal || 0,
    security: payload.securityAmount || 0,
    perInstalment,
    instCount: schedule.length,
    isDaily: payload.duration?.startsWith('d:') ?? false,
    paymentModeLabel: payload.paymentMode === 'cash'
      ? 'Cash'
      : payload.paymentMode === 'online'
        ? 'Online' + (payload.paymentAcc ? ' — ' + payload.paymentAcc : '')
        : '—',
    startDate: payload.startDate ? fmtDt(payload.startDate) : '—',
    firstBilling: firstBilling ? fmtDt(firstBilling) : '—',
    returnDate: schedule.length > 0 ? fmtDt(schedule[schedule.length - 1].dueDate) : '—',
    machineReturn: payload.returnDate
      ? fmtDt(payload.returnDate)
      : (schedule.length > 0 ? fmtDt(schedule[schedule.length - 1].dueDate) : '—'),
  };

  page1(doc, D, schedule);
  doc.addPage();
  await page2(doc, D, schedule);

  const fileName = 'Respion_Invoice_' + (payload.name || 'patient').replace(/\s+/g, '_') + '_' + Date.now() + '.pdf';
  doc.save(fileName);
}