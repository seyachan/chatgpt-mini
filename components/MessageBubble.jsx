import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";

export default function MessageBubble({ role, content, isTemp = false, isLoading = false, scrollRef = null }) {
  const isUser = role === "user";

  console.log("🧪 MessageBubble:", { role, content, isTemp, isLoading });

  const safeContent = typeof content === "string"
    ? content || "（空のメッセージ）"
    : JSON.stringify(content ?? "(invalid content)");

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        ref={scrollRef}
        className={`px-4 py-3 text-sm leading-relaxed rounded-2xl shadow-sm max-w-[calc(100%-2rem)] whitespace-pre-wrap ${
          isUser
            ? "bg-[#ECECF1] dark:bg-[#40414f] text-black dark:text-white rounded-br-none"
            : "bg-[#F7F7F8] dark:bg-[#343541] text-black dark:text-white rounded-bl-none"
        }`}
      >
        {isLoading ? (
          <span className="animate-pulse text-xl">...</span>
        ) : (
          <ReactMarkdown
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
            skipHtml={false}
          >
            {safeContent}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
  
}
