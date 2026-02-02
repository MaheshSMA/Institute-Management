import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

function ClubSignup() {
  const [faculty, setFaculty] = useState([]);
  const [form, setForm] = useState({
    club_name: "",
    description: "",
    coordinator_id: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    API.get("/faculty/available-coordinators")
      .then((res) => setFaculty(res.data))
      .catch(() => setError("Failed to load coordinators"));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.club_name || !form.coordinator_id || !form.email || !form.password) {
      setError("All required fields must be filled");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/club/signup", form);
      navigate("/login/club");
    } catch {
      setError("Club signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50">
    {/* LEFT PANEL */}
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

    {/* RIGHT PANEL */}
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border p-8">
        <h2 className="text-2xl font-semibold text-blue-900 mb-2 text-center">
          Club Signup
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Register a club and assign a faculty coordinator
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          {/* Club Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Club Name
            </label>
            <input
              name="club_name"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Club Description
            </label>
            <textarea
              name="description"
              rows={3}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Coordinator */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Faculty Coordinator
            </label>
            <select
              name="coordinator_id"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select Coordinator</option>
              {faculty.map((f) => (
                <option key={f.Fac_id} value={f.Fac_id}>
                  {f.Fac_name} ({f.Dept_code})
                </option>
              ))}
            </select>
          </div>

          {/* Club Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Club Email
            </label>
            <input
              name="email"
              onChange={handleChange}
              required
              placeholder="club@rvce.edu.in"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
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
                name="password"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
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
            disabled={loading}
            className={`w-full py-2 rounded-md font-medium transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800 text-white"
            }`}
          >
            {loading ? "Creating Club..." : "Create Club"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 border-t" />

        {/* Navigation */}
        <div className="flex flex-col gap-2 text-center text-sm">
          <button
            onClick={() => navigate("/signup/student")}
            className="text-blue-700 hover:underline"
          >
            Student Signup
          </button>

          <button
            onClick={() => navigate("/signup/faculty")}
            className="text-blue-700 hover:underline"
          >
            Faculty Signup
          </button>

          <button
            onClick={() => navigate("/signup/admin")}
            className="text-blue-700 hover:underline"
          >
            Admin Signup
          </button>

          <button
            onClick={() => navigate("/login/club")}
            className="text-blue-700 hover:underline"
          >
            Club Login
          </button>
        </div>
      </div>
    </div>
  </div>
);

}

export default ClubSignup;
