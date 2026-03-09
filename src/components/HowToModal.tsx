"use client";

import { useEffect } from "react";
import { Trash2 } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function HowToModal({ open, onClose }: Props) {
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative max-w-3xl w-full bg-white rounded-lg shadow-lg border border-zinc-200 p-6">
        <h2 className="text-lg font-semibold mb-4">How to use this tracker</h2>

        <div className="flex flex-col gap-4 text-sm text-zinc-700">
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

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md bg-white text-zinc-700 border border-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
