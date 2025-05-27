// components/ChatMessage.tsx
import { motion } from "framer-motion";

type Props = { role: "user" | "assistant"; content: string };

export default function ChatMessage({ role, content }: Props) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <img src="/gpt.png" alt="GPT" className="w-8 h-8 rounded-full mr-2" />
      )}

      <div
        className={`max-w-[80%] whitespace-pre-wrap break-words p-4 rounded-2xl leading-relaxed
        ${isUser
          ? "bg-blue-100 dark:bg-blue-600 text-blue-900 dark:text-white rounded-br-none"
          : "bg-gray-100 dark:bg-[#202123] text-gray-900 dark:text-gray-100 rounded-bl-none"}`}
      >
        {content}
      </div>

      {isUser && (
        <img src="/user.png" alt="You" className="w-8 h-8 rounded-full ml-2" />
      )}
    </motion.div>
  );
}
