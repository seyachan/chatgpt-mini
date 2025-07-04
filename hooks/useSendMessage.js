// hooks/useSendMessage.js

import { useRef } from "react";

export default function useSendMessage({
  input,
  setIsLoading,
  currentId,
  sessionRef,
  handleUserMessage,
  fetchAssistantResponse,
}) {
  const isSending = useRef(false);

  const sendMessage = async (customInput) => {

    if (isSending.current) return;

    const text = (typeof customInput === "string" ? customInput : input).trim();

    if (!text || !currentId || !sessionRef.current) return;

    isSending.current = true;
    setIsLoading(true);

    try {
     
      const proceed = await handleUserMessage(text, currentId);

      if (proceed) {
    
        await fetchAssistantResponse(text, currentId, sessionRef.current);
      }
    } catch (err) {
      console.error("sendMessage でエラーが発生しました:", err);

    } finally {

      isSending.current = false;
      setIsLoading(false);
    }
  };

  return { sendMessage };
}