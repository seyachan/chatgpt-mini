import { useEffect, useRef } from 'react';

export default function useInitSession(sessions, currentId, createSession, setCurrentId) {
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current || !sessions) {
      return;
    }
    
    if (sessions.length === 0) {
  console.log("初期化: セッションが存在しないため、新規作成します。");
  const newId = createSession();
  setCurrentId(newId); 
  didInit.current = true;
  return;
}

    if (!currentId) {
      console.log("初期化: 既存の先頭セッションを選択します。");
      setCurrentId(sessions[0].id);
      didInit.current = true;
    }

  }, [sessions, currentId, createSession, setCurrentId]); 
}