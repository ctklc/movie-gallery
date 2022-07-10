import { Outlet, useNavigate, useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useGetMoviesWithGenresQuery } from '../../../services/movie';
import { imageApiURL } from '../../../services/config';
import { Movie } from '../../../services/types';

export default function Movies() {
  const navigate = useNavigate();
  const { genreId = '', movieId = '' } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: result, isLoading } = useGetMoviesWithGenresQuery({
    genreIds: [genreId],
    page: currentPage
  });

  const [data, setData] = useState<Movie[]>([]);

  useEffect(() => {
    if (result) {
      setData((prev) => [...prev, ...result.results]);
    }
  }, [result]);

  const handleScroll: EventListener = (event: Event) => {
    const currentTarget = event.currentTarget as Document;
    const { scrollingElement } = currentTarget;

    if (
      scrollingElement &&
      scrollingElement.scrollTop + scrollingElement.clientHeight >=
        scrollingElement.scrollHeight
    ) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const renderHierarchy = () => {
    if (movieId) return <Outlet />;
    return (
      <>
        {data?.map((movie) => {
          const image = `${imageApiURL || ''}${movie.poster_path || ''}`;

          return (
            <Button
              key={movie.id}
              onClick={() => navigate(`${movie.id}`, { state: movie })}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'wrap',
                position: 'relative',
                gap: 2,
                borderBottom: '1px solid #000',
                borderRadius: 0
              }}
              data-testid="MovieCard"
            >
              <img
                width={250}
                height={250}
                alt={movie.original_title}
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
                <Typography variant="body1" sx={{ width: 250, color: '#000' }}>
                  {`${movie.title} (${movie.original_title})`}
                </Typography>
              </Box>
            </Button>
          );
        })}
        {isLoading && <CircularProgress data-testid="CircularProgress" />}
      </>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        m: 1,
        gap: 2,
        position: 'relative'
      }}
    >
      {renderHierarchy()}
    </Box>
  );
}
