const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3001;

app.use(bodyParser.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Vishu@123',
  port: 5432,
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

app.get("/", async (req, res)=>{
  res.json({id:"jkfgkmujh", data:",jhgfl"})
})

//TODO => inform user if userName already exists
//TODO => username muist be atleast 5 characters or longer
//TODO => heading, data field cannot be null

// Create a new post
app.post('/posts', async (req, res) => {
    const { user, heading, data } = req.body;
    if (user.length < 5) {
      return res.status(400).json({ error: 'Username must be at least 5 characters long' });
    }
  
    if (!heading || !data) {
      return res.status(400).json({ error: 'Heading and data fields cannot be null or empty' });
    }
    console.log(req.body)
    const createdAt = new Date();
    const postId = uuidv4();
  
    try {
      let queryResponse = await pool.query(
        'INSERT INTO posts2 (id, created_at, user_name, heading, data) VALUES ($1, $2, $3, $4, $5)',
        [postId, createdAt, user, heading, data],
      );
      console.log("queryRespose ==> ", queryResponse);
      res.status(201).json({ message: 'Post created successfully', data:{postId, createdAt, user, heading, data} });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'userName already exists' });
    }
  });
  
  // Update a post
  app.post('/posts/:postId', async (req, res) => {
    const { heading, data } = req.body;
    const { postId } = req.params;
  
    try {
      await pool.query(
        'UPDATE posts1 SET heading = $1, data = $2 WHERE id = $3',
        [heading, data, postId]
      );
      res.json({ message: 'Post updated successfully' });
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  // Get all posts
  app.get('/posts', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM posts1');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  // Get posts for a specific user
  app.get('/posts/:user', async (req, res) => {
    const { user } = req.params;
  
    try {
      const result = await pool.query(
        'SELECT * FROM posts1 WHERE user_name = $1',
        [user]
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  

 