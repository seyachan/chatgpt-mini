import { useCallback } from "react";

export default function useHandleUserMessage({
  sessions,
  addMessageToSession,
  updateTitle,
  setInput,
  setIsLoading,
  setTempReply,
}) {
  const handleUserMessage = useCallback(
    async (text, sessionId) => {
      console.log(
        `%c[1] handleUserMessage: メッセージ処理開始。sessionId: "${sessionId}", text: "${text}"`,
        "color: purple; font-weight: bold;"
      );

      const currentSession = sessions.find((s) => s.id === sessionId);

      if (
        !sessionId ||
        !currentSession ||
        !Array.isArray(currentSession.messages)
      ) {
        console.warn("⚠️ sessionIdまたはcurrentSessionが無効です。処理スキップ");
        return false;
      }

      const userMessage = {
        id: "user-" + Date.now(),
        role: "user",
        content: text,
      };

      addMessageToSession(sessionId, userMessage);

      if (currentSession.messages.length === 0) {
        updateTitle(sessionId, text.slice(0, 20));
      }

      // ✅ 以下のデバッグ用ログを追加します
      console.log(
        `%c[DEBUG] useHandleUserMessage: 入力欄をクリアします。`,
        "color: red; font-weight: bold;"
      );

      setInput("");
      setIsLoading(true);
      setTempReply("");

      return true;
    },
    [
      sessions,
      addMessageToSession,
      updateTitle,
      setInput,
      setIsLoading,
      setTempReply,
    ]
  );

  return { handleUserMessage };
}