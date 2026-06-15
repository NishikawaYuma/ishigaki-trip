"use client";

import { Send, User } from "lucide-react";
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

// ---- Markdown renderer (no external lib) ----

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*\n]+\*\*)/);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

function MarkdownText({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/);

  return (
    <div className="space-y-1.5">
      {blocks.map((block, bi) => {
        const lines = block.split("\n").filter((l) => l.trim() !== "");
        if (!lines.length) return null;

        const isItem = (l: string) => /^\s*[-*] /.test(l);
        const isNumItem = (l: string) => /^\s*\d+\. /.test(l);

        // Block with list items (may be mixed with plain lines)
        if (lines.some(isItem) || lines.some(isNumItem)) {
          const nodes: React.ReactNode[] = [];
          let buf: string[] = [];
          let listType: "ul" | "ol" | null = null;

          const flushList = () => {
            if (!buf.length) return;
            if (listType === "ul") {
              nodes.push(
                <ul key={nodes.length} className="list-disc pl-4 space-y-0.5">
                  {buf.map((l, i) => (
                    <li key={i}>{renderInline(l.replace(/^\s*[-*] /, ""))}</li>
                  ))}
                </ul>
              );
            } else {
              nodes.push(
                <ol key={nodes.length} className="list-decimal pl-4 space-y-0.5">
                  {buf.map((l, i) => (
                    <li key={i}>{renderInline(l.replace(/^\s*\d+\. /, ""))}</li>
                  ))}
                </ol>
              );
            }
            buf = [];
            listType = null;
          };

          for (const line of lines) {
            if (isItem(line)) {
              if (listType && listType !== "ul") flushList();
              listType = "ul";
              buf.push(line);
            } else if (isNumItem(line)) {
              if (listType && listType !== "ol") flushList();
              listType = "ol";
              buf.push(line);
            } else {
              flushList();
              nodes.push(<p key={nodes.length}>{renderInline(line)}</p>);
            }
          }
          flushList();
          return <div key={bi}>{nodes}</div>;
        }

        // Plain paragraph
        return (
          <p key={bi}>
            {lines.flatMap((l, i) => [
              ...(i > 0 ? [<br key={`br-${bi}-${i}`} />] : []),
              ...renderInline(l),
            ])}
          </p>
        );
      })}
    </div>
  );
}

// ---- Chat page ----

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (!content || loading || streaming) return;
    setInput("");

    const userMsg: Message = { id: genId(), role: "user", content };
    const next = [...messages, userMsg];
    setMessages(next);
    persist(next);
    setLoading(true);

    const history = next.map(({ role, content: c }) => ({
      role: role === "assistant" ? "model" : role,
      content: c,
    }));

    const aiMsgId = genId();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history }),
      });

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      setLoading(false);
      setStreaming(true);
      setMessages([...next, { id: aiMsgId, role: "assistant", content: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          if (event.startsWith("event: error")) {
            accumulated = "すみにゃん、うまく答えられなかったにゃ🐾";
            continue;
          }
          for (const line of event.split("\n")) {
            if (line.startsWith("data: ")) {
              try {
                accumulated += JSON.parse(line.slice(6)) as string;
              } catch {}
            }
          }
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId ? { ...m, content: accumulated } : m
          )
        );
      }

      const finalContent =
        accumulated || "すみにゃん、うまく答えられなかったにゃ🐾";
      const final: Message[] = [
        ...next,
        { id: aiMsgId, role: "assistant", content: finalContent },
      ];
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
      setStreaming(false);
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
              旅の疑問はもちろん、なんでも気軽に聞いてにゃ！
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
                <MarkdownText content={msg.content} />
              </div>
            </div>
          )
        )}

        {/* ローディング（最初のチャンクが届くまで） */}
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

      {/* 入力欄 */}
      <div
        className="flex-shrink-0 flex gap-2.5 items-center px-4 py-3 border-t"
        style={{ background: "#fff", borderColor: "var(--sand-200)" }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.nativeEvent.isComposing && sendMessage()
          }
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
          disabled={!input.trim() || loading || streaming}
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
