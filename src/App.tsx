import Container from '@mui/material/Container';
import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorBoundary from './components/errorBoundary';
import Genres from './pages/genres';

const Movies = lazy(() => import('./pages/genres/movies'));
const MovieDetails = lazy(() => import('./pages/genres/movies/detail'));

function App() {
  return (
    <ErrorBoundary>
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Routes>
          <Route path="/" element={<Genres />} />
          <Route
            path=":genreId"
            element={
              <Suspense fallback={<CircularProgress />}>
                <Movies />
              </Suspense>
            }
          >
            <Route
              path=":movieId"
              element={
                <Suspense fallback={<CircularProgress />}>
                  <MovieDetails />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </Container>
    </ErrorBoundary>
  );
}

export default App;
