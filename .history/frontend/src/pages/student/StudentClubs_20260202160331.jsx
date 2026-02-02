// frontend/src/pages/student/StudentClubs.jsx
import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function StudentClubs() {
  const [clubs, setClubs] = useState([]);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const [toast, setToast] = useState("");
    
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
    setToast("Join request sent. Awaiting approval.");
    fetchData();

    // auto-hide toast
    setTimeout(() => setToast(""), 3000);
  } catch (err) {
    console.error(err);
    setToast("Failed to send join request.");
    setTimeout(() => setToast(""), 3000);
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
        {clubs.map((club) => {
                        const status = getStatus(club.Club_id);
  const isApproved = club.Status === "Approved";

  return (
    <div
      key={club.Club_id}
      onClick={() => {
        if (isApproved) {
          navigate(`/student/clubs/${club.Club_id}/feed`);
        }
      }}
      className={`border rounded-xl p-6 transition
        ${isApproved 
          ? "cursor-pointer hover:shadow-md hover:-translate-y-1"
          : "opacity-90"
        }`}
    >
        {toast && (
  <div className="mb-6 bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg px-4 py-3">
    {toast}
  </div>
)}

      <h2 className="text-lg font-semibold text-blue-900">
        {club.Club_name}
      </h2>

      <p className="text-sm text-gray-600 mb-3">
        {club.Description}
      </p>

      {isApproved ? (
        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
          Approved · Tap to open feed
        </span>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation(); // IMPORTANT
            joinClub(club.Club_id);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
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
