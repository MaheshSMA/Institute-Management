import React from "react";
import logo from "../../assets/images/rvce-logo.png";

function Brand({ size = "md", showText = true }) {
  const sizes = {
    sm: "h-8",
    md: "h-10",
    lg: "h-14",
  };

  return (
    <div className="flex items-center gap-2">
      <img src={logo} className={sizes[size]} alt="RVCE" />
      {showText && (
        <span className="font-semibold text-blue-900">
          R V College of Engineering
        </span>
      )}
    </div>
  );
}

export default Brand;
