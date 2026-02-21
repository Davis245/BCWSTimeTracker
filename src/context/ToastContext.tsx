"use client";
import React, { createContext, useCallback, useContext, useState } from "react";

type Toast = { id: number; type: "success" | "error"; message: string };

type ToastContextType = {
  showToast: (type: Toast["type"], message: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: Toast["type"], message: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const t: Toast = { id, type, message };
    setToasts((prev) => [...prev, t]);
    // auto-dismiss
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 1200, display: "flex", flexDirection: "column", gap: 8 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            aria-live="polite"
            style={{
              minWidth: 220,
              maxWidth: 360,
              padding: "10px 14px",
              borderRadius: 8,
              color: "#fff",
              boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
              background: t.type === "success" ? "#16a34a" : "#b91c1c",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700 }}>{t.type === "success" ? "Success" : "Error"}</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
