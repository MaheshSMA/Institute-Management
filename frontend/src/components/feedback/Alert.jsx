
import React from "react";

export default function Alert({ message, type = "info" }) {
  const styles = {
    success: "bg-green-50 text-green-800",
    error: "bg-red-50 text-red-800",
    info: "bg-blue-50 text-blue-800",
  };

  return (
    <div className={`p-3 rounded-md ${styles[type]}`}>
      {message}
    </div>
  );
}
