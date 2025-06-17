import { useState, useCallback } from "react";
import useSessionStorage from "./helpers/useSessionStorage";
import useSessionDelete from "./helpers/useSessionDelete";
import useSessionPinToggle from "./helpers/useSessionPinToggle";

export default function useChatSessions() {
  const [sessions, setSessions] = useState([]);
  const [currentId, setCurrentId] = useState(null);

  const addMessageToSession = useCallback((sessionId, message) => {
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === sessionId
          ? { ...session, messages: [...(session.messages || []), message] }
          : session
      )
    );
  }, []); 

  const updateTitle = useCallback((sessionId, newTitle) => {
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === sessionId ? { ...session, title: newTitle } : session
      )
    );
  }, []); 

  const { createSession } = useSessionStorage({ setSessions, setCurrentId });
  const { deleteSession } = useSessionDelete({ sessions, setSessions, currentId, setCurrentId });
  const { togglePin } = useSessionPinToggle({ sessions, setSessions });

  return {
    sessions,
    currentId,
    setCurrentId,
    createSession,
    deleteSession,
    updateTitle,
    addMessageToSession,
    togglePin,
  };
}