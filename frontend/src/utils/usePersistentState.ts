import { useEffect, useState } from "react";

/** JSON-backed state for browser-only demos. Data survives refresh in this browser. */
export function usePersistentState<T>(key: string, initialValue: T): [T, (value: T | ((previous: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? initialValue : (JSON.parse(raw) as T);
    } catch { return initialValue; }
  });
  useEffect(() => {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable/full */ }
  }, [key, value]);
  return [value, setValue];
}
