import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { motion } from 'framer-motion';

export default function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchMovie() {
      try {
        setLoading(true);
        setError('');

        // ✅ Correct REST call
        const res = await API.get(`/movies/${id}`);
        setMovie(res.data);
      } catch (err) {
        console.error('MovieDetails error:', err);
        setError(
          err.response?.data?.message || 'Movie not found'
        );
        setMovie(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [id]);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (error || !movie) {
    return (
      <Typography align="center" color="error" sx={{ mt: 8 }}>
        {error || 'Movie not found'}
      </Typography>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          background: 'linear-gradient(135deg, #1c1c1c, #111)',
          color: '#fff'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            flexDirection: { xs: 'column', md: 'row' }
          }}
        >
          {/* POSTER */}
          <Box
            sx={{
              minWidth: { md: 260 },
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <img
              src={movie.poster || 'https://via.placeholder.com/300x450'}
              alt={movie.title}
              style={{
                width: '100%',
                maxWidth: 260,
                borderRadius: 12,
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            />
          </Box>

          {/* DETAILS */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight={700}>
              {movie.title}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
                mt: 1,
                flexWrap: 'wrap'
              }}
            >
              <Chip
                icon={<StarIcon />}
                label={movie.rating ?? '—'}
                color="primary"
                size="small"
              />

              {movie.releaseDate && (
                <Chip
                  label={new Date(movie.releaseDate).getFullYear()}
                  size="small"
                />
              )}

              {movie.duration && (
                <Chip
                  label={`${movie.duration} min`}
                  size="small"
                />
              )}
            </Box>

            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.85)'
              }}
            >
              {movie.description || 'No description available.'}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
}
