import { PlusCircle, MessageSquare, Trash2 } from "lucide-react";
import Image from "next/image";

interface Chat {
  id: number;
  title: string;
}

interface SidebarProps {
  chats: Chat[];
  activeChatId: number | null;
  onSelectChat: (id: number) => void;
  onNewChat: () => void;
  onLogout: () => void;
  onDeleteChat: (id: number) => void;
}

export default function Sidebar({ chats, activeChatId, onSelectChat, onNewChat, onLogout, onDeleteChat }: SidebarProps) {
  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-800/80 text-zinc-100 flex flex-col h-screen shadow-2xl relative z-10">
      <div className="p-5 border-b border-zinc-800/50 flex items-center gap-3">
        <Image src="/logo.png" alt="Researchatron Logo" width={32} height={32} className="rounded-md shadow-sm" />
        <span className="font-semibold tracking-tight text-white">Researchatron</span>
      </div>

      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-between gap-2 border border-zinc-700/80 rounded-lg p-2.5 hover:bg-zinc-800 hover:border-zinc-600 transition-all text-sm font-medium shadow-sm group"
        >
          <span className="text-zinc-200">New Chat</span>
          <PlusCircle size={18} className="text-zinc-400 group-hover:text-white transition-colors" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`w-full group rounded-lg flex items-center justify-between transition-all ${
              activeChatId === chat.id 
                ? "bg-zinc-800/80 text-white shadow-inner border border-zinc-700/50" 
                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent"
            }`}
          >
            <button
              onClick={() => onSelectChat(chat.id)}
              className="flex-1 text-left p-2.5 flex items-center gap-3 truncate text-sm"
            >
              <MessageSquare size={16} className={activeChatId === chat.id ? "text-zinc-300" : "text-zinc-500"} />
              <span className="truncate">{chat.title}</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              className={`p-2 mr-1 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ${activeChatId === chat.id ? 'opacity-100' : ''}`}
              title="Delete Chat"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-zinc-800/50 mt-auto bg-zinc-950/80 backdrop-blur-md">
        <button
          onClick={onLogout}
          className="w-full text-left text-zinc-500 hover:text-zinc-300 transition-colors text-sm flex items-center p-2.5 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
