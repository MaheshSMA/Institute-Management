import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function StudentMessages() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const studentId = localStorage.getItem("ref_id");

  useEffect(() => {
    if (!studentId) {
      navigate("/login/student");
      return;
    }
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await API.get(`/messages/${studentId}`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      await API.post(`/messages/${studentId}`, {
        content: text,
      });

      setText("");
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-blue-900">
          Messages
        </h1>
        <button
          onClick={() => navigate("/student/dashboard")}
          className="text-sm text-blue-700 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>

      {/* CHAT BOX */}
      <div className="flex-1 bg-white rounded-xl shadow p-4 overflow-y-auto space-y-3">
        {messages.length === 0 && (
          <p className="text-gray-500 text-sm">
            No messages yet
          </p>
        )}

        {messages.map((m) => (
          <div
            key={m.Message_id}
            className={`max-w-md p-2 rounded-lg text-sm ${
              m.Sender === "Student"
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-gray-100 text-gray-800"
            }`}
          >
            {m.Content}
            <div className="text-[10px] mt-1 opacity-70">
              {new Date(m.Created_At).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-600"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default StudentMessages;
