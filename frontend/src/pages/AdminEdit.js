import React, { useEffect, useState } from 'react';
import API from '../api/api';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Divider
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AdminEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchMovie() {
      try {
        setLoading(true);
        setError('');

        // backend does not have GET /movies/:id
        const res = await API.get('/movies', {
          params: { page: 1, limit: 2000 }
        });

        const payload = res.data;
        const movies = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.movies)
          ? payload.movies
          : [];

        const foundMovie = movies.find(m => m._id === id);

        if (!foundMovie) {
          setError('Movie not found');
          setForm(null);
        } else {
          setForm(foundMovie);
        }
      } catch (err) {
        console.error('Failed to load movie', err);
        setError('Failed to load movie');
        setForm(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSaving(true);
      await API.put(`/movies/${id}`, {
        ...form,
        rating: form.rating !== '' ? Number(form.rating) : null,
        duration: form.duration !== '' ? Number(form.duration) : null
      });
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    try {
      await API.delete(`/movies/${id}`);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  }

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (error || !form) {
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
          maxWidth: 760,
          mx: 'auto',
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          background: 'linear-gradient(135deg, #1c1c1c, #111)'
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Edit Movie
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Update movie details or remove it from the catalog
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5
          }}
        >
          <TextField
            label="Title"
            value={form.title || ''}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            required
            fullWidth
          />

          <TextField
            label="Description"
            value={form.description || ''}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            multiline
            rows={4}
            fullWidth
          />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2
            }}
          >
            <TextField
              label="Rating"
              type="number"
              inputProps={{ step: '0.1', min: 0, max: 10 }}
              value={form.rating ?? ''}
              onChange={(e) =>
                setForm({ ...form, rating: e.target.value })
              }
            />

            <TextField
              label="Duration (minutes)"
              type="number"
              value={form.duration ?? ''}
              onChange={(e) =>
                setForm({ ...form, duration: e.target.value })
              }
            />
          </Box>

          <TextField
            label="Release Date"
            type="date"
            value={
              form.releaseDate
                ? new Date(form.releaseDate)
                    .toISOString()
                    .split('T')[0]
                : ''
            }
            onChange={(e) =>
              setForm({ ...form, releaseDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Poster URL"
            value={form.poster || ''}
            onChange={(e) =>
              setForm({ ...form, poster: e.target.value })
            }
            fullWidth
          />

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'space-between',
              mt: 2,
              flexWrap: 'wrap'
            }}
          >
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={handleDelete}
            >
              Delete Movie
            </Button>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
}
