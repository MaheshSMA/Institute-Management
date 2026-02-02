import { Routes, Route } from "react-router-dom";
import React from "react";
import ChatLauncher from "./components/ChatLauncher";
import { useLocation } from "react-router-dom";

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
import StudentMessages from "./pages/student/StudentMessages";

/* -------- Faculty Pages -------- */
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import FacultyRequests from "./pages/faculty/FacultyRequests";
import FacultyStudents from "./pages/faculty/FacultyStudents";
import FacultyClubEvents from "./pages/faculty/FacultyClubEvents";
import FacultyStudentProfile from "./pages/faculty/FacultyStudentProfile";
import FacultyClubDashboard from "./pages/faculty/FacultyClubDashboard";
import FacultyAIInsights from "./pages/faculty/FacultyAIInsights";
import FacultyStudentTwin from "./pages/faculty/FacultyStudentTwin";

/* -------- Admin Pages -------- */
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReports from "./pages/admin/AdminReports";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminFaculty from "./pages/admin/AdminFaculty";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminPolicies from "./pages/admin/AdminPolicies";
import AdminNAACDashboard from "./pages/admin/AdminNAACDashboard";

import ClubDashboard from "./pages/club/ClubDashboard";
// import ClubEvents from "./pages/club/ClubEvents";
import CreateEvent from "./pages/club/CreateEvent";
import ManageEvents from "./pages/club/ManageEvents";

function App() {
  const location = useLocation();
  const hide = location.pathname.startsWith("/login") || location.pathname.startsWith("/signup") ;
  return (
    <>
      {!hide && <ChatLauncher />}
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
            <StudentLogin />
        }
      />
      <Route
        path="/login/faculty"
        element={
            <FacultyLogin />
        }
      />
      <Route
        path="/faculty/ai-insights"
        element={<FacultyAIInsights />}
      />

      <Route
        path="/login/admin"
        element={
            <AdminLogin />
        }
        />
        <Route path="/admin/policies" element={<AdminPolicies />} />
        <Route path="/club/events" element={<ManageEvents />} />

      <Route 
        path="/login/club" 
        element={
            <ClubLogin />
        }
      />
    <Route path="/club/events/edit/:id" element={<EditEvent />} />

      <Route
        path="/signup/student"
        element={
            <StudentSignup />
        }
      />
      <Route
        path="/signup/faculty"
        element={
            <FacultySignup />
        }
      />
      <Route
        path="/signup/admin"
        element={
            <AdminSignup />
        }
        />

      <Route 
        path="/signup/club" 
        element={
            <ClubSignup />
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

      <Route path="/student/messages" element={<StudentMessages />} />


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
        path="/faculty/students/:studentId/twin"
        element={<FacultyStudentTwin />}
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
      <Route path="/club/events/create" element={<CreateEvent />} />


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
      <Route
        path="/admin/naac"
        element={<AdminNAACDashboard />}
      />
      {/* <Route path="/club/events" element={<ClubEvents />} /> */}
    </Routes>
    </>
    
  );
}

export default App;
