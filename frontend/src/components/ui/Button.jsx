import React from "react";

export default function Button({
  children,
  variant = "primary",
  type = "button",
  onClick,
  disabled = false,
}) {
  const base =
    "px-4 py-2 rounded-md font-medium transition-all duration-200";

  const variants = {
    primary:
      "bg-blue-700 text-white hover:bg-blue-800",
    secondary:
      "bg-red-600 text-white hover:bg-red-700",
    outline:
      "border border-blue-700 text-blue-700 hover:bg-blue-50",
    ghost:
      "text-blue-700 hover:bg-blue-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
}
