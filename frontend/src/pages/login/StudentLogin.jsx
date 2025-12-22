import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@rvce\.edu\.in$/.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend validation
    if (!validateEmail(email)) {
      setError("Use your RVCE email (example@rvce.edu.in)");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      if (res.data.role !== "Student") {
        setError("This is not a student account");
        setLoading(false);
        return;
      }

      // Persist auth
      const storage = remember ? localStorage : sessionStorage;

      storage.setItem("token", res.data.token);
      storage.setItem("role", res.data.role);
      storage.setItem("ref_id", res.data.ref_id);

      navigate("/student/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border p-8">
        <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-center">
          Student Login
        </h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Email
            </label>
            <input
              type="email"
              placeholder="yourname@rvce.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full px-4 py-2 border rounded-md
                focus:outline-none focus:ring-2 focus:ring-blue-600
              "
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full px-4 py-2 border rounded-md
                  focus:outline-none focus:ring-2 focus:ring-blue-600
                "
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-sm text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="accent-blue-700"
            />
            <span className="text-gray-700">Remember me</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-2 rounded-md font-medium transition
              ${loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800 text-white"}
            `}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-6 border-t" />

        {/* Other roles */}
        <div className="flex flex-col gap-2 text-center text-sm">
          <button
            onClick={() => navigate("/login/faculty")}
            className="text-blue-700 hover:underline"
          >
            Faculty Login
          </button>

          <button
            onClick={() => navigate("/login/admin")}
            className="text-blue-700 hover:underline"
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;
