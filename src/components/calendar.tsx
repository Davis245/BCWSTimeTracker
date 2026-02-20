// Renamed from EventsCalendar.tsx

"use client";

import { useState, useEffect, useCallback } from "react";


const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatTime(time: string): string {
  if (!time) return "";
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
}

export default function Calendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed


  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  }

  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  return (
  <div style={{ width: "80vw", margin: "0 auto", background: "#f3f4f6", borderRadius: "0.75rem", padding: "2rem 0" }}>
      {/* Month nav */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <button onClick={prevMonth} style={navBtnStyle} aria-label="Previous month">
          ‹
        </button>
        <span style={{ fontSize: "1.5rem", fontWeight: 600, color: "#111827" }}>
          {MONTH_NAMES[month]} {year}
        </span>
        <button onClick={nextMonth} style={navBtnStyle} aria-label="Next month">
          ›
        </button>
      </div>



      {/* Day-of-week header */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "1px" }}>
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#6b7280",
              padding: "0.5rem 0",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "1px",
          backgroundColor: "#f3f4f6",
          border: "1px solid #e5e7eb",
          borderRadius: "0.5rem",
          overflow: "hidden",
        }}
      >
        {/* Empty leading cells */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} style={emptyCellStyle} />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          return (
            <div
              key={day}
              style={{
                ...cellStyle,
                backgroundColor: isToday(day) ? "#e0e7ef" : "#fff",
                border: "1px solid #e5e7eb",
              }}
            >
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: isToday(day) ? 700 : 400,
                  color: isToday(day) ? "#2563eb" : "#374151",
                }}
              >
                {day}
              </span>
            </div>
          );
        })}

        {/* Empty trailing cells to complete the last row */}
        {Array.from({
          length: (7 - ((firstDay + daysInMonth) % 7)) % 7,
        }).map((_, i) => (
          <div key={`trail-${i}`} style={emptyCellStyle} />
        ))}
      </div>
    </div>
  );
}

/* ---- shared inline styles ---- */

const navBtnStyle: React.CSSProperties = {
  background: "none",
  border: "1px solid #d1d5db",
  borderRadius: "0.375rem",
  padding: "0.4rem 0.85rem",
  fontSize: "1.5rem",
  cursor: "pointer",
  color: "#374151",
  lineHeight: 1,
};

const cellStyle: React.CSSProperties = {
  aspectRatio: "2 / 3",
  padding: "0.5rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};

const emptyCellStyle: React.CSSProperties = {
  backgroundColor: "#f3f4f6",
  aspectRatio: "2 / 3",
};
