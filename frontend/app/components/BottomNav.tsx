"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, MessageCircle, List, Wallet } from "lucide-react";

const tabs = [
  { href: "/", label: "Top", icon: Home },
  { href: "/itinerary", label: "旅程", icon: Map },
  { href: "/chat", label: "チャット", icon: MessageCircle },
  { href: "/checklist", label: "持ち物", icon: List },
  { href: "/budget", label: "会計", icon: Wallet },
];

export default function BottomNav() {
  const pathname = usePathname();

  // ★ バグ修正: 以前は `if (pathname === "/") return null;` で Top では
  //   ナビを描画していなかった。常に表示し、Top も "現在地" としてハイライトする。

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex pb-[max(4px,env(safe-area-inset-bottom))]"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid var(--sand-200)",
      }}
    >
      {tabs.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10.5px] font-bold transition-colors"
            style={{ color: active ? "var(--sea)" : "var(--ink-400)" }}
          >
            <Icon size={22} strokeWidth={active ? 2.6 : 1.9} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
