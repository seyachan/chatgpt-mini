// components/EmptyStateBox.jsx

import { useRef } from "react"; 

export default function EmptyStateBox({
  input,
  setInput,
  placeholder,
  textareaRef,
  handleFileChange,
  sendMessage,
  isLoading,
  startRecording, 
}) {

  const fileInputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (

    <div className="flex-1 flex items-center justify-center w-full">
      <div className="max-w-2xl w-full mx-auto px-4">
        <h1 className="text-lg font-semibold mb-4 text-center text-gray-700 dark:text-gray-200">
          どこから始めますか？
        </h1>

        <div className="w-full border border-gray-300 dark:border-white/20 rounded-xl bg-white dark:bg-[#40414F] shadow-md px-3 py-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full resize-none rounded-md px-2 py-1 text-sm bg-transparent text-black dark:text-white placeholder-gray-400 outline-none"
          />

          <div className="flex justify-between items-center mt-2">
            <div>
              <button
                onClick={() => fileInputRef.current.click()}
                className="p-2 rounded hover:bg-gray-50 dark:hover:bg-white/10 transition"
                title="ファイルを添付"
              >
                +
              </button>

              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={startRecording}
                className="p-2 rounded hover:bg-gray-50 dark:hover:bg-white/10 transition"
                title="音声入力"
              >
                🎤
              </button>

              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="p-2 rounded-full text-black hover:bg-gray-100 border border-gray-300 shadow-sm disabled:opacity-50"
                title="送信"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}