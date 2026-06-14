import Link from "next/link";
import { Map, List, Wallet, MessageCircle, CalendarDays, Plane } from "lucide-react";

const navCards = [
  {
    href: "/itinerary",
    icon: Map,
    label: "旅程",
    description: "5日間のスケジュール・スポット",
    color: "bg-cyan-50 border-cyan-200 text-cyan-700",
    iconColor: "text-cyan-500",
  },
  {
    href: "/chat",
    icon: MessageCircle,
    label: "AIチャット",
    description: "石垣島について何でも聞く",
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
    iconColor: "text-emerald-500",
  },
  {
    href: "/checklist",
    icon: List,
    label: "持ち物",
    description: "チェックリストで準備を確認",
    color: "bg-orange-50 border-orange-200 text-orange-700",
    iconColor: "text-orange-500",
  },
  {
    href: "/budget",
    icon: Wallet,
    label: "会計",
    description: "費用の概算と内訳",
    color: "bg-purple-50 border-purple-200 text-purple-700",
    iconColor: "text-purple-500",
  },
];

export default function Home() {
  return (
    <main className="max-w-md mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Plane size={28} className="text-cyan-500" />
          <h1 className="text-2xl font-bold text-gray-800">石垣島旅のしおり</h1>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-gray-500 text-sm">
          <CalendarDays size={16} />
          <span>2026年6月24日（水）〜 6月28日（日）</span>
        </div>
        <p className="mt-2 text-gray-400 text-xs">5日間 / 竹富島・石垣島・西表島</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-600 mb-2">旅行概要</h2>
        <ul className="text-sm text-gray-700 space-y-1.5">
          <li>✈️ 6/24（水）関西空港発 → 竹富島へ。高那旅館泊</li>
          <li>⛵ 6/25（木）竹富島散策 → 石垣島へ移動・川平湾ドライブ</li>
          <li>🤿 6/26（金）青の洞窟シュノーケリング・川平湾ドライブ</li>
          <li>🌴 6/27（土）西表島アクティビティ・石垣島観光</li>
          <li>🛫 6/28（日）石垣空港発 → 関西空港着</li>
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {navCards.map(({ href, icon: Icon, label, description, color, iconColor }) => (
          <Link
            key={href}
            href={href}
            className={`rounded-2xl border p-4 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow ${color}`}
          >
            <Icon size={26} className={iconColor} />
            <div>
              <p className="font-semibold text-sm">{label}</p>
              <p className="text-xs opacity-70 leading-tight mt-0.5">{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
