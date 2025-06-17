import { useCallback } from "react";

export default function useHandleUserMessage({
  currentId,
  currentSession,
  addMessageToSession,
  updateTitle,
  setInput,
  setIsLoading,
  setTempReply,
}) {
  const handleUserMessage = useCallback(async (text) => {
    console.log(
      `%c[1] handleUserMessage: メッセージ処理開始。text: "${text}"`,
      "color: purple; font-weight: bold;"
    );

    const messages = Array.isArray(currentSession?.messages)
      ? currentSession.messages
      : [];

    const userMessage = {
      id: "user-" + Date.now(),
      role: "user",
      content: text,
    };

    const lastMessage = messages.at(-1);
    if (lastMessage?.role === "user" && lastMessage.content === text) {
      console.warn("⚠️ 同じ内容が連続送信されました。スキップします。");
      return false;
    }

    addMessageToSession(currentId, userMessage);

    if (messages.length === 0) {
      updateTitle(currentId, text.slice(0, 20));
    }

    setInput("");
    setIsLoading(true);
    setTempReply("");

    return true;
  }, [
    currentId,
    currentSession,
    addMessageToSession,
    updateTitle,
    setInput,
    setIsLoading,
    setTempReply,
  ]);

  return { handleUserMessage };
}
