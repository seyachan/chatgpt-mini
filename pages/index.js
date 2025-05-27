import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import Sidebar from "@/components/Sidebar";
import useChatSessions from "@/utils/useChatSessions";
import useSpeechInput from "@/utils/useSpeechInput";
import rehypeRaw from "rehype-raw"; // ← 追加


const markdownComponents = {
  p: ({ children }) => <p className="leading-relaxed mb-3">{children}</p>,
  code: ({ children }) => (
    <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  ),
  pre: ({ children }) => {
    const extractText = (node) => {
      if (typeof node === "string") return node;
      if (Array.isArray(node)) return node.map(extractText).join("");
      if (typeof node === "object" && node?.props?.children)
        return extractText(node.props.children);
      return "";
    };
    const text = extractText(children).trim();
    const copyToClipboard = () => {
      if (text) {
        navigator.clipboard.writeText(text);
        alert("✅ コピーしました:\n\n" + text);
      } else {
        alert("⚠️ コード取得失敗");
      }
    };
    return (
      <div className="relative group bg-[#F7F7F8] dark:bg-[#343541] p-4 rounded-2xl shadow-sm my-4 overflow-x-auto text-base font-mono max-w-2xl mx-auto">
        <div className="absolute top-2 right-2 flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <button onClick={copyToClipboard} title="コピー" className="hover:underline hover:text-gray-800 dark:hover:text-white transition">
            コピー
          </button>
          <span className="hover:underline hover:text-gray-800 dark:hover:text-white transition">
            ✏️ 編集する
          </span>
        </div>
        <pre className="whitespace-pre-wrap break-words">{children}</pre>
      </div>
    );
  },
  ul: ({ children }) => <ul className="list-disc list-inside space-y-1 ml-5">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 ml-5">{children}</ol>,
  li: ({ children }) => <li className="ml-1">{children}</li>,
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="table-auto border-collapse w-full text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-gray-100 dark:bg-gray-700 text-sm">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="border-b border-gray-300 dark:border-gray-600">{children}</tr>,
  th: ({ children }) => <th className="p-2 font-semibold">{children}</th>,
  td: ({ children }) => <td className="p-2">{children}</td>,

  img: ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    className="my-4 max-w-full rounded-xl shadow"
  />
),

audio: ({ src }) => (
  <audio controls src={src} className="my-2 w-full" />
),

};

const texts = {
  ja: {
    title: "ChatGPT Mini",
    placeholder: "質問を入力してください…",
    send: "送信",
    history: "チャット履歴",
    model: "使用するモデル",
    language: "言語",
    darkMode: "ダークモード",
  },
  en: {
    title: "ChatGPT Mini",
    placeholder: "Type your question…",
    send: "Send",
    history: "Chat History",
    model: "Model",
    language: "Language",
    darkMode: "Dark Mode",
  },
};

const placeholders = [
  "PythonでFizzBuzzを書いて",
  "営業メールの例を教えて",
  "短く自己紹介して",
  "おすすめの本を教えて",
  "JavaScriptで配列をソートする方法は？",
];

export default function Home() {
  const [input, setInput] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState("ja");
  const [model, setModel] = useState("llama3-70b-8192");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tempReply, setTempReply] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const textareaRef = useRef(null);
  const scrollRef = useRef(null);
  const charCount = input?.length || 0;
  const tokenCount = Math.ceil(charCount / 4);
  const { transcript, isRecording, start } = useSpeechInput();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [attachedFile, setAttachedFile] = useState(null);

  const {
    sessions,
    currentId,
    setCurrentId,
    createSession,
    deleteSession,
    updateTitle,
    addMessageToSession,
  } = useChatSessions();

  const currentSession = sessions.find((s) => s.id === currentId);
  const messages = currentSession?.messages || [];

  useEffect(() => {
    if (!currentId && sessions.length === 0) {
      const newId = createSession();
      setCurrentId(newId);
    }
  }, [sessions, currentId]);

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
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
      console.log("📎 添付されたファイル:", file.name);
    }
  };

  const togglePin = (id) => {
    const updated = sessions.map((s) =>
      s.id === id ? { ...s, pinned: !s.pinned } : s
    );
    localStorage.setItem("chatSessions", JSON.stringify(updated));
    window.location.reload();
  };


const sendMessage = async (customInput = input) => {
  if (!currentId) return;

// ファイルがある場合は先に送る（これを return で止めない）
if (attachedFile) {
  const fileUrl = URL.createObjectURL(attachedFile);
  let fileMessage = "";

  if (attachedFile.type.startsWith("image/")) {
  // ✅ HTMLの <img> タグを直接埋め込むことで、blob:URLでも表示されるようにする
  fileMessage = `<img src="${fileUrl}" alt="アップロード画像" />`;
}else if (attachedFile.type.startsWith("audio/")) {
    fileMessage = `<audio controls src="${fileUrl}"></audio>`;
  } else {
    fileMessage = `📎 添付ファイル: ${attachedFile.name}`;
  }

  // ✅ 画像・音声・PDFもここで表示させる
  addMessageToSession(currentId, { role: "user", content: fileMessage });

  // 📌 attachedFileをnullにしておかないと再送信時に前のまま残る
  setAttachedFile(null);
}

// テキストが空の場合はここで return（ファイルは送信済みなのでOK）
if (!customInput.trim()) return;


  const userMessage = { role: "user", content: customInput.trim() };
  addMessageToSession(currentId, userMessage);
  if (!currentSession?.messages?.length) updateTitle(currentId, customInput.slice(0, 20));

  setInput("");
  setIsLoading(true);
  setTempReply("");

  const contextMessages = [...(currentSession?.messages || []), userMessage];
  const res = await fetch(`${process.env.NEXT_PUBLIC_OPENAI_API_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages: contextMessages, stream: true }),
  });

  if (!res.ok || !res.body) {
    const errorText = await res.text();
    console.error("❌ APIエラー:", res.status, errorText);
    alert("APIエラー：" + errorText);
    setIsLoading(false);
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let result = "";
  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunk = decoder.decode(value);
    const lines = chunk.split("\n").filter((line) => line.trim().startsWith("data:"));

    for (const line of lines) {
      const json = line.replace(/^data:\s*/, "");
      if (json === "[DONE]") break;
      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) {
          result += content;
          setTempReply(result);
        }
      } catch (err) {
        console.error("❌ JSON parse error:", json);
      }
    }
  }

  addMessageToSession(currentId, { role: "assistant", content: result });
  setTempReply("");
  setIsLoading(false);
};


  const t = texts[lang];

  return (
    <div className="flex h-screen">
      {/* Sidebar & toggle */}
      {sidebarOpen && (
        <Sidebar
          sessions={sessions}
          currentId={currentId}
          onSelect={setCurrentId}
          onNew={createSession}
          onDelete={deleteSession}
          onRename={updateTitle}
          onTogglePin={(id) => {
            const updated = sessions.map((s) =>
              s.id === id ? { ...s, pinned: !s.pinned } : s
            );
            localStorage.setItem("chatSessions", JSON.stringify(updated));
            window.location.reload();
          }}
        />
      )}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-4 left-4 z-50 p-2 bg-gray-200 dark:bg-gray-700 rounded-md text-sm"
      >
        {sidebarOpen ? "←" : "→"}
      </button>

      {/* Chat area */}
      <div className="flex flex-col flex-1">
        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 text-black dark:text-white px-4 py-6">
          <div className="max-w-3xl mx-auto">
            {/* Message Display */}
            {messages.length === 0 && !tempReply ? (
              <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center text-gray-700 dark:text-gray-300 px-4">
                <h2 className="text-2xl font-bold mb-6">今日は何をしましょうか？</h2>
                <div className="w-full max-w-xl bg-white dark:bg-[#40414f] border border-gray-300 dark:border-gray-600 rounded-2xl shadow-md px-4 py-3 space-y-2 text-sm">
                  <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        ref={textareaRef}
        className="flex-1 bg-transparent outline-none text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
      />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start px-1 text-sm text-gray-500 dark:text-gray-400">
      <label className="cursor-pointer hover:text-black dark:hover:text-white transition" title="ファイルを添付">
        ＋
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,audio/*,.pdf"
        />
      </label>
    </div>
                    <div className="flex items-center space-x-3">
                      <button onClick={start} className="text-gray-400 hover:text-black dark:hover:text-white transition" title="音声入力">
                        🎤
                      </button>
                      <button
                        onClick={() => sendMessage()}
                        disabled={isLoading || !input.trim()}
                        className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition disabled:opacity-40"
                        title="送信"
                      >
                        ➤
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((item, i) => (
                  <div key={i} className={`flex ${item.role === "user" ? "justify-end" : "justify-start"} mb-4`}>
                    <div className={`px-4 py-3 text-sm leading-relaxed rounded-2xl shadow-sm max-w-[90%] whitespace-pre-wrap ${
                      item.role === "user"
                        ? "bg-[#ECECF1] dark:bg-[#40414f] text-black dark:text-white rounded-br-none"
                        : "bg-[#F7F7F8] dark:bg-[#343541] text-black dark:text-white rounded-bl-none"
                    }`}>
                      <ReactMarkdown
  rehypePlugins={[rehypeHighlight, rehypeRaw]} // ← rehypeRawを追加
  components={markdownComponents}
>
  {item.content}
</ReactMarkdown>

                    </div>
                  </div>
                ))}
                {tempReply && (
                  <div className="flex justify-start mb-4">
                    <div className="px-4 py-3 text-sm leading-relaxed rounded-2xl shadow-sm max-w-[90%] bg-[#F7F7F8] dark:bg-[#343541] text-black dark:text-white rounded-bl-none">
                      <ReactMarkdown
  rehypePlugins={[rehypeHighlight, rehypeRaw]}
  components={markdownComponents}
  skipHtml={false} // ← これが必要
>

  {tempReply}
</ReactMarkdown>

                    </div>
                  </div>
                )}
                {isLoading && !tempReply && (
                  <div className="flex justify-start mb-4">
                    <div className="px-4 py-3 text-sm leading-relaxed rounded-2xl shadow-sm max-w-[90%] bg-[#F7F7F8] dark:bg-[#343541] text-black dark:text-white rounded-bl-none">
                      <span className="animate-pulse text-xl">...</span>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </>
            )}
          </div>
        </div>
      {(messages.length > 0 || tempReply) && (
  <div className="sticky bottom-0 bg-white dark:bg-[#40414f] border-t border-gray-200 dark:border-gray-600 px-4 py-3 z-10">
    <div className="max-w-3xl mx-auto w-full border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-2 bg-[#f7f7f8] dark:bg-[#343541] shadow-md space-y-2">
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          ref={textareaRef}
          className="flex-1 bg-transparent outline-none text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 px-1">
        <label className="cursor-pointer hover:text-black dark:hover:text-white transition" title="ファイルを添付">
          ＋
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,audio/*,.pdf"
          />
        </label>
        <div className="flex space-x-2 items-center">
          <button
            onClick={start}
            className="text-gray-400 hover:text-black dark:hover:text-white transition"
            title="音声入力"
          >
            🎤
          </button>
          <button
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            className="p-2 rounded-full bg-black text-white hover:bg-gray-800 disabled:opacity-40"
            title="送信"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  </div>
)}

         </div> 
    </div>   
  );
}
