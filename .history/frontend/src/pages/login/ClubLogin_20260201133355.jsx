import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

function ClubLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); 

  const login = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });

      if (res.data.role !== "Club") {
        setError("This is not a club account");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("ref_id", res.data.ref_id);

      navigate("/club/dashboard");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50">
    {/* LEFT BRANDING PANEL */}
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

    {/* RIGHT LOGIN PANEL */}
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border p-8">
        {/* Heading */}
        <h2 className="text-2xl font-semibold text-blue-900 mb-2 text-center">
          Club Login
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Sign in to manage club activities and events
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={login} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Club Email
            </label>
            <input
              type="email"
              placeholder="club@rvce.edu.in"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
                w-full px-4 py-2 border rounded-md
                focus:outline-none focus:ring-2 focus:ring-blue-600
              "
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
                onChange={(e) => setPassword(e.target.value)}
                required
                className="
                  w-full px-4 py-2 border rounded-md
                  focus:outline-none focus:ring-2 focus:ring-blue-600
                "
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-2 rounded-md font-medium transition
              ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-800 text-white"
              }
            `}
          >
            {loading ? "Logging in..." : "Login"}
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
  </div>
);

}

export default ClubLogin;
