export type Movie = {
  id: number;
  title: string;
  backdrop_path: string | null;
  original_title: string;
  overview: string;
  poster_path: string | null;
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
  profile_path: string | null;
}

export interface Cast {
  name: string;
  character: string;
  profile_path: string | null;
}

export type CreditResponse = {
  credits?: {
    cast: Cast[];
    crew: Crew[];
  };
};
