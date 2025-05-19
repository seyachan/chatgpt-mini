// pages/index.js
import { useState, useEffect } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // 🔄 ローディング状態

  // 🔁 ページ初回読み込み時に localStorage から履歴を復元
  useEffect(() => {
    const stored = localStorage.getItem("chatHistory");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  // 📨 メッセージ送信処理
  const sendMessage = async () => {
    setIsLoading(true); // ⏳ ローディング開始

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    const newReply = data.reply;
    setReply(newReply);

    // 履歴を追加して保存
    const newHistory = [...history, { input, reply: newReply }];
    setHistory(newHistory);
    localStorage.setItem("chatHistory", JSON.stringify(newHistory));

    setInput(""); // 入力欄をクリア
    setIsLoading(false); // ✅ ローディング終了
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>ChatGPT Mini</h1>

      {/* 🔁 ローディング表示 */}
      {isLoading && <p>🤖 考え中...</p>}

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
        cols={50}
        placeholder="質問を入力してください..."
      />
      <br />
      <button onClick={sendMessage}>送信</button>

      <div style={{ marginTop: "1rem" }}>
        <strong>📜 チャット履歴:</strong>
        {history.map((item, index) => (
          <div key={index} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc" }}>
            <p><strong>あなた:</strong> {item.input}</p>
            <p><strong>GPT:</strong> {item.reply}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
