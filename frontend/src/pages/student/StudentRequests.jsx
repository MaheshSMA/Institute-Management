import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function StudentRequests() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login/student");
      return;
    }

    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      // 🔐 student identity resolved in backend via JWT
      const res = await API.get("/requests/student");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load requests");
    }
  };

  return (
    <div>
      <h1>My Requests</h1>

      {requests.length === 0 ? (
        <p>No requests raised yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Points</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((req) => (
              <tr key={req.Request_id}>
                <td>{req.Type}</td>
                <td>{req.Reason}</td>
                <td>{req.Status}</td>
                <td>{req.Pts_earned || "-"}</td>
                <td>
                  {new Date(req.Created_At).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button onClick={() => navigate("/student/dashboard")}>
        Back
      </button>
    </div>
  );
}

export default StudentRequests;
