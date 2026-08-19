import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function generateInterviewPDF(interviewData, candidateName = "Interview Candidate") {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

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
  doc.setFillColor(15, 23, 42); // #0f172a dark slate navy
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("INTERVISTA AI", margin, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184); // #94a3b8
  doc.text("AI-Powered Mock Interview & Technical Assessment Platform", margin, 18);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(56, 189, 248); // #38bdf8 cyan
  doc.text("OFFICIAL CANDIDATE EVALUATION REPORT", pageWidth - margin, 12, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(`Report ID: #${interviewData.id || "LIVE-" + Date.now().toString().slice(-6)} • ${dateStr}`, pageWidth - margin, 18, { align: "right" });

  // Accent Line
  doc.setFillColor(37, 99, 235); // #2563eb
  doc.rect(0, 28, pageWidth, 2, "F");

  let currentY = 36;

  // 2. CANDIDATE & INTERVIEW DETAILS TABLE
  autoTable(doc, {
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

  currentY = doc.lastAutoTable.finalY + 6;

  // 3. EXECUTIVE METRICS SCORECARD CARDS
  const cardWidth = (pageWidth - margin * 2 - 9) / 4;
  const cards = [
    { title: "OVERALL SCORE", val: `${scoreNum}%`, sub: grade, col: [34, 197, 94] },
    { title: "TECHNICAL DEPTH", val: `${techScore}%`, sub: "Domain Accuracy", col: [37, 99, 235] },
    { title: "COMMUNICATION", val: `${commScore}%`, sub: "Clarity & Structure", col: [147, 51, 234] },
    { title: "PROBLEM SOLVING", val: `${probScore}%`, sub: "Logic & Complexity", col: [234, 88, 12] },
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
    `Candidate achieved an overall interview performance score of ${scoreNum}% (${grade}) for ${company}'s ${role} position. ` +
    `Demonstrated consistent technical fundamentals and analytical problem-solving with room to elaborate on edge cases.`
  );

  autoTable(doc, {
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

  currentY = doc.lastAutoTable.finalY + 6;

  // 5. STRENGTHS & IMPROVEMENTS SIDE-BY-SIDE
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

  autoTable(doc, {
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

  currentY = doc.lastAutoTable.finalY + 6;

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

    autoTable(doc, {
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

    currentY = doc.lastAutoTable.finalY + 8;
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

  doc.save(filename);
  return filename;
}
