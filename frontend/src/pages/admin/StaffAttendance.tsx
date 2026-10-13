
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Search,
  Download,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  BriefcaseBusiness,
} from "lucide-react";

type Status = "Present" | "Absent" | "Late" | "Leave";
type Staff = {
  id: number;
  employeeId: string;
  name: string;
  role: string;
  department: string;
  status: Status;
};

const initialStaff: Staff[] = [
  { id: 1, employeeId: "EMP1001", name: "Amit Kumar", role: "Mathematics Teacher", department: "Teaching", status: "Present" },
  { id: 2, employeeId: "EMP1002", name: "Neha Singh", role: "English Teacher", department: "Teaching", status: "Present" },
  { id: 3, employeeId: "EMP1003", name: "Rajesh Verma", role: "Accountant", department: "Administration", status: "Late" },
  { id: 4, employeeId: "EMP1004", name: "Pooja Kumari", role: "Office Assistant", department: "Administration", status: "Leave" },
  { id: 5, employeeId: "EMP1005", name: "Sanjay Yadav", role: "Lab Assistant", department: "Support", status: "Absent" },
  { id: 6, employeeId: "EMP1006", name: "Kavita Sharma", role: "Science Teacher", department: "Teaching", status: "Present" },
  { id: 7, employeeId: "EMP1007", name: "Manoj Das", role: "Security", department: "Support", status: "Present" },
];

const statuses: Status[] = ["Present", "Absent", "Late", "Leave"];
const styles: Record<Status, string> = {
  Present: "bg-green-100 text-green-700",
  Absent: "bg-red-100 text-red-700",
  Late: "bg-amber-100 text-amber-700",
  Leave: "bg-blue-100 text-blue-700",
};

function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function StaffAttendance() {
  const [staff, setStaff] = useState(initialStaff);
  const [date, setDate] = useState(getToday());
  const [department, setDepartment] = useState("All");
  const [search, setSearch] = useState("");

  const departments = [...new Set(staff.map((person) => person.department))];

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return staff.filter((person) => {
      const matchesDepartment = department === "All" || person.department === department;
      const matchesSearch = `${person.employeeId} ${person.name} ${person.role}`
        .toLowerCase()
        .includes(query);
      return matchesDepartment && matchesSearch;
    });
  }, [staff, department, search]);

  const present = filtered.filter((person) => person.status === "Present").length;
  const absent = filtered.filter((person) => person.status === "Absent").length;
  const late = filtered.filter((person) => person.status === "Late").length;
  const leave = filtered.filter((person) => person.status === "Leave").length;

  function exportCSV() {
    const rows = [
      ["Date", "Employee ID", "Name", "Role", "Department", "Status"],
      ...filtered.map((person) => [
        date,
        person.employeeId,
        person.name,
        person.role,
        person.department,
        person.status,
      ]),
    ];
    const csv = rows.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `staff-attendance-${date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Attendance</h1>
          <p className="mt-1 text-sm text-gray-500">Manage daily attendance for teachers and school staff.</p>
        </div>
        <button onClick={exportCSV} className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-gray-50">
          <Download size={17} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Present", value: present, icon: <CheckCircle2 size={22} />, color: "bg-green-100 text-green-600" },
          { title: "Absent", value: absent, icon: <XCircle size={22} />, color: "bg-red-100 text-red-600" },
          { title: "Late Arrivals", value: late, icon: <Clock size={22} />, color: "bg-amber-100 text-amber-600" },
          { title: "On Leave", value: leave, icon: <BriefcaseBusiness size={22} />, color: "bg-blue-100 text-blue-600" },
        ].map((item) => (
          <div key={item.title} className="flex items-center justify-between rounded-xl border bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm text-gray-500">{item.title}</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
            <div className={`rounded-xl p-3 ${item.color}`}>{item.icon}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <label className="space-y-1">
            <span className="text-sm font-medium text-gray-700">Attendance Date</span>
            <div className="relative">
              <CalendarDays size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm" />
            </div>
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-gray-700">Department</span>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm">
              <option value="All">All Departments</option>
              {departments.map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-gray-700">Search Staff</span>
            <div className="relative">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, ID, or role..." className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm" />
            </div>
          </label>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-gray-900">Staff Register</h2>
          <p className="mt-1 text-sm text-gray-500">{filtered.length} staff members · {date}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-4">Employee</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Department</th>
                <th className="px-5 py-4">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((person) => (
                <tr key={person.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">{person.name}</p>
                    <p className="mt-1 text-xs text-gray-500">{person.employeeId}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{person.role}</td>
                  <td className="px-5 py-4 text-gray-600">{person.department}</td>
                  <td className="px-5 py-4">
                    <select
                      value={person.status}
                      onChange={(e) => setStaff((current) => current.map((item) => item.id === person.id ? { ...item, status: e.target.value as Status } : item))}
                      className={`rounded-lg border px-3 py-2 text-sm ${styles[person.status]}`}
                    >
                      {statuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-12 text-center text-gray-500"><Users className="mx-auto mb-2" />No staff found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t px-5 py-4 text-xs text-gray-500">
          Demo data only. Attendance edits are not saved to the database.
        </div>
      </div>
    </div>
  );
}
