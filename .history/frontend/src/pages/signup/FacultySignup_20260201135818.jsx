import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

function FacultySignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fac_name: "",
    fac_email: "",
    dept_code: "",
    is_counsellor: false,
    is_club_coordinator: false,
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const validate = () => {
    if (!form.fac_name || !form.fac_email || !form.password)
      return "All required fields must be filled";
    if (!/^[^\s@]+@rvce\.edu\.in$/.test(form.fac_email))
      return "Invalid email format, use RVCE email";
    if (form.password.length < 6)
      return "Password must be at least 6 characters";
    return "";
  };

  const signup = async (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) return setError(msg);

    try {
      await API.post("/auth/register-faculty", form);
      navigate("/login/faculty");
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
          Faculty Signup
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Create your faculty account to access the portal
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
            {error}
          </div>
        )}

        <form onSubmit={signup} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              name="fac_name"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Faculty Email
            </label>
            <input
              name="fac_email"
              onChange={handleChange}
              required
              placeholder="faculty@rvce.edu.in"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Department Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department Code
            </label>
            <input
              name="dept_code"
              onChange={handleChange}
              required
              placeholder="AI / CS / EC"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600 uppercase"
            />
          </div>

          {/* Roles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Roles
            </label>
            <div className="flex gap-6 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_counsellor"
                  onChange={handleChange}
                  className="accent-blue-700"
                />
                Counsellor
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_club_coordinator"
                  onChange={handleChange}
                  className="accent-blue-700"
                />
                Club Coordinator
              </label>
            </div>
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
            onClick={() => navigate("/signup/club")}
            className="text-blue-700 hover:underline"
          >
            Club Signup
          </button>

          <button
            onClick={() => navigate("/signup/admin")}
            className="text-blue-700 hover:underline"
          >
            Admin Signup
          </button>

          <button
            onClick={() => navigate("/login/faculty")}
            className="text-blue-700 hover:underline"
          >
            Faculty Login
          </button>
        </div>
      </div>
    </div>
  </div>
);

}

export default FacultySignup;
