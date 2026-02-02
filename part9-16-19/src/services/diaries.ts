import axios from "axios";
import type { DiaryEntry, NewDiaryEntry } from "../types";

const baseUrl = "/api/diaries";

export const getDiaries = async (): Promise<DiaryEntry[]> => {
  const diaries = await axios.get<DiaryEntry[]>(baseUrl);
  console.log(diaries);
  return diaries.data;
};

export const postDiary = async (
  diaryToAdd: NewDiaryEntry,
): Promise<DiaryEntry> => {
  console.log(diaryToAdd);
  const newDiaryEntry = await axios.post<DiaryEntry>(baseUrl, diaryToAdd);
  return newDiaryEntry.data;
};
