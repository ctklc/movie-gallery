import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import fetchMock from 'jest-fetch-mock';
import Movies from './index';
import mockMovies from '../../../shared/test/movies.json';
import mockMoviesPage2 from '../../../shared/test/movies2.json';
import { store } from '../../../store';
import { DiscoverMovieResult } from '../../../services/types';

jest.setTimeout(15000);

const givenFetchMoviesSucceed = (data: DiscoverMovieResult = mockMovies) => {
  fetchMock.mockOnce(JSON.stringify(data), {
    status: 200
  });
};

const renderMoviesWithRouter = (genreId = 16) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/${genreId}`]}>
        <Routes>
          <Route path=":genreId" element={<Movies />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

describe('Movie List', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should fetch more data and when scrolled in the document', async () => {
    // given the fetch succeed with mock data
    givenFetchMoviesSucceed();

    // render the component
    renderMoviesWithRouter();

    // wait for the mock data and check rendered child component count
    await waitFor(() =>
      expect(screen.queryAllByTestId('MovieCard')).toHaveLength(
        mockMovies.results.length
      )
    );

    // given the fetch succeed with different mock data
    givenFetchMoviesSucceed(mockMoviesPage2);

    // scroll into bottom to fire infinite load
    fireEvent.scroll(document, {
      target: {
        scrollingElement: {
          scrollTop: 1,
          clientHeight: 1,
          scrollHeight: 1
        }
      }
    });

    // check fetch to be sure its called again
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    // wait for the mock data and check rendered child component count doubled
    await waitFor(() =>
      expect(screen.queryAllByTestId('MovieCard')).toHaveLength(
        mockMovies.results.length * 2
      )
    );
  });
});
