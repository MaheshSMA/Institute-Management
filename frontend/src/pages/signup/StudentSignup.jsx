import { useState } from "react";
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const signup = async () => {
    try {
      await API.post("/auth/register-student", form);
      alert("Student registered successfully");
      navigate("/login/student");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div>
      <h2>Student Signup</h2>

      <input name="student_name" placeholder="Name" onChange={handleChange} />
      <input name="usn" placeholder="USN" onChange={handleChange} />
      <input type="date" name="dob" onChange={handleChange} />
      <input name="year" placeholder="Year" onChange={handleChange} />
      <input name="dept_code" placeholder="Dept Code" onChange={handleChange} />
      <input name="student_email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />

      <button onClick={signup}>Register</button>
    </div>
  );
}

export default StudentSignup;
