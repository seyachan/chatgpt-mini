import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function useChatSessions() {
  const [sessions, setSessions] = useState([]);
  const [currentId, setCurrentId] = useState(null);

  // 初期化
  useEffect(() => {
    const stored = localStorage.getItem("chatSessions");
    if (stored) {
      const parsed = JSON.parse(stored);
      setSessions(parsed);
      if (parsed.length > 0) setCurrentId(parsed[0].id);
    }
  }, []);

  // セッションをローカルストレージに保存
  useEffect(() => {
    localStorage.setItem("chatSessions", JSON.stringify(sessions));
  }, [sessions]);

  const createSession = () => {
    const id = uuidv4();
    const newSession = { id, title: "新しいチャット", pinned: false, messages: [] };
    setSessions((prev) => [newSession, ...prev]);
    return id;
  };

  const deleteSession = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (currentId === id) setCurrentId(null);
  };

  const updateTitle = (id, title) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title } : s))
    );
  };

  const addMessageToSession = (id, message) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, messages: [...s.messages, message] } : s
      )
    );
  };

  return {
    sessions,
    currentId,
    setCurrentId,
    createSession,
    deleteSession,
    updateTitle,
    addMessageToSession,
  };
}
