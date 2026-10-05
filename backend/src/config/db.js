const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: process.env.DB_PASSWORD,
  database: 'trilha_digital',
});

module.exports = pool;