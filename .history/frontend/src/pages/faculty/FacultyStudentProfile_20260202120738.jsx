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
    API.get(`/faculty/student/${studentId}`).then((res) => {
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

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading student profile…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* STUDENT PROFILE */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 lg:col-span-1">
        <h1 className="text-2xl font-bold text-blue-900 mb-1">
          {student.Student_name}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Student Profile
        </p>

        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <p className="text-xs text-gray-500">USN</p>
            <p className="font-medium">{student.USN}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Department</p>
            <p className="font-medium">{student.Dept_code}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Year</p>
            <p className="font-medium">{student.Year}</p>
          </div>
        </div>

        {/* ACTIVITY POINTS */}
        <div className="mt-8">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Activity Points
          </p>

          <div className="flex gap-2">
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600"
            />
            <button
              onClick={() =>
                API.patch(`/faculty/student/${studentId}/points`, {
                  activity_pts: points,
                })
              }
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* MESSAGE PANEL */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 lg:col-span-2 flex flex-col">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">
          Messages
        </h2>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
          {messages.length === 0 ? (
            <p className="text-sm text-gray-500">
              No messages yet.
            </p>
          ) : (
            messages.map((m) => (
              <div
                key={m.Message_id}
                className={`max-w-md px-4 py-2 rounded-2xl text-sm ${
                  m.Sender === "Faculty"
                    ? "ml-auto bg-blue-600 text-white"
                    : "mr-auto bg-gray-100 text-gray-800"
                }`}
              >
                {m.Content}
              </div>
            ))
          )}
        </div>

        {/* INPUT */}
        <div className="flex items-center gap-2 border-t pt-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 border rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={sendMessage}
            className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default FacultyStudentProfile;
