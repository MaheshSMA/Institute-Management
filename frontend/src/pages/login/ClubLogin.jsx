import { useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function ClubLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
        role: "Club",
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "Club");
      localStorage.setItem("ref_id", res.data.ref_id);

      navigate("/club/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={login}
        className="bg-white p-6 rounded-xl shadow w-full max-w-md"
      >
        <h1 className="text-xl font-semibold mb-4">Club Login</h1>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 mb-3"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-4"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}

export default ClubLogin;
