import { useRef, useEffect } from "react";

export default function MessageInputBox({
  input,
  setInput,
  placeholder,
  isLoading,
  startRecording,
  sendMessage,
}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  return (
    <div className="w-full px-4 py-4">
  <div className="flex items-center gap-2 bg-white dark:bg-[#40414f] border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 shadow-sm">
    <textarea
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder={isLoading ? "応答を待っています..." : placeholder}
      ref={textareaRef}
      disabled={isLoading}
      rows={1}
      className="flex-1 resize-none bg-transparent outline-none text-sm text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border-none"
    />  

    <div className="flex space-x-2 items-center ml-2">
      <button
        onClick={startRecording}
        className="text-gray-400 hover:text-black dark:hover:text-white transition disabled:opacity-50"
        title="音声入力"
        disabled={isLoading}
      >
        🎤
      </button>

      <button
        onClick={sendMessage}
        disabled={isLoading || !input.trim()}
        className="p-2 rounded-full bg-black text-white hover:bg-gray-800 disabled:opacity-50"
        title="送信"
      >
        ➤
      </button>
    </div>
  </div>
</div>

  );
}
