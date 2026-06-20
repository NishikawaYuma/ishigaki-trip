"use client";

import { useState, useEffect } from "react";
import { tripData, ScheduleItem } from "../data/spots";
import { ChevronDown, ChevronUp, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";

const STORAGE_KEY = "ishigaki-custom-times";
const cardShadow = "0 1px 3px rgba(23,58,71,.06)";

export default function ItineraryPage() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [expandedLinks, setExpandedLinks] = useState<Set<string>>(new Set());

  const [customTimes, setCustomTimes] = useState<Record<string, string>>({});
  const [customTitles, setCustomTitles] = useState<Record<string, string>>({});
  const [customComments, setCustomComments] = useState<Record<string, string>>({});
  const [customSpots, setCustomSpots] = useState<Record<string, ScheduleItem[]>>({});
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const [loaded, setLoaded] = useState(false);

  const [editingTimeId, setEditingTimeId] = useState<string | null>(null);
  const [editTimeValue, setEditTimeValue] = useState("");
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editTitleValue, setEditTitleValue] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentValue, setEditCommentValue] = useState("");
  const [addingInDate, setAddingInDate] = useState<string | null>(null);
  const [newSpotTitle, setNewSpotTitle] = useState("");
  const [newSpotTime, setNewSpotTime] = useState("");

  useEffect(() => {
    fetch("/api/data/itinerary")
      .then((res) => res.json())
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setCustomTimes(data.customTimes ?? {});
          setCustomTitles(data.customTitles ?? {});
          setCustomComments(data.customComments ?? {});
          setCustomSpots(data.customSpots ?? {});
          setDeletedIds(new Set(data.deletedIds ?? []));
        } else {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) { try { setCustomTimes(JSON.parse(saved)); } catch {} }
        }
        setLoaded(true);
      })
      .catch(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) { try { setCustomTimes(JSON.parse(saved)); } catch {} }
        setLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    fetch("/api/data/itinerary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customTimes,
        customTitles,
        customComments,
        customSpots,
        deletedIds: [...deletedIds],
      }),
    }).catch(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customTimes));
    });
  }, [loaded, customTimes, customTitles, customComments, customSpots, deletedIds]);

  const startEditTime = (id: string, current: string) => {
    setEditingTitleId(null);
    setEditingCommentId(null);
    setEditingTimeId(id);
    setEditTimeValue(current === "未定" ? "" : current);
  };
  const saveTime = (id: string) => {
    setCustomTimes((prev) => ({ ...prev, [id]: editTimeValue.trim() || "未定" }));
    setEditingTimeId(null);
  };

  const startEditTitle = (id: string, current: string) => {
    setEditingTimeId(null);
    setEditingCommentId(null);
    setEditingTitleId(id);
    setEditTitleValue(current);
  };
  const saveTitle = (id: string) => {
    const v = editTitleValue.trim();
    if (v) setCustomTitles((prev) => ({ ...prev, [id]: v }));
    setEditingTitleId(null);
  };

  const startEditComment = (id: string, current: string) => {
    setEditingTimeId(null);
    setEditingTitleId(null);
    setEditingCommentId(id);
    setEditCommentValue(current);
  };
  const saveComment = (id: string) => {
    setCustomComments((prev) => ({ ...prev, [id]: editCommentValue }));
    setEditingCommentId(null);
  };

  const deleteItem = (date: string, id: string) => {
    if ((customSpots[date] ?? []).some((s) => s.id === id)) {
      setCustomSpots((prev) => ({ ...prev, [date]: (prev[date] ?? []).filter((s) => s.id !== id) }));
    } else {
      setDeletedIds((prev) => new Set([...prev, id]));
    }
  };

  const addSpot = (date: string) => {
    if (!newSpotTitle.trim()) return;
    const item: ScheduleItem = {
      id: "x-" + Math.random().toString(36).slice(2, 9),
      time: newSpotTime.trim() || "未定",
      title: newSpotTitle.trim(),
    };
    setCustomSpots((prev) => ({ ...prev, [date]: [...(prev[date] ?? []), item] }));
    setNewSpotTitle("");
    setNewSpotTime("");
    setAddingInDate(null);
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
  const visibleItems = [
    ...day.schedules.filter((item) => !deletedIds.has(item.id)),
    ...(customSpots[day.date] ?? []),
  ];

  return (
    <main className="max-w-md mx-auto px-4 py-5">
      <h1 className="font-display font-bold text-xl mb-3">旅程</h1>

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

      <div className="relative pl-5">
        <div className="absolute left-[5px] top-2 bottom-2 w-0.5" style={{ background: "var(--sand-200)" }} />

        {visibleItems.map((item) => {
          const displayTime = customTimes[item.id] ?? item.time;
          const displayTitle = customTitles[item.id] ?? item.title;
          const displayComment = customComments[item.id] ?? (item.comment ?? "");
          const isEditingTime = editingTimeId === item.id;
          const isEditingTitle = editingTitleId === item.id;
          const isEditingComment = editingCommentId === item.id;
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
                  {/* 時刻 + 削除 */}
                  <div className="flex items-center gap-2">
                    {isEditingTime ? (
                      <input
                        autoFocus
                        value={editTimeValue}
                        onChange={(e) => setEditTimeValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveTime(item.id);
                          if (e.key === "Escape") setEditingTimeId(null);
                        }}
                        onBlur={() => saveTime(item.id)}
                        placeholder="例: 14:00"
                        className="w-28 border rounded px-2 py-0.5 outline-none"
                        style={{ borderColor: "var(--sea)", fontSize: 16 }}
                      />
                    ) : (
                      <button
                        onClick={() => startEditTime(item.id, displayTime)}
                        className="flex items-center gap-1 text-[13px] font-semibold"
                        style={{ color: "var(--sea-deep)" }}
                      >
                        <span className="font-mono">{displayTime}</span>
                        <Pencil size={11} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteItem(day.date, item.id)}
                      className="ml-auto flex-shrink-0"
                      style={{ color: "var(--ink-300)" }}
                      aria-label="削除"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* タイトル */}
                  <div className="mt-1.5">
                    {isEditingTitle ? (
                      <input
                        autoFocus
                        value={editTitleValue}
                        onChange={(e) => setEditTitleValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveTitle(item.id);
                          if (e.key === "Escape") setEditingTitleId(null);
                        }}
                        onBlur={() => saveTitle(item.id)}
                        className="w-full border rounded-lg px-2 py-1 outline-none font-bold"
                        style={{ borderColor: "var(--sea)", fontSize: 16 }}
                      />
                    ) : (
                      <button
                        onClick={() => startEditTitle(item.id, displayTitle)}
                        className="flex items-center gap-1.5 w-full text-left"
                      >
                        <span className="font-bold text-[14.5px] leading-tight">{displayTitle}</span>
                        <Pencil size={11} className="flex-shrink-0" style={{ color: "var(--ink-300)" }} />
                      </button>
                    )}
                  </div>

                  {/* コメント */}
                  <div className="mt-1">
                    {isEditingComment ? (
                      <textarea
                        autoFocus
                        value={editCommentValue}
                        onChange={(e) => setEditCommentValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") saveComment(item.id);
                        }}
                        onBlur={() => saveComment(item.id)}
                        rows={3}
                        className="w-full border rounded-lg px-2 py-1 outline-none resize-none"
                        style={{ borderColor: "var(--sea)", fontSize: 14, color: "var(--ink-500)", lineHeight: "1.5" }}
                      />
                    ) : displayComment ? (
                      <button
                        onClick={() => startEditComment(item.id, displayComment)}
                        className="flex items-start gap-1.5 w-full text-left"
                      >
                        <span className="text-[12px] leading-relaxed" style={{ color: "var(--ink-500)" }}>
                          {displayComment}
                        </span>
                        <Pencil size={11} className="flex-shrink-0 mt-0.5" style={{ color: "var(--ink-300)" }} />
                      </button>
                    ) : (
                      <button
                        onClick={() => startEditComment(item.id, "")}
                        className="text-[11px] font-semibold mt-0.5"
                        style={{ color: "var(--ink-300)" }}
                      >
                        + メモを追加
                      </button>
                    )}
                  </div>
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

        {/* スポット追加 */}
        {addingInDate === day.date ? (
          <div
            className="bg-white rounded-[18px] border p-4 mb-2.5"
            style={{ borderColor: "var(--sand-200)", boxShadow: cardShadow }}
          >
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSpotTime}
                onChange={(e) => setNewSpotTime(e.target.value)}
                placeholder="時刻（例: 15:00）"
                className="w-28 border rounded-lg px-3 py-2 outline-none flex-shrink-0"
                style={{ borderColor: "var(--sand-300)", fontSize: 16 }}
              />
              <input
                autoFocus
                type="text"
                value={newSpotTitle}
                onChange={(e) => setNewSpotTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addSpot(day.date);
                  if (e.key === "Escape") {
                    setAddingInDate(null);
                    setNewSpotTitle("");
                    setNewSpotTime("");
                  }
                }}
                placeholder="スポット名"
                className="flex-1 min-w-0 border rounded-lg px-3 py-2 outline-none"
                style={{ borderColor: "var(--sand-300)", fontSize: 16 }}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => addSpot(day.date)}
                disabled={!newSpotTitle.trim()}
                className="text-[13px] text-white px-4 py-2 rounded-lg disabled:opacity-40"
                style={{ background: "var(--sun-deep)" }}
              >
                追加
              </button>
              <button
                onClick={() => {
                  setAddingInDate(null);
                  setNewSpotTitle("");
                  setNewSpotTime("");
                }}
                className="text-[13px] px-4 py-2 rounded-lg"
                style={{ color: "var(--ink-400)", background: "var(--sand-50)" }}
              >
                キャンセル
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              setAddingInDate(day.date);
              setNewSpotTitle("");
              setNewSpotTime("");
            }}
            className="w-full flex items-center justify-center gap-1 py-2.5 text-[13px] font-semibold rounded-[18px] border"
            style={{ color: "var(--sun-deep)", background: "var(--sand-50)", borderColor: "var(--sand-200)" }}
          >
            <Plus size={14} /> スポットを追加
          </button>
        )}
      </div>
    </main>
  );
}
