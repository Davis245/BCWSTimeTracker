"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface TimeEntryRefreshContextType {
  refreshKey: number;
  triggerRefresh: () => void;
}

const TimeEntryRefreshContext = createContext<TimeEntryRefreshContextType | undefined>(undefined);

export function useTimeEntryRefresh() {
  const ctx = useContext(TimeEntryRefreshContext);
  if (!ctx) throw new Error("useTimeEntryRefresh must be used within a TimeEntryRefreshProvider");
  return ctx;
}

export function TimeEntryRefreshProvider({ children }: { children: ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey(k => k + 1);
  return (
    <TimeEntryRefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </TimeEntryRefreshContext.Provider>
  );
}
