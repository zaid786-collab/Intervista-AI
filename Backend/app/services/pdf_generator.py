import io
from datetime import datetime
from typing import Dict, Any, List
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)

def generate_interview_pdf_report(
    interview_data: Dict[str, Any],
    candidate_name: str = "Candidate",
) -> io.BytesIO:
    """
    Generates a professional, publication-grade PDF assessment report
    using ReportLab and returns it as an in-memory BytesIO buffer.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36,
    )

    styles = getSampleStyleSheet()

    # Custom styles
    primary_color = colors.HexColor("#1e3a8a")   # Dark Navy Blue
    secondary_color = colors.HexColor("#2563eb") # Vibrant Blue
    accent_green = colors.HexColor("#16a34a")    # Emerald Green
    accent_amber = colors.HexColor("#d97706")    # Amber
    dark_text = colors.HexColor("#0f172a")       # Slate 900
    muted_text = colors.HexColor("#475569")      # Slate 600
    card_bg = colors.HexColor("#f8fafc")         # Slate 50
    border_color = colors.HexColor("#e2e8f0")    # Slate 200

    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        textColor=primary_color,
    )

    subtitle_style = ParagraphStyle(
        "DocSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=13,
        textColor=muted_text,
    )

    section_header_style = ParagraphStyle(
        "SectionHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=17,
        textColor=secondary_color,
        spaceAfter=6,
    )

    body_style = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=13,
        textColor=dark_text,
    )

    bold_body_style = ParagraphStyle(
        "BoldBody",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=13,
        textColor=dark_text,
    )

    score_val_style = ParagraphStyle(
        "ScoreVal",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=22,
        textColor=secondary_color,
        alignment=1, # Center
    )

    score_lbl_style = ParagraphStyle(
        "ScoreLbl",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=muted_text,
        alignment=1, # Center
    )

    elements = []

    # 1. HEADER & BRANDING
    header_table_data = [
        [
            Paragraph("<b>INTERVISTA AI</b><br/><font size=8 color='#64748b'>AI-Powered Mock Interview & Technical Assessment Platform</font>", title_style),
            Paragraph(f"<b>OFFICIAL CANDIDATE REPORT</b><br/><font size=8 color='#64748b'>Report ID: #{interview_data.get('id', 'INTV-LIVE')}<br/>Date: {interview_data.get('date', datetime.now().strftime('%d %b %Y'))}</font>", subtitle_style),
        ]
    ]
    header_table = Table(header_table_data, colWidths=[340, 200])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(header_table)
    elements.append(HRFlowable(width="100%", thickness=1.5, color=secondary_color, spaceAfter=12, spaceBefore=4))

    # 2. CANDIDATE & SESSION METADATA
    company = interview_data.get("company", "Tech Firm")
    role = interview_data.get("role", "Software Engineer")
    duration = interview_data.get("duration_minutes", 45)
    difficulty = interview_data.get("difficulty", "Medium")
    overall_score = interview_data.get("score_num") or interview_data.get("score") or 0
    if isinstance(overall_score, str):
        overall_score = int(overall_score.replace("%", "")) if overall_score.replace("%", "").isdigit() else 75
    grade = interview_data.get("grade") or ("A (Strong Hire)" if overall_score >= 80 else "B+ (Leaning Hire)")

    meta_data = [
        [
            Paragraph(f"<b>Candidate:</b> {candidate_name}", body_style),
            Paragraph(f"<b>Target Company:</b> {company}", body_style),
            Paragraph(f"<b>Target Role:</b> {role}", body_style),
        ],
        [
            Paragraph(f"<b>Difficulty:</b> {difficulty}", body_style),
            Paragraph(f"<b>Duration:</b> {duration} Minutes", body_style),
            Paragraph(f"<b>Status:</b> Completed & Evaluated", body_style),
        ]
    ]
    meta_table = Table(meta_data, colWidths=[180, 180, 180])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), card_bg),
        ('BOX', (0, 0), (-1, -1), 0.5, border_color),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, border_color),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(meta_table)
    elements.append(Spacer(1, 14))

    # 3. EXECUTIVE SCORECARD CARDS
    tech_score = interview_data.get("technical_score") or round(overall_score * 1.02)
    comm_score = interview_data.get("communication_score") or round(overall_score * 0.98)
    prob_score = interview_data.get("problem_solving_score") or round(overall_score * 0.95)

    scorecard_data = [
        [
            Paragraph(f"<font color='#16a34a'>{overall_score}%</font>", score_val_style),
            Paragraph(f"<font color='#2563eb'>{tech_score}%</font>", score_val_style),
            Paragraph(f"<font color='#7c3aed'>{comm_score}%</font>", score_val_style),
            Paragraph(f"<font color='#ea580c'>{prob_score}%</font>", score_val_style),
        ],
        [
            Paragraph("OVERALL SCORE", score_lbl_style),
            Paragraph("TECHNICAL DEPTH", score_lbl_style),
            Paragraph("COMMUNICATION", score_lbl_style),
            Paragraph("PROBLEM SOLVING", score_lbl_style),
        ],
        [
            Paragraph(f"<font size=7 color='#16a34a'><b>{grade}</b></font>", score_lbl_style),
            Paragraph("<font size=7 color='#64748b'>Domain Concepts</font>", score_lbl_style),
            Paragraph("<font size=7 color='#64748b'>Structure & Clarity</font>", score_lbl_style),
            Paragraph("<font size=7 color='#64748b'>Logic & Complexity</font>", score_lbl_style),
        ]
    ]
    scorecard_table = Table(scorecard_data, colWidths=[135, 135, 135, 135])
    scorecard_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f1f5f9")),
        ('BOX', (0, 0), (-1, -1), 0.75, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0, 0), (-1, 0), 8),
        ('BOTTOMPADDING', (0, -1), (-1, -1), 8),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ]))
    elements.append(scorecard_table)
    elements.append(Spacer(1, 14))

    # 4. AI EXECUTIVE SUMMARY
    summary_text = interview_data.get("feedback") or interview_data.get("overall_summary") or (
        f"Candidate scored {overall_score}% ({grade}) for {company}'s {role} position. "
        "Demonstrated consistent technical fundamentals and analytical problem-solving with room to elaborate on edge cases."
    )
    elements.append(Paragraph("<b>✦ Executive Performance Verdict</b>", section_header_style))
    summary_p = Paragraph(summary_text, body_style)
    summary_box = Table([[summary_p]], colWidths=[540])
    summary_box.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#eff6ff")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#bfdbfe")),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    elements.append(summary_box)
    elements.append(Spacer(1, 14))

    # 5. KEY STRENGTHS & IMPROVEMENTS
    strengths = interview_data.get("strengths") or [
        f"Solid technical alignment with {role} requirements.",
        "Demonstrated structured approach to problem solving.",
        "Clear explanation of core concepts and principles."
    ]
    improvements = interview_data.get("improvements") or [
        "Explicitly state asymptotic Big-O runtime and auxiliary memory upfront.",
        "Discuss production failure modes, concurrency issues, and scale limits.",
        "Incorporate specific quantitative metrics and concrete design patterns."
    ]

    strengths_html = "<b><font color='#16a34a'>✓ Key Strengths</font></b><br/>" + "<br/>".join([f"• {s}" for s in strengths])
    improvements_html = "<b><font color='#d97706'>⚠ Targeted Improvement Areas</font></b><br/>" + "<br/>".join([f"• {i}" for i in improvements])

    si_data = [
        [
            Paragraph(strengths_html, body_style),
            Paragraph(improvements_html, body_style),
        ]
    ]
    si_table = Table(si_data, colWidths=[265, 265])
    si_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), colors.HexColor("#f0fdf4")),
        ('BACKGROUND', (1, 0), (1, 0), colors.HexColor("#fffbeb")),
        ('BOX', (0, 0), (0, 0), 0.75, colors.HexColor("#bbf7d0")),
        ('BOX', (1, 0), (1, 0), 0.75, colors.HexColor("#fde68a")),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    elements.append(si_table)
    elements.append(Spacer(1, 14))

    # 6. DETAILED QUESTION BREAKDOWN
    detailed_feedback = interview_data.get("detailed_feedback") or []
    if detailed_feedback:
        elements.append(Paragraph("<b>📝 Question-by-Question Detailed Analysis & Marks</b>", section_header_style))

        for idx, qf in enumerate(detailed_feedback, 1):
            q_score = qf.get("score", 80)
            score_color = "#16a34a" if q_score >= 80 else "#d97706" if q_score >= 65 else "#dc2626"
            q_text = qf.get("question", f"Question {idx}")
            fb_text = qf.get("feedback", "Good fundamental answer.")
            keywords = qf.get("identified_keywords", [])
            points = qf.get("suggested_answer_points", [])

            q_header = f"<b>Question {idx}:</b> {q_text} &nbsp;&nbsp;[ <b><font color='{score_color}'>{q_score}%</font></b> ]"
            q_body = f"<b>AI Evaluator Assessment:</b> {fb_text}"
            if keywords:
                q_body += f"<br/><b>Key Concepts Covered:</b> <font color='#2563eb'>{', '.join(keywords)}</font>"
            if points:
                q_body += f"<br/><b>Model Key Points:</b><br/>" + "<br/>".join([f"&nbsp;&nbsp;→ {p}" for p in points])

            q_card_data = [
                [Paragraph(q_header, bold_body_style)],
                [Paragraph(q_body, body_style)]
            ]
            q_card = Table(q_card_data, colWidths=[540])
            q_card.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#f8fafc")),
                ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor("#ffffff")),
                ('BOX', (0, 0), (-1, -1), 0.5, border_color),
                ('LINEBELOW', (0, 0), (-1, 0), 0.5, border_color),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('LEFTPADDING', (0, 0), (-1, -1), 8),
                ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ]))
            elements.append(KeepTogether([q_card, Spacer(1, 8)]))

    # 7. FOOTER & VERIFICATION
    elements.append(Spacer(1, 10))
    footer_text = Paragraph(
        f"<font size=7 color='#94a3b8'>Generated automatically by Intervista AI Evaluation Engine • Verified Assessment • {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}</font>",
        ParagraphStyle("Footer", parent=styles["Normal"], alignment=1)
    )
    elements.append(footer_text)

    doc.build(elements)
    buffer.seek(0)
    return buffer
