import { MessageCircle } from "lucide-react";

export default function ChatPage() {
  return (
    <main className="max-w-md mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[60vh]">
      <MessageCircle size={48} className="text-emerald-300 mb-4" />
      <h1 className="text-xl font-bold text-gray-700 mb-2">AIチャット</h1>
      <p className="text-sm text-gray-400 text-center leading-relaxed">
        石垣島専用AIチャットは Day 17 で実装予定です。
        <br />
        川平湾へのアクセス・おすすめグルメなど、
        <br />
        旅行中の疑問に答えます。
      </p>
    </main>
  );
}
