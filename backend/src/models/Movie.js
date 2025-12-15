const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: { type: String },
  imdbId: { type: String, index: true },
  rating: { type: Number, default: null },
  releaseDate: { type: Date, default: null },
  duration: { type: Number, default: null }, // minutes
  poster: { type: String, default: null },
  genres: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
