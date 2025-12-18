import { Routes, Route } from "react-router-dom";

// Login Pages
import StudentLogin from "./pages/login/StudentLogin";
import FacultyLogin from "./pages/login/FacultyLogin";
import AdminLogin from "./pages/login/AdminLogin";


// Dashboards
import StudentDashboard from "./pages/student/StudentDashboard";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentRequests from "./pages/student/StudentRequests";
import FacultyRequests from "./pages/faculty/FacultyRequests";
import FacultyStudents from "./pages/faculty/FacultyStudents";
import StudentEvents from "./pages/student/StudentEvents";
import AdminReports from "./pages/admin/AdminReports";
import AdminStudents from "./pages/admin/AdminStudents";

function App() {
  return (
    <Routes>
      {/* LOGIN ROUTES */}
      <Route path="/" element={<StudentLogin />} />
      <Route path="/login/student" element={<StudentLogin />} />
      <Route path="/login/faculty" element={<FacultyLogin />} />
      <Route path="/login/admin" element={<AdminLogin />} />

      {/* DASHBOARDS */}
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/student/requests" element={<StudentRequests />} />
      <Route path="/faculty/requests" element={<FacultyRequests />} />
      <Route path="/faculty/students" element={<FacultyStudents />} />
      <Route path="/student/events" element={<StudentEvents />} />
      <Route path="/admin/reports" element={<AdminReports />} />
      <Route path="/admin/students" element={<AdminStudents />} />

    </Routes>
  );
}

export default App;
