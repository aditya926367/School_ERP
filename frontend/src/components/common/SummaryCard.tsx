import type { ReactNode } from "react";

type SummaryCardProps = {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  iconClassName?: string;
  iconBackgroundClassName?: string;
  className?: string;
};

export default function SummaryCard({
  label,
  value,
  icon,
  iconClassName = "text-blue-600",
  iconBackgroundClassName = "bg-blue-50",
  className = "",
}: SummaryCardProps) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        {icon && <div className={`rounded-lg p-3 ${iconBackgroundClassName} ${iconClassName}`}>{icon}</div>}
      </div>
    </div>
  );
}
