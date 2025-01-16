const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect('', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('Error connecting to MongoDB', err));

// Define Author Schema
const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  publishedDate: {
    type: Date,
    default: Date.now
  }
});

const Author = mongoose.model('Author', authorSchema);

// Define Blog Schema
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  blogContent: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    required: true
  }
});

const Blog = mongoose.model('Blog', blogSchema);

// Middleware
app.use(bodyParser.json());

// Routes
app.post('/author', async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if email already exists
    const existingAuthor = await Author.findOne({ email });
    if (existingAuthor) {
      return res.status(400).send({ message: 'Email already exists' });
    }

    const author = new Author({ name, email });
    await author.save();
    res.status(201).send(author);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post('/blog', async (req, res) => {
  try {
    const { title, blogContent, authorName } = req.body;

    // Check if author exists
    const existingAuthor = await Author.findOne({ name: authorName });
    if (!existingAuthor) {
      return res.status(400).send({ message: 'Author not found' });
    }

    const blog = new Blog({ title, blogContent, authorName });
    await blog.save();
    res.status(201).send(blog);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/blog', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).send(blogs);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
