"use client";

import { useState, useEffect } from "react";
import { CheckSquare, Square, Plus, Trash2 } from "lucide-react";

type Item = { id: string; label: string };
type Category = { name: string; emoji: string; items: Item[] };

const baseCategories: Category[] = [
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

const CHECK_KEY = "ishigaki-checklist";
const CUSTOM_KEY = "ishigaki-checklist-custom";
const cardShadow = "0 1px 3px rgba(23,58,71,.06)";

export default function ChecklistPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [custom, setCustom] = useState<Record<string, Item[]>>({});
  const [loaded, setLoaded] = useState(false);
  const [addingIn, setAddingIn] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState("");

  // マウント時に API から読み込み、失敗時は localStorage にフォールバック
  useEffect(() => {
    fetch("/api/data/checklist")
      .then((res) => res.json())
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setChecked(new Set(data.checkedIds ?? []));
          setCustom(data.customItems ?? {});
        } else {
          const c = localStorage.getItem(CHECK_KEY);
          const cu = localStorage.getItem(CUSTOM_KEY);
          if (c) { try { setChecked(new Set(JSON.parse(c))); } catch {} }
          if (cu) { try { setCustom(JSON.parse(cu)); } catch {} }
        }
        setLoaded(true);
      })
      .catch(() => {
        const c = localStorage.getItem(CHECK_KEY);
        const cu = localStorage.getItem(CUSTOM_KEY);
        if (c) { try { setChecked(new Set(JSON.parse(c))); } catch {} }
        if (cu) { try { setCustom(JSON.parse(cu)); } catch {} }
        setLoaded(true);
      });
  }, []);

  // 状態変更時に API へ保存、失敗時は localStorage にフォールバック
  useEffect(() => {
    if (!loaded) return;
    fetch("/api/data/checklist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkedIds: [...checked], customItems: custom }),
    }).catch(() => {
      localStorage.setItem(CHECK_KEY, JSON.stringify([...checked]));
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom));
    });
  }, [loaded, checked, custom]);

  const toggle = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const itemsFor = (name: string, base: Item[]) => [...base, ...(custom[name] ?? [])];

  const addItem = (name: string) => {
    if (!newLabel.trim()) return;
    const item: Item = { id: "x-" + Math.random().toString(36).slice(2, 9), label: newLabel.trim() };
    setCustom((prev) => ({ ...prev, [name]: [...(prev[name] ?? []), item] }));
    setNewLabel("");
    setAddingIn(null);
  };

  const removeCustom = (name: string, id: string) => {
    setCustom((prev) => ({ ...prev, [name]: (prev[name] ?? []).filter((i) => i.id !== id) }));
  };

  const allIds = baseCategories.flatMap((c) => itemsFor(c.name, c.items).map((i) => i.id));
  const totalCount = allIds.length;
  const checkedCount = loaded ? allIds.filter((id) => checked.has(id)).length : 0;
  const pct = totalCount ? Math.round((checkedCount / totalCount) * 100) : 0;

  return (
    <main className="max-w-md mx-auto px-4 py-5">
      <div className="flex items-center justify-between mb-2.5">
        <h1 className="font-display font-bold text-xl">持ち物</h1>
        <span className="text-[13px] font-bold font-mono" style={{ color: "var(--sun-deep)" }}>
          {checkedCount} / {totalCount}
        </span>
      </div>

      {/* 進捗バー */}
      <div className="w-full h-2.5 rounded-full overflow-hidden mb-5" style={{ background: "var(--sand-200)" }}>
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: "var(--sun)" }} />
      </div>

      <div className="flex flex-col gap-3">
        {baseCategories.map((cat) => {
          const items = itemsFor(cat.name, cat.items);
          const customIds = new Set((custom[cat.name] ?? []).map((i) => i.id));
          const isAdding = addingIn === cat.name;

          return (
            <div key={cat.name} className="bg-white rounded-[22px] border p-4" style={{ borderColor: "var(--sand-200)", boxShadow: cardShadow }}>
              <h2 className="text-[14px] font-bold mb-3">
                {cat.emoji} {cat.name}
              </h2>
              <ul className="space-y-2.5">
                {items.map((item) => {
                  const isChecked = loaded && checked.has(item.id);
                  const isCustom = customIds.has(item.id);
                  return (
                    <li key={item.id} className="flex items-center gap-2.5">
                      <button onClick={() => toggle(item.id)} className="flex items-center gap-2.5 flex-1 text-left">
                        {isChecked ? (
                          <CheckSquare size={19} style={{ color: "var(--sun-deep)" }} className="flex-shrink-0" />
                        ) : (
                          <Square size={19} style={{ color: "var(--sand-300)" }} className="flex-shrink-0" />
                        )}
                        <span
                          className="text-[13.5px] leading-tight"
                          style={isChecked ? { textDecoration: "line-through", color: "var(--ink-300)" } : { color: "var(--ink-700)" }}
                        >
                          {item.label}
                        </span>
                      </button>
                      {isCustom && (
                        <button onClick={() => removeCustom(cat.name, item.id)} style={{ color: "var(--ink-300)" }} aria-label="削除">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* ★ 追加: カテゴリごとに持ち物を追加できる */}
              {isAdding ? (
                <div className="mt-3 flex gap-2">
                  <input
                    autoFocus
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addItem(cat.name);
                      if (e.key === "Escape") {
                        setAddingIn(null);
                        setNewLabel("");
                      }
                    }}
                    placeholder="持ち物を入力"
                    className="flex-1 min-w-0 border rounded-lg px-3 py-2 outline-none"
                    style={{ borderColor: "var(--sand-300)", fontSize: 16 }}
                  />
                  <button onClick={() => addItem(cat.name)} disabled={!newLabel.trim()} className="text-[13px] text-white px-4 rounded-lg disabled:opacity-40" style={{ background: "var(--sun-deep)" }}>
                    追加
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAddingIn(cat.name);
                    setNewLabel("");
                  }}
                  className="mt-3 w-full flex items-center justify-center gap-1 py-2 text-[13px] font-semibold rounded-lg"
                  style={{ color: "var(--sun-deep)", background: "var(--sand-50)" }}
                >
                  <Plus size={14} /> 持ち物を追加
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => {
          setChecked(new Set());
        }}
        className="mt-6 w-full text-[12px] py-2"
        style={{ color: "var(--ink-400)" }}
      >
        チェックをすべてリセット
      </button>
    </main>
  );
}
