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
    <>
      <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-center">
        Student Signup
      </h2>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <form onSubmit={signup} className="space-y-4">
        <input className="input" name="student_name" placeholder="Full Name" onChange={handleChange} required />
        <input className="input" name="usn" placeholder="USN" onChange={handleChange} required />
        <input className="input" type="date" name="dob" onChange={handleChange} required />
        <input className="input" name="year" placeholder="Year" onChange={handleChange} required />
        <input className="input uppercase" name="dept_code" placeholder="Dept Code" onChange={handleChange} required />
        <input className="input" name="student_email" placeholder="Email" onChange={handleChange} required />
        <input className="input" type="password" name="password" placeholder="Password" onChange={handleChange} required />

        <button className="btn-primary w-full">Create Account</button>
      </form>
    </>
  );
}

export default StudentSignup;
