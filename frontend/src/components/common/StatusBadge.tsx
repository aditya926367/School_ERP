
type StatusBadgeProps = {
  status: string;
  className?: string;
};

export default function StatusBadge({
  status,
  className = "",
}: StatusBadgeProps) {
  const normalized = status.toLowerCase();

  const colorClasses: Record<string, string> = {
    issued: "bg-yellow-100 text-yellow-800",
    returned: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-700",
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
    present: "bg-emerald-100 text-emerald-700",
    absent: "bg-red-100 text-red-700",
    late: "bg-amber-100 text-amber-700",
    leave: "bg-blue-100 text-blue-700",
  };

  const tone =
    colorClasses[normalized] ??
    (["active", "paid", "present", "passed", "completed"].includes(normalized)
      ? "bg-green-50 text-green-700"
      : ["inactive", "absent", "failed"].includes(normalized)
        ? "bg-red-50 text-red-700"
        : ["overdue"].includes(normalized)
          ? "bg-red-100 text-red-800"
          : ["pending", "late", "partial", "partially paid"].includes(normalized)
            ? "bg-amber-50 text-amber-700"
            : "bg-gray-100 text-gray-700");

            const badgeClass =
  colorClasses[normalized] ?? "bg-gray-100 text-gray-600";

  return (
   <span
  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass} ${className}`}
>
  {status}
</span>
  );
}