"use client";

import { useState, useEffect } from "react";
import { tripData } from "../data/spots";
import { ChevronDown, ChevronUp, ExternalLink, Pencil } from "lucide-react";

const STORAGE_KEY = "ishigaki-custom-times";

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
    <main className="max-w-md mx-auto px-4 py-6 pb-24">
      {/* Day tabs */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
        {tripData.map((d, i) => (
          <button
            key={d.date}
            onClick={() => setSelectedDay(i)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedDay === i
                ? "bg-sky-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {i + 1}日目
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-400 font-medium mb-3">{day.label}</p>

      <div className="space-y-2.5">
        {day.schedules.map((item) => {
          const displayTime = customTimes[item.id] ?? item.time;
          const isEditing = editingId === item.id;
          const linksOpen = expandedLinks.has(item.id);

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="flex items-start gap-3 px-4 py-3">
                {/* Time */}
                <div className="w-[76px] flex-shrink-0 pt-0.5">
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
                        className="w-full text-xs border border-sky-300 rounded px-1.5 py-0.5 outline-none text-gray-700"
                      />
                    ) : (
                      <button
                        onClick={() => startEdit(item.id, displayTime)}
                        className="flex items-center gap-1 text-xs text-sky-500 font-medium hover:text-sky-700"
                      >
                        <span>{displayTime}</span>
                        <Pencil size={9} />
                      </button>
                    )
                  ) : (
                    <span className="text-xs text-gray-400 font-medium">{displayTime}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 leading-tight">
                    {item.title}
                  </p>
                  {item.comment && (
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      {item.comment}
                    </p>
                  )}
                </div>
              </div>

              {/* Expandable links */}
              {item.links && item.links.length > 0 && (
                <div className="border-t border-gray-50">
                  <button
                    onClick={() => toggleLinks(item.id)}
                    className="w-full flex items-center justify-between px-4 py-2 text-xs text-sky-500 hover:bg-gray-50 transition-colors"
                  >
                    <span>時刻表・リンクを見る</span>
                    {linksOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                  {linksOpen && (
                    <ul className="px-4 pb-3 space-y-2">
                      {item.links.map((link) => (
                        <li key={link.label}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-sky-600 hover:underline"
                          >
                            <ExternalLink size={11} />
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
