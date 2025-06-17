import { useRef } from "react";

export default function ChatInputBox({
  input,
  setInput,
  placeholder,
  isLoading,
  sendMessage,
  startRecording,
  handleFileChange,
  textareaRef,
}) {
  const fileInputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-full px-4 pb-4">
      <div className="w-full border border-gray-300 dark:border-white/20 rounded-xl bg-white dark:bg-[#40414F] shadow-md px-3 py-2">
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
    
          onChange={(e) => {
            console.log(
              `%c[DEBUG] onChange: テキストエリアが変更されました。 value: "${e.target.value}"`,
              "color: blue;"
            );
            setInput(e.target.value);
          }}
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
              className="p-2 rounded-full  text-black hover:bg-gray-100 border border-gray-300 shadow-sm disabled:opacity-50"
              title="送信"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}