import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";
import BottomNav from "./components/BottomNav";

const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto",
  display: "swap",
});

const zenMaru = Zen_Maru_Gothic({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--font-zen",
  display: "swap",
});

export const metadata: Metadata = {
  title: "石垣島 旅のしおり",
  description: "2026年6月 石垣島旅行のしおりアプリ",
  manifest: "/manifest.json",
};

/* ★ viewport を明示。width=device-width / initial-scale=1 / viewport-fit=cover。
   入力欄16px化（globals.css）と合わせて、文字入力時の勝手な拡大を防ぐ。 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FFF6E9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${notoSans.variable} ${zenMaru.variable} h-full antialiased`}
    >
      <body className="min-h-full pb-20">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
