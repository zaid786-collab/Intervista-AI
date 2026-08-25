import { useMemo, useState } from "react";
import "./Dashboard.css";

// GitHub Contribution Color Palette
const GITHUB_LEVELS = [
  { level: 0, count: "0", bgDark: "#161b22", bgLight: "#ebedf0", borderDark: "rgba(255,255,255,0.06)", borderLight: "rgba(0,0,0,0.06)" },
  { level: 1, count: "1", bgDark: "#0e4429", bgLight: "#9be9a8", borderDark: "#0e4429", borderLight: "#82df91" },
  { level: 2, count: "2", bgDark: "#006d32", bgLight: "#40c463", borderDark: "#006d32", borderLight: "#34b857" },
  { level: 3, count: "3", bgDark: "#26a641", bgLight: "#30a14e", borderDark: "#26a641", borderLight: "#289445" },
  { level: 4, count: "4+", bgDark: "#39d353", bgLight: "#216e39", borderDark: "#39d353", borderLight: "#19592d" },
];

function getLevel(count) {
  if (!count || count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
}

function formatDate(d) {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatShortMonth(d) {
  return d.toLocaleDateString("en-US", { month: "short" });
}

function InterviewHeatmap({ recentInterviews = [], activities = [] }) {
  const [hoveredCell, setHoveredCell] = useState(null);

  // Generate a GitHub-style 16-week grid ending today
  const { weeks, monthHeaders, totalSessions, currentStreak, longestStreak } = useMemo(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // Count sessions per date key "YYYY-MM-DD"
    const dateCounts = {};

    const registerDate = (dateVal) => {
      if (!dateVal) return;
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return;
      const key = d.toISOString().split("T")[0];
      dateCounts[key] = (dateCounts[key] || 0) + 1;
    };

    (recentInterviews || []).forEach((item) => {
      if (item.status === "Completed" || item.score !== undefined) {
        registerDate(item.date || item.created_at);
      }
    });

    (activities || []).forEach((act) => {
      registerDate(act.timestamp || act.date || act.created_at);
    });

    // 16 weeks x 7 days
    const numWeeks = 16;
    const endDayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
    
    // We want the grid to end on today's week
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (numWeeks * 7 - 1) + (6 - endDayOfWeek));
    startDate.setHours(0, 0, 0, 0);

    const generatedWeeks = [];
    const months = [];
    let currentMonth = "";
    let total = 0;
    let currStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    let cursor = new Date(startDate);

    for (let w = 0; w < numWeeks; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const dateObj = new Date(cursor);
        const key = dateObj.toISOString().split("T")[0];
        const count = dateCounts[key] || 0;
        const isFuture = dateObj > today;

        if (!isFuture) {
          total += count;
          if (count > 0) {
            tempStreak++;
            if (tempStreak > maxStreak) maxStreak = tempStreak;
          } else {
            tempStreak = 0;
          }
        }

        const mStr = formatShortMonth(dateObj);
        if (d === 0 && mStr !== currentMonth && w > 0) {
          months.push({ weekIndex: w, label: mStr });
          currentMonth = mStr;
        } else if (w === 0 && d === 0) {
          months.push({ weekIndex: 0, label: mStr });
          currentMonth = mStr;
        }

        days.push({
          date: dateObj,
          dateKey: key,
          count: isFuture ? 0 : count,
          level: isFuture ? 0 : getLevel(count),
          isFuture,
          formatted: formatDate(dateObj),
        });

        cursor.setDate(cursor.getDate() + 1);
      }
      generatedWeeks.push(days);
    }

    // Check current active streak ending today or yesterday
    const todayKey = today.toISOString().split("T")[0];
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split("T")[0];

    if (dateCounts[todayKey]) {
      currStreak = 1;
      let check = new Date(yesterday);
      while (dateCounts[check.toISOString().split("T")[0]]) {
        currStreak++;
        check.setDate(check.getDate() - 1);
      }
    } else if (dateCounts[yesterdayKey]) {
      currStreak = 1;
      let check = new Date(yesterday);
      check.setDate(check.getDate() - 1);
      while (dateCounts[check.toISOString().split("T")[0]]) {
        currStreak++;
        check.setDate(check.getDate() - 1);
      }
    }

    return {
      weeks: generatedWeeks,
      monthHeaders: months,
      totalSessions: total,
      currentStreak: currStreak,
      longestStreak: Math.max(maxStreak, currStreak),
    };
  }, [recentInterviews, activities]);

  const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="heatmap github-heatmap-container">
      {/* Header */}
      <div className="github-heatmap-header">
        <div className="github-heatmap-title-group">
          <h3>
            <span className="github-commit-icon">✦</span> Interview Consistency
          </h3>
          <span className="github-heatmap-badge">
            {totalSessions} session{totalSessions === 1 ? "" : "s"} in last 4 months
          </span>
        </div>

        {/* Streaks */}
        <div className="github-heatmap-streaks">
          <div className="streak-pill">
            <span className="streak-icon">🔥</span>
            <span className="streak-label">Streak:</span>
            <strong>{currentStreak} day{currentStreak === 1 ? "" : "s"}</strong>
          </div>
          <div className="streak-pill">
            <span className="streak-icon">⚡</span>
            <span className="streak-label">Max:</span>
            <strong>{longestStreak} day{longestStreak === 1 ? "" : "s"}</strong>
          </div>
        </div>
      </div>

      {/* Main Contribution Graph */}
      <div className="github-graph-wrapper">
        {/* Month labels along top */}
        <div className="github-months-row">
          <div className="github-day-spacer" />
          <div className="github-months-track">
            {monthHeaders.map((m, idx) => (
              <span
                key={idx}
                className="github-month-label"
                style={{ left: `${(m.weekIndex / 16) * 100}%` }}
              >
                {m.label}
              </span>
            ))}
          </div>
        </div>

        {/* Graph Body: Day Labels + Week Columns */}
        <div className="github-grid-body">
          {/* Day of Week Labels (Mon, Wed, Fri) */}
          <div className="github-days-col">
            {DAY_LABELS.map((day, idx) => (
              <span key={day} className="github-day-name">
                {idx % 2 === 1 ? day : ""}
              </span>
            ))}
          </div>

          {/* Week Columns */}
          <div className="github-weeks-grid">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="github-week-col">
                {week.map((day, dIdx) => {
                  const levelObj = GITHUB_LEVELS[day.level];
                  const isHovered =
                    hoveredCell && hoveredCell.dateKey === day.dateKey;

                  return (
                    <div
                      key={dIdx}
                      className={`github-cell level-${day.level} ${
                        day.isFuture ? "future" : ""
                      } ${isHovered ? "active-cell" : ""}`}
                      style={{
                        backgroundColor: levelObj.bgDark,
                        borderColor: levelObj.borderDark,
                      }}
                      onMouseEnter={() => setHoveredCell(day)}
                      onMouseLeave={() => setHoveredCell(null)}
                      aria-label={`${day.count} sessions on ${day.formatted}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Live Hover Tooltip Bar */}
        <div className="github-cell-info-bar">
          {hoveredCell ? (
            <span>
              <strong>
                {hoveredCell.count === 0
                  ? "No sessions"
                  : `${hoveredCell.count} session${
                      hoveredCell.count > 1 ? "s" : ""
                    }`}
              </strong>{" "}
              on {hoveredCell.formatted}
            </span>
          ) : (
            <span className="github-hint">
              Hover over squares to inspect daily mock interview practice
            </span>
          )}
        </div>
      </div>

      {/* GitHub-style Legend at Bottom */}
      <div className="github-heatmap-footer">
        <span className="learn-label">Learn how we count practice activity</span>
        <div className="github-legend">
          <span>Less</span>
          {GITHUB_LEVELS.map((lvl) => (
            <div
              key={lvl.level}
              className={`legend-square level-${lvl.level}`}
              style={{ backgroundColor: lvl.bgDark, borderColor: lvl.borderDark }}
              title={`Level ${lvl.level}: ${lvl.count} sessions`}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

export default InterviewHeatmap;