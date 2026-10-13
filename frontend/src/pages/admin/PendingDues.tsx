
import FinanceModule from "./FinanceModule";
import type { FinanceConfig } from "./FinanceModule";

const config: FinanceConfig = {
  title: "Pending Dues",
  description: "Identify outstanding student fees and follow up on payments.",
  searchPlaceholder: "Search student or class...",
  columns: ["Student ID", "Student", "Class / Due Date"],
  rows: [
    { id: "STU1001", name: "Aarav Sharma", detail: "Class 10 / 2026-10-20", amount: 15000, status: "Pending" },
    { id: "STU1002", name: "Priya Verma", detail: "Class 10 / 2026-10-25", amount: 8000, status: "Pending" },
    { id: "STU1003", name: "Rahul Kumar", detail: "Class 9 / 2026-10-15", amount: 12000, status: "Overdue" },
    { id: "STU1004", name: "Ananya Singh", detail: "Class 8 / 2026-10-30", amount: 5000, status: "Pending" },
  ],
};

export default function PendingDues() {
  return <FinanceModule config={config} />;
}
