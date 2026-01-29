import { useState } from "react";
import { MessageCircle } from "lucide-react";
import SyllabusChat from "./SyllabusChat";

function ChatLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-40"
        >
          <MessageCircle size={22} />
        </button>
      )}

      {open && <SyllabusChat onClose={() => setOpen(false)} />}
    </>
  );
}

export default ChatLauncher;
