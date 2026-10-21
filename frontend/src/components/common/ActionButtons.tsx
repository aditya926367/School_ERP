
import { Pencil, Trash2, Eye, Printer, Download } from "lucide-react";

export interface BaseButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  className?: string;
}

// Single Edit Button
export function EditButton({
  onClick,
  disabled = false,
  title = "Edit",
  className = "",
}: BaseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || !onClick}
      aria-label={title}
      title={title}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#27348b] bg-[#27348b]/10 text-[#27348b] transition hover:bg-[#27348b]/20 focus:outline-none focus:ring-2 focus:ring-[#27348b]/30 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      <Pencil size={18} strokeWidth={1.8} />
    </button>
  );
}

// Single View Button
export function ViewButton({
  onClick,
  disabled = false,
  title = "View",
  className = "",
}: BaseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || !onClick}
      aria-label={title}
      title={title}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      <Eye size={18} strokeWidth={1.8} />
    </button>
  );
}

// Single Delete Button
export function DeleteButton({
  onClick,
  disabled = false,
  title = "Delete",
  className = "",
}: BaseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || !onClick}
      aria-label={title}
      title={title}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-300 bg-red-50 text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      <Trash2 size={18} strokeWidth={1.8} />
    </button>
  );
}

// Edit + Delete Buttons
export interface ActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onPrint?: () => void;
  onDownload?: () => void;
  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  showPrint?: boolean;
  showDownload?: boolean;
  disabled?: boolean;
  viewTitle?: string;
  editTitle?: string;
  deleteTitle?: string;
  printTitle?: string;
  downloadTitle?: string;
  className?: string;
}

export default function ActionButtons({
  onView,
  onEdit,
  onDelete,
  onPrint,
  onDownload,
  showView = true,
  showEdit = true,
  showDelete = true,
  showPrint = false,
  showDownload = false,
  disabled = false,
  viewTitle = "View",
  editTitle = "Edit",
  deleteTitle = "Delete",
  printTitle = "Print",
  downloadTitle = "Download",
  className = "",
}: ActionButtonsProps) {
  if (!showEdit && !showDelete && !showView && !showPrint && !showDownload) {
    return null;
  }

  return (
    <div
      className={`flex w-full items-center justify-end gap-2 ${className}`}
    >
      {showView && (
        <ViewButton
          onClick={onView}
          disabled={disabled}
          title={viewTitle}
        />
      )}
      {showEdit && (
        <EditButton
          onClick={onEdit}
          disabled={disabled}
          title={editTitle}
        />
      )}

      {showDelete && (
        <DeleteButton
          onClick={onDelete}
          disabled={disabled}
          title={deleteTitle}
        />
      )}

      {showPrint && (
        <button
          type="button"
          onClick={onPrint}
          disabled={disabled || !onPrint}
          aria-label={printTitle}
          title={printTitle}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-purple-300 bg-purple-50 text-purple-600 transition hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-50"  >
          <Printer size={18} strokeWidth={1.8} />
        </button>
      )}

     {showDownload && (
  <button
    type="button"
    onClick={onDownload}
    disabled={disabled || !onDownload}
    aria-label={downloadTitle}
    title={downloadTitle}
    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-300 bg-blue-50 text-blue-600 transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <Download size={18} strokeWidth={1.8} />
  </button>
)}
    </div>
  );
}


{/*
 
  import {
  EditButton,
  DeleteButton,
} from "../../components/common/ActionButtons";

<td className="px-5 py-4">
  <div className="flex items-center justify-end gap-2">
    <EditButton
      title={`Edit marks for ${record.studentName}`}
      onClick={() => openEditModal(record)}
    />

    <DeleteButton
      title={`Delete marks for ${record.studentName}`}
      onClick={() => deleteRecord(record.id)}
    />
  </div>
</td>

  */}