import type { MovieLanguage } from "../types/movie";

export interface LanguageOption {
  label: string;
  value: MovieLanguage;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { label: "한국어", value: "ko-KR" },
  { label: "영어", value: "en-US" },
  { label: "일본어", value: "ja-JP" },
];

export const TMDB_POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
export const TMDB_BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280";
