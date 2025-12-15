// controllers/movieController.js
const Movie = require('../models/Movie');

/* ===================== GET ALL (PAGINATED) ===================== */
exports.getAll = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.min(50, parseInt(req.query.limit || '12'));
    const skip = (page - 1) * limit;

    const total = await Movie.countDocuments();
    const movies = await Movie.find()
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      total,
      movies
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* ===================== GET SORTED (PAGINATED) ===================== */
exports.getSorted = async (req, res) => {
  try {
    const {
      by = 'title',
      order = 'asc',
      page = 1,
      limit = 12
    } = req.query;

    const allowed = ['title', 'rating', 'releaseDate', 'duration'];
    const sortBy = allowed.includes(by) ? by : 'title';
    const sortOrder = order === 'desc' ? -1 : 1;

    const safePage = Math.max(1, parseInt(page));
    const safeLimit = Math.min(50, parseInt(limit));
    const skip = (safePage - 1) * safeLimit;

    const total = await Movie.countDocuments();

    const movies = await Movie.find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(safeLimit)
      .lean();

    res.json({
      page: safePage,
      totalPages: Math.ceil(total / safeLimit),
      total,
      movies
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* ===================== SEARCH ===================== */
exports.search = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json([]);

    const regex = new RegExp(
      q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'i'
    );

    const movies = await Movie.find({
      $or: [
        { title: { $regex: regex } },
        { description: { $regex: regex } }
      ]
    })
      .limit(200)
      .lean();

    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* ===================== GET BY ID (FIXES VIEW PAGE) ===================== */
exports.getById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).lean();
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (err) {
    res.status(400).json({ message: 'Invalid movie ID' });
  }
};

/* ===================== CREATE ===================== */
exports.create = async (req, res) => {
  try {
    const movie = await Movie.create({
      ...req.body,
      createdBy: req.user?._id
    });
    res.status(201).json(movie);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

/* ===================== UPDATE ===================== */
exports.update = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!movie) return res.status(404).json({ message: 'Not found' });
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

/* ===================== DELETE ===================== */
exports.remove = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
