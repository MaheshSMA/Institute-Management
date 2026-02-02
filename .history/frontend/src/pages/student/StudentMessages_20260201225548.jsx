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
    const res = await API.get("/messages/me");
    setMessages(res.data);
  } catch (err) {
    console.error(err);
  }
};

const sendMessage = async () => {
  if (!text.trim()) return;

  try {
    await API.post("/messages/me", { content: text });
    setText("");
    fetchMessages();
  } catch (err) {
    console.error(err);
  }
};


  return (
  <div className="min-h-screen bg-slate-100 p-6 flex flex-col">
    {/* HEADER */}
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">
          Messages
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Communicate with your counsellor or faculty
        </p>
      </div>

      <button
        onClick={() => navigate("/student/dashboard")}
        className="text-sm text-blue-700 hover:underline"
      >
        Back to Dashboard
      </button>
    </div>

    {/* CHAT CONTAINER */}
    <div className="flex-1 bg-white rounded-2xl shadow-md p-4 overflow-y-auto space-y-4">
      {messages.length === 0 && (
        <div className="h-full flex items-center justify-center text-gray-400 text-sm">
          No messages yet
        </div>
      )}

      {messages.map((m) => (
        <div
          key={m.Message_id}
          className={`flex ${
            m.Sender === "Student" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
              m.Sender === "Student"
                ? "bg-blue-600 text-white rounded-br-md"
                : "bg-slate-100 text-gray-800 rounded-bl-md"
            }`}
          >
            <p>{m.Content}</p>
            <div className="text-[11px] mt-1 opacity-70 text-right">
              {new Date(m.Created_At).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* INPUT BAR */}
    <div className="mt-4 bg-white rounded-2xl shadow-md p-3 flex gap-3 items-center">
      <input
        type="text"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="
          flex-1 bg-slate-50 border border-slate-200
          rounded-xl px-4 py-2 text-sm
          focus:ring-2 focus:ring-blue-600
        "
      />
      <button
        onClick={sendMessage}
        className="
          px-5 py-2 rounded-xl text-sm font-medium text-white
          bg-gradient-to-r from-blue-600 to-blue-700
          hover:from-blue-700 hover:to-blue-800
          shadow
        "
      >
        Send
      </button>
    </div>
  </div>
);

}

export default StudentMessages;
