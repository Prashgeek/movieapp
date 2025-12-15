// utils/queue.js  (optional)
const { Queue } = require('bullmq');

const connection = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS === 'true' ? { rejectUnauthorized: false } : undefined
};

const movieQueue = new Queue('movie-insert', { connection });

module.exports = { movieQueue };
