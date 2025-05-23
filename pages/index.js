// ✅ pages/index.js
import { useState, useEffect } from "react";

const texts = {
  ja: {
    title: "ChatGPT Mini",
    placeholder: "質問を入力してください…",
    send: "送信",
    history: "チャット履歴",
    model: "使用するモデル",
    language: "言語",
    darkMode: "ダークモード"
  },
  en: {
    title: "ChatGPT Mini",
    placeholder: "Type your question…",
    send: "Send",
    history: "Chat History",
    model: "Model",
    language: "Language",
    darkMode: "Dark Mode"
  }
};

export default function Home() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [history, setHistory] = useState([]);
  const [lang, setLang] = useState("ja");
  const [model, setModel] = useState("llama3-70b-8192");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("chatHistory");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const sendMessage = async () => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, model })
    });

    const data = await res.json();
    const newReply = data.reply;
    const newHistory = [...history, { input, reply: newReply }];
    setReply(newReply);
    setHistory(newHistory);
    localStorage.setItem("chatHistory", JSON.stringify(newHistory));
    setInput("");
  };

  const t = texts[lang];

  return (
    <div className="min-h-screen p-6 bg-white text-black dark:bg-gray-900 dark:text-white transition-all">
      <h1 className="text-3xl font-bold mb-4">{t.title}</h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
        className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-white"
        placeholder={t.placeholder}
      />

      <div className="flex flex-wrap items-center mt-4 gap-4">
        <label className="flex items-center">
          {t.model}:
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="ml-2 border p-1 bg-white dark:bg-gray-800 dark:text-white"
          >
            <option value="llama3-70b-8192">LLaMA3 (Groq)</option>
            <option value="gemma-7b-it">Gemma (Groq)</option>
          </select>
        </label>

        <label className="flex items-center">
          {t.language}:
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="ml-2 border p-1 bg-white dark:bg-gray-800 dark:text-white"
          >
            <option value="ja">日本語</option>
            <option value="en">English</option>
          </select>
        </label>

        <button
          onClick={() => setIsDark(!isDark)}
          className="px-3 py-1 border rounded bg-gray-100 dark:bg-gray-700"
        >
          {t.darkMode} {isDark ? "☾" : "☀"}
        </button>

        <button
          onClick={sendMessage}
          className="px-4 py-1 border rounded bg-blue-100 dark:bg-blue-700"
        >
          {t.send}
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">📜 {t.history}:</h2>
        {history.map((item, i) => (
          <div key={i} className="my-4 border rounded p-4 bg-white dark:bg-gray-800">
            <p><strong>🧑‍💼 あなた:</strong> {item.input}</p>
            <p><strong>🤖 GPT:</strong> {item.reply}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
