// hooks/useSendMessage.js

import { useRef } from "react";

export default function useSendMessage({
  input,
  // setInput, // 不要になる
  setIsLoading,
  // setTempReply, // 不要になる
  currentId,
  sessionRef,
  handleUserMessage,
  fetchAssistantResponse,
}) {
  const isSending = useRef(false);

  // ✅ 以下のように sendMessage 関数を修正します
  const sendMessage = async (customInput) => {
    // 処理中の場合は多重送信を防ぐ
    if (isSending.current) return;

    // 送信するテキストを確定
    const text = (typeof customInput === "string" ? customInput : input).trim();

    // テキストが空、またはセッションが存在しない場合は何もしない
    if (!text || !currentId || !sessionRef.current) return;

    // 送信処理開始
    isSending.current = true;
    setIsLoading(true);

    try {
      // 1. ユーザーメッセージの処理（履歴追加と入力欄クリア）を呼び出す
      // handleUserMessage が成功した場合のみ次に進む
      const proceed = await handleUserMessage(text, currentId);

      if (proceed) {
        // 2. アシスタントの応答を待つ
        await fetchAssistantResponse(text, currentId, sessionRef.current);
      }
    } catch (err) {
      console.error("sendMessage でエラーが発生しました:", err);
      // ここでユーザーにエラーを通知する処理を追加することも可能
    } finally {
      // 3. 成功・失敗にかかわらず、必ずローディング状態を解除する
      isSending.current = false;
      setIsLoading(false);
    }
  };

  return { sendMessage };
}