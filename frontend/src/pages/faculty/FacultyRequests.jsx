import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function FacultyRequests() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const facId = localStorage.getItem("ref_id");

  useEffect(() => {
    if (!facId) {
      navigate("/login/faculty");
      return;
    }
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get(`/requests/faculty/${facId}`);
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
      fetchRequests(); // refresh
    } catch (err) {
      console.error(err);
      alert("Failed to update request");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Faculty Requests</h1>

      {requests.length === 0 ? (
        <p>No requests assigned.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Student ID</th>
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
                <td>{req.Student_id}</td>
                <td>{req.Type}</td>
                <td>{req.Reason}</td>
                <td>{req.Pts_earned || "-"}</td>
                <td style={statusStyle(req.Status)}>
                  {req.Status}
                </td>
                <td>
                  {req.Status === "Pending" ? (
                    <>
                      <button
                        onClick={() =>
                          updateStatus(req.Request_id, "Approved")
                        }
                      >
                        Approve
                      </button>{" "}
                      <button
                        onClick={() =>
                          updateStatus(req.Request_id, "Rejected")
                        }
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <br />
      <button onClick={() => navigate("/faculty/dashboard")}>
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

export default FacultyRequests;
