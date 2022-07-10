import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import fetchMock from 'jest-fetch-mock';
import MovieDetails, { currencyFormatter } from './index';
import mockMovieDetail from '../../../../shared/test/movieDetail.json';
import { store } from '../../../../store';
import { imageApiURL } from '../../../../services/config';

jest.setTimeout(15000);

const givenFetchMovieDetailSucceed = () => {
  fetchMock.mockOnce(JSON.stringify(mockMovieDetail), {
    status: 200
  });
};

const renderMovieDetailWithRouter = (genreId = 16, movieId = 438148) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/${genreId}/${movieId}`]}>
        <Routes>
          <Route path=":genreId/:movieId" element={<MovieDetails />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

describe('Movie Details', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should render all details default', async () => {
    // given the fetch succeed with mock data
    givenFetchMovieDetailSucceed();

    // render the component
    renderMovieDetailWithRouter();

    // wait for the mock data and check rendered child component count
    await waitFor(() => {
      const imageSrc = `${imageApiURL || ''}${
        mockMovieDetail.poster_path || ''
      }`;
      const image = screen.queryByAltText(
        mockMovieDetail.original_title
      ) as HTMLImageElement;
      expect(image).toBeInTheDocument();
      expect(image.src).toContain(imageSrc);

      screen
        .queryAllByText(mockMovieDetail.title)
        .map((item) => expect(item).toBeInTheDocument());

      screen
        .queryAllByText(mockMovieDetail.original_title)
        .map((item) => expect(item).toBeInTheDocument());

      expect(
        screen.queryByText(`${mockMovieDetail.runtime} mins`)
      ).toBeInTheDocument();

      if (mockMovieDetail.release_date) {
        expect(
          screen.queryByText(
            new Date(mockMovieDetail.release_date).toLocaleDateString()
          )
        ).toBeInTheDocument();
      }

      if (mockMovieDetail.budget || mockMovieDetail.budget === 0) {
        expect(
          screen.queryByText(currencyFormatter().format(mockMovieDetail.budget))
        ).toBeInTheDocument();
      }

      if (mockMovieDetail.revenue || mockMovieDetail.revenue === 0) {
        expect(
          screen.queryByText(
            currencyFormatter().format(mockMovieDetail.revenue)
          )
        ).toBeInTheDocument();
      }

      expect(
        screen.queryByText(
          mockMovieDetail.genres.map(({ name }) => name).join(', ')
        )
      ).toBeInTheDocument();
    });
  });
});
