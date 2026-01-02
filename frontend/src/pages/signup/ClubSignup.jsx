import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function ClubSignup() {
  const [faculty, setFaculty] = useState([]);
  const [form, setForm] = useState({
    club_name: "",
    description: "",
    coordinator_id: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    API.get("/faculty/available-coordinators")
      .then((res) => setFaculty(res.data))
      .catch(() => alert("Failed to load coordinators"));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/club/signup", form);
      alert("Club registered successfully");
      navigate("/login/club");
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-md"
      >
        <h1 className="text-xl font-semibold mb-4">Club Signup</h1>

        <input
          name="club_name"
          placeholder="Club Name"
          onChange={handleChange}
          className="w-full border p-2 mb-3"
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="w-full border p-2 mb-3"
        />

        <select
          name="coordinator_id"
          onChange={handleChange}
          className="w-full border p-2 mb-3"
        >
          <option value="">Select Coordinator</option>
          {faculty.map((f) => (
            <option key={f.Fac_id} value={f.Fac_id}>
              {f.Fac_name} ({f.Dept_code})
            </option>
          ))}
        </select>

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border p-2 mb-3"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border p-2 mb-4"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Signup
        </button>
      </form>
    </div>
  );
}

export default ClubSignup;
