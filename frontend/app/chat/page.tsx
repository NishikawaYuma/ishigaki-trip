"use client";

import { Bot, MessageCircle, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "ai"; text: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "エラーが発生しました。もう一度お試しください。" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <main className="max-w-md mx-auto flex flex-col h-[calc(100vh-4rem)]">
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <MessageCircle size={20} className="text-emerald-500" />
          石垣島 AI ガイド
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm mt-12">
            <Bot size={40} className="mx-auto mb-3 text-emerald-300" />
            <p>
              川平湾へのアクセスや
              <br />
              おすすめグルメなど、
              <br />
              旅行の疑問を聞いてみましょう！
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "ai" && (
              <Bot size={24} className="text-emerald-500 shrink-0 mt-1" />
            )}
            <div
              className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-emerald-500 text-white rounded-tr-sm"
                  : "bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-100"
              }`}
            >
              {msg.text}
            </div>
            {msg.role === "user" && (
              <User size={24} className="text-gray-400 shrink-0 mt-1" />
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-2 justify-start">
            <Bot size={24} className="text-emerald-500 shrink-0 mt-1" />
            <div className="bg-white px-3 py-2 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 text-sm text-gray-400 animate-pulse">
              考え中...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="質問を入力（例: 川平湾への行き方は？）"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-emerald-400"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="bg-emerald-500 text-white rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-40 active:scale-95 transition-transform"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </main>
  );
}
