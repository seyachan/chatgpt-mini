import { useEffect } from "react";
import generateUUID from "@/utils/generateUUID"; 

export default function useSessionStorage({ setSessions, setCurrentId }) {
  const createSession = () => {
    const id = generateUUID();
    const newSession = {
      id,
      title: "新しいチャット",
      messages: [],
      pinned: false,
    };

    setSessions((prev) => {
      const updated = [...prev, newSession];
      localStorage.setItem("chatSessions", JSON.stringify(updated));
      return updated;
    });

    setCurrentId(id);
    return id;
  };

 const loadSessions = () => {
  try {
    const stored = localStorage.getItem("chatSessions");
    if (stored) {
      const parsed = JSON.parse(stored);

      const safeParsed = parsed.map((s) => ({
        ...s,
        messages: Array.isArray(s.messages) ? s.messages : [],
      }));

      setSessions(safeParsed);

      if (safeParsed.length > 0) {
        setCurrentId(safeParsed[0].id);
      } else {
        createSession();
      }
    } else {
      createSession();
    }
  } catch (err) {
    console.error("❌ セッション読み込みエラー", err);
    localStorage.removeItem("chatSessions");
    createSession();
  }
};


  useEffect(() => {
    loadSessions();
  }, []);

  return { createSession };
}
