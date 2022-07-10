import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { memo } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { imageApiURL } from '../../../../services/config';
import { useGetMovieDetailQuery } from '../../../../services/movie';

export const currencyFormatter = () =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

function MovieDetails() {
  const { movieId = '' } = useParams();
  const { data: movie, isLoading } = useGetMovieDetailQuery(movieId);

  if (isLoading) return <CircularProgress />;

  const image = `${imageApiURL || ''}${movie?.poster_path || ''}`;

  return (
    <Box
      sx={{
        display: 'flex',
        position: 'relative',
        gap: 3
      }}
    >
      <img
        width={400}
        alt={movie?.original_title}
        src={image}
        srcSet={image}
        loading="lazy"
      />
      <Box
        sx={{
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
          gap: 2,
          mb: 1
        }}
      >
        <Typography variant="body2">
          <strong>Title:</strong> {movie?.title}
        </Typography>
        <Typography variant="body2">
          <strong>Original Title:</strong> {movie?.original_title}
        </Typography>
        <Typography variant="body2">
          <strong>Duration:</strong> {movie?.runtime} mins
        </Typography>
        <Typography variant="body2">
          <strong>Release Date:</strong>{' '}
          {movie?.release_date &&
            new Date(movie.release_date).toLocaleDateString()}
        </Typography>
        <Typography variant="body2">
          <strong>Budget:</strong>{' '}
          {(movie?.budget || movie?.budget === 0) &&
            currencyFormatter().format(movie.budget)}
        </Typography>
        <Typography variant="body2">
          <strong>Revenue:</strong>{' '}
          {(movie?.revenue || movie?.revenue === 0) &&
            currencyFormatter().format(movie.revenue)}
        </Typography>
        <Typography variant="body2">
          <strong>Genres:</strong>{' '}
          {movie?.genres.map(({ name }) => name).join(', ')}
        </Typography>
      </Box>
    </Box>
  );
}

export default memo(MovieDetails);
