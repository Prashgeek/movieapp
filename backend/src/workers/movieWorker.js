// workers/movieWorker.js (run separately: node src/workers/movieWorker.js)
require('dotenv').config();
const connectDB = require('../config/db');
const { Worker } = require('bullmq');
const Movie = require('../models/Movie');

async function start() {
  await connectDB(process.env.MONGO_URI);
  const connection = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    tls: process.env.REDIS_TLS === 'true' ? { rejectUnauthorized: false } : undefined
  };
  const worker = new Worker('movie-insert', async job => {
    await Movie.create(job.data);
  }, { connection });

  worker.on('completed', job => console.log('Inserted', job.id));
  worker.on('failed', (job, err) => console.error('Job failed', job.id, err));
}
start().catch(console.error);
