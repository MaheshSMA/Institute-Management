import { Routes, Route } from "react-router-dom";
import React from "react";

/* -------- Layouts -------- */
import PublicLayout from "./components/layout/PublicLayout";
import AuthLayout from "./components/layout/AuthLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import LandingPage from "./pages/public/LandingPage";
/* -------- Login Pages -------- */
import StudentLogin from "./pages/login/StudentLogin";
import FacultyLogin from "./pages/login/FacultyLogin";
import AdminLogin from "./pages/login/AdminLogin";
import ClubLogin from "./pages/login/ClubLogin";

/* -------- Signup Pages -------- */
import StudentSignup from "./pages/signup/StudentSignup";
import FacultySignup from "./pages/signup/FacultySignup";
import AdminSignup from "./pages/signup/AdminSignup";
import ClubSignup from "./pages/signup/ClubSignup";

/* -------- Student Pages -------- */
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentRequests from "./pages/student/StudentRequests";
import StudentEvents from "./pages/student/StudentEvents";
import StudentFacultyList from "./pages/student/StudentFacultyList";

/* -------- Faculty Pages -------- */
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import FacultyRequests from "./pages/faculty/FacultyRequests";
import FacultyStudents from "./pages/faculty/FacultyStudents";
import FacultyClubEvents from "./pages/faculty/FacultyClubEvents";
import FacultyStudentProfile from "./pages/faculty/FacultyStudentProfile";
import FacultyClubDashboard from "./pages/faculty/FacultyClubDashboard";

/* -------- Admin Pages -------- */
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReports from "./pages/admin/AdminReports";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminFaculty from "./pages/admin/AdminFaculty";
import AdminEvents from "./pages/admin/AdminEvents";

import ClubDashboard from "./pages/club/ClubDashboard";
// import ClubEvents from "./pages/club/ClubEvents";

function App() {
  return (
    <Routes>
      {/* ================= AUTH (Logo only) ================= */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <LandingPage />
          </PublicLayout>
        }
      />
      <Route
        path="/login/student"
        element={
          <AuthLayout>
            <StudentLogin />
          </AuthLayout>
        }
      />
      <Route
        path="/login/faculty"
        element={
          <AuthLayout>
            <FacultyLogin />
          </AuthLayout>
        }
      />
      <Route
        path="/login/admin"
        element={
          <AuthLayout>
            <AdminLogin />
          </AuthLayout>
        }
        />

      <Route 
        path="/login/club" 
        element={
          <AuthLayout>
            <ClubLogin />
          </AuthLayout>
        }
      />

      <Route
        path="/signup/student"
        element={
          <AuthLayout>
            <StudentSignup />
          </AuthLayout>
        }
      />
      <Route
        path="/signup/faculty"
        element={
          <AuthLayout>
            <FacultySignup />
          </AuthLayout>
        }
      />
      <Route
        path="/signup/admin"
        element={
          <AuthLayout>
            <AdminSignup />
          </AuthLayout>
        }
        />

      <Route 
        path="/signup/club" 
        element={
          <AuthLayout>
            <ClubSignup />
          </AuthLayout>
        } 
      />

      {/* ================= STUDENT ================= */}
      <Route
        path="/student/dashboard"
        element={
          <DashboardLayout>
            <StudentDashboard />
          </DashboardLayout>
        }
      />
      <Route
        path="/student/events"
        element={
          <DashboardLayout>
            <StudentEvents />
          </DashboardLayout>
        }
      />
      <Route
        path="/student/requests"
        element={
          <DashboardLayout>
            <StudentRequests />
          </DashboardLayout>
        }
      />
      <Route
        path="/student/faculty"
        element={
          <DashboardLayout>
            <StudentFacultyList />
          </DashboardLayout>
        }
      />

      {/* ================= FACULTY ================= */}
      <Route
        path="/faculty/dashboard"
        element={
          <DashboardLayout>
            <FacultyDashboard />
          </DashboardLayout>
        }
      />
      <Route
        path="/faculty/requests"
        element={
          <DashboardLayout>
            <FacultyRequests />
          </DashboardLayout>
        }
      />
      <Route
        path="/faculty/students"
        element={
          <DashboardLayout>
            <FacultyStudents />
          </DashboardLayout>
        }
        />

      <Route
        path="/faculty/students/:studentId"
        element={
          <DashboardLayout>
            <FacultyStudentProfile/>
          </DashboardLayout>
        }
      />

      <Route
        path="/faculty/club-events"
        element={
          <DashboardLayout>
            <FacultyClubEvents />
          </DashboardLayout>
        }
      />

      <Route 
        path="/faculty/club" 
        element={
          <DashboardLayout>
            <FacultyClubDashboard />
          </DashboardLayout>
        } 
          
      />

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin/dashboard"
        element={
          <DashboardLayout>
            <AdminDashboard />
          </DashboardLayout>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <DashboardLayout>
            <AdminReports />
          </DashboardLayout>
        }
      />
      <Route
        path="/admin/students"
        element={
          <DashboardLayout>
            <AdminStudents />
          </DashboardLayout>
        }
      />
      <Route
        path="/admin/faculty"
        element={
          <DashboardLayout>
            <AdminFaculty />
          </DashboardLayout>
        }
      />
      <Route
        path="/admin/events"
        element={
          <DashboardLayout>
            <AdminEvents />
          </DashboardLayout>
        }
        />

      <Route 
        path="/club/dashboard" 
        element={
          <DashboardLayout>
            <ClubDashboard />
          </DashboardLayout>
        } 
      />
      {/* <Route path="/club/events" element={<ClubEvents />} /> */}
    </Routes>
  );
}

export default App;
