import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/rvce-logo.jpeg";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Logo + Name */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="RVCE Logo"
            className="h-11 w-11 object-contain"
          />
          <div className="leading-tight">
            <h1 className="text-base sm:text-lg font-semibold text-blue-900">
              R. V. College of Engineering
            </h1>
            <p className="text-[11px] text-gray-500">
              Institution Management Portal
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex gap-8 text-sm font-medium text-gray-600">
          <button className="hover:text-blue-700 transition">
            About
          </button>
          <button className="hover:text-blue-700 transition">
            Departments
          </button>
          <button className="hover:text-blue-700 transition">
            Clubs & Events
          </button>
          <button className="hover:text-blue-700 transition">
            Portal
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login/student")}
            className="
              px-4 py-2
              rounded-md
              bg-blue-700
              text-white
              text-sm
              font-medium
              hover:bg-blue-800
              transition
            "
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup/student")}
            className="
              px-4 py-2
              rounded-md
              border
              border-blue-700
              text-blue-700
              text-sm
              font-medium
              hover:bg-blue-50
              transition
            "
          >
            Signup
          </button>
        </div>

      </div>
    </header>
  );
}

export default Header;
