import { forwardRef } from "react";

const Select = forwardRef(
  (
    {
      className = "",
      options = [],
      value,
      onChange,
      disabled = false,
      placeholder = "Select...",
      ...props
    },
    ref,
  ) => {
    return (
      <select
        ref={ref}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className={`px-3 py-2 rounded-md border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:border-slate-400 ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  },
);

Select.displayName = "Select";

export default Select;
