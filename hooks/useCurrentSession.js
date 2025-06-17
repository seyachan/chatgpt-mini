import { useMemo, useEffect, useRef } from "react";

export default function useCurrentSession(sessions, currentId) {
  const currentSession = useMemo(() => {
    return sessions.find((s) => s.id === currentId);
  }, [sessions, currentId]);

  const sessionRef = useRef(currentSession);
  useEffect(() => {
    sessionRef.current = currentSession;
  }, [currentSession]);

  return { currentSession, sessionRef };
}
