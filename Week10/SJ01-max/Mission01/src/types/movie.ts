export type MovieLanguage = "ko-KR" | "en-US" | "ja-JP";

export interface MovieFilters {
  query: string;
  include_adult: boolean;
  language: MovieLanguage;
}

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  original_language: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  adult: boolean;
  video: boolean;
  genre_ids: number[];
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
}
