
"use client";
import { useEffect, useState } from "react";

const ETOSummaryCard: React.FC = () => {
  const [etoTotal, setEtoTotal] = useState<number | string>("--");
  const [etoLast, setEtoLast] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function fetchETO() {
      const res = await fetch("/api/time-entries");
      if (!res.ok) return;
      const data = await res.json();
      const entries = data.entries || [];
      const thisYear = new Date().getFullYear();
      let etoSum = 0;
      let etoLastDate = null;
      for (const entry of entries) {
        const d = new Date(entry.date);
        if (entry.type !== "ETO" || d.getFullYear() !== thisYear) continue;
        const sign = entry.direction === "EARNED" ? 1 : -1;
        etoSum += sign * entry.hours;
        if (!etoLastDate || d > new Date(etoLastDate)) etoLastDate = entry.date;
      }
      setEtoTotal(etoSum);
      setEtoLast(etoLastDate ? new Date(etoLastDate).toLocaleDateString() : undefined);
    }
    fetchETO();
  }, []);

  return (
    <div className="w-[48%] bg-white rounded-xl shadow p-8 flex flex-col justify-center items-center min-h-[200px] border border-zinc-200">
      <div className="flex items-end gap-2 mb-4">
        <h2 className="text-4xl font-bold">ETO:</h2>
        <span className="text-4xl font-extrabold text-black">{etoTotal}</span>
        <span className="text-2xl text-zinc-600 font-medium">hours</span>
      </div>
      <div className="text-zinc-500 text-sm">Last logged: {etoLast ?? "--"}</div>
    </div>
  );
};

export default ETOSummaryCard;
