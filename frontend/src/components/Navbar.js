import React, { useContext, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/');
    setOpen(false);
  }

  const drawerLinks = (
    <Box sx={{ width: 260, p: 2 }}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        🎬 MovieApp
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <List>
        <ListItem button component={Link} to="/" onClick={() => setOpen(false)}>
          <ListItemText primary="Home" />
        </ListItem>

        <ListItem
          button
          component={Link}
          to="/search"
          onClick={() => setOpen(false)}
        >
          <ListItemText primary="Search Movies" />
        </ListItem>

        {admin && (
          <ListItem
            button
            component={Link}
            to="/admin/add"
            onClick={() => setOpen(false)}
          >
            <ListItemText primary="Admin Panel" />
          </ListItem>
        )}
      </List>

      <Divider sx={{ my: 2 }} />

      {admin ? (
        <Button
          fullWidth
          variant="contained"
          color="error"
          onClick={handleLogout}
        >
          Logout
        </Button>
      ) : (
        <Button
          fullWidth
          variant="contained"
          component={Link}
          to="/admin/login"
          onClick={() => setOpen(false)}
        >
          Admin Login
        </Button>
      )}
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(15,15,15,0.9)'
        }}
      >
        <Toolbar>
          {/* MOBILE MENU */}
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setOpen(true)}
            sx={{ display: { xs: 'inline-flex', md: 'none' }, mr: 1 }}
          >
            <MenuIcon />
          </IconButton>

          {/* LOGO */}
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: 700,
              flexGrow: 1
            }}
          >
            MovieApp
          </Typography>

          {/* DESKTOP LINKS */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center'
            }}
          >
            <Button
              component={Link}
              to="/search"
              sx={{
                color: 'inherit',
                transition: 'all 0.2s',
                '&:hover': {
                  color: 'primary.main',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Search
            </Button>

            {admin ? (
              <>
                <Button
                  component={Link}
                  to="/admin/add"
                  sx={{
                    color: 'inherit',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  Admin
                </Button>

                <Button
                  color="error"
                  onClick={handleLogout}
                  sx={{ ml: 1 }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                component={Link}
                to="/admin/login"
              >
                Admin Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
      >
        {drawerLinks}
      </Drawer>
    </>
  );
}
