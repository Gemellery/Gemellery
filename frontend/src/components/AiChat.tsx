import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import axios from "axios";

export default function AiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai", text: string }[]>([
    { role: "ai", text: "Hi! How can I help you with Gemellery today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5001/api/chat", {
        message: userMessage,
        context: window.location.pathname
      });

      setMessages(prev => [...prev, { role: "ai", text: response.data.response }]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages(prev => [...prev, { role: "ai", text: "Sorry, I am having trouble connecting to the server. Please check if GEMINI_CHAT_API_KEY is configured in backend settings." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatText = (text: string) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = text.split(boldRegex);

    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i}>{part}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
             onClick={() => setIsOpen(true)}
             className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg shadow-amber-500/30 transition-transform hover:scale-110 active:scale-95"
             aria-label="Open AI Chat"
          >
             <Sparkles className="h-6 w-6 text-white" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl bg-white/40 backdrop-blur-2xl border border-white/30 shadow-2xl sm:w-[400px]">
          <div className="flex items-center justify-between bg-gradient-to-r from-[#D4AF37]/80 to-[#F5D061]/80 backdrop-blur border-b border-white/20 p-4 text-[#0A1128]">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <h3 className="font-semibold">Gemellery AI Guide</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 hover:bg-black/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 shadow-sm backdrop-blur-md ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-[#D4AF37]/90 to-[#F5D061]/90 text-[#0A1128] rounded-br-none border border-white/30"
                      : "bg-white/60 text-gray-800 border border-white/50 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">
                    {formatText(msg.text)}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white/60 backdrop-blur-md px-4 py-3 shadow-sm border border-white/50 rounded-bl-none">
                  <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-white/30 bg-white/20 p-4 backdrop-blur-md">
            <div className="flex items-end gap-2 rounded-xl border border-white/40 bg-white/30 p-1 focus-within:border-[#D4AF37] transition-all duration-300">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything..."
                className="max-h-24 min-h-[32px] w-full resize-none bg-transparent px-3 py-1 text-sm text-gray-800 outline-none"
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="mb-1 mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white transition-colors hover:bg-amber-600 disabled:opacity-50 disabled:hover:bg-amber-500"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
