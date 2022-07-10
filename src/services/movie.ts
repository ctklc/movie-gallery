import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Genre, MovieDetail } from './types';
import { DiscoverMovieResult } from './types';
import { apiURL, movieDetail, movieGenres, moviesWithGenres } from './config';

export const movieApi = createApi({
  reducerPath: 'movieApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiURL }),
  endpoints: (builder) => ({
    getGenres: builder.query<Genre[], void>({
      query: () => movieGenres(),
      transformResponse: (rawResult: { genres: Genre[] }) => rawResult.genres
    }),
    getMoviesWithGenres: builder.query<
      DiscoverMovieResult,
      { genreIds: (number | string)[]; page?: number }
    >({
      query: ({ genreIds, page }) => moviesWithGenres(genreIds, page)
    }),
    getMovieDetail: builder.query<MovieDetail, number | string>({
      query: (movieId) => movieDetail(movieId)
    })
  })
});

export const {
  useGetGenresQuery,
  useGetMoviesWithGenresQuery,
  useGetMovieDetailQuery
} = movieApi;
