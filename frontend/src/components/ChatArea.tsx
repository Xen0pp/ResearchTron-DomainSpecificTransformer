import { useEffect, useRef, useState } from "react";
import { Send, User as UserIcon, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id?: number;
  role: string;
  content: string;
}

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

export default function ChatArea({ messages, isLoading, onSendMessage }: ChatAreaProps) {
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-black bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black text-zinc-200">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 scroll-smooth">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 flex items-center justify-center shadow-lg">
              <Bot size={32} className="text-zinc-400" />
            </div>
            <p className="text-lg font-medium text-zinc-400 tracking-tight">How can I assist your research today?</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 max-w-4xl mx-auto ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === "user" ? "bg-zinc-800 border border-zinc-700" : "bg-black border border-zinc-800 shadow-[0_0_15px_rgba(255,255,255,0.05)]"}`}>
                {msg.role === "user" ? <UserIcon size={18} className="text-zinc-300" /> : <Bot size={18} className="text-zinc-300" />}
              </div>
              <div className={`px-5 py-3.5 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${msg.role === "user" ? "bg-zinc-800 text-zinc-100" : "bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/80 text-zinc-300"}`}>
                {msg.role === "user" ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-4 mb-2 text-zinc-100" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-lg font-semibold mt-3 mb-2 text-zinc-100" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-md font-medium mt-2 mb-1 text-zinc-200" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-outside ml-5 my-2 space-y-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-5 my-2 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="text-zinc-300" {...props} />,
                      p: ({node, ...props}) => <p className="mb-3 last:mb-0 leading-relaxed text-zinc-300" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-semibold text-zinc-100" {...props} />,
                      code: ({node, inline, className, children, ...props}: any) => inline 
                        ? <code className="bg-zinc-800/80 text-zinc-200 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>{children}</code>
                        : <pre className="bg-black/50 border border-zinc-800 p-4 rounded-xl overflow-x-auto my-4 text-xs font-mono text-zinc-300"><code {...props}>{children}</code></pre>,
                      a: ({node, ...props}) => <a className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                      table: ({node, ...props}) => <div className="overflow-x-auto my-4 rounded-lg border border-zinc-800"><table className="w-full text-sm text-left border-collapse" {...props} /></div>,
                      th: ({node, ...props}) => <th className="border-b border-zinc-700 px-4 py-3 bg-zinc-900/80 font-semibold text-zinc-200" {...props} />,
                      td: ({node, ...props}) => <td className="border-b border-zinc-800/50 px-4 py-3 text-zinc-300 bg-zinc-900/30" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-zinc-700 pl-4 py-1 my-3 text-zinc-400 italic bg-zinc-900/20 rounded-r-lg" {...props} />
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex gap-4 max-w-4xl mx-auto">
            <div className="w-9 h-9 rounded-full bg-black border border-zinc-800 shadow-[0_0_15px_rgba(255,255,255,0.05)] flex items-center justify-center flex-shrink-0">
              <Bot size={18} className="text-zinc-300" />
            </div>
            <div className="px-5 py-4 rounded-2xl bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/80 flex items-center shadow-sm">
              <div className="flex space-x-1.5">
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="p-4 bg-black/80 backdrop-blur-md border-t border-zinc-900 w-full flex flex-col items-center pt-6 pb-6 shrink-0">
        <form onSubmit={handleSubmit} className="relative w-full max-w-4xl group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message the model..."
            className="w-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/80 text-zinc-100 rounded-full py-4 pl-6 pr-16 focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 shadow-xl transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-zinc-100 text-black rounded-full hover:bg-zinc-300 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed transition-all"
          >
            <Send size={18} className="ml-[-2px]" />
          </button>
        </form>
        <p className="text-xs text-zinc-600 mt-3 font-medium">
          Researchatron MVP. Model responses may be placeholder or simulated.
        </p>
      </div>
    </div>
  );
}
