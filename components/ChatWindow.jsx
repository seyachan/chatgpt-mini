// components/ChatWindow.jsx

import MessageBubble from "@/components/MessageBubble";

export default function ChatWindow({ messages, tempReply, tempUserMessage, isLoading, scrollRef }) {
  return (
    <div className="flex flex-col h-full space-y-4">
      {messages.length === 0 && !isLoading && (
        <div className="text-center text-gray-400 mt-20">
          ここにメッセージが表示されます。
        </div>
      )}

      {messages.map(msg => (
        <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
      ))}

      {tempUserMessage && (
        <MessageBubble
          role="user"
          content={tempUserMessage.content}
          isTemp={true}
        />
      )}

      {isLoading && tempReply && (
        <MessageBubble
          role="assistant"
          content={tempReply}
          isTemp={true}
          isLoading={true}
        />
      )}

      <div ref={scrollRef} />
    </div>
  );
}
