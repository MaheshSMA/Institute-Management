export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required = false,
  pattern,
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        pattern={pattern}
        className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2
          ${error
            ? "border-red-500 focus:ring-red-500"
            : "focus:ring-blue-600"}`}
      />

      {error && (
        <span className="text-xs text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}
