// Renamed from EventsCalendar.tsx

"use client";
import { useState, useEffect, useCallback } from "react";
import { useTimeEntryRefresh } from "./TimeEntryRefreshContext";
import { useToast } from "../context/ToastContext";

type TimeEntry = {
  id: string;
  userId: string;
  date: string;
  savedAt?: string;
  type: "ETO" | "CTO";
  direction: "EARNED" | "USED";
  hours: number;
  notes?: string;
  deletedAt?: string | null;
};

type DayTotals = Record<string, { ETO: number; CTO: number; hasEto?: boolean; hasCto?: boolean }>;


const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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

function CalendarContent() {
  const [today, setToday] = useState<Date | null>(null);
  const [isSingleDayView, setIsSingleDayView] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0); // 0-indexed
  const [modalOpen, setModalOpen] = useState(false);
  const [editDay, setEditDay] = useState<number | null>(null);
  const [editEto, setEditEto] = useState("");
  const [editCto, setEditCto] = useState("");
  const [editEtoError, setEditEtoError] = useState<string | null>(null);
  const [editCtoError, setEditCtoError] = useState<string | null>(null);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [dayTotals, setDayTotals] = useState<DayTotals>({});
  const { refreshKey } = useTimeEntryRefresh();
  const { triggerRefresh } = useTimeEntryRefresh();
  const { showToast } = useToast();

  // Initialize today's date on client mount (ensures correct timezone)
  useEffect(() => {
    const currentDate = new Date();
    setToday(currentDate);
    setSelectedDate(currentDate);
    setYear(currentDate.getFullYear());
    setMonth(currentDate.getMonth());
  }, []);

  // Fetch entries for the current month
  useEffect(() => {
    async function fetchEntries() {
      const res = await fetch("/api/time-entries");
      if (!res.ok) return;
      const data = await res.json();
      setEntries(data.entries || []);
    }
    fetchEntries();
  }, [year, month, refreshKey]);

  // Watch for viewport size and enable single-day view on small screens
  useEffect(() => {
    function checkSize() {
      // Use 560px as the breakpoint where the full calendar won't fit comfortably
      setIsSingleDayView(window.innerWidth <= 560);
    }
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // Aggregate per day for this month
  useEffect(() => {
    const totals: DayTotals = {};
    for (const entry of entries) {
      const d = new Date(entry.date);
      if (d.getFullYear() !== year || d.getMonth() !== month) continue;
      const day = d.getDate();
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      if (!totals[key]) totals[key] = { ETO: 0, CTO: 0, hasEto: false, hasCto: false };
      const sign = entry.direction === "EARNED" ? 1 : -1;
      if (entry.type === "ETO") {
        totals[key].ETO += sign * entry.hours;
        totals[key].hasEto = true;
      }
      if (entry.type === "CTO") {
        totals[key].CTO += sign * entry.hours;
        totals[key].hasCto = true;
      }
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

  function prevDay() {
    if (!selectedDate) return;
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }

  function nextDay() {
    if (!selectedDate) return;
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }

  const isToday = (day: number) =>
    today !== null &&
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  // Helper to compute totals for an arbitrary date (used in single-day view)
  function getTotalsForDate(d: Date) {
    let eto = 0;
    let cto = 0;
    let hasEto = false;
    let hasCto = false;
    for (const entry of entries) {
      const ed = new Date(entry.date);
      if (ed.getFullYear() === d.getFullYear() && ed.getMonth() === d.getMonth() && ed.getDate() === d.getDate()) {
        const sign = entry.direction === "EARNED" ? 1 : -1;
        if (entry.type === "ETO") {
          eto += sign * entry.hours;
          hasEto = true;
        }
        if (entry.type === "CTO") {
          cto += sign * entry.hours;
          hasCto = true;
        }
      }
    }
    return { ETO: eto, CTO: cto, hasEto, hasCto };
  }

  function openEditModal(day: number) {
    setEditDay(day);
    setEditEto("");
    setEditCto("");
    setEditEtoError(null);
    setEditCtoError(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditDay(null);
    setEditEto("");
    setEditCto("");
    setEditEtoError(null);
    setEditCtoError(null);
  }

  function validateEtoInput(value: string) {
    if (value === "") {
      setEditEtoError(null);
      return true;
    }
    const num = parseFloat(value);
    if (isNaN(num)) {
      setEditEtoError("Must be a number");
      return false;
    }
    if (num < -7) {
      setEditEtoError("Cannot use more than 7 hours of ETO");
      return false;
    }
    if (num > 1.5) {
      setEditEtoError("Cannot earn more than 1.5 hours of ETO");
      return false;
    }
    setEditEtoError(null);
    return true;
  }

  function validateCtoInput(value: string) {
    if (value === "") {
      setEditCtoError(null);
      return true;
    }
    const num = parseFloat(value);
    if (isNaN(num)) {
      setEditCtoError("Must be a number");
      return false;
    }
    if (num < -7) {
      setEditCtoError("Cannot use more than 7 hours of CTO");
      return false;
    }
    setEditCtoError(null);
    return true;
  }

  async function handleSave() {
    if (editDay == null) return;
    // Build a date using the selected day but stamp it with the current local time so
    // the saved entry records when the user clicked Save.
    const now = new Date();
    const dateObj = new Date(year, month, editDay, now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    const date = dateObj.toISOString(); // Full ISO-8601 string
    const requests = [];
    // ETO
    if (editEto !== "" && !isNaN(Number(editEto))) {
      const etoNum = Number(editEto);
      const payload = {
        date,
        type: "ETO",
        direction: etoNum >= 0 ? "EARNED" : "USED",
        hours: Math.abs(etoNum),
        savedAt: new Date().toISOString(),
      };
      
      requests.push(
        fetch("/api/time-entry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      );
    }
    // CTO
    if (editCto !== "" && !isNaN(Number(editCto))) {
      const ctoNum = Number(editCto);
      const payload = {
        date,
        type: "CTO",
        direction: ctoNum >= 0 ? "EARNED" : "USED",
        hours: Math.abs(ctoNum),
        savedAt: new Date().toISOString(),
      };
      
      requests.push(
        fetch("/api/time-entry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      );
    }
    try {
      const responses = await Promise.all(requests);
      const statuses = responses.map((r) => r.status);
      // attempt to parse json bodies for errors and collect created entries
      const bodies = await Promise.all(responses.map(async (r) => {
        try { return await r.json(); } catch { return null; }
      }));

      // If the API returned created entries, optimistically add them to local state
      const created = (bodies || []).filter((b: any) => b && b.id);
      if (created.length > 0) {
        // ensure savedAt is present on returned bodies (fallback to our payload value or now)
        const withSaved = created.map((c: any) => ({ ...c, savedAt: c.savedAt || new Date().toISOString() }));
        setEntries((prev) => [...prev, ...withSaved]);
        // show success toast for the number of entries created
        showToast("success", `${withSaved.length} entr${withSaved.length === 1 ? "y" : "ies"} saved`);
      }

      // If any responses failed, show an error toast (and still keep the optimistic created items)
      const allOk = responses.every((r) => r.ok);
      if (!allOk) {
        const errorMsgs = (bodies || []).map((b: any) => b?.error).filter(Boolean);
        const errMsg = errorMsgs.length > 0 ? errorMsgs.join("; ") : `Save failed: ${statuses.join(",")}`;
        showToast("error", errMsg);
      }

      // notify others that data changed (server-side) — keeps the existing refresh flow
      try {
        triggerRefresh();
      } catch (_) {
        // ignore if context not available
      }
    } catch (e) {
      console.error("[calendar] error saving entries:", e);
    }
    closeModal();
  }

  // Delete confirmed via in-app modal. Optimistic UI with revert on failure.
  async function deleteConfirmed() {
    const id = entryToDelete;
    if (!id) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch("/api/time-entry", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `delete failed: ${res.status}`);
      }
      // remove locally on success
      setEntries((es) => es.filter((e) => e.id !== id));
      // show success toast
      showToast("success", "Entry deleted");
      try { triggerRefresh(); } catch (_) {}
      // close modal after a short delay so user sees the change
      setTimeout(() => setEntryToDelete(null), 600);
    } catch (err: any) {
      console.error("failed deleting entry", err);
      const msg = err?.message || "Unable to delete entry";
      setDeleteError(msg);
      showToast("error", msg);
    } finally {
      setDeleting(false);
    }
  }

  // Get the date string for the modal
  let modalDateStr = "";
  if (editDay !== null) {
    modalDateStr = `${MONTH_NAMES[month]} ${editDay}, ${year}`;
  }

  // If in single-day view use selectedDate for header label
  const headerDateLabel = isSingleDayView && selectedDate
    ? `${DAY_NAMES[selectedDate.getDay()]}, ${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
    : `${MONTH_NAMES[month]} ${year}`;

  // Entries for the edit modal (entries that match the currently edited day)
  const modalEntries = (() => {
    if (editDay == null) return [] as TimeEntry[];
    const d = new Date(year, month, editDay);
    return entries.filter((e) => {
      const ed = new Date(e.date);
      return ed.getFullYear() === d.getFullYear() && ed.getMonth() === d.getMonth() && ed.getDate() === d.getDate();
    });
  })();

  return (
  <div className="w-full max-w-5xl mx-auto bg-gray-100 rounded-xl py-6 px-4 sm:px-6 relative">
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
            {/* Previous entries will appear under the existing ETO/CTO labels below */}
            <label style={{ fontSize: 14, fontWeight: 500, marginBottom: 0 }}>ETO:</label>
            {/* ETO entries for this date */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8, marginBottom: 8 }}>
              {modalEntries.filter((e) => e.type === "ETO").length > 0 ? (
                modalEntries
                  .filter((e) => e.type === "ETO")
                  .map((entry) => (
                    <div
                      key={entry.id}
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                        padding: 10,
                        borderRadius: 8,
                        background: entry.direction === "EARNED" ? "#bbf7d0" : "#fecaca",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>ETO</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{entry.direction === "EARNED" ? "+" : "-"}{entry.hours}</div>
                        </div>
                        {entry.notes && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{entry.notes}</div>}
                        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>{new Date(entry.savedAt || entry.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</div>
                      </div>
                      <button
                        onClick={() => setEntryToDelete(entry.id)}
                        aria-label="Delete entry"
                        title="Delete"
                        style={{
                          marginLeft: "auto",
                          alignSelf: "center",
                          padding: "6px",
                          borderRadius: 6,
                          border: "1px solid rgba(0,0,0,0.08)",
                          background: "#fff",
                          color: "#ef4444",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  ))
              ) : (
                <div style={{ fontSize: 13, color: "#6b7280" }}>No ETO entries</div>
              )}
            </div>
            <input
              type="text"
              value={editEto}
              onChange={e => {
                setEditEto(e.target.value);
                validateEtoInput(e.target.value);
              }}
              style={{ padding: 8, borderRadius: 6, border: editEtoError ? "1px solid #ef4444" : "1px solid #d1d5db", marginBottom: 4 }}
              placeholder="Enter ETO value"
            />
            {editEtoError && <div style={{ fontSize: 12, color: "#ef4444", marginBottom: 8 }}>{editEtoError}</div>}
            <label style={{ fontSize: 14, fontWeight: 500, marginBottom: 0 }}>CTO:</label>
            {/* CTO entries for this date */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8, marginBottom: 8 }}>
              {modalEntries.filter((e) => e.type === "CTO").length > 0 ? (
                modalEntries
                  .filter((e) => e.type === "CTO")
                  .map((entry) => (
                    <div
                      key={entry.id}
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                        padding: 10,
                        borderRadius: 8,
                        background: entry.direction === "EARNED" ? "#bbf7d0" : "#fecaca",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>CTO</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{entry.direction === "EARNED" ? "+" : "-"}{entry.hours}</div>
                        </div>
                        {entry.notes && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{entry.notes}</div>}
                        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>{new Date(entry.savedAt || entry.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</div>
                      </div>
                      <button
                        onClick={() => setEntryToDelete(entry.id)}
                        aria-label="Delete entry"
                        title="Delete"
                        style={{
                          marginLeft: "auto",
                          alignSelf: "center",
                          padding: "6px",
                          borderRadius: 6,
                          border: "1px solid rgba(0,0,0,0.08)",
                          background: "#fff",
                          color: "#ef4444",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  ))
              ) : (
                <div style={{ fontSize: 13, color: "#6b7280" }}>No CTO entries</div>
              )}
            </div>
            <input
              type="text"
              value={editCto}
              onChange={e => {
                setEditCto(e.target.value);
                validateCtoInput(e.target.value);
              }}
              style={{ padding: 8, borderRadius: 6, border: editCtoError ? "1px solid #ef4444" : "1px solid #d1d5db", marginBottom: 4 }}
              placeholder="Enter CTO value"
            />
            {editCtoError && <div style={{ fontSize: 12, color: "#ef4444", marginBottom: 8 }}>{editCtoError}</div>}
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button onClick={closeModal} style={{ padding: "8px 18px", borderRadius: 6, border: "1px solid #d1d5db", background: "#f3f4f6", color: "#374151", fontWeight: 500, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSave} disabled={editEtoError !== null || editCtoError !== null || (editEto === "" && editCto === "")} style={{ padding: "8px 18px", borderRadius: 6, border: "none", background: (editEtoError !== null || editCtoError !== null || (editEto === "" && editCto === "")) ? "#d1d5db" : "#2563eb", color: (editEtoError !== null || editCtoError !== null || (editEto === "" && editCto === "")) ? "#9ca3af" : "#fff", fontWeight: 600, cursor: (editEtoError !== null || editCtoError !== null || (editEto === "" && editCto === "")) ? "not-allowed" : "pointer", opacity: (editEtoError !== null || editCtoError !== null || (editEto === "" && editCto === "")) ? 0.6 : 1 }}>Save</button>
            </div>
          </div>
        </div>
      )}
      {/* In-app delete confirmation modal */}
      {entryToDelete && (
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
          zIndex: 1100,
        }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, minWidth: 300, maxWidth: "90vw", boxShadow: "0 6px 30px rgba(0,0,0,0.12)" }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Delete entry</div>
            <div style={{ color: "#374151", marginBottom: 12 }}>Are you sure you want to delete this entry?</div>
              {deleteError && <div style={{ color: "#b91c1c", marginBottom: 8 }}>{deleteError}</div>}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => { setEntryToDelete(null); setDeleteError(null); }} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db", background: "#f3f4f6", color: "#374151", cursor: "pointer" }}>Cancel</button>
              <button onClick={() => deleteConfirmed()} disabled={deleting} style={{ padding: "8px 12px", borderRadius: 6, border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontWeight: 700 }}>{deleting ? "Deleting…" : "Delete"}</button>
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
        <button onClick={isSingleDayView ? prevDay : prevMonth} style={navBtnStyle} aria-label="Previous">
          ‹
        </button>
        {isSingleDayView && selectedDate ? (
          <div style={{ textAlign: "center", color: "#111827" }}>
            <div style={{ fontSize: "0.95rem", fontWeight: 600 }}>{DAY_NAMES[selectedDate.getDay()]}</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>{`${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`}</div>
          </div>
        ) : (
          <span style={{ fontSize: "1.25rem", fontWeight: 600, color: "#111827" }}>
            {headerDateLabel}
          </span>
        )}
        <button onClick={isSingleDayView ? nextDay : nextMonth} style={navBtnStyle} aria-label="Next">
          ›
        </button>
      </div>



      {/* Day-of-week header and calendar grid - switch to single-day when space is tight */}
      {!isSingleDayView ? (
        <>
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
              const hasEto = !!dayTotals[key]?.hasEto;
              const hasCto = !!dayTotals[key]?.hasCto;
              const dayOfWeek = new Date(year, month, day).getDay();
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday
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
                  {/* ETO/CTO cards - hidden on weekends */}
                  {!isWeekend && (
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
                            transition: "background 0.2s",
                            height: "36px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                      >
                        <div style={{ fontSize: 10, fontWeight: 600, color: "#0f172a", letterSpacing: 1 }}>ETO</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                          {hasEto ? etoVal : "--"}
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
                            transition: "background 0.2s",
                            height: "36px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                      >
                        <div style={{ fontSize: 10, fontWeight: 600, color: "#0f172a", letterSpacing: 1 }}>CTO</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                          {hasCto ? ctoVal : "--"}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Spacer to push button to bottom */}
                  <div style={{ flex: 1 }} />
                  {/* Edit button at bottom - hidden on weekends */}
                  {!isWeekend && (
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
                  )}
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
        </>
      ) : (
  // Single-day compact view styled like a calendar day cell
  <div style={{ backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "0.5rem", overflow: "hidden", display: "flex", justifyContent: "center", padding: "0.75rem" }}>
          {/* Single day card (looks like one of the day cells) */}
          {selectedDate && (() => {
            const d = selectedDate;
            const day = d.getDate();
            const dayOfWeek = d.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const totals = getTotalsForDate(d);
            return (
              <div style={{ ...cellStyle, backgroundColor: "#fff", border: "1px solid #e5e7eb", display: "flex", flexDirection: "column", alignItems: "flex-start", width: 300, height: 400, maxWidth: "96vw", padding: "0.5rem", boxSizing: "border-box" }}>
                {/* ETO/CTO small cards like in month view (no day label inside) - hidden on weekends */}
                {!isWeekend && (
                <div style={{ display: "flex", gap: 8, marginTop: 8, width: "100%", justifyContent: "center" }}>
                  <div
                    style={{
                      flex: "0 0 48%",
                      aspectRatio: "4 / 3",
                      background:
                        totals.ETO > 0
                          ? "#bbf7d0"
                          : totals.ETO < 0
                          ? "#fecaca"
                          : "#f1f5f9",
                      borderRadius: 6,
                      textAlign: "center",
                      border: "1px solid #e5e7eb",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      padding: "4px",
                      boxSizing: "border-box",
                    }}
                  >
                    <div style={{ fontSize: 10, fontWeight: 600, color: "#0f172a", letterSpacing: 1 }}>ETO</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                      {totals.hasEto ? totals.ETO : "--"}
                    </div>
                  </div>
                  <div
                    style={{
                      flex: "0 0 48%",
                      aspectRatio: "4 / 3",
                      background:
                        totals.CTO > 0
                          ? "#bbf7d0"
                          : totals.CTO < 0
                          ? "#fecaca"
                          : "#f1f5f9",
                      borderRadius: 6,
                      textAlign: "center",
                      border: "1px solid #e5e7eb",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      padding: "4px",
                      boxSizing: "border-box",
                    }}
                  >
                    <div style={{ fontSize: 10, fontWeight: 600, color: "#0f172a", letterSpacing: 1 }}>CTO</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                      {totals.hasCto ? totals.CTO : "--"}
                    </div>
                  </div>
                </div>
                )}
                {/* Spacer */}
                <div style={{ flex: 1 }} />
                {/* Edit button - hidden on weekends */}
                {!isWeekend && (
                <button
                  onClick={() => openEditModal(day)}
                  aria-label="Edit day"
                  style={{
                    marginTop: "auto",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f3f4f6",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    padding: "0",
                    height: "48px",
                    cursor: "pointer",
                    color: "#64748b",
                    fontSize: 14,
                    fontWeight: 500,
                    gap: 6,
                    outline: "none"
                  }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ marginRight: 4 }}>
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                  </svg>
                </button>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// Wrap CalendarContent with ToastProvider so consumers can call useToast()
export default CalendarContent;

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
