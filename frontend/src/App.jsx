import { Routes, Route } from "react-router-dom";

// Login Pages
import StudentLogin from "./pages/login/StudentLogin";
import FacultyLogin from "./pages/login/FacultyLogin";
import AdminLogin from "./pages/login/AdminLogin";

// Dashboards
import StudentDashboard from "./pages/student/StudentDashboard";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

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
    </Routes>
  );
}

export default App;
