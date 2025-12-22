import React,{ useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function FacultyStudents() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();
  const facId = localStorage.getItem("ref_id");

  useEffect(() => {
    if (!facId) {
      navigate("/login/faculty");
      return;
    }

    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get(`/faculty/my-students`);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load students");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Assigned Students</h1>

      {students.length === 0 ? (
        <p>No students assigned yet.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Name</th>
              <th>USN</th>
              <th>Department</th>
              <th>Year</th>
              <th>Activity Points</th>
            </tr>
          </thead>
          <tbody>
            {students.map((stu) => (
              <tr key={stu.Student_id}>
                <td>{stu.Student_name}</td>
                <td>{stu.USN}</td>
                <td>{stu.Dept_code}</td>
                <td>{stu.Year}</td>
                <td>{stu.Activity_pts}</td>
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

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

export default FacultyStudents;
