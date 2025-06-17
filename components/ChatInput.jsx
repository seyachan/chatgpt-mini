import { Send } from "lucide-react";

export default function ChatInput({
  input,           
  setInput,         
  textareaRef,    
  sendMessage,    
  isLoading        
}) {
  return (
  
    <div className="flex items-end gap-2 w-full max-w-3xl mx-auto">

      <textarea
        ref={textareaRef}
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();      
            }
          }}
        placeholder="メッセージを入力…"
        className="flex-1 resize-none rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-black dark:text-white shadow-sm focus:outline-none"
      />

      <button
        onClick={sendMessage}                         
        disabled={isLoading || !input.trim()}      
        className="p-2 text-gray-500 hover:text-black dark:hover:text-white disabled:opacity-30"
      >
        <Send size={20} /> 
      </button>
    </div>
  );
}
