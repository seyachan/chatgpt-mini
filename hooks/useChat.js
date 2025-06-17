import { useState, useRef } from "react";
import useCurrentSession from "./useCurrentSession";
import useHandleUserMessage from "./useHandleUserMessage";
import useChatStreamingResponse from "./useChatStreamingResponse";
import useSendMessage from "./useSendMessage";

export default function useChat({ currentId, sessions, addMessageToSession, updateTitle }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tempReply, setTempReply] = useState("");
  const textareaRef = useRef(null);

  const { sessionRef } = useCurrentSession(sessions, currentId);

  const { handleUserMessage } = useHandleUserMessage({
    sessions,
    addMessageToSession,
    updateTitle,
    setInput,
    setIsLoading,
    setTempReply,
  });

  const { fetchAssistantResponse } = useChatStreamingResponse({
    addMessageToSession,
    setIsLoading,
    setTempReply,
  });

  // ✅ useSendMessageに渡すpropsから setInput と setTempReply を削除
  const { sendMessage } = useSendMessage({
    input,
    // setInput,      // 削除
    setIsLoading,
    // setTempReply,  // 削除
    currentId,
    sessionRef,
    handleUserMessage,
    fetchAssistantResponse,
  });

  return {
    input,
    setInput,
    isLoading,
    textareaRef,
    sendMessage,
    tempReply,
  };
}