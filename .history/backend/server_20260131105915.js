const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= ROUTES =================
const authRoutes = require("./routes/authRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const messageRoutes = require("./routes/messageRoutes");
const counsellorRequestRoutes = require("./routes/counsellorRequestRoutes");
const aiInsightsRoutes = require("./routes/aiInsightsRoutes");

// ================= ROUTE REGISTRATION =================
app.use("/api/auth", authRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/requests", counsellorRequestRoutes);
app.use("/api/ai", aiInsightsRoutes); // 🔥 THIS FIXES YOUR 404

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("Backend server running 🚀");
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
