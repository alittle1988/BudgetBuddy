// src/hooks/usePersistedMonth.js
import { useEffect, useState } from "react";

export function usePersistedMonth() {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    try {
      return (
        localStorage.getItem("selectedMonth") ||
        new Date().toISOString().slice(0, 7)
      );
    } catch {
      return new Date().toISOString().slice(0, 7);
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("selectedMonth", selectedMonth);
    } catch {
      // ignore storage errors
    }
  }, [selectedMonth]);

  return [selectedMonth, setSelectedMonth];
}
