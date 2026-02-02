import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

function StudentSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    student_name: "",
    usn: "",
    dob: "",
    year: "",
    dept_code: "",
    student_email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.student_name || !form.usn || !form.student_email || !form.password)
      return "All required fields must be filled";
    if (!/^[^\s@]+@rvce\.edu\.in$/.test(form.student_email))
      return "Invalid email format, use RVCE email";
    if (form.password.length < 6)
      return "Password must be at least 6 characters";
    if (isNaN(form.year))
      return "Year must be numeric";
    if(!/^1RV\d{2}[A-Z]{2}\d{3}$/.test(form.usn)){
      return "USN is in wrong format";
    }
    return "";
  };

  const signup = async (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) return setError(msg);

    try {
      await API.post("/auth/register-student", form);
      navigate("/login/student");
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
          Student Signup
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Create your student account to access the portal
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
            {error}
          </div>
        )}

        <form onSubmit={signup} className="space-y-4">
          <input
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
            name="student_name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600 uppercase"
            name="usn"
            placeholder="USN (e.g. 1RV22AI001)"
            onChange={handleChange}
            required
          />

          <input
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
            type="date"
            name="dob"
            onChange={handleChange}
            required
          />

          <input
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
            name="year"
            placeholder="Year"
            onChange={handleChange}
            required
          />

          <input
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600 uppercase"
            name="dept_code"
            placeholder="Department Code"
            onChange={handleChange}
            required
          />

          <input
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
            name="student_email"
            placeholder="Email (example@rvce.edu.in)"
            onChange={handleChange}
            required
          />

          <input
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

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
            onClick={() => navigate("/login/student")}
            className="text-blue-700 hover:underline"
          >
            Student Login
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
            onClick={() => navigate("/signup/admin")}
            className="text-blue-700 hover:underline"
          >
            Admin Signup
          </button>
        </div>
      </div>
    </div>
  </div>
);

}

export default StudentSignup;
