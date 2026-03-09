"use client";

import { useEffect, useRef } from "react";
import { Trash2, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function HowToModal({ open, onClose }: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrollTimeout = useRef<number | null>(null);
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Reveal the scrollbar thumb while the user is actively scrolling (wheel/trackpad)
  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;

    function onScroll() {
      const target = scrollRef.current;
      if (!target) return;
      target.classList.add("scrolling");
      if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
      scrollTimeout.current = window.setTimeout(() => {
        const t = scrollRef.current;
        if (t) t.classList.remove("scrolling");
        scrollTimeout.current = null;
      }, 700) as unknown as number;
    }

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
      scrollTimeout.current = null;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative max-w-3xl w-full bg-white rounded-lg shadow-lg border border-zinc-200">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 inline-flex items-center justify-center rounded-md bg-white text-zinc-700 border border-zinc-200 p-1 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">How to use this tracker</h2>
          <hr className="border-t border-zinc-200 mb-4" />

          {/* Make the central content scrollable when it grows too tall (3px thin scrollbar; auto-hide when idle) */}
          <style>{`.howto-scroll { -ms-overflow-style: auto; scrollbar-width: thin; /* default hidden */ scrollbar-color: transparent transparent; direction: ltr; } .howto-scroll.scrolling { scrollbar-color: rgba(15,23,42,0.35) transparent; } .howto-scroll::-webkit-scrollbar { width: 1px; height: 1px; } .howto-scroll::-webkit-scrollbar-track { background: transparent; } .howto-scroll::-webkit-scrollbar-thumb { background-color: rgba(15,23,42,0.35); border-radius: 9999px; border: 1px solid rgba(255,255,255,0.06); opacity: 0; transition: opacity .18s ease; } .howto-scroll.scrolling::-webkit-scrollbar-thumb { opacity: 1; }`}</style>
          <div ref={scrollRef} className="overflow-auto max-h-[65vh] howto-scroll">
            <div className="flex flex-col gap-4 text-sm text-zinc-700 pr-4">
          {/* Compartment: ETO — Leave */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div>
              <h3 className="font-medium">ETO — Leave</h3>
              <div className="mt-2 rounded-lg overflow-hidden border border-zinc-200 shadow-sm">
                {/* header */}
                <div className="bg-zinc-200 px-4 py-2 flex items-center justify-between">
                  <div className="text-sm text-zinc-800">— Start Time: 08:00&nbsp;&nbsp; Stop Time: 17:00</div>
                  <div className="text-zinc-700">
                    <button aria-label="Delete diary entry" className="p-1 rounded hover:bg-zinc-300">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  </div>

                {/* body */}
                <div className="bg-white p-4">
                  <div className="mb-4">
                    <div className="text-sm text-zinc-700 mb-2">Did you work or take leave during this period?</div>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 text-sm text-zinc-700">
                        <span className="inline-block w-4 h-4 rounded-full border border-zinc-400" />
                        Work
                      </label>
                      <label className="flex items-center gap-2 text-sm text-zinc-700">
                        <span className="inline-block w-4 h-4 rounded-full border border-amber-400 bg-amber-100 ring-2 ring-amber-200" />
                        Leave
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-zinc-500">Start Time *</div>
                      <div className="text-lg font-medium">08:00</div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500">Stop Time *</div>
                      <div className="text-lg font-medium">17:00</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs text-zinc-500">What type of leave did you take? *</div>
                    <div className="mt-2 border-b border-zinc-300 text-sm text-zinc-800">ETO Leave Taken</div>
                  </div>

                  <div>
                    <div className="text-sm text-zinc-700 mb-2">Did you take your lunch break during this period?</div>
                    <div className="flex items-center gap-6 mb-3">
                      <label className="flex items-center gap-2 text-sm text-zinc-700">
                        <span className="inline-block w-4 h-4 rounded-full border border-amber-400 bg-amber-100 ring-2 ring-amber-200" />
                        Yes
                      </label>
                      <label className="flex items-center gap-2 text-sm text-zinc-700">
                        <span className="inline-block w-4 h-4 rounded-full border border-zinc-400" />
                        No
                      </label>
                    </div>

                    <div className="text-xs text-zinc-500">Lunch Break (Minutes) *</div>
                    <div className="text-lg font-medium">30</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium">How to record ETO leave</h3>
              <div className="mt-2">
                - Open the calendar and click the date (e.g., Mar 15).
                <br />- Choose "ETO" and select duration (half day/full day).
                <br />- Add a short note explaining reason.
                <br />- Save; the summary card will update.
              </div>
            </div>
          </div>
          <hr className="border-t border-zinc-200" />

          {/* Compartment: ETO — Earning */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div>
              <h3 className="font-medium">ETO — Earning</h3>
              <div className="mt-2 bg-zinc-50 rounded p-3 text-xs text-zinc-600">
                Mar 18, 2026
                <div className="mt-1">• Worked extra 2 hours; flagged as ETO earning.</div>
                <div className="mt-1">• Note: Overtime recorded.</div>
              </div>
            </div>
            <div>
              <h3 className="font-medium">How to record earning ETO</h3>
              <div className="mt-2">
                - Click the date you worked extra (e.g., Mar 18).
                <br />- Choose "ETO (earn)" or select "Add hours earned".
                <br />- Enter hours and an explanatory note.
                <br />- Save to increase your ETO balance.
              </div>
            </div>
          </div>
          <hr className="border-t border-zinc-200" />

          {/* Compartment: CTO — Leave */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div>
              <h3 className="font-medium">CTO — Leave</h3>
              <div className="mt-2 space-y-4">
                {/* First card: 08:00 - 15:30 FS CTO Taken */}
                <div className="rounded-lg overflow-hidden border border-zinc-200 shadow-sm">
                  <div className="bg-zinc-200 px-4 py-2 flex items-center justify-between">
                    <div className="text-sm text-zinc-800">— Start Time: 08:00&nbsp;&nbsp; Stop Time: 15:30</div>
                    <div className="text-zinc-700">
                      <button aria-label="Delete diary entry" className="p-1 rounded hover:bg-zinc-300">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-white p-4">
                    <div className="mb-4">
                      <div className="text-sm text-zinc-700 mb-2">Did you work or take leave during this period?</div>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 text-sm text-zinc-700">
                          <span className="inline-block w-4 h-4 rounded-full border border-zinc-400" />
                          Work
                        </label>
                        <label className="flex items-center gap-2 text-sm text-zinc-700">
                          <span className="inline-block w-4 h-4 rounded-full border border-amber-400 bg-amber-100 ring-2 ring-amber-200" />
                          Leave
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-zinc-500">Start Time *</div>
                        <div className="text-lg font-medium">08:00</div>
                      </div>
                      <div>
                        <div className="text-xs text-zinc-500">Stop Time *</div>
                        <div className="text-lg font-medium">15:30</div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-xs text-zinc-500">What type of leave did you take? *</div>
                      <div className="mt-2 border-b border-zinc-300 text-sm text-zinc-800">FS CTO Taken</div>
                    </div>
                    <div>
                      <div className="text-sm text-zinc-700 mb-2">Did you take your lunch break during this period?</div>
                      <div className="flex items-center gap-6 mb-3">
                        <label className="flex items-center gap-2 text-sm text-zinc-700">
                          <span className="inline-block w-4 h-4 rounded-full border border-amber-400 bg-amber-100 ring-2 ring-amber-200" />
                          Yes
                        </label>
                        <label className="flex items-center gap-2 text-sm text-zinc-700">
                          <span className="inline-block w-4 h-4 rounded-full border border-zinc-400" />
                          No
                        </label>
                      </div>
                      <div className="text-xs text-zinc-500">Lunch Break (Minutes) *</div>
                      <div className="text-lg font-medium">30</div>
                    </div>
                  </div>
                </div>

                {/* Second card: 15:30 - 17:00 ETO Leave Taken */}
                <div className="rounded-lg overflow-hidden border border-zinc-200 shadow-sm">
                  <div className="bg-zinc-200 px-4 py-2 flex items-center justify-between">
                    <div className="text-sm text-zinc-800">— Start Time: 15:30&nbsp;&nbsp; Stop Time: 17:00</div>
                    <div className="text-zinc-700">
                      <button aria-label="Delete diary entry" className="p-1 rounded hover:bg-zinc-300">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-white p-4">
                    <div className="mb-4">
                      <div className="text-sm text-zinc-700 mb-2">Did you work or take leave during this period?</div>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 text-sm text-zinc-700">
                          <span className="inline-block w-4 h-4 rounded-full border border-zinc-400" />
                          Work
                        </label>
                        <label className="flex items-center gap-2 text-sm text-zinc-700">
                          <span className="inline-block w-4 h-4 rounded-full border border-amber-400 bg-amber-100 ring-2 ring-amber-200" />
                          Leave
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-zinc-500">Start Time *</div>
                        <div className="text-lg font-medium">15:30</div>
                      </div>
                      <div>
                        <div className="text-xs text-zinc-500">Stop Time *</div>
                        <div className="text-lg font-medium">17:00</div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-xs text-zinc-500">What type of leave did you take? *</div>
                      <div className="mt-2 border-b border-zinc-300 text-sm text-zinc-800">ETO Leave Taken</div>
                    </div>
                    <div>
                      <div className="text-sm text-zinc-700 mb-2">Did you take your lunch break during this period?</div>
                      <div className="flex items-center gap-6 mb-3">
                        <label className="flex items-center gap-2 text-sm text-zinc-700">
                          <span className="inline-block w-4 h-4 rounded-full border border-amber-400 bg-amber-100 ring-2 ring-amber-200" />
                          Yes
                        </label>
                        <label className="flex items-center gap-2 text-sm text-zinc-700">
                          <span className="inline-block w-4 h-4 rounded-full border border-zinc-400" />
                          No
                        </label>
                      </div>
                      <div className="text-xs text-zinc-500">Lunch Break (Minutes) *</div>
                      <div className="text-lg font-medium">30</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium">How to record CTO leave</h3>
              <div className="mt-2">
                - Select the date (e.g., Mar 22).
                <br />- Choose "CTO" and set the length.
                <br />- Optionally add a note and submit.
                <br />- CTO used will be deducted from CTO balance.
              </div>

              {/* Exact calendar date-card copy (hard-coded day 1) */}
              <div className="mt-3">
                <div className="flex items-center gap-3">
                  {/* Existing negative CTO card (left) */}
                  <div className="rounded-lg overflow-hidden border border-zinc-200 shadow-sm" style={{ width: 144, aspectRatio: "2 / 3" }}>
                    <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "0.5rem", boxSizing: "border-box", height: "100%" }}>
                      <span style={{ fontSize: "1rem", fontWeight: 400, color: "#374151" }}>1</span>

                      <div style={{ display: "flex", gap: 4, marginTop: 8, width: "100%" }}>
                        <div style={{ flex: 1, background: "#f1f5f9", borderRadius: 6, padding: "2px 0", textAlign: "center", marginRight: 2, border: "1px solid #e5e7eb", transition: "background 0.2s", height: "36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                          <div style={{ fontSize: 10, fontWeight: 600, color: "#0f172a", letterSpacing: 1 }}>ETO</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{"--"}</div>
                        </div>
                        <div style={{ flex: 1, background: "#fecaca", borderRadius: 6, padding: "2px 0", textAlign: "center", marginLeft: 2, border: "1px solid #e5e7eb", transition: "background 0.2s", height: "36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                          <div style={{ fontSize: 10, fontWeight: 600, color: "#0f172a", letterSpacing: 1 }}>CTO</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{"-7"}</div>
                        </div>
                      </div>

                      <div style={{ flex: 1 }} />

                      <button style={{ marginTop: "auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 6, padding: "4px 0", cursor: "pointer", color: "#64748b", fontSize: 14, fontWeight: 500, gap: 6, outline: "none" }} aria-label="Edit day">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ marginRight: 4 }}>
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Plus button */}
                  <div className="flex items-center justify-center">
                    <button aria-label="Add" className="w-10 h-10 rounded-md bg-white text-zinc-600 flex items-center justify-center hover:bg-zinc-50">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14"></path>
                        <path d="M5 12h14"></path>
                      </svg>
                    </button>
                  </div>

                  {/* Neutral card (right) */}
                  <div className="rounded-lg overflow-hidden border border-zinc-200 shadow-sm" style={{ width: 144, aspectRatio: "2 / 3" }}>
                    <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "0.5rem", boxSizing: "border-box", height: "100%" }}>
                      <span style={{ fontSize: "1rem", fontWeight: 400, color: "#374151" }}>1</span>

                      <div style={{ display: "flex", gap: 4, marginTop: 8, width: "100%" }}>
                        <div style={{ flex: 1, background: "#f1f5f9", borderRadius: 6, padding: "2px 0", textAlign: "center", marginRight: 2, border: "1px solid #e5e7eb", transition: "background 0.2s", height: "36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                          <div style={{ fontSize: 10, fontWeight: 600, color: "#0f172a", letterSpacing: 1 }}>ETO</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{"--"}</div>
                        </div>
                        <div style={{ flex: 1, background: "#f1f5f9", borderRadius: 6, padding: "2px 0", textAlign: "center", marginLeft: 2, border: "1px solid #e5e7eb", transition: "background 0.2s", height: "36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                          <div style={{ fontSize: 10, fontWeight: 600, color: "#0f172a", letterSpacing: 1 }}>CTO</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{"--"}</div>
                        </div>
                      </div>

                      <div style={{ flex: 1 }} />

                      <button style={{ marginTop: "auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 6, padding: "4px 0", cursor: "pointer", color: "#64748b", fontSize: 14, fontWeight: 500, gap: 6, outline: "none" }} aria-label="Edit day">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ marginRight: 4 }}>
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          

          <hr className="border-t border-zinc-200" />

          {/* Compartment: CTO — Earning */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div>
              <h3 className="font-medium">CTO — Earning</h3>
              <div className="mt-2 bg-zinc-50 rounded p-3 text-xs text-zinc-600">
                Mar 25, 2026
                <div className="mt-1">• Completed weekend on-call; 4 hours CTO earned.</div>
                <div className="mt-1">• Note: Manager approved.</div>
              </div>
            </div>
            <div>
              <h3 className="font-medium">How to record earning CTO</h3>
              <div className="mt-2">
                - When you earn CTO (e.g., on-call time), click the date you earned it.
                <br />- Choose "CTO (earn)" and enter earned hours.
                <br />- Add a note for audit purposes and save.
              </div>
            </div>
          </div>
          </div>
        </div>
        </div>

        
      </div>
    </div>
  );
}
