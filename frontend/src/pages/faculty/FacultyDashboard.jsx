import { useNavigate } from "react-router-dom";

function FacultyDashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Faculty Dashboard</h1>

      <button onClick={() => navigate("/faculty/students")}>
        View Assigned Students
      </button>


      <button onClick={() => navigate("/faculty/requests")}>
        View Requests
      </button>

    </div>
  );
}

export default FacultyDashboard;

// messeging feature and file view pending