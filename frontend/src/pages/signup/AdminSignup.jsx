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
    if (!/^[^\s@]+@rvce\.edu\.in$/.test(form.fac_email))
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
    <>
      <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-center">
        Admin Signup
      </h2>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <form onSubmit={signup} className="space-y-4">
        <input className="input" name="admin_name" placeholder="Full Name" onChange={handleChange} required/>
        <input className="input" name="admin_email" placeholder="Email" onChange={handleChange} required/>
        <input className="input" type="password" name="password" placeholder="Password" onChange={handleChange} required/>

        <button className="btn-primary w-full">Create Account</button>
      </form>
    </>
  );
}

export default AdminSignup;
