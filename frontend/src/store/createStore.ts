// src/store/createStore.ts
// A tiny shared store that keeps its data in localStorage.
// Every store file (students, teachers, fees...) is built with this helper.
import { useSyncExternalStore } from "react";

export type Updater<T> = T | ((previous: T) => T);

export function createStore<T>(key: string, seed: () => T, normalize?: (saved: unknown) => T | null) {
  const hasStorage = typeof localStorage !== "undefined";

  function load(): T {
    try {
      const raw = hasStorage ? localStorage.getItem(key) : null;
      if (raw) {
        const saved = JSON.parse(raw) as unknown;
        const value = normalize ? normalize(saved) : (saved as T);
        if (value !== null && value !== undefined) return value;
      }
    } catch {
      // If saved JSON is invalid or storage is unavailable, use the store’s empty initial state.
    }
    return seed();
  }

  let state: T = load();
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((listener) => listener());

  function set(next: Updater<T>) {
    state = typeof next === "function" ? (next as (previous: T) => T)(state) : next;
    try {
      if (hasStorage) localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Storage full: the data stays in memory for this visit.
    }
    emit();
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  // Keep other browser tabs in sync
  if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
      if (event.key === key) {
        state = load();
        emit();
      }
    });
  }

  return {
    get: () => state,
    set,
    subscribe,
    reset: () => set(seed()),
    useValue: () => useSyncExternalStore(subscribe, () => state),
    // Same shape as useState, so a page can switch with one line
    useState: (): [T, (next: Updater<T>) => void] => [useSyncExternalStore(subscribe, () => state), set],
  };
}