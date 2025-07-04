// hooks/useChatSessions.js

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import generateUUID from '@/utils/generateUUID';

const LOCAL_STORAGE_KEY = 'anonymousChatSessions';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // <--- 1. この行を追加

export default function useChatSessions() {
  const { token, isLoading: authIsLoading } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const createSession = useCallback(async (isInitial = false) => {
    let newSession;
    if (token) {
      try {
        // <--- 2. URLを修正
        const response = await fetch(`${API_BASE_URL}/api/v1/sessions`, {
          method: 'POST', headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('APIセッション作成失敗');
        newSession = await response.json();
      } catch (error) { console.error(error); return null; }
    } else {
      newSession = { id: generateUUID(), title: "新しいチャット", messages: [] };
    }
    
    if (newSession) {
      setSessions(prev => isInitial ? [newSession] : [newSession, ...prev]);
      setCurrentId(newSession.id);
    }
    return newSession;
  }, [token]);

  useEffect(() => {
    const loadData = async () => {
      if (authIsLoading) return;
      setIsLoading(true);
      let loadedSessions = [];
      if (token) {
        try {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          // <--- 2. URLを修正
          const response = await fetch(`${API_BASE_URL}/api/v1/sessions`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) loadedSessions = await response.json();
        } catch (error) { console.error(error); }
      } else {
        try {
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (stored) loadedSessions = JSON.parse(stored);
        } catch (error) { console.error(error); }
      }

      setSessions(loadedSessions);
      if (loadedSessions.length > 0) {
        setCurrentId(loadedSessions[0].id);
      } else {
        await createSession(true);
      }
      setIsLoading(false);
    };
    loadData();
  }, [token, authIsLoading, createSession]);

  useEffect(() => {
    if (!token && !authIsLoading && sessions.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions, token, authIsLoading]);

  const addMessage = useCallback(async (sessionId, content) => {
    if (!sessionId) return;
    const userMessage = { id: `user-${Date.now()}`, role: 'user', content };
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: [...(s.messages || []), userMessage] } : s));

    let aiMessage;
    if (token) {
      try {
        // <--- 2. URLを修正
        const response = await fetch(`${API_BASE_URL}/api/v1/sessions/${sessionId}/messages`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'user', content })
        });
        if (!response.ok) throw new Error('AIからの返信取得に失敗');
        aiMessage = await response.json();
      } catch (error) { 
        aiMessage = { id: generateUUID(), role: 'assistant', content: '申し訳ありません、AIとの通信でエラーが発生しました。' };
      }
    } else {
      aiMessage = { id: generateUUID(), role: 'assistant', content: `「${content}」への返信です(匿名)` };
    }
    
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        const newMessages = s.messages.filter(m => m.id !== userMessage.id);
        newMessages.push(userMessage, aiMessage);
        return { ...s, messages: newMessages };
      }
      return s;
    }));
  }, [token]);

  const deleteSession = useCallback(async (idToDelete) => {
     const newSessions = sessions.filter(s => s.id !== idToDelete);
     if (currentId === idToDelete) {
       setCurrentId(newSessions.length > 0 ? newSessions[0].id : null);
     }
     setSessions(newSessions);
     if (token) {
       try {
        // <--- 2. URLを修正
         await fetch(`${API_BASE_URL}/api/v1/sessions/${idToDelete}`, {
           method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
         });
       } catch (error) { console.error("セッション削除APIエラー:", error); }
     }
  }, [token, sessions, currentId]);
  
  return { sessions, currentId, setCurrentId, isLoading, createSession, addMessage, deleteSession };
}