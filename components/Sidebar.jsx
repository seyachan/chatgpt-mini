// components/Sidebar.jsx

import { useState, useMemo } from "react"; 
import { MessageSquarePlus, Search, BookOpen } from "lucide-react";
import SessionList from "./SessionList";

export default function Sidebar({
  sessions,
  currentId,
  onSelect,
  onNew,
  onDelete,
  onRename,
  onTogglePin,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSessions = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      return sessions; 
    }
    return sessions.filter((session) =>
      session.title.toLowerCase().includes(query)
    );
  }, [sessions, searchQuery]);

  const pinnedSessions = filteredSessions
    .filter((s) => s.pinned)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  const otherSessions = filteredSessions
    .filter((s) => !s.pinned)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  return (
    <div className="w-full h-full bg-[#f7f7f8] dark:bg-[#1e1e20] text-black dark:text-white flex flex-col p-2 gap-2">
      <nav className="text-xs leading-tight mt-8"> {/* 閉じるボタンがなくなった分、少しマージンを追加 */}
        <ul className="space-y-1">
          <li
            onClick={onNew}
            className="flex items-center text-xs gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#2a2b32] cursor-pointer"
          >
            <MessageSquarePlus size={16} />
            <span className="text-sm">新しいチャット</span>
          </li>
          <li className="relative flex items-center">
            <Search
              size={16}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="チャットを検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-0 rounded-md pl-8 pr-3 py-2 text-sm outline-none"
            />
          </li>
          <li className="flex items-center text-xs gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#2a2b32] cursor-pointer">
            <BookOpen size={16} />
            <span className="text-sm">ライブラリ</span>
          </li>
        </ul>
      </nav>
      <div className="border-b border-gray-200 dark:border-gray-700 mx-2"></div>
      <div className="flex-1 overflow-y-auto space-y-4 pt-2">
        {pinnedSessions.length > 0 && (
          <div>
            <h2 className="text-xs text-gray-400 font-medium px-2 mb-1">
              ピン留め済み
            </h2>
            <SessionList
              sessions={pinnedSessions}
              currentId={currentId}
              onSelect={onSelect}
              onDelete={onDelete}
              onRename={onRename}
              onTogglePin={onTogglePin}
            />
          </div>
        )}
        {(searchQuery && filteredSessions.length === 0) ? (
            <p className="text-xs text-gray-500 text-center py-4">一致するチャットはありません。</p>
        ) : (
          <div>
            <h2 className="text-xs text-gray-400 font-medium px-2 mb-1">
              最近のチャット
            </h2>
            <SessionList
              sessions={otherSessions}
              currentId={currentId}
              onSelect={onSelect}
              onDelete={onDelete}
              onRename={onRename}
              onTogglePin={onTogglePin}
            />
          </div>
        )}
      </div>
    </div>
  );
}