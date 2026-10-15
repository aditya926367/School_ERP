type FilterOption = string | { label: string; value: string };

type FilterSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder: string;
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
};

export default function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
  className = "",
  disabled = false,
  "aria-label": ariaLabel,
}: FilterSelectProps) {
  return (
    <select
      value={value}
      disabled={disabled}
      aria-label={ariaLabel ?? placeholder}
      onChange={(event) => onChange(event.target.value)}
      className={`mt-1 w-30 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100 ${className}`}
    >
      <option value="All">{placeholder}</option>
      {options.map((option) => {
        const item = typeof option === "string" ? { label: option, value: option } : option;
        return <option key={item.value} value={item.value}>{item.label}</option>;
      })}
    </select>
  );
}
