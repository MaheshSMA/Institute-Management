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
    <>
      <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-center">
        Faculty Signup
      </h2>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <form onSubmit={signup} className="space-y-4">
        <input className="input" name="fac_name" placeholder="Full Name" onChange={handleChange} required />
        <input className="input" name="fac_email" placeholder="Email" onChange={handleChange} required/>
        <input className="input uppercase" name="dept_code" placeholder="Dept Code" onChange={handleChange} required/>

        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="is_counsellor" onChange={handleChange} />
            Counsellor
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="is_club_coordinator" onChange={handleChange} />
            Club Coordinator
          </label>
        </div>

        <input className="input" type="password" name="password" placeholder="Password" onChange={handleChange} required />

        <button className="btn-primary w-full">Create Account</button>
      </form>
    </>
  );
}

export default FacultySignup;
