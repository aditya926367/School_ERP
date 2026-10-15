import type { ReactNode } from "react";

type PageHeaderProps = {
  breadcrumb?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export default function PageHeader({
  breadcrumb,
  title,
  description,
  actions,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`flex flex-col justify-between gap-4 sm:flex-row sm:items-center ${className}`}>
      <div>
        {breadcrumb && <p className="text-sm text-gray-500">{breadcrumb}</p>}
        <h1 className="mt-1 text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2 print:hidden">{actions}</div>}
    </div>
  );
}
