"use client";

import { useState, useEffect } from "react";
import { initialBudget } from "../data/budget";
import type { BudgetCategory } from "../data/budget";
import { Plus, Trash2 } from "lucide-react";

const STORAGE_KEY = "ishigaki-budget";
const cardShadow = "0 1px 3px rgba(23,58,71,.06)";

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function formatYen(amount: number) {
  return "¥" + amount.toLocaleString("ja-JP");
}

export default function BudgetPage() {
  const [categories, setCategories] = useState<BudgetCategory[]>(initialBudget);
  const [addingIn, setAddingIn] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newNote, setNewNote] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCategories(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const persist = (updated: BudgetCategory[]) => {
    setCategories(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addItem = (categoryId: string) => {
    if (!newLabel.trim()) return;
    const amount = parseInt(newAmount, 10) || 0;
    persist(
      categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, items: [...cat.items, { id: genId(), label: newLabel.trim(), amount, note: newNote.trim() }] }
          : cat
      )
    );
    setAddingIn(null);
    setNewLabel("");
    setNewAmount("");
    setNewNote("");
  };

  const deleteItem = (categoryId: string, itemId: string) =>
    persist(
      categories.map((cat) =>
        cat.id === categoryId ? { ...cat, items: cat.items.filter((i) => i.id !== itemId) } : cat
      )
    );

  const startEditAmount = (itemId: string, current: number) => {
    setEditingItemId(itemId);
    setEditAmount(current === 0 ? "" : String(current));
  };

  const saveAmount = (categoryId: string, itemId: string) => {
    const amount = parseInt(editAmount, 10) || 0;
    persist(
      categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, items: cat.items.map((i) => (i.id === itemId ? { ...i, amount } : i)) }
          : cat
      )
    );
    setEditingItemId(null);
  };

  const total = categories.flatMap((c) => c.items).reduce((sum, i) => sum + i.amount, 0);

  const inputStyle = { borderColor: "var(--sand-300)", fontSize: 16 } as const;

  return (
    <main className="max-w-md mx-auto px-4 py-5">
      <div className="flex items-center justify-between mb-3">
        <h1 className="font-display font-bold text-xl">会計</h1>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(255,111,94,.14)", color: "var(--coral-deep)" }}>
          2名で割り勘
        </span>
      </div>

      {/* 合計ヒーロー */}
      <div className="rounded-[28px] p-5 text-white" style={{ background: "linear-gradient(135deg,#FF6F5E,#FF5C8A)", boxShadow: "0 6px 18px rgba(23,58,71,.08)" }}>
        <div className="text-[12.5px] font-semibold opacity-95">2名 合計</div>
        <div className="font-display font-black text-[32px] mt-0.5">{formatYen(total)}</div>
        <div className="text-[11.5px] opacity-90 mt-0.5">1人あたり {formatYen(Math.round(total / 2))}</div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {categories.map((cat) => {
          const catTotal = cat.items.reduce((sum, i) => sum + i.amount, 0);
          const isAdding = addingIn === cat.id;

          return (
            <div key={cat.id} className="bg-white rounded-[22px] border overflow-hidden" style={{ borderColor: "var(--sand-200)", boxShadow: cardShadow }}>
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--sand-150)" }}>
                <h2 className="text-[14px] font-bold">
                  {cat.emoji} {cat.name}
                </h2>
                <span className="text-[14px] font-bold font-mono" style={{ color: "var(--coral-deep)" }}>{formatYen(catTotal)}</span>
              </div>

              <ul>
                {cat.items.map((item) => (
                  <li key={item.id} className="px-4 py-2.5 flex items-start justify-between gap-2 border-b" style={{ borderColor: "var(--sand-100)" }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] leading-tight">{item.label}</p>
                      {item.note && <p className="text-[11px] mt-0.5" style={{ color: "var(--ink-400)" }}>{item.note}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {editingItemId === item.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            autoFocus
                            type="number"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveAmount(cat.id, item.id);
                              if (e.key === "Escape") setEditingItemId(null);
                            }}
                            onBlur={() => saveAmount(cat.id, item.id)}
                            placeholder="0"
                            className="w-24 border rounded px-2 py-0.5 outline-none text-right"
                            style={{ borderColor: "var(--coral)", fontSize: 16 }}
                          />
                          <span className="text-[12px]" style={{ color: "var(--ink-500)" }}>円</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditAmount(item.id, item.amount)}
                          className="text-[13.5px] font-mono font-semibold"
                          style={{ color: item.amount === 0 ? "var(--ink-300)" : "var(--ink-700)" }}
                        >
                          {item.amount === 0 ? "未入力" : formatYen(item.amount)}
                        </button>
                      )}
                      <button onClick={() => deleteItem(cat.id, item.id)} style={{ color: "var(--ink-300)" }} aria-label="削除">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {isAdding ? (
                <div className="px-4 py-3 space-y-2" style={{ background: "var(--sand-50)" }}>
                  <input
                    autoFocus
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    onKeyDown={(e) => e.key === "Escape" && setAddingIn(null)}
                    placeholder="項目名"
                    className="w-full border rounded-lg px-3 py-2 outline-none"
                    style={inputStyle}
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addItem(cat.id);
                        if (e.key === "Escape") setAddingIn(null);
                      }}
                      placeholder="金額（円）"
                      className="flex-1 min-w-0 border rounded-lg px-3 py-2 outline-none"
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="メモ（任意）"
                      className="flex-1 min-w-0 border rounded-lg px-3 py-2 outline-none"
                      style={inputStyle}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        setAddingIn(null);
                        setNewLabel("");
                        setNewAmount("");
                        setNewNote("");
                      }}
                      className="text-[13px] px-3 py-1.5 rounded-lg"
                      style={{ color: "var(--ink-400)" }}
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={() => addItem(cat.id)}
                      disabled={!newLabel.trim()}
                      className="text-[13px] text-white px-4 py-1.5 rounded-lg disabled:opacity-40"
                      style={{ background: "var(--coral)" }}
                    >
                      追加
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAddingIn(cat.id);
                    setNewLabel("");
                    setNewAmount("");
                    setNewNote("");
                  }}
                  className="w-full flex items-center justify-center gap-1 px-4 py-2.5 text-[13px] font-semibold"
                  style={{ color: "var(--coral-deep)" }}
                >
                  <Plus size={14} /> 項目を追加
                </button>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
