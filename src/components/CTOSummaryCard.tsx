"use client";

import { useEffect, useState } from "react";

const CTOSummaryCard: React.FC = () => {
  const [ctoTotal, setCtoTotal] = useState<number | string>("--");
  const [ctoLast, setCtoLast] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function fetchCTO() {
      const res = await fetch("/api/time-entries");
      if (!res.ok) return;
      const data = await res.json();
      const entries = data.entries || [];
      const thisYear = new Date().getFullYear();
      let ctoSum = 0;
      let ctoLastDate = null;
      for (const entry of entries) {
        const d = new Date(entry.date);
        if (entry.type !== "CTO" || d.getFullYear() !== thisYear) continue;
        const sign = entry.direction === "EARNED" ? 1 : -1;
        ctoSum += sign * entry.hours;
        if (!ctoLastDate || d > new Date(ctoLastDate)) ctoLastDate = entry.date;
      }
      setCtoTotal(ctoSum);
      setCtoLast(ctoLastDate ? new Date(ctoLastDate).toLocaleDateString() : undefined);
    }
    fetchCTO();
  }, []);

  return (
    <div className="w-[48%] bg-white rounded-xl shadow p-8 flex flex-col justify-center items-center min-h-[200px] border border-zinc-200">
      <div className="flex items-end gap-2 mb-4">
        <h2 className="text-4xl font-bold">CTO:</h2>
        <span className="text-4xl font-extrabold text-black">{ctoTotal}</span>
        <span className="text-2xl text-zinc-600 font-medium">hours</span>
      </div>
      <div className="text-zinc-500 text-sm">Last logged: {ctoLast ?? "--"}</div>
    </div>
  );
};

export default CTOSummaryCard;
