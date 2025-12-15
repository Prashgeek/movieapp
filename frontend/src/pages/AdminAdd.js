import React, { useState } from 'react';
import API from '../api/api';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AdminAdd() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    rating: '',
    duration: '',
    releaseDate: '',
    poster: ''
  });

  const [saving, setSaving] = useState(false);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // 🛑 simple required validation
    if (
      !form.title ||
      !form.description ||
      !form.rating ||
      !form.releaseDate ||
      !form.poster
    ) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        rating: Number(form.rating),
        duration: form.duration ? Number(form.duration) : undefined
      };

      await API.post('/movies', payload);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add movie');
    } finally {
      setSaving(false);
    }
  }

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
          Add New Movie
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Enter all required details to add a movie
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
        >
          <TextField
            label="Title *"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Description *"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            multiline
            rows={4}
            required
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
              label="Rating (0–10) *"
              type="number"
              inputProps={{ step: '0.1', min: 0, max: 10 }}
              value={form.rating}
              onChange={(e) => handleChange('rating', e.target.value)}
              required
            />

            <TextField
              label="Duration (minutes)"
              type="number"
              value={form.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
            />
          </Box>

          <TextField
            label="Release Date *"
            type="date"
            value={form.releaseDate}
            onChange={(e) => handleChange('releaseDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />

          <TextField
            label="Poster URL *"
            value={form.poster}
            onChange={(e) => handleChange('poster', e.target.value)}
            required
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
              {saving ? 'Adding…' : 'Add Movie'}
            </Button>

            <Button variant="outlined" onClick={() => navigate('/')}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
}
