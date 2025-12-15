import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import MovieDetails from './pages/MovieDetails';
import AdminAdd from './pages/AdminAdd';
import AdminEdit from './pages/AdminEdit';
import AdminLogin from './pages/AdminLogin';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Container from '@mui/material/Container';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 3, mb: 6 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin protected routes */}
          <Route
            path="/admin/add"
            element={
              <ProtectedRoute adminOnly>
                <AdminAdd />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit/:id"
            element={
              <ProtectedRoute adminOnly>
                <AdminEdit />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}
