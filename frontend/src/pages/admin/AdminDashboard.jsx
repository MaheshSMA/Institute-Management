import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <button onClick={() => navigate("/admin/students")}>Students</button>
      <button onClick={() => navigate("/admin/faculty")}>Faculty</button>
      <button onClick={() => navigate("/admin/events")}>Events</button>

      <button onClick={() => navigate("/admin/reports")}>Reports</button>
    </div>
  );
}

export default AdminDashboard;
