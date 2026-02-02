// frontend/src/pages/student/StudentClubs.jsx
import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function StudentClubs() {
  const [clubs, setClubs] = useState([]);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [clubsRes, reqRes] = await Promise.all([
        API.get("/clubs"),
        API.get("/clubs/my-requests")
      ]);

      setClubs(clubsRes.data);
      setRequests(reqRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatus = (clubId) => {
    const r = requests.find(r => r.Club_id === clubId);
    return r ? r.Status : null;
  };

  const joinClub = async (clubId) => {
    try {
      await API.post(`/clubs/${clubId}/join`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-blue-900">
          Clubs
        </h1>
        <button
          onClick={() => navigate("/student/dashboard")}
          className="text-sm text-blue-700 hover:underline"
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map(club => {
          const status = getStatus(club.Club_id);

          return (
            <div
              key={club.Club_id}
              className="bg-white border rounded-xl shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold text-blue-800">
                {club.Club_name}
              </h2>

              <p className="text-sm text-gray-600 mt-1 mb-4">
                {club.Description || "No description"}
              </p>

              {status ? (
                <span className={`text-sm font-medium px-3 py-1 rounded-full
                  ${status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : status === "Rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"}
                `}>
                  {status}
                </span>
              ) : (
                <button
                  onClick={() => joinClub(club.Club_id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  Join Club
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StudentClubs;
