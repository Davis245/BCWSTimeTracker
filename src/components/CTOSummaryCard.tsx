import React from "react";

interface CTOSummaryCardProps {
  cto: number | string;
  lastLogged?: string;
}

const CTOSummaryCard: React.FC<CTOSummaryCardProps> = ({ cto, lastLogged }) => (
  <div className="w-[48%] bg-white rounded-xl shadow p-8 flex flex-col justify-center items-center min-h-[200px] border border-zinc-200">
    <div className="flex items-end gap-2 mb-4">
      <h2 className="text-4xl font-bold">CTO:</h2>
      <span className="text-4xl font-extrabold text-black">{cto}</span>
      <span className="text-2xl text-zinc-600 font-medium">hours</span>
    </div>
    <div className="text-zinc-500 text-sm">Last logged: {lastLogged ?? "--"}</div>
  </div>
);

export default CTOSummaryCard;
