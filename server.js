const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Simple admin authentication (in production, use proper auth with bcrypt)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

// In-memory session store (in production, use Redis or database)
const sessions = new Map();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Session middleware
app.use((req, res, next) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  if (sessionId && sessions.has(sessionId)) {
    req.user = sessions.get(sessionId);
  }
  next();
});

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'journal-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Data storage files
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// API Routes

// Authentication routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const sessionId = crypto.randomBytes(32).toString('hex');
    const user = { username, isAdmin: true, sessionId };
    sessions.set(sessionId, user);
    
    res.json({ 
      success: true, 
      user: { username, isAdmin: true }, 
      sessionId 
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  if (sessionId && sessions.has(sessionId)) {
    sessions.delete(sessionId);
  }
  res.json({ success: true });
});

app.get('/api/auth/me', (req, res) => {
  if (req.user) {
    res.json({ user: { username: req.user.username, isAdmin: req.user.isAdmin } });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Blog routes
app.get('/api/blog', (req, res) => {
  try {
    const blogPath = path.join(dataDir, 'blog.json');
    if (fs.existsSync(blogPath)) {
      const blogs = JSON.parse(fs.readFileSync(blogPath, 'utf8'));
      // Sort by date descending
      blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
      res.json(blogs);
    } else {
      res.json([]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve blog posts' });
  }
});

app.post('/api/blog', requireAuth, (req, res) => {
  try {
    const blogPath = path.join(dataDir, 'blog.json');
    let blogs = [];
    
    if (fs.existsSync(blogPath)) {
      blogs = JSON.parse(fs.readFileSync(blogPath, 'utf8'));
    }
    
    const newPost = {
      id: Date.now().toString(),
      title: req.body.title,
      content: req.body.content,
      excerpt: req.body.excerpt || req.body.content.substring(0, 150) + '...',
      author: req.user.username,
      date: new Date().toISOString(),
      published: req.body.published || false,
      tags: req.body.tags || []
    };
    
    blogs.unshift(newPost);
    fs.writeFileSync(blogPath, JSON.stringify(blogs, null, 2));
    
    res.json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

app.put('/api/blog/:id', requireAuth, (req, res) => {
  try {
    const blogPath = path.join(dataDir, 'blog.json');
    if (!fs.existsSync(blogPath)) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    const blogs = JSON.parse(fs.readFileSync(blogPath, 'utf8'));
    const postIndex = blogs.findIndex(post => post.id === req.params.id);
    
    if (postIndex === -1) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    blogs[postIndex] = {
      ...blogs[postIndex],
      title: req.body.title || blogs[postIndex].title,
      content: req.body.content || blogs[postIndex].content,
      excerpt: req.body.excerpt || req.body.content?.substring(0, 150) + '...' || blogs[postIndex].excerpt,
      published: req.body.published !== undefined ? req.body.published : blogs[postIndex].published,
      tags: req.body.tags || blogs[postIndex].tags,
      lastModified: new Date().toISOString()
    };
    
    fs.writeFileSync(blogPath, JSON.stringify(blogs, null, 2));
    res.json(blogs[postIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

app.delete('/api/blog/:id', requireAuth, (req, res) => {
  try {
    const blogPath = path.join(dataDir, 'blog.json');
    if (!fs.existsSync(blogPath)) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    const blogs = JSON.parse(fs.readFileSync(blogPath, 'utf8'));
    const filteredBlogs = blogs.filter(post => post.id !== req.params.id);
    
    if (filteredBlogs.length === blogs.length) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    fs.writeFileSync(blogPath, JSON.stringify(filteredBlogs, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

app.get('/api/blog/:id', (req, res) => {
  try {
    const blogPath = path.join(dataDir, 'blog.json');
    if (!fs.existsSync(blogPath)) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    const blogs = JSON.parse(fs.readFileSync(blogPath, 'utf8'));
    const post = blogs.find(post => post.id === req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve blog post' });
  }
});

// Get productivity data
app.get('/api/productivity-data', (req, res) => {
  try {
    const dataPath = path.join(dataDir, 'productivity.json');
    if (fs.existsSync(dataPath)) {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      res.json(data);
    } else {
      // Return default data structure
      const defaultData = {
        books: [],
        screenTime: { daily: 0, weekly: 0 },
        journalPhotos: [],
        notionTasks: [],
        lastUpdated: new Date().toISOString()
      };
      res.json(defaultData);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve productivity data' });
  }
});

// Update productivity data
app.post('/api/productivity-data', requireAuth, (req, res) => {
  try {
    const dataPath = path.join(dataDir, 'productivity.json');
    const data = { ...req.body, lastUpdated: new Date().toISOString() };
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update productivity data' });
  }
});

// Upload journal photo
app.post('/api/upload-journal-photo', requireAuth, upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }

    const photoData = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: `/uploads/${req.file.filename}`,
      date: new Date().toISOString(),
      caption: req.body.caption || ''
    };

    // Update productivity data with new photo
    const dataPath = path.join(dataDir, 'productivity.json');
    let data = {};
    
    if (fs.existsSync(dataPath)) {
      data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }
    
    if (!data.journalPhotos) {
      data.journalPhotos = [];
    }
    
    data.journalPhotos.unshift(photoData); // Add to beginning
    data.lastUpdated = new Date().toISOString();
    
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    
    res.json({ success: true, photo: photoData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload journal photo' });
  }
});

// Delete journal photo
app.delete('/api/journal-photo/:filename', requireAuth, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);
    
    // Delete file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Update productivity data
    const dataPath = path.join(dataDir, 'productivity.json');
    if (fs.existsSync(dataPath)) {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      if (data.journalPhotos) {
        data.journalPhotos = data.journalPhotos.filter(photo => photo.filename !== filename);
        data.lastUpdated = new Date().toISOString();
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete journal photo' });
  }
});

// Books API
app.get('/api/books', (req, res) => {
  try {
    const dataPath = path.join(dataDir, 'productivity.json');
    if (fs.existsSync(dataPath)) {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      res.json(data.books || []);
    } else {
      res.json([]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve books' });
  }
});

app.post('/api/books', requireAuth, (req, res) => {
  try {
    const dataPath = path.join(dataDir, 'productivity.json');
    let data = {};
    
    if (fs.existsSync(dataPath)) {
      data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }
    
    if (!data.books) {
      data.books = [];
    }
    
    const newBook = {
      id: Date.now().toString(),
      title: req.body.title,
      author: req.body.author,
      progress: req.body.progress || 0,
      status: req.body.status || 'reading',
      startDate: req.body.startDate || new Date().toISOString(),
      notes: req.body.notes || ''
    };
    
    data.books.push(newBook);
    data.lastUpdated = new Date().toISOString();
    
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    res.json(newBook);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add book' });
  }
});

// Screen time API (mock data for now)
app.get('/api/screen-time', (req, res) => {
  try {
    // Mock screen time data - in real app, this would come from device APIs
    const screenTimeData = {
      daily: Math.floor(Math.random() * 8) + 2, // 2-10 hours
      weekly: Math.floor(Math.random() * 50) + 20, // 20-70 hours
      apps: [
        { name: 'Social Media', time: Math.floor(Math.random() * 3) + 1 },
        { name: 'Productivity', time: Math.floor(Math.random() * 2) + 1 },
        { name: 'Entertainment', time: Math.floor(Math.random() * 2) + 1 }
      ],
      lastUpdated: new Date().toISOString()
    };
    
    res.json(screenTimeData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve screen time data' });
  }
});

// Serve uploads directory
app.use('/uploads', express.static(uploadsDir));

// Catch-all handler for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large' });
    }
  }
  res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`Productivity Hub server running on port ${PORT}`);
});