"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/* ★ 表紙写真: frontend/public/photos/ に画像を置き、ここにパスを設定（例 "/photos/cover.jpg"）。
   空文字のままなら青系グラデーションのプレースホルダ表示。 */
const COVER_IMAGE = "";

const TRIP_START = new Date("2026-06-24T00:00:00+09:00");

const navCards = [
  { href: "/itinerary", emoji: "🗺️", label: "旅程", desc: "5日間の予定", color: "var(--sea)" },
  { href: "/budget", emoji: "💰", label: "会計", desc: "費用の内訳", color: "var(--coral)" },
  { href: "/checklist", emoji: "🎒", label: "持ち物", desc: "準備チェック", color: "var(--sun-deep)" },
  { href: "/chat", emoji: "💬", label: "AIガイド", desc: "何でも聞ける", color: "var(--lagoon)" },
];

const cardShadow = "0 1px 3px rgba(23,58,71,.06)";

export default function Home() {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const diff = Math.ceil((TRIP_START.getTime() - Date.now()) / 86_400_000);
    setDaysLeft(diff);
  }, []);

  return (
    <main className="max-w-md mx-auto px-4 py-5">
      {/* 表紙 */}
      <div
        className="relative rounded-[28px] overflow-hidden"
        style={{ minHeight: 152, boxShadow: "0 6px 18px rgba(23,58,71,.08)" }}
      >
        {COVER_IMAGE ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={COVER_IMAGE} alt="石垣島" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0" style={{ background: "linear-gradient(150deg,#0E9FD6,#14B8A6)" }} />
        )}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(155deg,rgba(8,58,82,.5) 0%,rgba(8,58,82,.12) 45%,rgba(8,58,82,.6) 100%)" }}
        />
        <div className="relative px-5 py-5 text-white" style={{ textShadow: "0 1px 14px rgba(0,38,56,.6)" }}>
          <div className="absolute top-4 right-5 text-xs font-bold tracking-widest opacity-95 font-mono">ISHIGAKI &apos;26</div>
          <div className="font-display font-black text-[27px] leading-tight">
            石垣島
            <br />
            旅のしおり
          </div>
          <div className="mt-3 flex gap-2 flex-wrap" style={{ textShadow: "none" }}>
            <span className="text-[11.5px] font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(8,58,82,.5)" }}>📅 6/24–28</span>
            <span className="text-[11.5px] font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(8,58,82,.5)" }}>👥 2名</span>
          </div>
        </div>
      </div>

      {/* 出発カウント */}
      <div
        className="mt-3 rounded-[22px] bg-white border px-4 py-3 flex items-center gap-3"
        style={{ borderColor: "var(--sand-200)", boxShadow: cardShadow }}
      >
        <div className="text-2xl">🌺</div>
        <div className="flex-1">
          <div className="text-xs" style={{ color: "var(--ink-500)" }}>出発まで</div>
          <div className="font-bold text-[15px]">
            あと <span className="text-[19px]" style={{ color: "var(--coral)" }}>{daysLeft ?? "—"}</span> 日
          </div>
        </div>
        <span
          className="text-[11px] font-bold px-2.5 py-1 rounded-full text-center leading-tight"
          style={{ background: "rgba(14,159,214,.12)", color: "var(--sea-deep)" }}
        >
          竹富 → 石垣 → 西表
        </span>
      </div>

      {/* 旅行概要 */}
      <div className="mt-3 rounded-[22px] bg-white border p-4" style={{ borderColor: "var(--sand-200)", boxShadow: cardShadow }}>
        <h2 className="text-xs font-bold mb-2" style={{ color: "var(--ink-500)" }}>旅行概要</h2>
        <ul className="text-[13px] leading-[1.95]" style={{ color: "var(--ink-700)" }}>
          <li>✈️ 6/24（水）関西発 → 竹富島・高那旅館泊</li>
          <li>⛵ 6/25（木）竹富散策 → 石垣・川平湾</li>
          <li>🤿 6/26（金）青の洞窟シュノーケリング</li>
          <li>🌴 6/27（土）西表島アクティビティ</li>
          <li>🛫 6/28（日）石垣発 → 関西着</li>
        </ul>
      </div>

      {/* 2x2 ナビ */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        {navCards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-[22px] bg-white border p-4 transition-shadow hover:shadow-md"
            style={{ borderColor: "var(--sand-200)", borderLeft: `4px solid ${c.color}`, boxShadow: cardShadow }}
          >
            <div className="text-[22px]">{c.emoji}</div>
            <div className="font-bold text-[15px] mt-1.5">{c.label}</div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-500)" }}>{c.desc}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
