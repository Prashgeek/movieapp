import React, { useState } from 'react';
import API from '../api/api';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  CircularProgress,
  Autocomplete,
  Avatar,
  Paper
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MovieCard from '../components/MovieCard';

export default function SearchPage() {
  const [q, setQ] = useState('');
  const [movies, setMovies] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const navigate = useNavigate();

  // Button-based search
  async function handleSearch(e) {
    e.preventDefault();
    if (!q.trim()) return;

    try {
      setLoading(true);
      setError('');
      setSearched(true);

      const res = await API.get('/movies/search', { params: { q } });
      const payload = res.data;

      const resultArray = Array.isArray(payload)
        ? payload
        : Array.isArray(payload.movies)
        ? payload.movies
        : [];

      setMovies(resultArray);
    } catch (err) {
      console.error(err);
      setError('Failed to search movies');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  //  Live suggestions
  async function handleSuggestion(_, value) {
    setQ(value || '');

    if (!value || value.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await API.get('/movies/search', { params: { q: value } });
      const payload = res.data;

      const arr = Array.isArray(payload)
        ? payload
        : Array.isArray(payload.movies)
        ? payload.movies
        : [];

      setSuggestions(arr.slice(0, 8));
    } catch {
      setSuggestions([]);
    }
  }

  return (
    <Box>
      {/* HERO SEARCH SECTION */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 5,
          borderRadius: 4,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #1c1c1c, #111)'
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Search Movies
        </Typography>
        <Typography color="text.secondary" mt={1} mb={4}>
          Find movies by title, description, or rating
        </Typography>

        {/* SEARCH BAR */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            maxWidth: 800,
            mx: 'auto'
          }}
        >
          <Autocomplete
            freeSolo
            options={suggestions}
            onInputChange={handleSuggestion}
            getOptionLabel={(option) =>
              typeof option === 'string' ? option : option.title || ''
            }
            onChange={(_, value) => {
              if (value?._id) navigate(`/movie/${value._id}`);
            }}
            noOptionsText="No matching movies"
            sx={{ flex: 1 }}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'flex-start',
                  py: 1
                }}
              >
                <Avatar
                  variant="rounded"
                  src={option.poster || 'https://via.placeholder.com/60x90'}
                  alt={option.title}
                  sx={{ width: 56, height: 80 }}
                />

                <Box sx={{ overflow: 'hidden' }}>
                  <Typography fontWeight={600} noWrap>
                    {option.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {option.description || 'No description available'}
                  </Typography>

                  <Typography variant="caption">
                    <StarIcon fontSize="inherit" /> {option.rating ?? '—'}
                  </Typography>
                </Box>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search movies by name or description"
                size="large"
                fullWidth
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ px: 4 }}
          >
            Search
          </Button>
        </Box>
      </Paper>

      {/* LOADING */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {/* ERROR */}
      {error && (
        <Typography color="error" align="center" sx={{ mt: 4 }}>
          {error}
        </Typography>
      )}

      {/* NO RESULTS */}
      {!loading && searched && movies.length === 0 && (
        <Typography align="center" sx={{ mt: 4 }}>
          No movies found.
        </Typography>
      )}

      {/* RESULTS */}
      <Grid container spacing={3}>
        {movies.map((movie, index) => (
          <Grid item key={movie._id} xs={12} sm={6} md={4} lg={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <MovieCard movie={movie} view="grid" />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
