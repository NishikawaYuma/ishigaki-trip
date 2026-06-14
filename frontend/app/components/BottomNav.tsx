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

  if (pathname === "/") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex">
      {tabs.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs transition-colors ${
              active ? "text-cyan-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span className={active ? "font-semibold" : ""}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
