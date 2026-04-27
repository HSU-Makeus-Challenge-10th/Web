export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
    vote_average: number;
    release_date: string;
    backdrop_path: string;
}

export interface MovieResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export interface Genre {
    id: number;
    name: string;
}

export interface MovieDetail extends Movie {
    tagline: string;
    runtime: number;
    genres: Genre[];
    status: string;
    revenue: number;
    budget: number;
}

export interface Cast {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    known_for_department: string;
}

export interface Crew {
    id: number;
    name: string;
    job: string;
    profile_path: string | null;
}

export interface MovieCredits {
    id: number;
    cast: Cast[];
    crew: Crew[];
}