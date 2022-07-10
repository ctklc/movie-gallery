export const apiURL = process.env.REACT_APP_API_URL;
export const imageApiURL = process.env.REACT_APP_IMAGE_API_URL;
export const apiKey = process.env.REACT_APP_API_KEY;

export const movieGenres = () => `/genre/movie/list?api_key=${apiKey}`;

export const moviesWithGenres = (
  genreIds: (number | string)[],
  page: number = 1
) =>
  `/discover/movie?api_key=${apiKey}&with_genres=${genreIds.join(
    ','
  )}&page=${page}`;

export const movieDetail = (movieId: number | string) =>
  `/movie/${movieId}?api_key=${apiKey}`;
