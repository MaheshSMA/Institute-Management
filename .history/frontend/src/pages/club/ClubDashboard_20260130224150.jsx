import { useNavigate } from "react-router-dom";

function ClubDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <h1 className="text-2xl font-semibold mb-6">Club Dashboard</h1>

      <button
        onClick={() => navigate("/club/events")}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Manage Events
      </button>
    </div>
  );
}

export default ClubDashboard;
