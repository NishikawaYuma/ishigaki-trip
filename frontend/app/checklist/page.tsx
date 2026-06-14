"use client";

import { useState, useEffect } from "react";
import { CheckSquare, Square } from "lucide-react";

type Item = { id: string; label: string };
type Category = { name: string; emoji: string; items: Item[] };

const categories: Category[] = [
  {
    name: "衣類",
    emoji: "👕",
    items: [
      { id: "c1", label: "Tシャツ（3〜4枚）" },
      { id: "c2", label: "ショートパンツ" },
      { id: "c3", label: "水着" },
      { id: "c4", label: "サンダル" },
      { id: "c5", label: "薄手の羽織り（冷房対策）" },
      { id: "c6", label: "下着・靴下" },
    ],
  },
  {
    name: "日焼け・UVケア",
    emoji: "🌞",
    items: [
      { id: "u1", label: "日焼け止め SPF50+（大容量）" },
      { id: "u2", label: "サングラス（UVカット）" },
      { id: "u3", label: "帽子・キャップ" },
      { id: "u4", label: "ラッシュガード" },
    ],
  },
  {
    name: "水中・ビーチ",
    emoji: "🤿",
    items: [
      { id: "w1", label: "シュノーケルセット（or 現地レンタル）" },
      { id: "w2", label: "防水ケース（スマホ用）" },
      { id: "w3", label: "ビーチタオル" },
      { id: "w4", label: "マリンシューズ" },
      { id: "w5", label: "着替え用ポリ袋" },
    ],
  },
  {
    name: "書類・お金",
    emoji: "📄",
    items: [
      { id: "d1", label: "身分証明書（免許証 or マイナンバー）" },
      { id: "d2", label: "クレジットカード" },
      { id: "d3", label: "現金（離島・小さな食堂は現金のみの場合あり）" },
      { id: "d4", label: "航空券・予約確認メール（スクリーンショット）" },
      { id: "d5", label: "宿泊施設の予約確認" },
    ],
  },
  {
    name: "その他",
    emoji: "🎒",
    items: [
      { id: "o1", label: "充電器・モバイルバッテリー" },
      { id: "o2", label: "常備薬・酔い止め" },
      { id: "o3", label: "虫よけスプレー" },
      { id: "o4", label: "エコバッグ" },
      { id: "o5", label: "カメラ / GoPro" },
    ],
  },
];

const STORAGE_KEY = "ishigaki-checklist";

export default function ChecklistPage() {
  const allIds = categories.flatMap((c) => c.items.map((i) => i.id));
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setChecked(new Set(JSON.parse(saved)));
      } catch {
        // ignore parse errors
      }
    }
    setMounted(true);
  }, []);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const checkedCount = checked.size;
  const totalCount = allIds.length;

  return (
    <main className="max-w-md mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">持ち物</h1>
        <span className="text-sm text-gray-500">
          {mounted ? `${checkedCount} / ${totalCount}` : `0 / ${totalCount}`}
        </span>
      </div>

      {/* 進捗バー */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-orange-400 h-2 rounded-full transition-all duration-300"
          style={{ width: mounted ? `${(checkedCount / totalCount) * 100}%` : "0%" }}
        />
      </div>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm"
          >
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              {cat.emoji} {cat.name}
            </h2>
            <ul className="space-y-2">
              {cat.items.map((item) => {
                const isChecked = mounted && checked.has(item.id);
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => toggle(item.id)}
                      className="flex items-center gap-2.5 w-full text-left"
                    >
                      {isChecked ? (
                        <CheckSquare size={18} className="text-orange-400 flex-shrink-0" />
                      ) : (
                        <Square size={18} className="text-gray-300 flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm leading-tight ${
                          isChecked ? "line-through text-gray-400" : "text-gray-700"
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          setChecked(new Set());
          localStorage.removeItem(STORAGE_KEY);
        }}
        className="mt-6 w-full text-xs text-gray-400 hover:text-gray-600 py-2"
      >
        チェックをすべてリセット
      </button>
    </main>
  );
}
