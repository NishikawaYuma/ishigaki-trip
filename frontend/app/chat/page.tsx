"use client";

import { Bot, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const STORAGE_KEY = "ishigaki-chat";
const CAT = "🐱";

const SUGGESTIONS = [
  "川平湾への行き方は？",
  "雨の日のおすすめプランは？",
  "石垣島のおすすめグルメを教えて",
  "西表島でできるアクティビティは？",
];

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* localStorage から会話を復元 */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const persist = (msgs: Message[]) =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));

  const scrollToBottom = () =>
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");

    const userMsg: Message = { id: genId(), role: "user", content };
    const next = [...messages, userMsg];
    setMessages(next);
    persist(next);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });
      const data = await res.json();
      const aiMsg: Message = {
        id: genId(),
        role: "assistant",
        content: data.reply ?? "すみにゃん、うまく答えられなかったにゃ🐾",
      };
      const final = [...next, aiMsg];
      setMessages(final);
      persist(final);
    } catch {
      const errMsg: Message = {
        id: genId(),
        role: "assistant",
        content: "ネットワークエラーが発生したにゃ😿 もう一度試してみてにゃ。",
      };
      const final = [...next, errMsg];
      setMessages(final);
      persist(final);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[100dvh]">
      {/* ヘッダー */}
      <header
        className="flex-shrink-0 flex items-center gap-2.5 px-4 py-3 border-b"
        style={{ background: "#fff", borderColor: "var(--sand-200)" }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0 text-lg"
          style={{ background: "var(--lagoon)" }}
        >
          {CAT}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-[15px] leading-tight">いしがき ねこガイド</div>
          <div className="text-[11px]" style={{ color: "var(--ink-400)" }}>
            旅のことなんでも聞いてにゃ 🐾
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="text-[11.5px] px-3 py-1.5 rounded-full"
            style={{ color: "var(--ink-400)", background: "var(--sand-150)" }}
          >
            クリア
          </button>
        )}
      </header>

      {/* メッセージリスト */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
        style={{ background: "var(--sand-100)" }}
      >
        {/* ウェルカムメッセージ（初回のみ） */}
        {isEmpty && (
          <div className="flex gap-2.5 items-start">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 text-base"
              style={{ background: "var(--lagoon)" }}
            >
              {CAT}
            </div>
            <div
              className="rounded-[18px] rounded-tl-sm px-4 py-3 text-[13.5px] leading-relaxed max-w-[80%] bg-white"
              style={{
                boxShadow: "0 1px 3px rgba(23,58,71,.06)",
                border: "1px solid var(--sand-200)",
              }}
            >
              こんにちは！いしがき ねこガイドだにゃ 🐱🌊
              <br />
              川平湾へのアクセス・グルメ・天気・おすすめアクティビティなど、旅の疑問はなんでも聞いてにゃ！
            </div>
          </div>
        )}

        {/* サジェスト（初回のみ） */}
        {isEmpty && (
          <div className="flex flex-wrap gap-2 pl-10">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-[12px] font-semibold px-3.5 py-1.5 rounded-full border transition-colors"
                style={{
                  background: "#fff",
                  borderColor: "var(--sand-300)",
                  color: "var(--ink-700)",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* 会話履歴 */}
        {messages.map((msg) =>
          msg.role === "user" ? (
            <div key={msg.id} className="flex justify-end gap-2 items-end">
              <div
                className="rounded-[18px] rounded-br-sm px-4 py-2.5 text-[13.5px] leading-relaxed max-w-[80%] text-white"
                style={{ background: "var(--lagoon)" }}
              >
                {msg.content}
              </div>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs"
                style={{ background: "var(--sea-deep)" }}
              >
                <User size={14} />
              </div>
            </div>
          ) : (
            <div key={msg.id} className="flex gap-2.5 items-start">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 text-base"
                style={{ background: "var(--lagoon)" }}
              >
                {CAT}
              </div>
              <div
                className="rounded-[18px] rounded-tl-sm px-4 py-3 text-[13.5px] leading-relaxed max-w-[80%] bg-white"
                style={{
                  boxShadow: "0 1px 3px rgba(23,58,71,.06)",
                  border: "1px solid var(--sand-200)",
                }}
              >
                {msg.content}
              </div>
            </div>
          )
        )}

        {/* ローディング */}
        {loading && (
          <div className="flex gap-2.5 items-start">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 text-base"
              style={{ background: "var(--lagoon)" }}
            >
              {CAT}
            </div>
            <div
              className="rounded-[18px] rounded-tl-sm px-4 py-3 bg-white flex gap-1.5 items-center"
              style={{
                boxShadow: "0 1px 3px rgba(23,58,71,.06)",
                border: "1px solid var(--sand-200)",
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    background: "var(--lagoon)",
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 入力欄
          ★ font-size: 16px (globals.css で全 input に適用) で iOS の自動ズームを防止。
          さらに念のため style 直指定も入れる。 */}
      <div
        className="flex-shrink-0 flex gap-2.5 items-center px-4 py-3 border-t"
        style={{ background: "#fff", borderColor: "var(--sand-200)" }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.nativeEvent.isComposing && sendMessage()}
          placeholder="ねこガイドに質問…"
          className="flex-1 min-w-0 rounded-[16px] px-4 py-2.5 outline-none border"
          style={{
            fontSize: 16,
            borderColor: "var(--sand-300)",
            background: "var(--sand-50)",
            color: "var(--ink)",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "var(--lagoon)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "var(--sand-300)")
          }
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 transition-opacity disabled:opacity-40"
          style={{ background: "var(--lagoon)" }}
          aria-label="送信"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
