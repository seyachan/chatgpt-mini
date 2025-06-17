import { useEffect, useState, useRef, useMemo } from "react";
import ChatLayout from "@/components/ChatLayout";
import useChat from "@/hooks/useChat";
import useSpeechInput from "@/utils/useSpeechInput";
import useHomeState from "@/hooks/useHomeState";
import useInitSession from "@/hooks/useInitSession";
import useTranscriptInput from "@/hooks/useTranscriptInput";
import usePlaceholder from "@/hooks/usePlaceholder";
import useScrollToBottom from "@/hooks/useScrollToBottom";
import useAutoResizeTextarea from "@/hooks/useAutoResizeTextarea";
import useChatSessions from "@/hooks/useChatSessions";
import texts from "@/constants/texts";
import { formatFileMessage } from "@/utils/fileMessageFormatter";

const placeholders = [
  "PythonでFizzBuzzを書いて",
  "営業メールの例を教えて",
  "短く自己紹介して",
  "おすすめの本を教えて",
  "JavaScriptで配列をソートする方法は？",
];

export default function Home() {
  const {
    isDark,
    setIsDark,
    lang,
    setLang,
    model,
    setModel,
    copiedIndex,
    setCopiedIndex,
    placeholder,
    setPlaceholder,
    sidebarOpen,
    setSidebarOpen,
  } = useHomeState();

  const [attachedFile, setAttachedFile] = useState(null);

  const {
    sessions,
    currentId,
    setCurrentId,
    createSession,
    deleteSession,
    updateTitle,
    addMessageToSession,
    togglePin,
  } = useChatSessions();

  const { transcript, isRecording, start } = useSpeechInput();

  const scrollRef = useRef(null);

  const currentSession = useMemo(() => {
    return sessions.find((s) => s.id === currentId);
  }, [sessions, currentId]);

  useEffect(() => {
    if (sessions.length === 0 && !currentId) {
      const id = createSession();
      setCurrentId(id);
      console.log("🌱 初回セッションを自動作成しました:", id);
    }
  }, [sessions, currentId, createSession, setCurrentId]);

  console.log("📌 sessions:", sessions.map((s) => s.id));
  console.log("🔍 currentId:", currentId);
  console.log("🧪 currentSession:", currentSession);

  const {
    input,
    setInput,
    isLoading,
    tempReply,
    textareaRef,
    sendMessage,
  } = useChat({
    currentId,
    sessions,
    addMessageToSession,
    updateTitle,
  });

  console.log(
    `%c[DEBUG] Home Component: 再レンダリングされました。現在のinputの値: "${input}"`,
    "color: green;"
  );

  const t = texts[lang];

  useInitSession(sessions, currentId, createSession, setCurrentId);
  useTranscriptInput(transcript, setInput);
  usePlaceholder(placeholders, setPlaceholder);
  useScrollToBottom(scrollRef, [currentSession?.messages, isLoading]);
  useAutoResizeTextarea(textareaRef, input);
  
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setAttachedFile(file);
    } else if (file) {
      alert("画像ファイル（JPEG, PNG, GIFなど）を選択してください。");
    }
    e.target.value = null;
  };

  useEffect(() => {
    if (attachedFile) {
      const fileMessageContent = formatFileMessage(attachedFile);
      const newMessage = {
        id: "user-" + Date.now(),
        role: "user",
        content: fileMessageContent,
      };
      addMessageToSession(currentId, newMessage);
      setAttachedFile(null);
    }
  }, [attachedFile, addMessageToSession, currentId]);


  if (!currentSession) {
    console.log("⚠️ currentSession が見つかりません");
    return null;
  }

  console.log(
    `%c[5] index.jsx: 最終描画データ。messages:`,
    "color: teal; font-weight: bold;",
    currentSession?.messages
  );

  return (
    <ChatLayout
      key={currentId}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      sessions={sessions}
      currentId={currentId}
      setCurrentId={setCurrentId}
      createSession={createSession}
      deleteSession={deleteSession}
      updateTitle={updateTitle}
      input={input}
      setInput={setInput}
      placeholder={placeholder}
      isLoading={isLoading}
      tempReply={tempReply}
      messages={currentSession?.messages || []}
      textareaRef={textareaRef}
      handleFileChange={handleFileChange}
      startRecording={start}
      sendMessage={sendMessage}
      togglePin={togglePin}
      scrollRef={scrollRef}
    />
  );
}