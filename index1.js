const express = require('express');
const { v4: uuidv4 } = require('uuid'); // To generate UUIDs
const { Pool } = require('pg'); // PostgreSQL client

const app = express();
const port = 5000;

// PostgreSQL database configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Vishu@123',
  port: 5432,
});

// Middleware to parse JSON
app.use(express.json());

// Save a new post
app.post('/posts', async (req, res) => {
  const { user, heading, data } = req.body;
  const createdAt = new Date();
  const postId = uuidv4();

  try {
    const query = 'INSERT INTO posts(id, created_at, user_id, heading, data) VALUES($1, $2, $3, $4, $5)';
    await pool.query(query, [postId, createdAt, user, heading, data]);
    res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
