import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";

function FacultyStudentProfile() {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    API.get(`/faculty/student/${studentId}`)
      .then(res => {
        setStudent(res.data);
        setPoints(res.data.Activity_pts);
      });
  }, [studentId]);

  const savePoints = async () => {
    await API.patch(
      `/faculty/student/${studentId}/points`,
      { activity_pts: points }
    );
    alert("Activity points updated");
  };

  if (!student) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-semibold mb-4">
          {student.Student_name}
        </h1>

        <p><b>USN:</b> {student.USN}</p>
        <p><b>Department:</b> {student.Dept_code}</p>
        <p><b>Year:</b> {student.Year}</p>

        <div className="mt-6">
          <label className="block font-medium mb-1">
            Activity Points
          </label>

          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            className="border px-3 py-2 rounded"
          />

          <button
            onClick={savePoints}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default FacultyStudentProfile;
