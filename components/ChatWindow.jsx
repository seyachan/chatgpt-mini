import MessageBubble from "@/components/MessageBubble";
import { useRef, useEffect } from 'react';

export default function ChatWindow({ messages, isLoading }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full space-y-4">
      {messages.map((msg, index) => (
        <MessageBubble key={msg.id || index} role={msg.role} content={msg.content} />
      ))}
      {isLoading && (
        <MessageBubble role="assistant" content="..." isLoading={true} />
      )}
      <div ref={scrollRef} />
    </div>
  );
}