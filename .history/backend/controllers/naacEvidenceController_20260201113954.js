const db = require("../config/db");

const uploadEvidence = async (req, res) => {
  try {
    const { metricCode } = req.params;
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "File missing" });
    }

    // ✅ THIS IS THE IMPORTANT LINE
    const filePath = `uploads/naac/${req.file.filename}`;

    await db.query(
      `INSERT INTO NAAC_EVIDENCE (Metric_code, Title, File_path)
       VALUES (?, ?, ?)`,
      [metricCode, title, filePath]
    );

    res.json({ message: "Evidence uploaded successfully" });
  } catch (err) {
    console.error("Evidence upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
};

const getEvidenceByMetric = async (req, res) => {
  const { metricCode } = req.params;

  const [rows] = await db.query(
    `SELECT * FROM NAAC_EVIDENCE
     WHERE Metric_code = ?
     ORDER BY Uploaded_at DESC`,
    [metricCode]
  );

  res.json(rows);
};

module.exports = {
  uploadEvidence,
  getEvidenceByMetric
};
