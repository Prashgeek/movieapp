import React, { useContext } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Divider
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import { AuthContext } from '../contexts/AuthContext';
import API from '../api/api';

export default function MovieCard({ movie, view = 'grid' }) {
  const { admin } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleDelete() {
    if (!window.confirm('Delete this movie?')) return;
    try {
      await API.delete(`/movies/${movie._id}`);
      window.location.reload();
    } catch {
      alert('Delete failed');
    }
  }

  /* ===================== GRID VIEW ===================== */
  if (view === 'grid') {
    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.25s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6
          }
        }}
      >
        {/* Poster */}
        <Box
          sx={{
            height: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default'
          }}
        >
          <CardMedia
            component="img"
            image={
              movie.poster ||
              'https://via.placeholder.com/300x450?text=No+Image'
            }
            alt={movie.title}
            sx={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain'
            }}
          />
        </Box>

        {/* Content */}
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" noWrap fontWeight={600}>
            {movie.title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: 'text.secondary',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {movie.description || 'No description available.'}
          </Typography>

          <Box
            sx={{
              mt: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <StarIcon fontSize="small" />
            <Typography variant="body2">
              {movie.rating ?? '—'}
            </Typography>
          </Box>
        </CardContent>

        {/* Actions */}
        <CardActions
          sx={{
            px: 2,
            pb: 2,
            justifyContent: admin ? 'space-between' : 'flex-end'
          }}
        >
          <Button
            size="small"
            component={Link}
            to={`/movie/${movie._id}`}
          >
            View
          </Button>

          {admin && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                onClick={() =>
                  navigate(`/admin/edit/${movie._id}`)
                }
              >
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Box>
          )}
        </CardActions>
      </Card>
    );
  }

  /* ===================== LIST VIEW ===================== */
  return (
    <Card
      sx={{
        display: 'flex',
        p: 2,
        gap: 2,
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 4
        }
      }}
    >
      {/* Poster */}
      <CardMedia
        component="img"
        image={
          movie.poster ||
          'https://via.placeholder.com/300x450?text=No+Image'
        }
        alt={movie.title}
        sx={{
          width: 140,
          height: 210,
          objectFit: 'cover',
          borderRadius: 1,
          flexShrink: 0
        }}
      />

      {/* Details */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {movie.title}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mt: 0.5
          }}
        >
          <StarIcon fontSize="small" />
          <Typography variant="body2">
            {movie.rating ?? '—'}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            mt: 1,
            color: 'text.secondary',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {movie.description || 'No description available.'}
        </Typography>

        <Divider sx={{ my: 1.5 }} />

        {/* Actions */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            mt: 'auto'
          }}
        >
          <Button
            size="small"
            component={Link}
            to={`/movie/${movie._id}`}
          >
            View
          </Button>

          {admin && (
            <>
              <Button
                size="small"
                onClick={() =>
                  navigate(`/admin/edit/${movie._id}`)
                }
              >
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Card>
  );
}
