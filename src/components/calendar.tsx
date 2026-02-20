// Renamed from EventsCalendar.tsx

"use client";

import { useState, useEffect, useCallback } from "react";

type TimeEntry = {
  id: string;
  userId: string;
  date: string;
  type: "ETO" | "CTO";
  direction: "EARNED" | "USED";
  hours: number;
  notes?: string;
  deletedAt?: string | null;
};

type DayTotals = Record<string, { ETO: number; CTO: number }>;


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
  const [modalOpen, setModalOpen] = useState(false);
  const [editDay, setEditDay] = useState<number | null>(null);
  const [editEto, setEditEto] = useState("");
  const [editCto, setEditCto] = useState("");
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [dayTotals, setDayTotals] = useState<DayTotals>({});

  // Fetch entries for the current month
  useEffect(() => {
    async function fetchEntries() {
      const res = await fetch("/api/time-entries");
      if (!res.ok) return;
      const data = await res.json();
      setEntries(data.entries || []);
    }
    fetchEntries();
  }, [year, month]);

  // Aggregate per day for this month
  useEffect(() => {
    const totals: DayTotals = {};
    for (const entry of entries) {
      const d = new Date(entry.date);
      if (d.getFullYear() !== year || d.getMonth() !== month) continue;
      const day = d.getDate();
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      if (!totals[key]) totals[key] = { ETO: 0, CTO: 0 };
      const sign = entry.direction === "EARNED" ? 1 : -1;
      if (entry.type === "ETO") totals[key].ETO += sign * entry.hours;
      if (entry.type === "CTO") totals[key].CTO += sign * entry.hours;
    }
    setDayTotals(totals);
  }, [entries, year, month]);

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

  function openEditModal(day: number) {
    setEditDay(day);
    setEditEto("");
    setEditCto("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditDay(null);
    setEditEto("");
    setEditCto("");
  }

  async function handleSave() {
    if (editDay == null) return;
    const date = new Date(year, month, editDay).toISOString(); // Full ISO-8601 string
    const requests = [];
    // ETO
    if (editEto && !isNaN(Number(editEto)) && Number(editEto) !== 0) {
      const etoNum = Number(editEto);
      requests.push(
        fetch("/api/time-entry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date,
            type: "ETO",
            direction: etoNum > 0 ? "EARNED" : "USED",
            hours: Math.abs(etoNum),
          }),
        })
      );
    }
    // CTO
    if (editCto && !isNaN(Number(editCto)) && Number(editCto) !== 0) {
      const ctoNum = Number(editCto);
      requests.push(
        fetch("/api/time-entry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date,
            type: "CTO",
            direction: ctoNum > 0 ? "EARNED" : "USED",
            hours: Math.abs(ctoNum),
          }),
        })
      );
    }
    try {
      await Promise.all(requests);
    } catch (e) {
      // Optionally show error
    }
    closeModal();
  }

  // Get the date string for the modal
  let modalDateStr = "";
  if (editDay !== null) {
    modalDateStr = `${MONTH_NAMES[month]} ${editDay}, ${year}`;
  }

  return (
    <div style={{ width: "80vw", margin: "0 auto", background: "#f3f4f6", borderRadius: "0.75rem", padding: "2rem 0", position: "relative" }}>
      {/* Modal Popup */}
      {modalOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            padding: 32,
            minWidth: 320,
            maxWidth: "90vw",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{modalDateStr}</div>
            <label style={{ fontSize: 14, fontWeight: 500, marginBottom: 0 }}>ETO:</label>
            <input
              type="text"
              value={editEto}
              onChange={e => setEditEto(e.target.value)}
              style={{ padding: 8, borderRadius: 6, border: "1px solid #d1d5db", marginBottom: 8 }}
              placeholder="Enter ETO value"
            />
            <label style={{ fontSize: 14, fontWeight: 500, marginBottom: 0 }}>CTO:</label>
            <input
              type="text"
              value={editCto}
              onChange={e => setEditCto(e.target.value)}
              style={{ padding: 8, borderRadius: 6, border: "1px solid #d1d5db", marginBottom: 16 }}
              placeholder="Enter CTO value"
            />
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button onClick={closeModal} style={{ padding: "8px 18px", borderRadius: 6, border: "1px solid #d1d5db", background: "#f3f4f6", color: "#374151", fontWeight: 500, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSave} style={{ padding: "8px 18px", borderRadius: 6, border: "none", background: "#2563eb", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Save</button>
            </div>
          </div>
        </div>
      )}
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
          const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const etoVal = dayTotals[key]?.ETO ?? 0;
          const ctoVal = dayTotals[key]?.CTO ?? 0;
          return (
            <div
              key={day}
              style={{
                ...cellStyle,
                backgroundColor: isToday(day) ? "#e0e7ef" : "#fff",
                border: "1px solid #e5e7eb",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                height: "100%",
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
              {/* ETO/CTO cards */}
              <div style={{ display: "flex", gap: 4, marginTop: 4, width: "100%" }}>
                <div
                  style={{
                    flex: 1,
                    background:
                      etoVal > 0
                        ? "#bbf7d0" // green-200
                        : etoVal < 0
                        ? "#fecaca" // red-200
                        : "#f1f5f9",
                    borderRadius: 6,
                    padding: "2px 0",
                    textAlign: "center",
                    marginRight: 2,
                    border: "1px solid #e5e7eb",
                    transition: "background 0.2s"
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#0f172a", letterSpacing: 1 }}>ETO</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                    {etoVal !== 0 ? etoVal : "--"}
                  </div>
                </div>
                <div
                  style={{
                    flex: 1,
                    background:
                      ctoVal > 0
                        ? "#bbf7d0"
                        : ctoVal < 0
                        ? "#fecaca"
                        : "#f1f5f9",
                    borderRadius: 6,
                    padding: "2px 0",
                    textAlign: "center",
                    marginLeft: 2,
                    border: "1px solid #e5e7eb",
                    transition: "background 0.2s"
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#0f172a", letterSpacing: 1 }}>CTO</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                    {ctoVal !== 0 ? ctoVal : "--"}
                  </div>
                </div>
              </div>
              {/* Spacer to push button to bottom */}
              <div style={{ flex: 1 }} />
              {/* Edit button at bottom */}
              <button
                style={{
                  marginTop: "auto",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f3f4f6",
                  border: "1px solid #e5e7eb",
                  borderRadius: 6,
                  padding: "4px 0",
                  cursor: "pointer",
                  color: "#64748b",
                  fontSize: 14,
                  fontWeight: 500,
                  gap: 6,
                  outline: "none"
                }}
                aria-label="Edit day"
                onClick={() => openEditModal(day)}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ marginRight: 4 }}>
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
              </button>
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
