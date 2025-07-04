import { useRef } from "react";
import { Send, Plus } from "lucide-react";

export default function EmptyStateBox({
  input,
  setInput,
  placeholder,
  isLoading,
  sendMessage,
  handleFileChange = () => {},
  startRecording = () => {},
}) {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 text-center">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-gray-100">
        ChatGPT
      </h1>
      <div className="w-full border border-gray-300 dark:border-white/20 rounded-xl bg-white dark:bg-[#40414F] shadow-md px-3 py-2 flex items-center gap-2">
        <button onClick={() => fileInputRef.current.click()} className="p-2 rounded hover:bg-gray-50 dark:hover:bg-white/10 transition" title="ファイルを添付">
          <Plus size={20} />
        </button>
        <input type="file" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
        <textarea
          ref={textareaRef}
          rows={1}
          value={input || ""}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className="w-full resize-none py-2 text-sm bg-transparent text-black dark:text-white placeholder-gray-400 outline-none"
        />
        <button onClick={startRecording} className="p-2 rounded hover:bg-gray-50 dark:hover:bg-white/10 transition" title="音声入力">
          🎤
        </button>
        <button onClick={sendMessage} disabled={isLoading || !input} className="p-2 rounded-full text-black hover:bg-gray-100 border border-gray-300 shadow-sm disabled:opacity-50" title="送信">
          <Send size={18} className="-mr-0.5 -mt-0.5" />
        </button>
      </div>
    </div>
  );
}