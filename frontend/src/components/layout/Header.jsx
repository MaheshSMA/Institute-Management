import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/rvce-logo.png";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo + Name */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="College Logo"
            className="h-10 w-10 object-contain"
          />
          <div>
            <h1 className="text-lg font-semibold text-blue-900">
              R. V. College of Engineering
            </h1>
            <p className="text-xs text-gray-500">
              Institution Management Portal
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex gap-6 text-sm text-gray-700">
          <button className="hover:text-blue-700">About</button>
          <button className="hover:text-blue-700">Departments</button>
          <button className="hover:text-blue-700">Clubs & Events</button>
          <button className="hover:text-blue-700">Portal</button>
        </nav>

        {/* CTA */}
        <button
          onClick={() => navigate("/login/student")}
          className="px-4 py-2 rounded-md bg-blue-700 text-white text-sm hover:bg-blue-800 transition"
        >
          Login
        </button>
      </div>
    </header>
  );
}

export default Header;
