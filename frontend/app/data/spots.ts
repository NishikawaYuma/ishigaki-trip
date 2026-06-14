export type Link = {
  label: string;
  url: string;
};

export type ScheduleItem = {
  id: string;
  time: string;
  editable?: boolean;
  title: string;
  comment?: string;
  links?: Link[];
};

export type DayPlan = {
  date: string;
  label: string;
  schedules: ScheduleItem[];
};

export const tripData: DayPlan[] = [
  {
    date: "2026-06-24",
    label: "1日目（水）石垣島着・竹富島へ",
    schedules: [
      {
        id: "d1-1",
        time: "7:10",
        title: "関西国際空港 出発",
        comment: "Terminal 2 発。LCC はターミナル2が多いので余裕を持って2時間前到着を。",
      },
      {
        id: "d1-2",
        time: "9:55",
        title: "南ぬ島石垣空港 着",
        comment: "到着ロビー出てすぐのバス停から離島ターミナルへ（約30分）。景色を眺めながら石垣島の空気を初体験。",
      },
      {
        id: "d1-3",
        time: "未定",
        editable: true,
        title: "竹富島行き 観光船乗車",
        comment: "石垣離島ターミナル 発。約10分で竹富島へ到着。波が穏やかで乗り心地◎。チケットは乗船前に窓口で購入。",
        links: [
          { label: "安栄観光 時刻表", url: "https://aneikankou.co.jp/course/" },
          { label: "八重山観光フェリー 時刻表", url: "https://www.yaeyama.co.jp/" },
        ],
      },
      {
        id: "d1-4",
        time: "未定",
        editable: true,
        title: "ホテルチェックイン",
        comment: "高那旅館。琉球赤瓦の建物が続く集落のなかに佇む老舗旅館。竹富島の静けさと風情がそのまま宿に宿っている。",
      },
      {
        id: "d1-5",
        time: "未定",
        editable: true,
        title: "昼食",
        comment: "しだめー館。竹富島の郷土料理食堂。八重山そば・ジューシー（炊き込みご飯）・ゴーヤチャンプルーなど島の定番が揃う。",
      },
      {
        id: "d1-6",
        time: "未定",
        editable: true,
        title: "自由時間",
        comment: "島はほぼ平坦でレンタサイクルで1周できる（約5km）。白砂の道、赤瓦の古民家、コンドイビーチ、カイジ浜の星砂など見どころが点在。",
      },
      {
        id: "d1-7",
        time: "未定",
        editable: true,
        title: "夕食",
        comment: "高那旅館のご飯。島豆腐・海ぶどう・島魚など沖縄素材を使ったお惣菜が並ぶ。宿で食べる夜ご飯が竹富島らしい贅沢。",
      },
      {
        id: "d1-8",
        time: "未定",
        editable: true,
        title: "桟橋・星空",
        comment: "西桟橋は夕陽の名所。日が暮れた後も、光害の少ない竹富島では晴れれば天の川が肉眼で見える。虫除けスプレー持参を。",
      },
    ],
  },
  {
    date: "2026-06-25",
    label: "2日目（木）石垣島へ移動・観光",
    schedules: [
      {
        id: "d2-1",
        time: "8:00頃",
        editable: true,
        title: "朝食",
        comment: "高那旅館。竹富島最後の朝をのんびり味わう。島の静かな朝の空気は格別。",
      },
      {
        id: "d2-2",
        time: "12:00頃",
        editable: true,
        title: "昼食",
        comment: "やらぼ（竹富島）。島素材を使ったシンプルな定食・麺類が中心の食堂。気分と天候次第でAMに石垣島へ戻る選択肢も。",
      },
      {
        id: "d2-3",
        time: "未定",
        editable: true,
        title: "石垣島行き 観光船乗車",
        comment: "竹富島 発。約10分で石垣港へ。天候によって欠航・時刻変更あり。当日の運航状況を乗船前に確認。",
        links: [
          { label: "安栄観光 時刻表", url: "https://aneikankou.co.jp/course/" },
          { label: "八重山観光フェリー 時刻表", url: "https://www.yaeyama.co.jp/" },
        ],
      },
      {
        id: "d2-4",
        time: "未定",
        editable: true,
        title: "ホテルチェックイン",
        comment: "The Breakfast Hotel MARCHE（石垣島）。翌朝の充実した朝食ビュッフェが評判のホテル。市街地に近く観光の拠点に最適。",
      },
      {
        id: "d2-5",
        time: "11:00〜19:00",
        title: "石垣観光（川平湾などドライブ）",
        comment: "川平湾（かびらわん）は日本百景の絶景スポット。エメラルドグリーンの海とグラスボート（約30分）が人気。石垣島の道はドライブしやすく、海沿いの景色も最高。",
        links: [
          {
            label: "タイムズカー 石垣島 Google Maps",
            url: "https://www.google.com/maps/search/タイムズカー+石垣島市",
          },
        ],
      },
      {
        id: "d2-6",
        time: "19:00",
        title: "夕食",
        comment: "よるどーや（石垣島）。地元客も通う居酒屋。石垣牛・ミミガー・もずく酢をつまみに泡盛でかんぱい。石垣の夜を満喫。",
      },
    ],
  },
  {
    date: "2026-06-26",
    label: "3日目（金）シュノーケリング・観光",
    schedules: [
      {
        id: "d3-1",
        time: "7:00",
        title: "朝食",
        comment: "The Breakfast Hotel MARCHEの朝食ビュッフェ。石垣島食材を使ったメニューが充実。シュノーケリング前にしっかり食べておこう。",
      },
      {
        id: "d3-2",
        time: "8:00",
        title: "荷物をホテルに預け出発",
        comment: "チェックアウト後、荷物はMARCHEに預けて身軽に。着替えと貴重品だけ持ってシュノーケリングへ。",
      },
      {
        id: "d3-3",
        time: "8:30",
        title: "シュノーケリング",
        comment: "青の洞窟。岩の割れ目から入る洞窟内は光の反射で海面が青く輝く神秘的な空間。カラフルな熱帯魚の群れも目の前に広がる。器材レンタル・インストラクター付きで安心。終了後はホテルまで送迎あり。",
      },
      {
        id: "d3-4",
        time: "12:30",
        title: "ホテルへ送迎",
        comment: "シュノーケリング業者がThe Breakfast Hotel MARCHEまで送迎。シャワーを借りて着替えを済ませ、午後の観光へ。",
      },
      {
        id: "d3-5",
        time: "13:00頃",
        title: "荷物を預ける",
        comment: "The Breakfast Hotel PORTE（今夜の宿）に荷物を先預け。チェックインは夕方まで不要なので、身軽なままドライブへ出発。",
      },
      {
        id: "d3-6",
        time: "13:30〜18:00",
        title: "石垣観光（川平湾などドライブ）",
        comment: "川平湾・米原ビーチなど島北部を自由にドライブ。昨日と違うルートや立ち寄りスポットを探しながら、沈む夕日を眺めてホテルへ。",
        links: [
          {
            label: "タイムズカー 石垣島 Google Maps",
            url: "https://www.google.com/maps/search/タイムズカー+石垣島市",
          },
        ],
      },
      {
        id: "d3-7",
        time: "18:00",
        title: "夕食",
        comment: "島料理うらさき。島の食材にこだわった郷土料理店。島豆腐・ゴーヤチャンプルー・石垣牛の炙りなど、石垣島の旨いものが一堂に揃う。",
      },
    ],
  },
  {
    date: "2026-06-27",
    label: "4日目（土）西表島・石垣観光",
    schedules: [
      {
        id: "d4-1",
        time: "7:00",
        title: "朝食ビュッフェ",
        comment: "The Breakfast Hotel PORTEの朝食ビュッフェ。沖縄そば・島野菜・ジューシーなど沖縄料理が中心。西表島アクティビティに備えてしっかり食べておこう。",
      },
      {
        id: "d4-2",
        time: "未定",
        editable: true,
        title: "アクティビティ",
        comment: "西表島。石垣から高速船で約40〜50分。国内最大のマングローブ林が広がるジャングルの島。カヌー・トレッキング・由布島（水牛車で渡る絶景の小島）が人気。要事前予約。",
      },
      {
        id: "d4-3",
        time: "未定",
        editable: true,
        title: "石垣島残り観光",
        comment: "公設市場（石垣市街地）でおみやげ探し。石垣島ラー油・黒糖・泡盛・ちんすこう・石垣牛加工品など、買い残しがないようにチェック。",
      },
      {
        id: "d4-4",
        time: "19:00",
        title: "ホテルチェックイン",
        comment: "みどり荘（8,200円）。アットホームな地元ゲストハウス。リラックスして旅の最終夜を過ごせる。",
      },
    ],
  },
  {
    date: "2026-06-28",
    label: "5日目（日）帰路",
    schedules: [
      {
        id: "d5-1",
        time: "8:30〜9:00",
        title: "バス移動",
        comment: "離島ターミナル → 南ぬ島石垣空港。ターミナル発のバス時刻を前日に確認しておくこと。スーツケースがあるので余裕を持って。",
      },
      {
        id: "d5-2",
        time: "10:40",
        title: "南ぬ島石垣空港 出発",
        comment: "搭乗前に空港内の売店で最後のおみやげも忘れずに。石垣牛バーガーや海ぶどうスムージーなどフードも充実。",
      },
      {
        id: "d5-3",
        time: "13:05",
        title: "関西国際空港 着",
        comment: "おつかれさまでした！竹富島の赤瓦、青の洞窟の青、川平湾のエメラルド——忘れられない5日間に。",
      },
    ],
  },
];
