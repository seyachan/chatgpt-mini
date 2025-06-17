// hooks/useAppEffects.js
import { useEffect } from "react";

export default function useAppEffects({
  sessions,
  currentId,
  createSession,
  setCurrentId,
  transcript,
  setInput,
  placeholders,
  setPlaceholder,
  isDark,
  messages,
  isLoading,
  scrollRef,
  textareaRef,
  input
}) {

  useEffect(() => {
    if (transcript) setInput((prev) => prev + transcript);
  }, [transcript]);

  useEffect(() => {
    const random = placeholders[Math.floor(Math.random() * placeholders.length)];
    setPlaceholder(random);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);
}
