import React from "react";

export default function Card({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5">
      {title && (
        <h2 className="text-lg font-semibold text-blue-800 mb-3">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
