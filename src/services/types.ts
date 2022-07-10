export type Genre = {
  id: number;
  name: string;
};

export type Movie = {
  id: number;
  genre_ids: number[];
  title: string;
  original_title: string;
  overview: string;
  poster_path?: string;
};

export type DiscoverMovieResult = {
  page: number;
  results: Movie[];
  total_results: number;
  total_pages: number;
};

export type MovieDetail = {
  id: number;
  genres: Genre[];
  title: string;
  original_title: string;
  overview?: string;
  poster_path?: string;
  release_date: string;
  budget: number;
  revenue: number;
  runtime?: number;
};
