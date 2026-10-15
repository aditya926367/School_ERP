import type { ReactNode } from "react";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  rowKey: (row: T) => string | number;
  emptyState?: ReactNode;
  tableClassName?: string;
  rowClassName?: string;
};

export default function DataTable<T>({
  data,
  columns,
  rowKey,
  emptyState,
  tableClassName = "",
  rowClassName = "hover:bg-gray-50",
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-left ${tableClassName}`}>
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 ${column.className ?? ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row) => (
            <tr key={rowKey(row)} className={rowClassName}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-5 py-4 ${column.className ?? ""}`}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-5 py-12 text-center">
                {emptyState ?? <p className="text-sm text-gray-500">No records found.</p>}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
