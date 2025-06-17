import { Pin, PinOff, Trash2, Pencil } from "lucide-react";

export default function SessionList({
  sessions,       
  currentId,    
  onSelect,       
  onDelete,     
  onRename,      
  onTogglePin,   
}) {
  return (
    <ul className="space-y-1"> 
      {sessions.map((s) => (   
        <li
          key={s.id}           
          onClick={() => onSelect(s.id)} 
          className={`group flex justify-between items-center px-3 py-2 rounded-lg cursor-pointer transition
            ${s.id === currentId
              ? "bg-gray-200 dark:bg-[#3c3f4a] " 
              : "hover:bg-gray-100 dark:hover:bg-gray-100"}     // ホバー時の背景
          `}
        >
          <span className="truncate w-40 text-sm">{s.title}</span> 

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">

            <button
              onClick={(e) => {
                e.stopPropagation(); 
                onTogglePin(s.id);  
              }}
              title="ピン切替"
              className="text-gray-400 hover:text-black dark:hover:text-white"
            >
              {s.pinned ? <Pin size={14} /> : <PinOff size={14} />} 
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation(); 
                const newTitle = prompt("新しいタイトル", s.title); 
                if (newTitle) onRename(s.id, newTitle); 
              }}
              title="名前変更"
              className="text-gray-400 hover:text-black dark:hover:text-white"
            >
              <Pencil size={14} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(s.id);      
              }}
              title="削除"
              className="text-gray-400 hover:text-red-500"
            >
              <Trash2 size={14} /> 
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
