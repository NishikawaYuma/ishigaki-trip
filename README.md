# 石垣島旅のしおりアプリ

石垣島旅行用に作った個人用 Web アプリ。日程・スポット・持ち物・予算の確認と、石垣島に特化した AI チャットができる。

## 機能

- 日程・スポット一覧
- 持ち物チェックリスト（localStorage で永続化）
- 予算メモ
- 石垣島専用 AI チャット（Gemini API）

## 技術構成

| レイヤー | 技術 |
|---|---|
| フロントエンド | Next.js 15 / TypeScript / Tailwind CSS |
| バックエンド | Python / FastAPI |
| LLM | Google Gemini API（gemini-2.5-flash） |
| デプロイ | Vercel（フロント）/ Google Cloud Run（バック） |

## ローカル起動

### バックエンド

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # .env に GEMINI_API_KEY を設定
uvicorn main:app --reload
```

### フロントエンド

```bash
cd frontend
npm install
npm run dev
```

`http://localhost:3000` で起動。バックエンドは `http://localhost:8000` で待ち受け。

## 環境変数

| 変数 | 説明 |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API キー（バックエンド `.env`） |
| `BACKEND_URL` | バックエンド URL（Vercel 環境変数。ローカルはデフォルト `http://localhost:8000`） |

> このアプリは個人旅行用途で作成。公開 URL は掲載していない（Cloud Run・Gemini API の課金リスク回避のため）。
