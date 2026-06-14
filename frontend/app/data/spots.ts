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
        comment: "Terminal 2",
      },
      {
        id: "d1-2",
        time: "9:55",
        title: "南ぬ島石垣空港 着",
        comment: "バス移動で離島ターミナルへ",
      },
      {
        id: "d1-3",
        time: "未定",
        editable: true,
        title: "竹富島行き 観光船乗車",
        comment: "石垣離島ターミナル 発",
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
        comment: "高那旅館",
      },
      {
        id: "d1-5",
        time: "未定",
        editable: true,
        title: "昼食",
        comment: "しだめー館",
      },
      {
        id: "d1-6",
        time: "未定",
        editable: true,
        title: "自由時間",
        comment: "自転車を借りて島を散策など",
      },
      {
        id: "d1-7",
        time: "未定",
        editable: true,
        title: "夕食",
        comment: "高那旅館",
      },
      {
        id: "d1-8",
        time: "未定",
        editable: true,
        title: "桟橋・星空",
        comment: "桟橋で夕陽、夜は星空",
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
        comment: "高那旅館",
      },
      {
        id: "d2-2",
        time: "12:00頃",
        editable: true,
        title: "昼食",
        comment: "やらぼ 竹富島（気分と天候次第。場合によってはAMに石垣島へ）",
      },
      {
        id: "d2-3",
        time: "未定",
        editable: true,
        title: "石垣島行き 観光船乗車",
        comment: "竹富島 発",
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
        comment: "The Breakfast Hotel MARCHE",
      },
      {
        id: "d2-5",
        time: "11:00〜19:00",
        title: "石垣観光（川平湾などドライブ）",
        comment: "タイムズレンタカー",
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
        comment: "よるどーや",
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
        comment: "The Breakfast Hotel MARCHE",
      },
      {
        id: "d3-2",
        time: "8:00",
        title: "荷物をホテルに預け出発",
      },
      {
        id: "d3-3",
        time: "8:30",
        title: "シュノーケリング",
        comment: "青の洞窟（終了後、ホテルまで送迎あり）",
      },
      {
        id: "d3-4",
        time: "12:30",
        title: "ホテルへ送迎",
        comment: "The Breakfast Hotel MARCHE",
      },
      {
        id: "d3-5",
        time: "13:00頃",
        title: "荷物を預ける",
        comment: "The Breakfast Hotel PORTE",
      },
      {
        id: "d3-6",
        time: "13:30〜18:00",
        title: "石垣観光（川平湾などドライブ）",
        comment: "タイムズレンタカー",
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
        comment: "島料理うらさき",
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
        comment: "The Breakfast Hotel PORTE",
      },
      {
        id: "d4-2",
        time: "未定",
        editable: true,
        title: "アクティビティ",
        comment: "西表島",
      },
      {
        id: "d4-3",
        time: "未定",
        editable: true,
        title: "石垣島残り観光",
        comment: "公設市場（市街地）など",
      },
      {
        id: "d4-4",
        time: "19:00",
        title: "ホテルチェックイン",
        comment: "みどり荘（8,200円）",
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
        comment: "離島ターミナル → 南ぬ島石垣空港",
      },
      {
        id: "d5-2",
        time: "10:40",
        title: "南ぬ島石垣空港 出発",
      },
      {
        id: "d5-3",
        time: "13:05",
        title: "関西国際空港 着",
      },
    ],
  },
];
