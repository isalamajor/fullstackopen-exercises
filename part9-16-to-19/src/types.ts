const Weather = {
  Sunny: "sunny",
  Rainy: "rainy",
  Cloudy: "cloudy",
  Stormy: "stormy",
  Windy: "windy",
} as const;

const Visibility = {
  Great: "great",
  Good: "good",
  Ok: "ok",
  Poor: "poor",
} as const;

type Weather = (typeof Weather)[keyof typeof Weather];
type Visibility = (typeof Visibility)[keyof typeof Visibility];

interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment: string;
}

type NewDiaryEntry = Omit<DiaryEntry, "id">;

type NonSensitiveDiaryEntry = Omit<DiaryEntry, "comment">;

export { Visibility, Weather };
export type { DiaryEntry, NewDiaryEntry, NonSensitiveDiaryEntry };
