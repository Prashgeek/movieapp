import React, { useEffect, useState } from 'react';
import API from '../api/api';
import {
  Grid,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress
} from '@mui/material';
import MovieCard from '../components/MovieCard';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(12);
  const [sortBy, setSortBy] = useState('title');
  const [view, setView] = useState('grid');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovies(1);
  }, [sortBy]);

  async function fetchMovies(p = 1) {
    try {
      setLoading(true);
      setError('');

      const endpoint =
        sortBy === 'title'
          ? '/movies'
          : '/movies/sorted';

      const res = await API.get(endpoint, {
        params: {
          page: p,
          limit,
          by: sortBy,
          order: 'asc'
        }
      });

      const data = res.data;

      setMovies(data.movies || []);
      setPage(data.page || p);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError('Failed to load movies');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  function handlePageChange(_, value) {
    fetchMovies(value);
  }

  return (
    <Box>
      {/* HEADER */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          gap: 2
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          All Movies
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="title">Name</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
              <MenuItem value="releaseDate">Release Date</MenuItem>
              <MenuItem value="duration">Duration</MenuItem>
            </Select>
          </FormControl>

          <ToggleButtonGroup
            value={view}
            exclusive
            size="small"
            onChange={(_, v) => v && setView(v)}
          >
            <ToggleButton value="grid">Grid</ToggleButton>
            <ToggleButton value="list">List</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* LOADING */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {/* ERROR */}
      {error && (
        <Typography align="center" color="error" sx={{ mt: 4 }}>
          {error}
        </Typography>
      )}

      {/* MOVIES */}
      <Grid container spacing={2}>
        {movies.map((movie) => (
          <Grid
            item
            key={movie._id}
            xs={12}
            sm={view === 'grid' ? 6 : 12}
            md={view === 'grid' ? 4 : 12}
            lg={view === 'grid' ? 3 : 12}
          >
            <MovieCard movie={movie} view={view} />
          </Grid>
        ))}
      </Grid>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Box>
  );
}
