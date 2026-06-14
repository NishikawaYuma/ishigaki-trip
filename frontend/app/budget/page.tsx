const categories = [
  {
    name: "交通",
    emoji: "✈️",
    items: [
      { label: "往復航空券", amount: 50000, note: "東京発の場合の目安" },
      { label: "レンタカー（5日間）", amount: 30000, note: "保険込み" },
      { label: "フェリー（竹富島 or 西表島 往復）", amount: 5000, note: "離島ごとに異なる" },
    ],
  },
  {
    name: "宿泊",
    emoji: "🏨",
    items: [
      { label: "宿泊費（4泊）", amount: 40000, note: "1泊1万円想定" },
    ],
  },
  {
    name: "食事",
    emoji: "🍽️",
    items: [
      { label: "食費（5日間）", amount: 20000, note: "1日4,000円目安" },
    ],
  },
  {
    name: "アクティビティ",
    emoji: "🤿",
    items: [
      { label: "グラスボート（川平湾）", amount: 1500, note: "1人あたり" },
      { label: "体験ダイビング（任意）", amount: 15000, note: "要事前予約" },
      { label: "シュノーケル器材レンタル", amount: 1000, note: "現地レンタルの場合" },
    ],
  },
  {
    name: "おみやげ・その他",
    emoji: "🛍️",
    items: [
      { label: "おみやげ", amount: 10000, note: "石垣牛・ラー油・泡盛など" },
      { label: "その他（予備）", amount: 5000, note: "急な出費用" },
    ],
  },
];

function formatYen(amount: number) {
  return amount.toLocaleString("ja-JP") + "円";
}

export default function BudgetPage() {
  const total = categories
    .flatMap((c) => c.items)
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <main className="max-w-md mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">会計</h1>
        <div className="text-right">
          <p className="text-xs text-gray-400">合計（概算）</p>
          <p className="text-lg font-bold text-purple-600">{formatYen(total)}</p>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => {
          const catTotal = cat.items.reduce((sum, i) => sum + i.amount, 0);
          return (
            <div
              key={cat.name}
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
                  <li key={item.label} className="px-4 py-2.5 flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{item.label}</p>
                      {item.note && (
                        <p className="text-xs text-gray-400 mt-0.5">{item.note}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-600 flex-shrink-0">
                      {formatYen(item.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-center text-gray-400">
        ※ 概算のため実際の費用と異なる場合があります
      </p>
    </main>
  );
}
