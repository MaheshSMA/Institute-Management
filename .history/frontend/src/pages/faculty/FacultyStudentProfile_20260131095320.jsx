import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";

function FacultyStudentProfile() {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [points, setPoints] = useState(0);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    API.get(`/faculty/student/${studentId}`).then(res => {
      setStudent(res.data);
      setPoints(res.data.Activity_pts);
    });

    fetchMessages();
  }, [studentId]);

  const fetchMessages = async () => {
    const res = await API.get(`/messages/${studentId}`);
    setMessages(res.data);
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    await API.post(`/messages/${studentId}`, { content: text });
    setText("");
    fetchMessages();
  };

  if (!student) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* STUDENT PROFILE */}
      <div className="bg-white p-6 rounded-xl shadow lg:col-span-1">
        <h1 className="text-2xl font-semibold mb-4">
          {student.Student_name}
        </h1>
        <p><b>USN:</b> {student.USN}</p>
        <p><b>Department:</b> {student.Dept_code}</p>
        <p><b>Year:</b> {student.Year}</p>

        <div className="mt-6">
          <label className="block font-medium mb-1">Activity Points</label>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
          <button
            onClick={() =>
              API.patch(`/faculty/student/${studentId}/points`, {
                activity_pts: points,
              })
            }
            className="mt-2 w-full bg-blue-600 text-white py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>

      {/* MESSAGE PANEL */}
      <div className="bg-white rounded-xl shadow p-6 lg:col-span-2 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Messages</h2>

        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {messages.map(m => (
            <div
              key={m.Message_id}
              className={`p-2 rounded max-w-sm ${
                m.Sender === "Faculty"
                  ? "bg-blue-100 ml-auto"
                  : "bg-gray-100"
              }`}
            >
              {m.Content}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border px-3 py-2 rounded"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default FacultyStudentProfile;
