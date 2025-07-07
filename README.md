# Personal Productivity Hub

A comprehensive productivity dashboard featuring drag-and-drop customization, reading tracking, daily journaling, and integrated productivity tools.

## 🚀 Features

### Core Productivity Tools
- **📚 Reading Tracker** - Add books, track progress, and manage reading status
- **📸 Daily Journal** - Upload and organize daily journal photos
- **✍️ Blog Section** - Create, edit, and manage blog posts with tags and publishing
- **📱 Screen Time Monitor** - View daily and weekly screen time statistics
- **🔗 Notion Integration** - Connect daily plans and tasks (ready for API integration)
- **🎯 Goals Dashboard** - Track personal and professional goals
- **📊 Quick Stats** - Visual overview of productivity metrics
- **🔐 Admin Authentication** - Secure admin-only editing with session management

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

## 🚀 Server Deployment

The application is ready for deployment on cloud platforms like Heroku, Railway, Vercel, or any VPS.

### Environment Variables

Create a `.env` file with the following variables:

```bash
# Required for production
NODE_ENV=production
PORT=3000

# Admin Authentication (CHANGE THESE!)
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
SESSION_SECRET=your_64_character_random_secret

# Optional API integrations
NOTION_TOKEN=your_notion_token_here
NOTION_DATABASE_ID=your_database_id_here
SCREEN_TIME_API_KEY=your_screen_time_api_key_here
```

### Deployment Platforms

#### Heroku
```bash
# Install Heroku CLI, then:
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set ADMIN_USERNAME=your_admin_username
heroku config:set ADMIN_PASSWORD=your_secure_password
heroku config:set SESSION_SECRET=your_64_character_random_secret
git push heroku main
```

#### Railway
```bash
# Install Railway CLI, then:
railway login
railway init
railway add
railway deploy
```

#### VPS/Cloud Server
```bash
# Install Node.js and npm on your server
npm install --production
npm start

# Use PM2 for process management
npm install -g pm2
pm2 start server.js --name productivity-hub
pm2 save
pm2 startup
```

### Security Considerations

1. **Change default credentials**: Never use default admin credentials in production
2. **Use HTTPS**: Configure SSL/TLS certificates for production
3. **Environment variables**: Store sensitive data in environment variables, not code
4. **Session security**: Use a strong, unique session secret (64+ characters)
5. **Database**: Consider using a proper database (PostgreSQL, MongoDB) for production

### Performance Optimization

1. **Static file serving**: Use a CDN for static assets in production
2. **Process management**: Use PM2 or similar for Node.js process management
3. **Load balancing**: Configure reverse proxy with Nginx for high traffic
4. **Database optimization**: Index frequently queried fields

## 🎮 Usage Guide

### Authentication System

The application uses a simple admin authentication system:

1. **Admin Access**: Only admin users can edit content, add blog posts, upload photos, and manage data
2. **Login**: Click "Login" in the header and enter admin credentials
3. **Default Credentials**: 
   - Username: `admin`
   - Password: `admin123`
   - **⚠️ IMPORTANT**: Change these in production via environment variables!

### Regular User Experience
- **View Mode**: Non-admin users can view all content but cannot edit
- **Full Access**: Blog posts, photos, books, and stats are visible to all users
- **No Registration**: Simple single-admin system for personal use

### Basic Navigation
- **Theme Toggle**: Click the sun/moon icon in the header
- **Edit Mode**: Click "Edit Layout" to enable drag-and-drop customization
- **Dashboard**: Access all productivity widgets from the main dashboard

### Adding Content
- **Books**: Click "Add Book" to track your reading progress
- **Journal Photos**: Use "Add Photo" to upload daily journal images
- **Blog Posts**: Admin users can create, edit, and delete blog posts
- **Screen Time**: Click refresh to update your usage statistics

### Blog Management (Admin Only)
- **Create Posts**: Click "New Post" to write blog entries
- **Rich Content**: Add titles, excerpts, content, and tags
- **Publishing**: Toggle between draft and published status
- **Organization**: Use tags to categorize posts
- **Management**: Edit or delete existing posts from the blog section

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
- `/api/auth/login` - Admin authentication
- `/api/auth/logout` - Session termination
- `/api/auth/me` - Current user status
- `/api/blog` - Blog post management (CRUD)

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