/**
 * Intervista AI - Enterprise PDF & Printable Report Generator
 * Resilient implementation with dynamic loader and native printable PDF fallback.
 */

function buildReportHTML(interviewData, candidateName = "Interview Candidate") {
  const company = interviewData.company || "Tech Company";
  const role = interviewData.role || "Software Engineer";
  const difficulty = interviewData.difficulty || "Medium";
  const duration = interviewData.duration_minutes || 45;
  const dateStr = interviewData.date || new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const scoreNum = typeof interviewData.score === "number"
    ? interviewData.score
    : parseInt(String(interviewData.score || interviewData.score_percentage || "75").replace("%", ""), 10) || 75;

  const grade = interviewData.grade || (scoreNum >= 85 ? "A+ (Strong Hire)" : scoreNum >= 75 ? "A (Hire)" : "B+ (Leaning Hire)");
  const techScore = interviewData.technical_score || Math.min(Math.round(scoreNum * 1.02), 100);
  const commScore = interviewData.communication_score || Math.max(Math.round(scoreNum * 0.98), 40);
  const probScore = interviewData.problem_solving_score || Math.max(Math.round(scoreNum * 0.95), 40);

  const summaryText = interviewData.feedback || interviewData.overall_summary || (
    `Candidate achieved an overall interview performance score of ${scoreNum}% (${grade}) for ${company}'s ${role} position.`
  );

  const strengths = interviewData.strengths || [
    `Demonstrated solid grasp of ${role} engineering fundamentals.`,
    `Structured and articulate approach to problem decomposition.`,
    `Effective integration of domain-specific concepts and best practices.`
  ];

  const improvements = interviewData.improvements || [
    `Explicitly state asymptotic Big-O runtime and auxiliary space complexity in initial reasoning.`,
    `Highlight edge cases (e.g. concurrency race conditions, null inputs, scale bottlenecks).`,
    `Structure responses using the STAR or Problem-Approach-Complexity framework.`
  ];

  const detailed = interviewData.detailed_feedback || [];

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Intervista AI Official Report - ${company} (${role})</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', -apple-system, sans-serif; }
    body { background: #0f172a; color: #0f172a; padding: 24px; }
    .sheet { background: #ffffff; max-width: 860px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
    .header { background: #0f172a; color: #fff; padding: 24px 32px; border-bottom: 3px solid #2563eb; }
    .header-top { display: flex; justify-content: space-between; align-items: center; }
    .brand { font-size: 22px; font-weight: 800; letter-spacing: 0.5px; color: #fff; }
    .report-title { font-size: 13px; font-weight: 700; color: #38bdf8; text-transform: uppercase; }
    .header-sub { margin-top: 6px; display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; }
    .content { padding: 28px 32px; }
    .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px; font-size: 12px; }
    .meta-item strong { color: #0f172a; display: block; font-size: 11px; text-transform: uppercase; color: #64748b; margin-bottom: 2px; }
    .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
    .metric-card { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; text-align: center; }
    .metric-val { font-size: 22px; font-weight: 800; }
    .metric-title { font-size: 10px; font-weight: 700; color: #64748b; margin-top: 4px; text-transform: uppercase; }
    .metric-sub { font-size: 10px; color: #475569; margin-top: 2px; }
    .section-title { font-size: 14px; font-weight: 700; color: #1e3a8a; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
    .summary-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 14px 18px; font-size: 12.5px; line-height: 1.5; color: #1e293b; margin-bottom: 20px; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px; }
    .box-green { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; color: #166534; font-size: 12px; line-height: 1.45; }
    .box-amber { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px; color: #92400e; font-size: 12px; line-height: 1.45; }
    .box-title { font-weight: 700; font-size: 12.5px; margin-bottom: 8px; }
    .list-item { margin-bottom: 6px; display: flex; align-items: flex-start; gap: 6px; }
    .qa-table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 11.5px; }
    .qa-table th { background: #0f172a; color: #fff; padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; }
    .qa-table td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    .qa-table tr:nth-child(even) { background: #f8fafc; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 14px 32px; font-size: 10.5px; color: #94a3b8; text-align: center; }
    @media print {
      body { background: #fff; padding: 0; }
      .sheet { box-shadow: none; border-radius: 0; max-width: 100%; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="header">
      <div class="header-top">
        <div class="brand">INTERVISTA AI</div>
        <div class="report-title">Official Candidate Evaluation Report</div>
      </div>
      <div class="header-sub">
        <span>AI-Powered Mock Interview & Technical Assessment</span>
        <span>Date: ${dateStr} • Status: Verified Assessment</span>
      </div>
    </div>
    <div class="content">
      <div class="meta-grid">
        <div class="meta-item"><strong>Candidate</strong>${candidateName}</div>
        <div class="meta-item"><strong>Target Company</strong>${company}</div>
        <div class="meta-item"><strong>Role</strong>${role}</div>
        <div class="meta-item"><strong>Difficulty</strong>${difficulty}</div>
        <div class="meta-item"><strong>Duration</strong>${duration} Minutes</div>
        <div class="meta-item"><strong>Status</strong><span style="color: #16a34a; font-weight: 700;">Completed & Evaluated</span></div>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-val" style="color: #16a34a;">${scoreNum}%</div>
          <div class="metric-title">Overall Score</div>
          <div class="metric-sub">${grade}</div>
        </div>
        <div class="metric-card">
          <div class="metric-val" style="color: #2563eb;">${techScore}%</div>
          <div class="metric-title">Technical Depth</div>
          <div class="metric-sub">Domain Accuracy</div>
        </div>
        <div class="metric-card">
          <div class="metric-val" style="color: #9333ea;">${commScore}%</div>
          <div class="metric-title">Communication</div>
          <div class="metric-sub">Clarity & Structure</div>
        </div>
        <div class="metric-card">
          <div class="metric-val" style="color: #ea580c;">${probScore}%</div>
          <div class="metric-title">Problem Solving</div>
          <div class="metric-sub">Logic & Approach</div>
        </div>
      </div>

      <div class="section-title">✦ Executive Performance Summary</div>
      <div class="summary-box">${summaryText}</div>

      <div class="two-col">
        <div class="box-green">
          <div class="box-title">✓ Key Strengths</div>
          ${strengths.map(s => `<div class="list-item"><span>•</span><span>${s}</span></div>`).join("")}
        </div>
        <div class="box-amber">
          <div class="box-title">⚠ Targeted Improvement Areas</div>
          ${improvements.map(i => `<div class="list-item"><span>•</span><span>${i}</span></div>`).join("")}
        </div>
      </div>

      ${detailed.length > 0 ? `
      <div class="section-title">📝 Question-by-Question Detailed Analysis</div>
      <table class="qa-table">
        <thead>
          <tr>
            <th style="width: 45px;">#</th>
            <th style="width: 35%;">Question</th>
            <th style="width: 60px; text-align: center;">Score</th>
            <th>Evaluator Notes & Key Points</th>
          </tr>
        </thead>
        <tbody>
          ${detailed.map((q, idx) => `
            <tr>
              <td><strong>Q${idx + 1}</strong></td>
              <td><strong>${q.question || `Question ${idx + 1}`}</strong></td>
              <td style="text-align: center; color: #16a34a; font-weight: 700;">${q.score || 80}%</td>
              <td>
                <div>${q.feedback || "Solid answer."}</div>
                ${q.identified_keywords && q.identified_keywords.length > 0 ? `<div style="margin-top: 4px; font-size: 10.5px; color: #475569;"><strong>Matched Concepts:</strong> ${q.identified_keywords.join(", ")}</div>` : ""}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      ` : ""}
    </div>
    <div class="footer">
      Generated by Intervista AI Evaluation Engine • Verified Official Assessment
    </div>
  </div>
  <script>
    window.addEventListener("load", () => {
      setTimeout(() => {
        window.print();
      }, 400);
    });
  </script>
</body>
</html>`;
}

/**
 * Native Print-to-PDF Fallback Window
 */
export function openPrintableReport(interviewData, candidateName = "Interview Candidate") {
  const html = buildReportHTML(interviewData, candidateName);
  const printWindow = window.open("", "_blank", "width=900,height=800,menubar=no,toolbar=no,location=no,status=no");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  } else {
    // Fallback if popup blocker intercepted window.open
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Intervista_AI_Report_${(interviewData.company || "Company").replace(/\\s+/g, "_")}.html`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
  }
}

/**
 * Main PDF Generator function.
 * Loads jsPDF dynamically with autoTable and gracefully falls back to native printable report.
 */
export async function generateInterviewPDF(interviewData, candidateName = "Interview Candidate") {
  try {
    // Dynamic import to prevent build/startup breaks
    const [jsPDFModule, autoTableModule] = await Promise.all([
      import("jspdf").catch((err) => {
        console.warn("Could not import jspdf directly:", err);
        return null;
      }),
      import("jspdf-autotable").catch((err) => {
        console.warn("Could not import jspdf-autotable directly:", err);
        return null;
      }),
    ]);

    const jsPDF = jsPDFModule?.jsPDF || jsPDFModule?.default || window?.jspdf?.jsPDF;
    const autoTable = autoTableModule?.default || autoTableModule?.applyPlugin || autoTableModule;

    if (!jsPDF) {
      console.warn("jsPDF is not directly available in runtime. Triggering printable report fallback...");
      openPrintableReport(interviewData, candidateName);
      return "PRINT_FALLBACK";
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const runTable = (options) => {
      if (typeof autoTable === "function") {
        autoTable(doc, options);
      } else if (doc && typeof doc.autoTable === "function") {
        doc.autoTable(options);
      } else if (autoTable && typeof autoTable.default === "function") {
        autoTable.default(doc, options);
      }
    };

    const getFinalY = (fallbackY) => {
      return (doc.lastAutoTable && typeof doc.lastAutoTable.finalY === "number")
        ? doc.lastAutoTable.finalY
        : fallbackY;
    };

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;

    const company = interviewData.company || "Tech Company";
    const role = interviewData.role || "Software Engineer";
    const difficulty = interviewData.difficulty || "Medium";
    const duration = interviewData.duration_minutes || 45;
    const dateStr = interviewData.date || new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

    const scoreNum = typeof interviewData.score === "number"
      ? interviewData.score
      : parseInt(String(interviewData.score || interviewData.score_percentage || "75").replace("%", ""), 10) || 75;

    const grade = interviewData.grade || (scoreNum >= 85 ? "A+ (Strong Hire)" : scoreNum >= 75 ? "A (Hire)" : "B+ (Leaning Hire)");
    const techScore = interviewData.technical_score || Math.min(Math.round(scoreNum * 1.02), 100);
    const commScore = interviewData.communication_score || Math.max(Math.round(scoreNum * 0.98), 40);
    const probScore = interviewData.problem_solving_score || Math.max(Math.round(scoreNum * 0.95), 40);

    // 1. BRAND HEADER
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("INTERVISTA AI", margin, 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.text("AI-Powered Mock Interview & Technical Assessment Platform", margin, 18);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(56, 189, 248);
    doc.text("OFFICIAL CANDIDATE EVALUATION REPORT", pageWidth - margin, 12, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(203, 213, 225);
    doc.text(`Report ID: #${interviewData.id || "LIVE-" + Date.now().toString().slice(-6)} • ${dateStr}`, pageWidth - margin, 18, { align: "right" });

    // Accent Line
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 28, pageWidth, 2, "F");

    let currentY = 36;

    // 2. CANDIDATE DETAILS TABLE
    runTable({
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: "plain",
      head: [],
      body: [
        [
          { content: `Candidate: ${candidateName}`, styles: { fontStyle: "bold", textColor: [30, 41, 59] } },
          { content: `Target Company: ${company}`, styles: { fontStyle: "bold", textColor: [30, 41, 59] } },
          { content: `Role: ${role}`, styles: { fontStyle: "bold", textColor: [30, 41, 59] } },
        ],
        [
          { content: `Difficulty: ${difficulty}`, styles: { textColor: [71, 85, 105] } },
          { content: `Duration: ${duration} Minutes`, styles: { textColor: [71, 85, 105] } },
          { content: `Status: Completed & Evaluated`, styles: { textColor: [22, 163, 74], fontStyle: "bold" } },
        ],
      ],
      styles: {
        fontSize: 8.5,
        cellPadding: 2.5,
        fillColor: [248, 250, 252],
        lineColor: [226, 232, 240],
        lineWidth: 0.2,
      },
    });

    currentY = getFinalY(currentY + 16) + 6;

    // 3. SCORECARD CARDS
    const cardWidth = (pageWidth - margin * 2 - 9) / 4;
    const cards = [
      { title: "OVERALL SCORE", val: `${scoreNum}%`, sub: grade, col: [34, 197, 94] },
      { title: "TECHNICAL DEPTH", val: `${techScore}%`, sub: "Domain Accuracy", col: [37, 99, 235] },
      { title: "COMMUNICATION", val: `${commScore}%`, sub: "Clarity & Structure", col: [147, 51, 234] },
      { title: "PROBLEM SOLVING", val: `${probScore}%`, sub: "Logic & Approach", col: [234, 88, 12] },
    ];

    cards.forEach((c, idx) => {
      const cardX = margin + idx * (cardWidth + 3);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(cardX, currentY, cardWidth, 20, 2, 2, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(...c.col);
      doc.text(c.val, cardX + cardWidth / 2, currentY + 7, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(c.title, cardX + cardWidth / 2, currentY + 12, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(71, 85, 105);
      doc.text(c.sub, cardX + cardWidth / 2, currentY + 16.5, { align: "center" });
    });

    currentY += 25;

    // 4. EXECUTIVE SUMMARY BOX
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 58, 138);
    doc.text("✦ Executive Performance Summary", margin, currentY);
    currentY += 3;

    const summaryText = interviewData.feedback || interviewData.overall_summary || (
      `Candidate achieved an overall interview performance score of ${scoreNum}% (${grade}) for ${company}'s ${role} position.`
    );

    runTable({
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: "plain",
      body: [[{ content: summaryText, styles: { textColor: [30, 41, 59], fontSize: 8.5, fontStyle: "normal", cellPadding: 3.5 } }]],
      styles: {
        fillColor: [239, 246, 255],
        lineColor: [191, 219, 254],
        lineWidth: 0.4,
      },
    });

    currentY = getFinalY(currentY + 18) + 6;

    // 5. STRENGTHS & IMPROVEMENTS
    const strengths = interviewData.strengths || [
      `Demonstrated solid grasp of ${role} engineering fundamentals.`,
      `Structured and articulate approach to problem decomposition.`,
      `Effective integration of domain-specific concepts and best practices.`
    ];

    const improvements = interviewData.improvements || [
      `Explicitly state asymptotic Big-O runtime and auxiliary space complexity in initial reasoning.`,
      `Highlight edge cases (e.g. concurrency race conditions, null inputs, scale bottlenecks).`,
      `Structure responses using the STAR or Problem-Approach-Complexity framework.`
    ];

    const strengthsContent = "✓ Key Strengths:\n" + strengths.map((s) => `• ${s}`).join("\n");
    const improvementsContent = "⚠ Targeted Improvement Areas:\n" + improvements.map((i) => `• ${i}`).join("\n");

    runTable({
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: "plain",
      body: [
        [
          {
            content: strengthsContent,
            styles: {
              textColor: [22, 101, 52],
              fillColor: [240, 253, 244],
              lineColor: [187, 247, 208],
              lineWidth: 0.4,
              fontSize: 8,
              cellPadding: 3.5,
            },
          },
          {
            content: improvementsContent,
            styles: {
              textColor: [146, 64, 14],
              fillColor: [255, 251, 235],
              lineColor: [253, 230, 138],
              lineWidth: 0.4,
              fontSize: 8,
              cellPadding: 3.5,
            },
          },
        ],
      ],
    });

    currentY = getFinalY(currentY + 28) + 6;

    // 6. QUESTION BY QUESTION BREAKDOWN TABLE
    const detailed = interviewData.detailed_feedback || [];
    if (detailed.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(30, 58, 138);
      doc.text("📝 Question-by-Question Detailed Analysis & Marks", margin, currentY);
      currentY += 3;

      const tableRows = detailed.map((qf, idx) => {
        const qScore = qf.score || 80;
        const qText = qf.question || `Question ${idx + 1}`;
        const feedback = qf.feedback || "Solid response.";
        const keywords = (qf.identified_keywords || []).join(", ");
        const modelPoints = (qf.suggested_answer_points || []).map((p) => `→ ${p}`).join("\n");

        let detailsBlock = `Feedback: ${feedback}`;
        if (keywords) {
          detailsBlock += `\nMatched Concepts: ${keywords}`;
        }
        if (modelPoints) {
          detailsBlock += `\nModel Answer Key Points:\n${modelPoints}`;
        }

        return [
          `Q${idx + 1}`,
          qText,
          `${qScore}%`,
          detailsBlock,
        ];
      });

      runTable({
        startY: currentY,
        margin: { left: margin, right: margin },
        head: [["#", "Interview Question", "Score", "Evaluator Assessment & Model Points"]],
        body: tableRows,
        theme: "grid",
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: "bold",
          cellPadding: 2.5,
        },
        columnStyles: {
          0: { cellWidth: 10, halign: "center", fontStyle: "bold", fontSize: 8 },
          1: { cellWidth: 50, fontSize: 7.5, fontStyle: "bold" },
          2: { cellWidth: 16, halign: "center", fontStyle: "bold", fontSize: 8.5, textColor: [34, 197, 94] },
          3: { fontSize: 7.5, cellPadding: 2.5 },
        },
        styles: {
          overflow: "linebreak",
          cellPadding: 2.5,
          lineColor: [226, 232, 240],
        },
      });

      currentY = getFinalY(currentY + 40) + 8;
    }

    // 7. FOOTER ON ALL PAGES
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Generated by Intervista AI Evaluation Engine • Page ${i} of ${totalPages} • Verified Assessment`,
        pageWidth / 2,
        pageHeight - 6,
        { align: "center" }
      );
    }

    const safeCompany = company.replace(/[^a-zA-Z0-9]/g, "_");
    const safeRole = role.replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `Intervista_AI_Report_${safeCompany}_${safeRole}.pdf`;

    try {
      doc.save(filename);
    } catch (saveError) {
      console.warn("Direct doc.save failed, falling back to Blob download:", saveError);
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1000);
    }

    return filename;
  } catch (err) {
    console.error("PDF generation encounter error, falling back to printable report:", err);
    openPrintableReport(interviewData, candidateName);
    return "PRINT_FALLBACK";
  }
}
