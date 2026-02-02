import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

function AdminSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    admin_name: "",
    admin_email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const signup = async (e) => {
    e.preventDefault();
    if (!form.admin_name || !form.admin_email || form.password.length < 6)
      return setError("Valid name, email & password required");
    if (!/^[^\s@]+@rvce\.edu\.in$/.test(form.admin_email))
      return "Invalid email format, use RVCE email";
    if (form.password.length < 6)
      return "Password must be at least 6 characters";

    try {
      await API.post("/auth/register-admin", form);
      navigate("/login/admin");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
  <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50">
    {/* LEFT PANEL */}
    <div className="hidden lg:flex flex-col items-center justify-center bg-blue-900 text-white px-12">
      <div className="text-center">
        <img
          src="/rvce-logo.png"
          alt="RVCE"
          className="w-20 mx-auto mb-6"
        />
        <h1 className="text-2xl font-semibold">
          Institution Management System
        </h1>
        <p className="mt-2 text-blue-100">
          R V College of Engineering
        </p>
      </div>
    </div>

    {/* RIGHT PANEL */}
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border p-8">
        <h2 className="text-2xl font-semibold text-blue-900 mb-2 text-center">
          Admin Signup
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Create an administrator account for portal management
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
            {error}
          </div>
        )}

        <form onSubmit={signup} className="space-y-4">
          {/* Admin Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              name="admin_name"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Admin Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Email
            </label>
            <input
              name="admin_email"
              placeholder="admin@rvce.edu.in"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 rounded-md font-medium bg-blue-700 hover:bg-blue-800 text-white transition"
          >
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 border-t" />

        {/* Navigation */}
        <div className="flex flex-col gap-2 text-center text-sm">
          <button
            onClick={() => navigate("/signup/student")}
            className="text-blue-700 hover:underline"
          >
            Student Signup
          </button>

          <button
            onClick={() => navigate("/signup/faculty")}
            className="text-blue-700 hover:underline"
          >
            Faculty Signup
          </button>

          <button
            onClick={() => navigate("/signup/club")}
            className="text-blue-700 hover:underline"
          >
            Club Signup
          </button>

          <button
            onClick={() => navigate("/login/admin")}
            className="text-blue-700 hover:underline"
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  </div>
);

}

export default AdminSignup;
