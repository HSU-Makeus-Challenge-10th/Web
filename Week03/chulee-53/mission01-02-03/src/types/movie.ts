export type Movie = {
  id: number;
  title: string;
  backdrop_path: string;
  original_title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  runtime: number;
};

export type MovieResponse = {
  page: number;
  results: Movie[];
};

export interface Crew {
  name: string;
  job: string;
  profile_path: string;
}

export interface Cast {
  name: string;
  character: string;
  profile_path: string;
}
