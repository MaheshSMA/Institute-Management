import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function FacultyRequests() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // token presence check is enough
    if (!localStorage.getItem("token")) {
      navigate("/login/faculty");
      return;
    }
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      // 🔐 faculty identity derived from JWT (backend)
      const res = await API.get("/requests/faculty");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load requests");
    }
  };

  const updateStatus = async (requestId, status) => {
    try {
      await API.patch(`/requests/${requestId}/status`, { status });
      alert(`Request ${status}`);
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("Failed to update request");
    }
  };

  return (
    <div>
      <h1>Faculty Requests</h1>

      {requests.length === 0 ? (
        <p>No requests assigned.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Type</th>
              <th>Reason</th>
              <th>Points</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((req) => (
              <tr key={req.Request_id}>
                <td>
                  {req.Student_name} ({req.USN})
                </td>
                <td>{req.Type}</td>
                <td>{req.Reason}</td>
                <td>{req.Pts_earned || "-"}</td>
                <td>{req.Status}</td>
                <td>
                  {req.Status === "Pending" ? (
                    <>
                      <button
                        onClick={() =>
                          updateStatus(req.Request_id, "Approved")
                        }
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          updateStatus(req.Request_id, "Rejected")
                        }
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button onClick={() => navigate("/faculty/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default FacultyRequests;
