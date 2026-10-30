// src/store/schoolStore.ts
// School name, address and bank details for challans, bills, payslips and the header.
// The profile is written by the admin School Profile page (same key), accountant pages only read it.
import { useSyncExternalStore } from "react";
import { createStore } from "./createStore";

export type SchoolInfo = {
  schoolName: string;
  schoolCode: string;
  affiliation: string;
  address: string;
  contactNumber: string;
  email: string;
  website: string;
};

const PROFILE_KEY = "schoolProfileInfo_v1"; // same key the admin School Profile page uses

// Nothing is made up here: until the admin fills the School Profile page, every field is empty
export const DEFAULT_SCHOOL: SchoolInfo = {
  schoolName: "",
  schoolCode: "",
  affiliation: "",
  address: "",
  contactNumber: "",
  email: "",
  website: "",
};

// Shown on printed pages while the School Profile is still empty
export const SCHOOL_NAME_MISSING = "School name not set (add it in School Profile)";

// The School Profile page saves straight to localStorage, so we re-read the saved text
// on every snapshot and only build a new object when that text has changed.
let lastRaw: string | null | undefined;
let lastValue: SchoolInfo = DEFAULT_SCHOOL;

export function getSchool(): SchoolInfo {
  let raw: string | null = null;
  try {
    raw = typeof localStorage === "undefined" ? null : localStorage.getItem(PROFILE_KEY);
  } catch {
    raw = null;
  }
  if (raw === lastRaw) return lastValue;
  lastRaw = raw;
  try {
    lastValue = raw ? { ...DEFAULT_SCHOOL, ...(JSON.parse(raw) as Partial<SchoolInfo>) } : DEFAULT_SCHOOL;
  } catch {
    lastValue = DEFAULT_SCHOOL;
  }
  return lastValue;
}

const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === PROFILE_KEY) listeners.forEach((listener) => listener());
  });
}

export const useSchool = () => useSyncExternalStore(subscribe, getSchool);

// Bank details printed on the fee challan (edited on the Fee Challan page)
export type BankDetails = { bankName: string; accountName: string; accountNo: string; ifsc: string };

const bankStore = createStore<BankDetails>(
  "erp_school_bank_v1",
  () => ({ bankName: "", accountName: "", accountNo: "", ifsc: "" }),
  (saved) => (saved && typeof saved === "object" ? (saved as BankDetails) : null),
);

export const useBankDetails = () => bankStore.useState();
