import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      if (res.data.role !== "Student") {
        alert("Not a student account!");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("ref_id", res.data.ref_id);

      navigate("/student/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      <h2>Student Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Student Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />

        <button type="submit">Login</button>
      </form>

      <p onClick={() => navigate("/login/faculty")}>Faculty Login</p>
      <p onClick={() => navigate("/login/admin")}>Admin Login</p>
    </div>
  );
}

export default StudentLogin;
