import { useState } from "react";
import { Pencil, X } from "lucide-react";
import { Head, card, inputCls, btn, th, td, inr, netOf, getStaff, saveStructures } from "./payrollShared";
import type { Staff, Structure } from "./payrollShared";

const FIELDS: [keyof Structure, string][] = [
  ["basic", "Basic salary"], ["hra", "House rent allowance"], ["da", "Dearness allowance"],
  ["other", "Other allowance"], ["pf", "PF deduction"], ["tax", "Tax deduction"],
];

export default function SalaryStructure() {
  const [staff, setStaff] = useState<Staff[]>(getStaff);
  const [edit, setEdit] = useState<Staff | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [q, setQ] = useState("");

  const toStructure = () =>
    Object.fromEntries(FIELDS.map(([k]) => [k, Number(form[k]) || 0])) as Structure;

  function open(t: Staff) {
    setEdit(t);
    setForm(Object.fromEntries(FIELDS.map(([k]) => [k, String(Math.round(t.s[k]))])));
  }

  function save() {
    if (!edit) return;
    const next = staff.map((t) => (t.id === edit.id ? { ...t, s: toStructure() } : t));
    setStaff(next);
    saveStructures(Object.fromEntries(next.map((t) => [t.id, t.s])));
    setEdit(null);
  }

  const shown = staff.filter((t) => (t.name + t.id).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      <Head title="Salary Structure" sub="Set basic salary, allowances and deductions for each teacher." />

      <div className={card}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900">Teachers ({shown.length})</h2>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or ID" className={`${inputCls} w-64`} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Teacher", "Designation", "Basic", "Allowances", "Deductions", "Net salary", ""].map((h) => (
                  <th key={h} className={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {shown.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className={td}>
                    <p className="font-medium text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.id}</p>
                  </td>
                  <td className={td}>{t.designation}</td>
                  <td className={td}>{inr(t.s.basic)}</td>
                  <td className={td}>{inr(t.s.hra + t.s.da + t.s.other)}</td>
                  <td className={td}>{inr(t.s.pf + t.s.tax)}</td>
                  <td className={`${td} font-semibold text-gray-900`}>{inr(netOf(t.s))}</td>
                  <td className={td}>
                    <button onClick={() => open(t)} aria-label={`Edit ${t.name}`} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-[#27348b]">
                      <Pencil size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {shown.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-500">No teachers found. Add a teacher first.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Edit salary structure</h3>
                <p className="text-sm text-gray-500">{edit.name} ({edit.id})</p>
              </div>
              <button onClick={() => setEdit(null)} aria-label="Close" className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4">
              {FIELDS.map(([k, label]) => (
                <label key={k} className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                  {label}
                  <input type="number" min={0} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className={inputCls} />
                </label>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
              <span className="text-sm text-gray-600">Net monthly salary</span>
              <span className="text-lg font-bold text-gray-900">{inr(netOf(toStructure()))}</span>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setEdit(null)} className="h-10 rounded-lg border border-gray-200 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={save} className={btn}>Save structure</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}