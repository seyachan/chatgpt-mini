import { useState } from "react";
import { Plus, Search, Book, Folder, Trash2, Pin, PinOff } from "lucide-react";

export default function Sidebar({ sessions, currentId, onSelect, onNew, onDelete, onRename, onTogglePin }) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleRename = (id) => {
    if (editTitle.trim()) {
      onRename(id, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle("");
  };

  const filteredSessions = sessions
    .filter((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (b.pinned === a.pinned ? 0 : b.pinned ? 1 : -1));

  return (
    <div className="w-[260px] bg-[#F7F7F8] dark:bg-[#202123] text-sm text-black dark:text-white h-screen flex flex-col border-r border-gray-200 dark:border-gray-700">
      {/* 新しいチャット */}
      <div className="p-3 border-b border-gray-300 dark:border-gray-600">
        <button
          onClick={onNew}
          className="flex items-center gap-2 w-full p-2 bg-white dark:bg-[#343541] rounded-md hover:bg-gray-100 dark:hover:bg-[#3e3f4b] transition"
        >
          <Plus className="w-4 h-4" />
          新しいチャット
        </button>
      </div>

      {/* 検索・ライブラリ・プロジェクト */}
      <div className="p-3 space-y-3 flex-1 overflow-y-auto">
        <div className="flex items-center gap-2 px-2">
          <Search className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <input
            type="text"
            placeholder="チャットを検索"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 px-2">
          <Book className="w-4 h-4" />
          <span className="text-sm">ライブラリ</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 px-2">
          <Folder className="w-4 h-4" />
          <span className="text-sm">プロジェクト</span>
        </div>

        {/* 履歴リスト */}
        <div className="mt-5 space-y-1">
          <div className="text-xs text-gray-500 dark:text-gray-400 px-2">過去のチャット</div>
          {filteredSessions.map((s) => (
            <div key={s.id} className="group flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
              {editingId === s.id ? (
                <input
                  autoFocus
                  className="flex-1 mr-2 bg-transparent outline-none text-black dark:text-white text-sm"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => handleRename(s.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename(s.id);
                  }}
                />
              ) : (
                <button
                  onClick={() => onSelect(s.id)}
                  className={`flex-1 text-left truncate text-sm ${currentId === s.id ? "font-semibold" : ""}`}
                  onDoubleClick={() => {
                    setEditingId(s.id);
                    setEditTitle(s.title);
                  }}
                >
                  {s.title || "新しいチャット"}
                </button>
              )}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => onTogglePin(s.id)} title="ピン留め">
                  {s.pinned ? (
                    <Pin className="w-4 h-4 text-blue-500" />
                  ) : (
                    <PinOff className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                <button onClick={() => onDelete(s.id)} title="削除">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
