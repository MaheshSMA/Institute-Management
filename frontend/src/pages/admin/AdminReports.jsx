import React,{ useEffect, useState } from "react";
import API from "../../api/axios";

function AdminReports() {
  const [points, setPoints] = useState([]);
  const [events, setEvents] = useState([]);
  const [depts, setDepts] = useState([]);

  useEffect(() => {
    API.get("/admin/reports/student-points").then(res => setPoints(res.data));
    API.get("/admin/reports/event-participation").then(res => setEvents(res.data));
    API.get("/admin/reports/dept-students").then(res => setDepts(res.data));
  }, []);

  return (
    <div>
      <h2>Student Points</h2>
      <ul>{points.map(p => <li key={p.USN}>{p.Student_name} - {p.Activity_pts}</li>)}</ul>

      <h2>Event Participation</h2>
      <ul>{events.map(e => <li key={e.Event_name}>{e.Event_name} - {e.participants}</li>)}</ul>

      <h2>Department-wise Students</h2>
      <ul>{depts.map(d => <li key={d.Dept_code}>{d.Dept_code} - {d.total_students}</li>)}</ul>
    </div>
  );
}

export default AdminReports;
