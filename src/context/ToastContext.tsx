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
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
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
              pointerEvents: "auto",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{t.type === "success" ? "Success" : "Error"}</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>{t.message}</div>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                lineHeight: 1,
                marginTop: -2,
              }}
              aria-label="Dismiss"
            >
              ×
            </button>
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
