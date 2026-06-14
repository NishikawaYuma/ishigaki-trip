export type BudgetItem = {
  id: string;
  label: string;
  amount: number;
  note: string;
};

export type BudgetCategory = {
  id: string;
  name: string;
  emoji: string;
  items: BudgetItem[];
};

export const initialBudget: BudgetCategory[] = [
  {
    id: "transport",
    name: "交通",
    emoji: "✈️",
    items: [
      { id: "t1", label: "往復航空券（関西〜石垣）", amount: 0, note: "" },
      { id: "t2", label: "フェリー（石垣↔竹富島 往復）", amount: 0, note: "" },
      { id: "t3", label: "タイムズレンタカー Day2（11:00〜19:00）", amount: 0, note: "" },
      { id: "t4", label: "タイムズレンタカー Day3（13:30〜18:00）", amount: 0, note: "" },
    ],
  },
  {
    id: "accommodation",
    name: "宿泊",
    emoji: "🏨",
    items: [
      { id: "a1", label: "高那旅館 1泊", amount: 0, note: "竹富島" },
      { id: "a2", label: "The Breakfast Hotel MARCHE 1泊", amount: 0, note: "石垣島" },
      { id: "a3", label: "The Breakfast Hotel PORTE 1泊", amount: 21800, note: "石垣島" },
      { id: "a4", label: "みどり荘 1泊", amount: 8200, note: "石垣島" },
    ],
  },
  {
    id: "food",
    name: "食事",
    emoji: "🍽️",
    items: [
      { id: "f1", label: "食費（5日間）", amount: 20000, note: "1日4,000円目安" },
    ],
  },
  {
    id: "activity",
    name: "アクティビティ",
    emoji: "🤿",
    items: [
      { id: "ac1", label: "シュノーケリング（青の洞窟）", amount: 0, note: "" },
      { id: "ac2", label: "西表島 アクティビティ", amount: 0, note: "" },
    ],
  },
  {
    id: "other",
    name: "おみやげ・その他",
    emoji: "🛍️",
    items: [
      { id: "o1", label: "おみやげ", amount: 10000, note: "" },
      { id: "o2", label: "その他（予備）", amount: 5000, note: "急な出費用" },
    ],
  },
];
