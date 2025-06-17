// hooks/helpers/useSessionDelete.js

export default function useSessionDelete({ sessions, setSessions, currentId, setCurrentId }) {
  const deleteSession = (id) => {
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    localStorage.setItem("chatSessions", JSON.stringify(updated));

    if (currentId === id) {
      if (updated.length > 0) {
        setCurrentId(updated[0].id); 
      } else {
        setCurrentId(null);
      }
    }
  };

  return { deleteSession };
}
