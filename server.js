const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

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
app.post('/api/productivity-data', (req, res) => {
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
app.post('/api/upload-journal-photo', upload.single('photo'), (req, res) => {
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
app.delete('/api/journal-photo/:filename', (req, res) => {
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

app.post('/api/books', (req, res) => {
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