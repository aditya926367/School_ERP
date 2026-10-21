import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Globe,
  Image as ImageIcon,
  Mail,
  MapPin,
  PenLine,
  Phone,
  Save,
  School,
  Stamp,
  Trash2,
  Upload,
  X,
} from "lucide-react";

type BrandingKey = "logo" | "signature" | "stamp" | "letterhead";

type StoredFile = {
  name: string;
  dataUrl: string;
  type: string;
  size: number;
};

type BrandingFiles = Record<BrandingKey, StoredFile | null>;

type SchoolForm = {
  schoolName: string;
  schoolCode: string;
  affiliation: string;
  address: string;
  contactNumber: string;
  email: string;
  website: string;
};

const PROFILE_STORAGE_KEY = "schoolProfileInfo_v1";
const BRANDING_DB_NAME = "schoolProfileBrandingDB";
const BRANDING_STORE_NAME = "brandingFiles";

const DEFAULT_PROFILE: SchoolForm = {
  schoolName: "Delhi Public School",
  schoolCode: "DPS-RKP",
  affiliation: "CBSE",
  address: "R. K. Puram, New Delhi, Delhi - 110022",
  contactNumber: "+91 11 1234 5678",
  email: "info@school.edu.in",
  website: "https://www.school.edu.in",
};

const EMPTY_BRANDING: BrandingFiles = {
  logo: null,
  signature: null,
  stamp: null,
  letterhead: null,
};

const BRANDING_LABELS: Record<BrandingKey, string> = {
  logo: "School logo",
  signature: "Authorized signature",
  stamp: "School stamp",
  letterhead: "Official letterhead",
};

function openBrandingDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("This browser does not support persistent file storage."));
      return;
    }

    const request = indexedDB.open(BRANDING_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(BRANDING_STORE_NAME)) {
        db.createObjectStore(BRANDING_STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open file storage."));
  });
}

async function getStoredBranding(): Promise<BrandingFiles> {
  const db = await openBrandingDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(BRANDING_STORE_NAME, "readonly");
    const store = transaction.objectStore(BRANDING_STORE_NAME);
    const result: BrandingFiles = { ...EMPTY_BRANDING };
    const keys: BrandingKey[] = ["logo", "signature", "stamp", "letterhead"];
    let completed = 0;

    keys.forEach((key) => {
      const request = store.get(key);
      request.onsuccess = () => {
        result[key] = (request.result as StoredFile | undefined) ?? null;
        completed += 1;
        if (completed === keys.length) resolve(result);
      };
      request.onerror = () => reject(request.error ?? new Error("Could not load saved files."));
    });
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => reject(transaction.error ?? new Error("Could not read saved files."));
  });
}

async function putStoredBranding(key: BrandingKey, file: StoredFile): Promise<void> {
  const db = await openBrandingDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(BRANDING_STORE_NAME, "readwrite");
    transaction.objectStore(BRANDING_STORE_NAME).put(file, key);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error ?? new Error("Could not save the file."));
    };
    transaction.onabort = () => {
      db.close();
      reject(transaction.error ?? new Error("File save was cancelled."));
    };
  });
}

async function deleteStoredBranding(key: BrandingKey): Promise<void> {
  const db = await openBrandingDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(BRANDING_STORE_NAME, "readwrite");
    transaction.objectStore(BRANDING_STORE_NAME).delete(key);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error ?? new Error("Could not remove the file."));
    };
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("The selected file could not be read."));
    };
    reader.onerror = () => reject(new Error("Failed to read the selected file."));
    reader.readAsDataURL(file);
  });
}

function BrandingCard({
  fileKey,
  title,
  description,
  accept,
  file,
  inputRef,
  onFileChange,
  onRemove,
  onChoose,
}: {
  fileKey: BrandingKey;
  title: string;
  description: string;
  accept: string;
  file: StoredFile | null;
  inputRef: (element: HTMLInputElement | null) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onChoose: () => void;
}) {
  const isPdf = file?.type === "application/pdf";

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onFileChange}
        aria-label={`Choose ${title.toLowerCase()}`}
      />
      <div className="mb-4 flex items-center justify-center gap-3">
        <div className="rounded-lg bg-[#27348b]/10 p-2 text-[#27348b]">
          {fileKey === "logo" ? <ImageIcon size={20} /> : null}
          {fileKey === "signature" ? <PenLine size={20} /> : null}
          {fileKey === "stamp" ? <Stamp size={20} /> : null}
          {fileKey === "letterhead" ? <FileText size={20} /> : null}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          <p className="mt-1 text-xs text-gray-500">{description}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onChoose}
        className="flex h-40 w-full flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-3 text-center transition hover:border-[#27348b] hover:bg-[#27348b]/5 focus:outline-none focus:ring-2 focus:ring-[#27348b]/30"
        aria-label={file ? `Replace ${title.toLowerCase()} by choosing another file` : `Upload ${title.toLowerCase()}`}
      >
        {file ? (
          isPdf ? (
            <>
              <FileText size={40} className="text-[#27348b]" />
              <span className="mt-2 max-w-full truncate text-xs font-medium text-gray-700">{file.name}</span>
              <span className="mt-1 text-xs text-gray-500">Click to replace</span>
            </>
          ) : (
            <>
              <img src={file.dataUrl} alt={title} className="max-h-28 max-w-full object-contain" />
              <span className="mt-2 max-w-full truncate text-xs text-gray-600">{file.name}</span>
            </>
          )
        ) : (
          <>
            <Upload size={28} className="mb-2 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Click to upload</span>
            <span className="mt-1 text-xs text-gray-500">PNG, JPG, WebP or SVG · Max 2 MB</span>
          </>
        )}
      </button>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={onChoose}
          className="flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-[#27348b] px-3 py-2 text-sm font-medium text-[#27348b] transition hover:bg-[#27348b]/5 focus:outline-none focus:ring-2 focus:ring-[#27348b]/30"
        >
          <Upload size={16} /> {file ? "Replace file" : "Choose file"}
        </button>
        {file ? (
          <button
            type="button"
            onClick={onRemove}
            className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
            aria-label={`Remove ${title.toLowerCase()}`}
          >
            <Trash2 size={16} /> Remove
          </button>
        ) : null}
      </div>
      {file ? (
        <p className="mt-2 break-all text-xs text-gray-500">
          {(file.size / 1024).toFixed(0)} KB · {file.name}
          {isPdf ? (
            <a
              href={file.dataUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="ml-2 font-medium text-[#27348b] underline"
            >
              Open PDF
            </a>
          ) : null}
        </p>
      ) : null}
    </section>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

const inputClassName =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-[#27348b] focus:ring-2 focus:ring-[#27348b]/10";

export default function SchoolProfile() {
  const [form, setForm] = useState<SchoolForm>(DEFAULT_PROFILE);
  const [branding, setBranding] = useState<BrandingFiles>(EMPTY_BRANDING);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRefs = useRef<Record<BrandingKey, HTMLInputElement | null>>({
    logo: null,
    signature: null,
    stamp: null,
    letterhead: null,
  });

  useEffect(() => {
    let isMounted = true;

    const loadSavedData = async () => {
      try {
        const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile) as Partial<SchoolForm>;
          if (isMounted) setForm({ ...DEFAULT_PROFILE, ...parsed });
        }

        const savedBranding = await getStoredBranding();
        if (isMounted) setBranding(savedBranding);
      } catch (error) {
        console.error("Could not load School Profile data:", error);
        if (isMounted) {
          setErrorMessage("Saved data could not be loaded. Your browser storage may be unavailable.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadSavedData();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateField = <K extends keyof SchoolForm>(key: K, value: SchoolForm[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setSuccessMessage("");
  };

  const handleUpload = async (key: BrandingKey, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setErrorMessage("");
    setSuccessMessage("");

    const isLetterhead = key === "letterhead";
    const maxSizeBytes = (isLetterhead ? 5 : 2) * 1024 * 1024;
    const allowedTypes =
      key === "logo"
        ? ["image/png", "image/jpeg", "image/webp", "image/svg+xml"]
        : isLetterhead
          ? ["application/pdf", "image/png", "image/jpeg", "image/webp"]
          : ["image/png", "image/jpeg", "image/webp"];

    try {
      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          `Invalid file format for ${BRANDING_LABELS[key]}. Allowed: ${
            key === "logo" ? "PNG, JPG, WebP or SVG" : isLetterhead ? "PDF, PNG, JPG or WebP" : "PNG, JPG or WebP"
          }.`,
        );
      }
      if (file.size === 0) throw new Error("The selected file is empty.");
      if (file.size > maxSizeBytes) {
        throw new Error(`File is too large. Maximum size for ${BRANDING_LABELS[key].toLowerCase()} is ${isLetterhead ? "5 MB" : "2 MB"}.`);
      }

      const dataUrl = await readFileAsDataUrl(file);
      const uploadedFile: StoredFile = {
        name: file.name,
        dataUrl,
        type: file.type,
        size: file.size,
      };

      await putStoredBranding(key, uploadedFile);
      setBranding((previous) => ({ ...previous, [key]: uploadedFile }));
      setSuccessMessage(`${BRANDING_LABELS[key]} uploaded and saved in this browser.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "The file could not be uploaded.";
      setErrorMessage(message);
    } finally {
      // Clearing the input allows the same file to be selected again.
      event.target.value = "";
    }
  };

  const removeUpload = async (key: BrandingKey) => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await deleteStoredBranding(key);
      setBranding((previous) => ({ ...previous, [key]: null }));
      setSuccessMessage(`${BRANDING_LABELS[key]} removed.`);
    } catch (error) {
      console.error("Could not remove branding file:", error);
      setErrorMessage(`Could not remove ${BRANDING_LABELS[key].toLowerCase()}. Please try again.`);
    }
  };

  const triggerPicker = (key: BrandingKey) => {
    fileInputRefs.current[key]?.click();
  };

  const saveChanges = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!form.schoolName.trim()) {
      setErrorMessage("School name is required.");
      return;
    }
    if (!form.schoolCode.trim()) {
      setErrorMessage("School code is required.");
      return;
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (form.website.trim()) {
      try {
        const url = new URL(form.website.trim());
        if (!["http:", "https:"].includes(url.protocol)) throw new Error("Invalid protocol");
      } catch {
        setErrorMessage("Please enter a valid website URL beginning with https:// or http://.");
        return;
      }
    }

    setIsSaving(true);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(form));
      setSuccessMessage("School profile saved successfully in this browser.");
    } catch (error) {
      console.error("Could not save School Profile:", error);
      setErrorMessage("Could not save school information. Check browser storage and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center text-sm text-gray-500" role="status">
        Loading school profile…
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">School Profile</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your school information and official branding.</p>
      </div>

      {errorMessage ? (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          <div className="flex items-start gap-2">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button type="button" onClick={() => setErrorMessage("")} className="rounded p-1 hover:bg-red-100" aria-label="Dismiss error">
            <X size={16} />
          </button>
        </div>
      ) : null}

      {successMessage ? (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800" role="status">
          <div className="flex items-start gap-2">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button type="button" onClick={() => setSuccessMessage("")} className="rounded p-1 hover:bg-green-100" aria-label="Dismiss success message">
            <X size={16} />
          </button>
        </div>
      ) : null}

      <form onSubmit={saveChanges} noValidate>
        <section className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#27348b]/10 text-[#27348b]">
              <School size={21} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">School Information</h2>
              <p className="text-sm text-gray-500">Basic details about your school</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
            <Field label="School Name" className="md:col-span-2">
              <input className={inputClassName} value={form.schoolName} onChange={(e) => updateField("schoolName", e.target.value)} required autoComplete="organization" />
            </Field>
            <Field label="School Code">
              <input className={inputClassName} value={form.schoolCode} onChange={(e) => updateField("schoolCode", e.target.value)} required />
            </Field>
            <Field label="Board / Affiliation">
              <select className={inputClassName} value={form.affiliation} onChange={(e) => updateField("affiliation", e.target.value)}>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="State Board">State Board</option>
                <option value="IB">IB</option>
                <option value="Other">Other</option>
              </select>
            </Field>
            <Field label="Address" className="md:col-span-2">
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                <textarea className={`${inputClassName} resize-y pl-9`} rows={3} value={form.address} onChange={(e) => updateField("address", e.target.value)} autoComplete="street-address" />
              </div>
            </Field>
            <Field label="Contact Number">
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
                <input className={`${inputClassName} pl-9`} type="tel" value={form.contactNumber} onChange={(e) => updateField("contactNumber", e.target.value)} autoComplete="tel" />
              </div>
            </Field>
            <Field label="Email Address">
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                <input className={`${inputClassName} pl-9`} type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} autoComplete="email" />
              </div>
            </Field>
            <Field label="Website" className="md:col-span-2">
              <div className="relative">
                <Globe size={16} className="absolute left-3 top-3 text-gray-400" />
                <input className={`${inputClassName} pl-9`} type="url" value={form.website} onChange={(e) => updateField("website", e.target.value)} placeholder="https://example.com" autoComplete="url" />
              </div>
            </Field>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#27348b]/10 text-[#27348b]">
              <ImageIcon size={21} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">School Branding</h2>
              <p className="text-sm text-gray-500">Upload the official logo, signature, stamp and letterhead</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
            <BrandingCard
              fileKey="logo"
              title="School Logo"
              
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              file={branding.logo}
              inputRef={(element) => { fileInputRefs.current.logo = element; }}
              onFileChange={(event) => void handleUpload("logo", event)}
              onRemove={() => void removeUpload("logo")}
              onChoose={() => triggerPicker("logo")}
            />
            <BrandingCard
              fileKey="signature"
              title="Authorized Signature"
              accept="image/png,image/jpeg,image/webp"
              file={branding.signature}
              inputRef={(element) => { fileInputRefs.current.signature = element; }}
              onFileChange={(event) => void handleUpload("signature", event)}
              onRemove={() => void removeUpload("signature")}
              onChoose={() => triggerPicker("signature")}
            />
            <BrandingCard
              fileKey="stamp"
              title="School Stamp"
              accept="image/png,image/jpeg,image/webp"
              file={branding.stamp}
              inputRef={(element) => { fileInputRefs.current.stamp = element; }}
              onFileChange={(event) => void handleUpload("stamp", event)}
              onRemove={() => void removeUpload("stamp")}
              onChoose={() => triggerPicker("stamp")}
            />
            <BrandingCard
              fileKey="letterhead"
              title="Official Letterhead"
              accept="application/pdf,image/png,image/jpeg,image/webp"
              file={branding.letterhead}
              inputRef={(element) => { fileInputRefs.current.letterhead = element; }}
              onFileChange={(event) => void handleUpload("letterhead", event)}
              onRemove={() => void removeUpload("letterhead")}
              onChoose={() => triggerPicker("letterhead")}
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#27348b] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1f2a70] focus:outline-none focus:ring-2 focus:ring-[#27348b]/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} /> {isSaving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}
