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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border p-8">
        <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-center">
          Club Signup
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <input
            name="club_name"
            placeholder="Club Name"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
          />

          <textarea
            name="description"
            placeholder="Club Description"
            rows={3}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
          />

          <select
            name="coordinator_id"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Select Club Coordinator</option>
            {faculty.map((f) => (
              <option key={f.Fac_id} value={f.Fac_id}>
                {f.Fac_name} ({f.Dept_code})
              </option>
            ))}
          </select>

          <input
            name="email"
            placeholder="Club Email"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-sm text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            disabled={loading}
            className={`w-full py-2 rounded-md font-medium transition ${
              loading
                ? "bg-blue-400"
                : "bg-blue-700 hover:bg-blue-800 text-white"
            }`}
          >
            {loading ? "Creating Club..." : "Create Club"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <button
            onClick={() => navigate("/login/club")}
            className="text-blue-700 hover:underline"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClubSignup;
