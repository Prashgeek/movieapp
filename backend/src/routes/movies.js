// routes/movies.js
const router = require('express').Router();
const movieCtrl = require('../controllers/movieController');
const auth = require('../middleware/auth');
const permit = require('../middleware/roles');

/* ===================== PUBLIC ROUTES ===================== */

// Get all movies (pagination)
router.get('/', movieCtrl.getAll);

// Get sorted movies
// GET /api/movies/sorted?by=rating&order=desc&page=1&limit=12
router.get('/sorted', movieCtrl.getSorted);

// Search movies
// GET /api/movies/search?q=matrix
router.get('/search', movieCtrl.search);

// ✅ GET SINGLE MOVIE BY ID (VERY IMPORTANT)
router.get('/:id', movieCtrl.getById);

/* ===================== ADMIN ROUTES ===================== */

// Add movie (admin only)
router.post('/', auth, permit('admin'), movieCtrl.create);

// Update movie (admin only)
router.put('/:id', auth, permit('admin'), movieCtrl.update);

// Delete movie (admin only)
router.delete('/:id', auth, permit('admin'), movieCtrl.remove);

module.exports = router;
