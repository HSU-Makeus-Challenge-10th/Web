export type Movie = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};
export type MovieDetail = Movie & {
  runtime: number;
  tagline: string;
  genres: { id: number; name: string }[];
  backdrop_path: string;
};
export type MovieResponse = {
  page: number;
  results: Movie[];
  totalPages: number;
  total_results: number;
};
export type Cast = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
};
export type CreditsResponse = {
  id: number;
  cast: Cast[];
};

