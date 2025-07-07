# Personal Productivity Hub

A comprehensive productivity dashboard featuring drag-and-drop customization, reading tracking, daily journaling, and integrated productivity tools.

## 🚀 Features

### Core Productivity Tools
- **📚 Reading Tracker** - Add books, track progress, and manage reading status
- **📸 Daily Journal** - Upload and organize daily journal photos
- **📱 Screen Time Monitor** - View daily and weekly screen time statistics
- **🔗 Notion Integration** - Connect daily plans and tasks (ready for API integration)
- **🎯 Goals Dashboard** - Track personal and professional goals
- **📊 Quick Stats** - Visual overview of productivity metrics

### Interactive Experience
- **🎨 Drag & Drop Layout** - Customize widget positions in edit mode
- **🌙 Dark/Light Theme** - Toggle between themes with persistent preferences
- **📱 Responsive Design** - Optimized for desktop, tablet, and mobile
- **💾 Data Persistence** - Local storage for layout and preferences

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/theabhishekdahal/rameshrcp.github.io.git
   cd rameshrcp.github.io
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## 🎮 Usage Guide

### Basic Navigation
- **Theme Toggle**: Click the sun/moon icon in the header
- **Edit Mode**: Click "Edit Layout" to enable drag-and-drop customization
- **Dashboard**: Access all productivity widgets from the main dashboard

### Adding Content
- **Books**: Click "Add Book" to track your reading progress
- **Journal Photos**: Use "Add Photo" to upload daily journal images
- **Screen Time**: Click refresh to update your usage statistics

### Customization
- **Layout**: Enable edit mode and drag widgets to rearrange
- **Theme**: Toggle between light and dark themes
- **Data**: All preferences are saved automatically

## 🏗️ Technical Architecture

### Frontend
- **HTML5** with semantic structure
- **CSS3** with CSS variables for theming
- **Vanilla JavaScript** for interactivity
- **Responsive Grid System** for layout

### Backend
- **Node.js** with Express.js server
- **Multer** for file upload handling
- **CORS** enabled for API access
- **JSON-based** data persistence

### APIs
- `/api/productivity-data` - Main data management
- `/api/books` - Reading tracker management
- `/api/screen-time` - Usage statistics
- `/api/upload-journal-photo` - Photo uploads

## 📁 Project Structure

```
├── index.html              # Main HTML structure
├── styles.css              # All styling and themes
├── productivity-hub.js     # Frontend JavaScript logic
├── server.js               # Express server and API routes
├── package.json            # Dependencies and scripts
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🔮 Future Enhancements

- **Real Notion API Integration** - Live sync with Notion databases
- **Device Screen Time APIs** - Actual screen time data from devices
- **Advanced Analytics** - Detailed productivity insights
- **Data Export** - Backup and sharing capabilities
- **Multi-user Support** - User accounts and authentication

## 🎯 Development Goals

This project transforms a basic personal website into a unique productivity hub that helps track habits, manage goals, and visualize progress through:

- **Habit Tracking** via daily journal photos
- **Reading Progress** with book management
- **Screen Time Awareness** through usage monitoring
- **Goal Visualization** with progress indicators
- **Productivity Integration** via Notion connectivity

## 📝 License

MIT License - feel free to use this as a template for your own productivity hub!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.