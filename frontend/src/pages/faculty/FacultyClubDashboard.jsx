import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function FacultyClubDashboard() {
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/clubs")
      .then(res => {
        const facId = Number(localStorage.getItem("ref_id"));
        const myClub = res.data.find(
          c => c.Coordinator_id === facId
        );
        setClub(myClub || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6">Loading club...</div>;
  }

  if (!club) {
    return (
      <div className="p-6 text-gray-600">
        You are not assigned as a club coordinator.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-3xl font-semibold text-blue-900 mb-6">
        Club Dashboard
      </h1>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-semibold text-blue-800">
          {club.Club_name}
        </h2>

        <p className="text-gray-600 mt-2">
          {club.Description || "No description available"}
        </p>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate("/faculty/club-events")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Manage Events
          </button>

          <button
            onClick={() => navigate("/faculty/dashboard")}
            className="px-4 py-2 border rounded"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default FacultyClubDashboard;
