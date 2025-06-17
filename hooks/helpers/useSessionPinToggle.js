export default function useSessionPinToggle({ sessions, setSessions }) {
  const togglePin = (id) => {
    const updated = sessions.map((s) =>
      s.id === id ? { ...s, pinned: !s.pinned } : s
    );
    setSessions(updated);
    localStorage.setItem("chatSessions", JSON.stringify(updated));
  };

  return { togglePin };
}
