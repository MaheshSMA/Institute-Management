import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  const studentId = localStorage.getItem("ref_id");

  useEffect(() => {
    if (!studentId) {
      navigate("/login/student");
      return;
    }

    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      const res = await API.get(`/students/${studentId}`);
      setStudent(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load student profile");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login/student");
  };

  if (!student) return <h3>Loading dashboard...</h3>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Student Dashboard</h1>

      {/* PROFILE CARD */}
      <div style={cardStyle}>
        <h3>{student.Student_name}</h3>
        <p><b>USN:</b> {student.USN}</p>
        <p><b>Department:</b> {student.Dept_code}</p>
        <p><b>Year:</b> {student.Year}</p>
        <p>
          <b>Counsellor:</b>{" "}
          {student.Supervised_by ? student.Supervised_by : "Not Assigned"}
        </p>
      </div>

      {/* ACTIVITY POINTS */}
      <div style={cardStyle}>
        <h2> Activity Points</h2>
        <h1>{student.Activity_pts}</h1>
      </div>

      <button onClick={() => navigate("/student/events")}>
        View Events
      </button>


      <button onClick={() => navigate("/student/requests")}>
        View My Requests
      </button>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

const cardStyle = {
  border: "1px solid #ccc",
  padding: "15px",
  marginBottom: "20px",
  borderRadius: "8px",
};

export default StudentDashboard;
