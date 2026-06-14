"use client";

import { useState } from "react";
import { tripData } from "../data/spots";
import { MapPin, Clock, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

export default function ItineraryPage() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [openAlts, setOpenAlts] = useState<Record<string, boolean>>({});

  const day = tripData[selectedDay];

  const toggleAlt = (key: string) =>
    setOpenAlts((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <main className="max-w-md mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-gray-800 mb-4">旅程</h1>

      {/* 日選択タブ */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {tripData.map((d, i) => (
          <button
            key={d.date}
            onClick={() => setSelectedDay(i)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedDay === i
                ? "bg-cyan-500 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-cyan-300"
            }`}
          >
            {i + 1}日目
          </button>
        ))}
      </div>

      {/* 選択日のラベル */}
      <p className="text-sm font-semibold text-cyan-700 mb-3">{day.label}</p>

      {/* スケジュールカード一覧 */}
      <div className="space-y-3">
        {day.schedules.map((schedule, si) => (
          <div
            key={si}
            className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm"
          >
            {/* 時刻・タイトル */}
            <div className="flex items-start gap-2 mb-3">
              <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5 flex-shrink-0">
                <Clock size={13} />
                <span>{schedule.time}</span>
              </div>
              <h2 className="text-sm font-bold text-gray-800 leading-tight">
                {schedule.title}
              </h2>
            </div>

            {/* スポット一覧 */}
            {schedule.spots.map((spot, spi) => {
              const altKey = `${si}-${spi}`;
              const altOpen = openAlts[altKey];
              return (
                <div key={spi} className="mb-2 last:mb-0">
                  <p className="text-sm font-semibold text-gray-700">{spot.name}</p>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5 mb-1.5">
                    <MapPin size={12} />
                    <span>{spot.location}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{spot.comment}</p>

                  {/* 代替案 */}
                  {spot.alternative && (
                    <div className="mt-2">
                      <button
                        onClick={() => toggleAlt(altKey)}
                        className="flex items-center gap-1 text-xs text-amber-600 font-medium"
                      >
                        <AlertTriangle size={13} />
                        代替案
                        {altOpen ? (
                          <ChevronUp size={13} />
                        ) : (
                          <ChevronDown size={13} />
                        )}
                      </button>
                      {altOpen && (
                        <p className="mt-1.5 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 leading-relaxed">
                          {spot.alternative}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </main>
  );
}
