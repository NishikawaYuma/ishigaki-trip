"use client";

import { useState, useEffect } from "react";
import { tripData } from "../data/spots";
import { ChevronDown, ChevronUp, ExternalLink, Pencil } from "lucide-react";

const STORAGE_KEY = "ishigaki-custom-times";
const cardShadow = "0 1px 3px rgba(23,58,71,.06)";

export default function ItineraryPage() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [expandedLinks, setExpandedLinks] = useState<Set<string>>(new Set());
  const [customTimes, setCustomTimes] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCustomTimes(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const startEdit = (id: string, currentTime: string) => {
    setEditingId(id);
    setEditValue(currentTime === "未定" ? "" : currentTime);
  };

  const saveEdit = (id: string) => {
    const value = editValue.trim() || "未定";
    const updated = { ...customTimes, [id]: value };
    setCustomTimes(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setEditingId(null);
  };

  const toggleLinks = (id: string) => {
    setExpandedLinks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const day = tripData[selectedDay];

  return (
    <main className="max-w-md mx-auto px-4 py-5">
      <h1 className="font-display font-bold text-xl mb-3">旅程</h1>

      {/* デイタブ */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {tripData.map((d, i) => (
          <button
            key={d.date}
            onClick={() => setSelectedDay(i)}
            className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-bold transition-colors"
            style={
              selectedDay === i
                ? { background: "var(--sea)", color: "#fff" }
                : { background: "var(--sand-150)", color: "var(--ink-700)" }
            }
          >
            {i + 1}日目
          </button>
        ))}
      </div>

      <p className="text-[12px] font-semibold mt-3 mb-3" style={{ color: "var(--ink-500)" }}>{day.label}</p>

      {/* タイムライン */}
      <div className="relative pl-5">
        <div className="absolute left-[5px] top-2 bottom-2 w-0.5" style={{ background: "var(--sand-200)" }} />
        {day.schedules.map((item) => {
          const displayTime = customTimes[item.id] ?? item.time;
          const isEditing = editingId === item.id;
          const linksOpen = expandedLinks.has(item.id);

          return (
            <div key={item.id} className="relative mb-2.5">
              <div
                className="absolute w-[11px] h-[11px] rounded-full"
                style={{ left: -19, top: 6, background: "var(--sea)", boxShadow: "0 0 0 3px #fff" }}
              />
              <div
                className="bg-white rounded-[18px] border overflow-hidden"
                style={{ borderColor: "var(--sand-200)", boxShadow: cardShadow }}
              >
                <div className="px-4 py-3">
                  {/* 時刻 */}
                  <div>
                    {item.editable ? (
                      isEditing ? (
                        <input
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit(item.id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          onBlur={() => saveEdit(item.id)}
                          placeholder="例: 14:00"
                          className="w-28 border rounded px-2 py-0.5 outline-none"
                          style={{ borderColor: "var(--sea)", fontSize: 16 }}
                        />
                      ) : (
                        <button
                          onClick={() => startEdit(item.id, displayTime)}
                          className="flex items-center gap-1 text-[13px] font-semibold"
                          style={{ color: "var(--sea-deep)" }}
                        >
                          <span className="font-mono">{displayTime}</span>
                          <Pencil size={11} />
                        </button>
                      )
                    ) : (
                      <span className="text-[13px] font-semibold font-mono" style={{ color: "var(--sea-deep)" }}>
                        {displayTime}
                      </span>
                    )}
                  </div>

                  <p className="font-bold text-[14.5px] mt-1.5 leading-tight">{item.title}</p>
                  {item.comment && (
                    <p className="text-[12px] mt-1 leading-relaxed" style={{ color: "var(--ink-500)" }}>
                      {item.comment}
                    </p>
                  )}
                </div>

                {item.links && item.links.length > 0 && (
                  <div className="border-t" style={{ borderColor: "var(--sand-150)" }}>
                    <button
                      onClick={() => toggleLinks(item.id)}
                      className="w-full flex items-center justify-between px-4 py-2 text-[12px] font-semibold"
                      style={{ color: "var(--sea-deep)" }}
                    >
                      <span>時刻表・リンクを見る</span>
                      {linksOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {linksOpen && (
                      <ul className="px-4 pb-3 space-y-2">
                        {item.links.map((link) => (
                          <li key={link.label}>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-[12px]"
                              style={{ color: "var(--sea-deep)" }}
                            >
                              <ExternalLink size={12} />
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
