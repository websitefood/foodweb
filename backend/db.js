const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'foodblog',
  password: 'postgres',
  port: 5432,
});

module.exports = pool;
