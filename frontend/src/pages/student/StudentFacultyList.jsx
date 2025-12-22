import React,{ useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function StudentFacultyList() {
  const [faculty, setFaculty] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login/student");
      return;
    }
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    const res = await API.get("/faculty");
    setFaculty(res.data);
  };

  const sendRequest = async (facId) => {
    try {
      await API.post("/requests", {
        fac_id: facId,
        type: "Counsellor Join",
        reason: "Requesting counsellor assignment",
      });
      alert("Request sent successfully");
    } catch (err) {
      alert("Failed to send request");
    }
  };

  return (
    <div>
      <h2>Available Faculty</h2>

      {faculty.length === 0 ? (
        <p>No faculty available</p>
      ) : (
        <ul>
          {faculty.map((f) => (
            <li key={f.Fac_id}>
              {f.Fac_name} ({f.Dept_code})
              <button onClick={() => sendRequest(f.Fac_id)}>
                Request Counsellor
              </button>
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => navigate("/student/dashboard")}>
        Back
      </button>
    </div>
  );
}

export default StudentFacultyList;
