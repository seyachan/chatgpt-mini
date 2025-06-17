import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "chat-sessions"; 

export default function useChatSessions() {
  const getInitialData = () => {
    if (typeof window === "undefined") return { sessions: [], currentId: null };
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      return {
        sessions: parsed,
        currentId: parsed.length > 0 ? parsed[0].id : null,
      };
    } catch (e) {
      console.error("読み込み失敗", e);
      return { sessions: [], currentId: null };
    }
  };

  const { sessions: initialSessions, currentId: initialId } = getInitialData();
  const [sessions, setSessions] = useState(initialSessions);
  const [currentId, setCurrentId] = useState(initialId);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const createSession = useCallback(() => {
    const newSession = {
      id: uuidv4(),
      title: "新しいチャット",
      messages: [],
      pinned: false,
      createdAt: Date.now(), 
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentId(newSession.id);
    return newSession.id;
  }, []); 

  const deleteSession = useCallback((idToDelete) => {
    setSessions((prev) => {
      const newSessions = prev.filter((s) => s.id !== idToDelete);
      if (currentId === idToDelete) {
        setCurrentId(newSessions.length > 0 ? newSessions[0].id : null);
      }
      if (newSessions.length === 0) {
        localStorage.removeItem("chatSessions");
      }
      return newSessions;
    });
  }, [currentId]); 

  const addMessageToSession = useCallback((sessionId, message) => {
    if (!sessionId) return;
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
        
          ? { ...session, messages: [...(session.messages || []), message] }
          : session
      )
    );
  }, []);

  const updateTitle = useCallback((sessionId, title) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId ? { ...session, title } : session
      )
    );
  }, []);
  
  const togglePinned = useCallback((sessionId) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, pinned: !s.pinned } : s))
    );
  }, []);

  return {
    sessions,
    currentId,
    setCurrentId,
    createSession,
    deleteSession,
    updateTitle,
    addMessageToSession,
    togglePinned,
  };
}