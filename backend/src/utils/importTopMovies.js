require('dotenv').config();
const axios = require('axios');
const connectDB = require('../config/db');
const Movie = require('../models/Movie');

const TMDB_KEY = process.env.TMDB_API_KEY;
const TMDB_URL = 'https://api.themoviedb.org/3/movie/top_rated';

// how many pages to import (1 page ≈ 20 movies)
// 5 pages ≈ 100 movies
// 10 pages ≈ 200 movies (close to IMDb Top 250)
const TOTAL_PAGES = 10;

async function importTopMovies() {
  if (!TMDB_KEY) {
    console.error('❌ TMDB_API_KEY not found in .env');
    process.exit(1);
  }

  try {
    await connectDB(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
    console.log('🎬 Importing IMDb Top-250 style movies from TMDb...\n');

    let insertedCount = 0;

    for (let page = 1; page <= TOTAL_PAGES; page++) {
      const { data } = await axios.get(TMDB_URL, {
        params: {
          api_key: TMDB_KEY,
          language: 'en-US',
          page
        }
      });

      for (const m of data.results) {
        await Movie.updateOne(
          { imdbId: m.id },
          {
            imdbId: m.id,
            title: m.title,
            description: m.overview,
            rating: m.vote_average,
            releaseDate: m.release_date || null,
            poster: m.poster_path
              ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
              : null,
            duration: null, // can be enriched later
            source: 'TMDb'
          },
          { upsert: true }
        );

        insertedCount++;
      }

      console.log(`📄 Page ${page} imported (${data.results.length} movies)`);
    }

    console.log('\n✅ Import complete');
    console.log(`🎥 Total movies imported/updated: ${insertedCount}`);
    console.log('📌 Data source: TMDb (IMDb Top-250 equivalent)');

    process.exit(0);
  } catch (err) {
    console.error('❌ Import failed:', err.message);
    process.exit(1);
  }
}

importTopMovies();
