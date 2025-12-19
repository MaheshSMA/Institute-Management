import { useState } from "react";
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const signup = async () => {
    try {
      await API.post("/auth/register-faculty", form);
      alert("Faculty registered successfully");
      navigate("/login/faculty");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div>
      <h2>Faculty Signup</h2>

      <input name="fac_name" placeholder="Name" onChange={handleChange} />
      <input name="fac_email" placeholder="Email" onChange={handleChange} />
      <input name="dept_code" placeholder="Dept Code" onChange={handleChange} />

      <label>
        <input type="checkbox" name="is_counsellor" onChange={handleChange} />
        Counsellor
      </label>

      <label>
        <input type="checkbox" name="is_club_coordinator" onChange={handleChange} />
        Club Coordinator
      </label>

      <input type="password" name="password" placeholder="Password" onChange={handleChange} />

      <button onClick={signup}>Register</button>
    </div>
  );
}

export default FacultySignup;
