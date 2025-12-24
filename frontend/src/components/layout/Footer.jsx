import React from "react";

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-semibold mb-2">
            R. V. College of Engineering
          </h3>
          <p className="text-sm">
            Autonomous institution affiliated to VTU, Bengaluru.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li>Admissions</li>
            <li>Departments</li>
            <li>Clubs & Activities</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-2">Portal</h4>
          <p className="text-sm">
            Student • Faculty • Admin Management System
          </p>
        </div>
      </div>

      <div className="border-t border-slate-700 text-center py-4 text-xs">
        © {new Date().getFullYear()} R. V. College of Engineering
      </div>
    </footer>
  );
}

export default Footer;
