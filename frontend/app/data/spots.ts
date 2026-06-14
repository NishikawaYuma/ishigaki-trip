export type Spot = {
  name: string;
  location: string;
  comment: string;
  alternative?: string;
};

export type Schedule = {
  time: string;
  title: string;
  spots: Spot[];
};

export type DayPlan = {
  date: string;
  label: string;
  schedules: Schedule[];
};

export const tripData: DayPlan[] = [
  {
    date: "2026-06-24",
    label: "1日目（水）石垣島着",
    schedules: [
      {
        time: "13:00",
        title: "石垣空港着・レンタカー受取",
        spots: [
          {
            name: "石垣空港",
            location: "石垣市白保1960-1",
            comment: "到着後すぐレンタカー会社に連絡。空港内に各社カウンターあり。荷物は預けたままレンタカー手続きへ。",
          },
        ],
      },
      {
        time: "15:00",
        title: "市街地・ユーグレナモール散策",
        spots: [
          {
            name: "ユーグレナモール",
            location: "石垣市大川258",
            comment: "みやげ・スーパー・食堂が集まる商店街。石垣牛関連のおみやげが豊富。夕食の候補も多い。",
          },
        ],
      },
      {
        time: "18:00",
        title: "夕食",
        spots: [
          {
            name: "市街地周辺の食堂",
            location: "石垣市街地",
            comment: "石垣牛ステーキ・八重山そば・海鮮など。ユーグレナモール周辺に選択肢多数。",
          },
        ],
      },
    ],
  },
  {
    date: "2026-06-25",
    label: "2日目（木）川平湾・米原ビーチ",
    schedules: [
      {
        time: "09:00",
        title: "川平湾 グラスボート",
        spots: [
          {
            name: "川平湾",
            location: "石垣市川平79",
            comment: "日本百景。グラスボートで海中のサンゴ・魚が見られる。所要30〜40分。朝一番が空いていておすすめ。",
            alternative: "雨天・強風時はグラスボート欠航の場合あり。欠航なら米原ビーチへ先行するか、底地ビーチに変更。",
          },
        ],
      },
      {
        time: "11:30",
        title: "米原ビーチ シュノーケリング",
        spots: [
          {
            name: "米原ビーチ",
            location: "石垣市桴海546",
            comment: "石垣島随一のシュノーケルポイント。駐車場あり・無料。器材レンタル現地可（シュノーケルセット500円〜）。",
            alternative: "波が高い日は底地ビーチ（石垣市桴海）へ変更。穏やかで浅瀬が続く。",
          },
        ],
      },
      {
        time: "14:00",
        title: "昼食・休憩",
        spots: [
          {
            name: "米原キャンプ場周辺",
            location: "石垣市桴海",
            comment: "米原ビーチ近くに売店あり。島内産フルーツも売られていることが多い。",
          },
        ],
      },
    ],
  },
  {
    date: "2026-06-26",
    label: "3日目（金）竹富島 or 西表島",
    schedules: [
      {
        time: "08:00",
        title: "離島ターミナル出発",
        spots: [
          {
            name: "石垣港離島ターミナル",
            location: "石垣市美崎町1",
            comment: "竹富島へフェリー約10分（往復1,500円）。西表島大原港へ約40分（往復4,750円）。事前チケット購入推奨。",
            alternative: "天候が悪い場合は竹富島（穏やか）を優先。西表島は波に影響されやすい。",
          },
        ],
      },
      {
        time: "09:00",
        title: "竹富島 水牛車・星砂の浜",
        spots: [
          {
            name: "竹富島",
            location: "竹富町竹富",
            comment: "琉球赤瓦と石畳の集落が美しい。水牛車（有料）で集落を周遊。星砂の浜でシュノーケルも可。",
            alternative: "西表島を選ぶ場合：仲間川マングローブカヌー（要予約）、由布島水牛渡しなど。",
          },
        ],
      },
    ],
  },
  {
    date: "2026-06-27",
    label: "4日目（土）フリー日",
    schedules: [
      {
        time: "自由",
        title: "ダイビング or ショッピング",
        spots: [
          {
            name: "石垣市街地 / ダイビングショップ",
            location: "石垣市街地",
            comment: "体験ダイビング（要事前予約・1〜2万円）。または市街地でおみやげ購入：石垣牛焼肉・石垣島ラー油・泡盛・ちんすこうなど。",
            alternative: "天候次第で川平湾への再訪やミシュラン穴場スポットへ。",
          },
        ],
      },
      {
        time: "18:00",
        title: "最後の夕食",
        spots: [
          {
            name: "石垣市街地 居酒屋",
            location: "石垣市街地",
            comment: "最終日前夜は石垣島料理で締め。島豆腐・ゴーヤチャンプルー・石垣島の地魚がおすすめ。",
          },
        ],
      },
    ],
  },
  {
    date: "2026-06-28",
    label: "5日目（日）帰宅",
    schedules: [
      {
        time: "午前",
        title: "チェックアウト・空港へ",
        spots: [
          {
            name: "石垣空港",
            location: "石垣市白保1960-1",
            comment: "搭乗2時間前を目安に到着。レンタカー返却場所・時間に注意（空港から離れた場所の場合は送迎バスあり）。",
          },
        ],
      },
    ],
  },
];
