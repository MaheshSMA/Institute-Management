import React,{ useEffect, useState } from "react";
import API from "../../api/axios";

function AdminStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    API.get("/admin/students").then(res => setStudents(res.data));
  }, []);

  return (
    <div>
      <h2>All Students</h2>
      <ul>
        {students.map(s => (
          <li key={s.Student_id}>
            {s.Student_name} | {s.USN} | {s.Dept_code} | {s.Activity_pts}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminStudents;
