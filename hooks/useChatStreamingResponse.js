import { useCallback } from "react";

export default function useChatStreamingResponse({
  addMessageToSession,
  setIsLoading,
  setTempReply,
}) {
  const fetchAssistantResponse = useCallback(
    async (text, currentId, currentSession) => {
      setIsLoading(true);
      setTempReply("");

      // この入力チェックは有効なので残します
      if (!text.trim()) {
        console.warn("⚠️ 空の入力です。リクエストをスキップします。");
        setIsLoading(false);
        return;
      }

      let messageId = "assistant-" + Date.now();

      try {
        const previousMessages = currentSession?.messages || [];

        // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
        //                ここが最後の修正点です
        // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
        // handleUserMessageで追加済みのメッセージ履歴をそのまま使うようにします。
        // ここで `text` を重複して追加するのをやめます。
        const cleanMessages = previousMessages.map(m => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: cleanMessages,
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let result = "";

        // このストリーム処理部分は完璧なので、変更しません
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter(line => line.trim().startsWith("data:"));

          for (const line of lines) {
            const data = line.replace("data: ", "");
            if (data === "[DONE]") break;

            try {
              const json = JSON.parse(data);
              const content = json.choices?.[0]?.delta?.content;
              if (content) {
                result += content;
                setTempReply(result);
              }
            } catch (err) {
              //
            }
          }
        }
        
        // 最終的なメッセージを履歴に追加する処理（完璧なので変更なし）
        if (result.trim()) {
          const assistantMessage = {
            id: messageId,
            role: "assistant",
            content: result,
          };
          addMessageToSession(currentId, assistantMessage);
        } else {
          console.warn("⚠️ 生成されたcontentが空でした。");
        }
      } catch (error) {
        console.error("ストリーミングレスポンスの取得中にエラー:", error);
        addMessageToSession(currentId, {
          id: 'error-' + Date.now(),
          role: 'assistant',
          content: 'エラーが発生しました。APIサーバーのログを確認してください。',
        });
      } finally {
        setTempReply("");
        setIsLoading(false);
      }
    },
    [addMessageToSession, setIsLoading, setTempReply]
  );

  return { fetchAssistantResponse };
}