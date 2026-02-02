// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

// ================= ROUTE IMPORTS =================
const studentRoutes = require('./routes/studentRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const messageRoutes = require('./routes/messageRoutes');
const counsellorRequestRoutes = require('./routes/counsellorRequestRoutes');
const clubRoutes = require('./routes/clubRoutes');
const eventRoutes = require('./routes/eventRoutes');
const participationRoutes = require('./routes/participationRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aiInsightsRoutes = require('./routes/aiInsightsRoutes'); // 🔥 ADD THIS
const policyRoutes = require("./routes/policyRoutes");
const twinRoutes = require("./routes/twinRoutes");
const naacRoutes = require("./routes/naacRoutes");
const naacEvidenceRoutes = require("./routes/naacEvidenceRoutes");
// const clubEventRoutes = require("./routes/clubEventRoutes");
const clubMembershipRoutes = require("./routes/clubMembershipRoutes");

const app = express();

// ================= MIDDLEWARE =================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= HEALTH CHECK =================
app.get('/', (req, res) => {
  res.json({ message: 'Institution Management Backend is running 🚀' });
});
app.use("/api/admin/policies", policyRoutes);

// ================= API ROUTES =================
app.use('/api/students', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/requests', counsellorRequestRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/participation', participationRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/twin", twinRoutes);
app.use("/api/naac/evidence", naacEvidenceRoutes); // 👈 MOVE UP
app.use("/api/naac", require("./routes/naacRoutes"));
// app.use("/api/clubs", clubEventRoutes);
app.use("/api/clubs", clubMembershipRoutes);

// 🔥 AI INSIGHTS ROUTE (THIS FIXES YOUR 404)
app.use("/api/ai", aiInsightsRoutes);

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
