import { useMemo, useState, useRef } from "react";
import ChatLayout from "@/components/ChatLayout";
import useChatSessions from "@/hooks/useChatSessions";
import { useAuth } from "@/contexts/AuthContext";
import useHomeState from "@/hooks/useHomeState";

export default function Home() {
  const { sidebarOpen, setSidebarOpen, placeholder } = useHomeState();
  const { user, isLoading: authIsLoading } = useAuth();
  
  const {
    sessions, currentId, setCurrentId, isLoading: sessionsIsLoading,
    createSession, addMessage, deleteSession, updateTitle, togglePin
  } = useChatSessions();

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef(null);

  const currentSession = useMemo(() => {
    return sessions.find((s) => s.id === currentId);
  }, [sessions, currentId]);

  const sendMessage = async () => {
    if (!input.trim() || !currentId) return;
    
    const messageContent = input;
    setInput("");
    setIsSending(true);
    await addMessage(currentId, messageContent);
    setIsSending(false);
  };
  
  if (authIsLoading || sessionsIsLoading) {
    return <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-gray-900">読み込み中...</div>;
  }

  return (
    <ChatLayout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      sessions={sessions}
      currentId={currentId}
      setCurrentId={setCurrentId}
      createSession={createSession}
      deleteSession={deleteSession}
      updateTitle={updateTitle}
      togglePin={togglePin}
      input={input}
      setInput={setInput}
      placeholder={placeholder || "メッセージを入力..."}
      isLoading={isSending}
      messages={currentSession?.messages || []}
      textareaRef={textareaRef}
      sendMessage={sendMessage}
      handleFileChange={() => {}}
      startRecording={() => {}}
    />
  );
}