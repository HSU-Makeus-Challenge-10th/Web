export interface Credit {
  id: number;
  cast: Cast[];
}

export interface Cast {
  id: number;
  name: string;
  profile_path: string;
  character: string;
}
