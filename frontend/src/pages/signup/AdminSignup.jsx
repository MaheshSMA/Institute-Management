import React,{ useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

function AdminSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    admin_name: "",
    admin_email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const signup = async () => {
    try {
      await API.post("/auth/register-admin", form);
      alert("Admin registered successfully");
      navigate("/login/admin");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div>
      <h2>Admin Signup</h2>

      <input name="admin_name" placeholder="Name" onChange={handleChange} />
      <input name="admin_email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />

      <button onClick={signup}>Register</button>
    </div>
  );
}

export default AdminSignup;
