import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useGetGenresQuery } from '../../services/movie';

export default function Genres() {
  const { data, isLoading } = useGetGenresQuery();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        m: 1,
        gap: 2,
        position: 'relative'
      }}
    >
      {isLoading ? (
        <CircularProgress />
      ) : (
        data?.map(({ id, name }) => (
          <Link key={id} to={`${id}`}>
            {name}
          </Link>
        ))
      )}
    </Box>
  );
}
