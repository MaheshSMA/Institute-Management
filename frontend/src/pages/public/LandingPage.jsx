import React from "react";
import { motion } from "framer-motion";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import campus from "../../assets/images/RVCE.jpg";
import {
  GraduationCap,
  Users,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

function LandingPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Header />

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-blue-900 leading-tight">
            A Unified Platform for <br /> Academic Management
          </h1>

          <p className="mt-4 text-gray-600">
            Streamlining student records, faculty counselling,
            club activities, and institutional analytics — all in
            one secure portal.
          </p>

          <div className="mt-6 flex gap-4">
            <button className="px-6 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition">
              Explore Portal
            </button>
            <button className="px-6 py-3 border rounded-md hover:bg-gray-100 transition">
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center"
        >
          <img
            src={campus}
            alt="Campus"
            className="w-full max-w-md"
          />
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-center text-blue-900 mb-12">
            What This Portal Offers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: <GraduationCap />,
                title: "Student Management",
                desc: "Profiles, activity points, counsellor tracking",
              },
              {
                icon: <Users />,
                title: "Faculty Control",
                desc: "Counselling, approvals, student oversight",
              },
              {
                icon: <CalendarDays />,
                title: "Clubs & Events",
                desc: "Event creation, participation, analytics",
              },
              {
                icon: <ShieldCheck />,
                title: "Secure Access",
                desc: "Role-based access & data integrity",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className="p-6 border rounded-xl shadow-sm bg-slate-50"
              >
                <div className="text-blue-700 mb-3">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;
