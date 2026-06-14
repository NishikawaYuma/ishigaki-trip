"use client";

import { useState, useEffect } from "react";
import { initialBudget } from "../data/budget";
import type { BudgetCategory } from "../data/budget";
import { Plus, Trash2 } from "lucide-react";

const STORAGE_KEY = "ishigaki-budget";

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function formatYen(amount: number) {
  return amount.toLocaleString("ja-JP") + "円";
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
    const updated = categories.map((cat) =>
      cat.id === categoryId
        ? {
            ...cat,
            items: [
              ...cat.items,
              { id: genId(), label: newLabel.trim(), amount, note: newNote.trim() },
            ],
          }
        : cat
    );
    persist(updated);
    setAddingIn(null);
    setNewLabel("");
    setNewAmount("");
    setNewNote("");
  };

  const deleteItem = (categoryId: string, itemId: string) => {
    const updated = categories.map((cat) =>
      cat.id === categoryId
        ? { ...cat, items: cat.items.filter((i) => i.id !== itemId) }
        : cat
    );
    persist(updated);
  };

  const startEditAmount = (itemId: string, current: number) => {
    setEditingItemId(itemId);
    setEditAmount(current === 0 ? "" : String(current));
  };

  const saveAmount = (categoryId: string, itemId: string) => {
    const amount = parseInt(editAmount, 10) || 0;
    const updated = categories.map((cat) =>
      cat.id === categoryId
        ? { ...cat, items: cat.items.map((i) => (i.id === itemId ? { ...i, amount } : i)) }
        : cat
    );
    persist(updated);
    setEditingItemId(null);
  };

  const total = categories.flatMap((c) => c.items).reduce((sum, i) => sum + i.amount, 0);

  return (
    <main className="max-w-md mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">会計</h1>
        <div className="text-right">
          <p className="text-xs text-gray-400">合計</p>
          <p className="text-lg font-bold text-purple-600">{formatYen(total)}</p>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => {
          const catTotal = cat.items.reduce((sum, i) => sum + i.amount, 0);
          const isAdding = addingIn === cat.id;

          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-700">
                  {cat.emoji} {cat.name}
                </h2>
                <span className="text-sm font-semibold text-purple-500">
                  {formatYen(catTotal)}
                </span>
              </div>

              <ul className="divide-y divide-gray-50">
                {cat.items.map((item) => (
                  <li
                    key={item.id}
                    className="px-4 py-2.5 flex items-start justify-between gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 leading-tight">{item.label}</p>
                      {item.note && (
                        <p className="text-xs text-gray-400 mt-0.5">{item.note}</p>
                      )}
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
                            className="w-20 text-xs border border-purple-300 rounded px-1.5 py-0.5 outline-none text-right"
                          />
                          <span className="text-xs text-gray-500">円</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditAmount(item.id, item.amount)}
                          className={`text-sm transition-colors ${
                            item.amount === 0
                              ? "text-gray-300 hover:text-purple-400"
                              : "text-gray-600 hover:text-purple-600"
                          }`}
                        >
                          {item.amount === 0 ? "未入力" : formatYen(item.amount)}
                        </button>
                      )}
                      <button
                        onClick={() => deleteItem(cat.id, item.id)}
                        className="text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {isAdding ? (
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 space-y-2">
                  <input
                    autoFocus
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    onKeyDown={(e) => e.key === "Escape" && setAddingIn(null)}
                    placeholder="項目名"
                    className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-purple-300"
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
                      className="flex-1 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-purple-300"
                    />
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="メモ（任意）"
                      className="flex-1 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-purple-300"
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
                      className="text-xs text-gray-400 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={() => addItem(cat.id)}
                      disabled={!newLabel.trim()}
                      className="text-xs text-white bg-purple-500 px-3 py-1.5 rounded-lg disabled:opacity-40 hover:bg-purple-600 transition-colors"
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
                  className="w-full flex items-center gap-1 px-4 py-2 text-xs text-gray-400 hover:text-purple-500 hover:bg-gray-50 transition-colors border-t border-gray-50"
                >
                  <Plus size={13} />
                  追加
                </button>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
