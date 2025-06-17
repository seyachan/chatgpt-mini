import generateUUID from "@/utils/generateUUID"; 


export default function useSessionCreate({ sessions, setSessions, setCurrentId }) {
  const createSession = () => {
    const id = generateUUID();
    const newSession = {
      id,
      title: "新しいチャット",
      messages: [],
      pinned: false,
    };

    const updated = [...sessions, newSession];
    setSessions(updated);
    localStorage.setItem("chatSessions", JSON.stringify(updated));
    setCurrentId(id);
    return id;
  };

  return { createSession };
}
