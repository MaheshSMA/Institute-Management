import React from "react";


export default function Badge({ text, type = "info" }) {
  const styles = {
    success: "bg-green-100 text-green-700",
    danger: "bg-red-100 text-red-700",
    warning: "bg-yellow-100 text-yellow-700",
    info: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[type]}`}
    >
      {text}
    </span>
  );
}
