import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function StudentRequests() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const studentId = localStorage.getItem("ref_id");

  useEffect(() => {
    if (!studentId) {
      navigate("/login/student");
      return;
    }

    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get(`/requests/student/${studentId}`);
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load requests");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Requests</h1>

      {requests.length === 0 ? (
        <p>No requests raised yet.</p>
      ) : (
        <table style={tableStyle}>
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
                <td style={statusStyle(req.Status)}>
                  {req.Status}
                </td>
                <td>{req.Pts_earned || "-"}</td>
                <td>{new Date(req.Created_At).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <br />
      <button onClick={() => navigate("/student/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}

/* ---------- styles ---------- */

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const statusStyle = (status) => ({
  fontWeight: "bold",
  color:
    status === "Approved"
      ? "green"
      : status === "Rejected"
      ? "red"
      : "orange",
});

export default StudentRequests;
