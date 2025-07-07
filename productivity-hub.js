// Productivity Hub JavaScript
class ProductivityHub {
  constructor() {
    this.data = {
      books: [],
      screenTime: { daily: 0, weekly: 0 },
      journalPhotos: [],
      notionTasks: []
    };
    this.blogPosts = [];
    this.editMode = false;
    this.user = null;
    this.sessionId = localStorage.getItem('sessionId');
    this.init();
  }

  async init() {
    await this.checkAuth();
    await this.loadData();
    await this.loadBlogPosts();
    this.setupEventListeners();
    this.setupDragAndDrop();
    this.renderDashboard();
    this.renderBlogPosts();
    this.updateAuthUI();
  }

  async checkAuth() {
    if (this.sessionId) {
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${this.sessionId}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          this.user = data.user;
        } else {
          this.sessionId = null;
          localStorage.removeItem('sessionId');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        this.sessionId = null;
        localStorage.removeItem('sessionId');
      }
    }
  }

  async login(username, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        this.user = data.user;
        this.sessionId = data.sessionId;
        localStorage.setItem('sessionId', this.sessionId);
        this.updateAuthUI();
        return true;
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async logout() {
    try {
      if (this.sessionId) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.sessionId}`
          }
        });
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      this.user = null;
      this.sessionId = null;
      localStorage.removeItem('sessionId');
      this.updateAuthUI();
      this.editMode = false;
      this.toggleEditMode();
    }
  }

  updateAuthUI() {
    const loginBtn = document.getElementById('login-btn');
    const editBtn = document.getElementById('edit-mode-btn');
    const addBlogBtn = document.getElementById('add-blog-btn');
    
    if (this.user && this.user.isAdmin) {
      loginBtn.textContent = 'Logout';
      editBtn.style.display = 'inline-block';
      addBlogBtn.style.display = 'inline-block';
    } else {
      loginBtn.textContent = 'Login';
      editBtn.style.display = 'none';
      addBlogBtn.style.display = 'none';
    }
  }

  async loadBlogPosts() {
    try {
      const response = await fetch('/api/blog');
      if (response.ok) {
        this.blogPosts = await response.json();
      }
    } catch (error) {
      console.error('Failed to load blog posts:', error);
    }
  }

  async saveBlogPost(postData, isEdit = false, postId = null) {
    try {
      const url = isEdit ? `/api/blog/${postId}` : '/api/blog';
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.sessionId}`
        },
        body: JSON.stringify(postData)
      });
      
      if (response.ok) {
        await this.loadBlogPosts();
        this.renderBlogPosts();
        return true;
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error) {
      console.error('Failed to save blog post:', error);
      throw error;
    }
  }

  async deleteBlogPost(postId) {
    try {
      const response = await fetch(`/api/blog/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.sessionId}`
        }
      });
      
      if (response.ok) {
        await this.loadBlogPosts();
        this.renderBlogPosts();
        return true;
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error) {
      console.error('Failed to delete blog post:', error);
      throw error;
    }
  }

  async loadData() {
    try {
      const response = await fetch('/api/productivity-data');
      if (response.ok) {
        this.data = await response.json();
      }
    } catch (error) {
      console.error('Failed to load productivity data:', error);
    }
  }

  async saveData() {
    try {
      const response = await fetch('/api/productivity-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.sessionId}`
        },
        body: JSON.stringify(this.data)
      });
      if (response.ok) {
        console.log('Data saved successfully');
      }
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  }

  setupEventListeners() {
    // Edit mode toggle
    const editBtn = document.getElementById('edit-mode-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => this.toggleEditMode());
    }

    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Login/Logout button
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        if (this.user) {
          this.logout();
        } else {
          document.getElementById('login-modal').style.display = 'block';
        }
      });
    }

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Blog post form
    const blogForm = document.getElementById('blog-post-form');
    if (blogForm) {
      blogForm.addEventListener('submit', (e) => this.handleBlogPost(e));
    }

    // Add blog post button
    const addBlogBtn = document.getElementById('add-blog-btn');
    if (addBlogBtn) {
      addBlogBtn.addEventListener('click', () => {
        document.getElementById('blog-modal-title').textContent = 'New Blog Post';
        document.getElementById('blog-post-form').reset();
        document.getElementById('blog-post-form').dataset.editId = '';
        document.getElementById('blog-post-modal').style.display = 'block';
      });
    }

    // Journal photo upload
    const journalUpload = document.getElementById('journal-upload');
    if (journalUpload) {
      journalUpload.addEventListener('change', (e) => this.handleJournalUpload(e));
    }

    // Add book form
    const addBookForm = document.getElementById('add-book-form');
    if (addBookForm) {
      addBookForm.addEventListener('submit', (e) => this.handleAddBook(e));
    }

    // Screen time refresh
    const screenTimeRefresh = document.getElementById('screen-time-refresh');
    if (screenTimeRefresh) {
      screenTimeRefresh.addEventListener('click', () => this.refreshScreenTime());
    }
  }

  setupDragAndDrop() {
    const widgets = document.querySelectorAll('.widget');
    widgets.forEach(widget => {
      widget.draggable = true;
      widget.addEventListener('dragstart', this.handleDragStart.bind(this));
      widget.addEventListener('dragover', this.handleDragOver.bind(this));
      widget.addEventListener('drop', this.handleDrop.bind(this));
    });
  }

  handleDragStart(e) {
    if (!this.editMode) return;
    e.dataTransfer.setData('text/plain', e.target.id);
    e.target.classList.add('dragging');
  }

  handleDragOver(e) {
    if (!this.editMode) return;
    e.preventDefault();
  }

  handleDrop(e) {
    if (!this.editMode) return;
    e.preventDefault();
    
    const draggedId = e.dataTransfer.getData('text/plain');
    const draggedElement = document.getElementById(draggedId);
    const dropTarget = e.target.closest('.widget');
    
    if (dropTarget && draggedElement !== dropTarget) {
      const dashboard = document.getElementById('dashboard');
      const draggedIndex = Array.from(dashboard.children).indexOf(draggedElement);
      const dropIndex = Array.from(dashboard.children).indexOf(dropTarget);
      
      if (draggedIndex < dropIndex) {
        dropTarget.parentNode.insertBefore(draggedElement, dropTarget.nextSibling);
      } else {
        dropTarget.parentNode.insertBefore(draggedElement, dropTarget);
      }
    }
    
    draggedElement.classList.remove('dragging');
    this.saveWidgetOrder();
  }

  saveWidgetOrder() {
    const widgets = document.querySelectorAll('.widget');
    const order = Array.from(widgets).map(widget => widget.id);
    localStorage.setItem('widget-order', JSON.stringify(order));
  }

  loadWidgetOrder() {
    const order = JSON.parse(localStorage.getItem('widget-order') || '[]');
    if (order.length === 0) return;
    
    const dashboard = document.getElementById('dashboard');
    order.forEach(id => {
      const widget = document.getElementById(id);
      if (widget) {
        dashboard.appendChild(widget);
      }
    });
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    const body = document.body;
    const editBtn = document.getElementById('edit-mode-btn');
    
    if (this.editMode) {
      body.classList.add('edit-mode');
      editBtn.textContent = 'Save Layout';
      editBtn.classList.add('editing');
    } else {
      body.classList.remove('edit-mode');
      editBtn.textContent = 'Edit Layout';
      editBtn.classList.remove('editing');
    }
  }

  toggleTheme() {
    const body = document.body;
    const isDark = body.classList.contains('dark-theme');
    
    if (isDark) {
      body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    }
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
    }
  }

  async handleJournalUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('caption', ''); // Could add caption input later

    try {
      const response = await fetch('/api/upload-journal-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.sessionId}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        this.data.journalPhotos.unshift(result.photo);
        this.renderJournalPhotos();
      }
    } catch (error) {
      console.error('Failed to upload journal photo:', error);
    }
  }

  async handleAddBook(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const bookData = {
      title: formData.get('title'),
      author: formData.get('author'),
      progress: parseInt(formData.get('progress')) || 0,
      status: formData.get('status') || 'reading'
    };

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.sessionId}`
        },
        body: JSON.stringify(bookData)
      });

      if (response.ok) {
        const newBook = await response.json();
        this.data.books.push(newBook);
        this.renderBooks();
        e.target.reset();
      }
    } catch (error) {
      console.error('Failed to add book:', error);
    }
  }

  async refreshScreenTime() {
    try {
      const response = await fetch('/api/screen-time');
      if (response.ok) {
        const screenTimeData = await response.json();
        this.data.screenTime = screenTimeData;
        this.renderScreenTime();
      }
    } catch (error) {
      console.error('Failed to refresh screen time:', error);
    }
  }

  renderDashboard() {
    this.renderJournalPhotos();
    this.renderBooks();
    this.renderScreenTime();
    this.loadWidgetOrder();
  }

  renderJournalPhotos() {
    const container = document.getElementById('journal-photos');
    if (!container) return;

    const photosHtml = this.data.journalPhotos.slice(0, 6).map(photo => `
      <div class="journal-photo" data-filename="${photo.filename}">
        <img src="${photo.path}" alt="Journal photo" loading="lazy">
        <div class="photo-date">${new Date(photo.date).toLocaleDateString()}</div>
        ${this.editMode ? `<button class="delete-photo" onclick="hub.deleteJournalPhoto('${photo.filename}')">×</button>` : ''}
      </div>
    `).join('');

    container.innerHTML = photosHtml;
  }

  renderBooks() {
    const container = document.getElementById('books-list');
    if (!container) return;

    const booksHtml = this.data.books.map(book => `
      <div class="book-item">
        <div class="book-info">
          <h4>${book.title}</h4>
          <p class="book-author">by ${book.author}</p>
          <div class="book-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${book.progress}%"></div>
            </div>
            <span class="progress-text">${book.progress}%</span>
          </div>
        </div>
        <div class="book-status status-${book.status}">${book.status}</div>
      </div>
    `).join('');

    container.innerHTML = booksHtml;
  }

  renderScreenTime() {
    const dailyElement = document.getElementById('daily-screen-time');
    const weeklyElement = document.getElementById('weekly-screen-time');
    
    if (dailyElement) {
      dailyElement.textContent = `${this.data.screenTime.daily}h`;
    }
    
    if (weeklyElement) {
      weeklyElement.textContent = `${this.data.screenTime.weekly}h`;
    }
  }

  async deleteJournalPhoto(filename) {
    if (!confirm('Delete this journal photo?')) return;

    try {
      const response = await fetch(`/api/journal-photo/${filename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.sessionId}`
        }
      });

      if (response.ok) {
        this.data.journalPhotos = this.data.journalPhotos.filter(photo => photo.filename !== filename);
        this.renderJournalPhotos();
      }
    } catch (error) {
      console.error('Failed to delete journal photo:', error);
    }
  }

  async handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');

    try {
      await this.login(username, password);
      document.getElementById('login-modal').style.display = 'none';
      e.target.reset();
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  }

  async handleBlogPost(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const editId = e.target.dataset.editId;
    
    // Parse tags
    const tagsString = formData.get('tags') || '';
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    const postData = {
      title: formData.get('title'),
      content: formData.get('content'),
      excerpt: formData.get('excerpt'),
      tags: tags,
      published: formData.get('published') === 'on'
    };

    try {
      if (editId) {
        await this.saveBlogPost(postData, true, editId);
      } else {
        await this.saveBlogPost(postData);
      }
      document.getElementById('blog-post-modal').style.display = 'none';
      e.target.reset();
    } catch (error) {
      alert('Failed to save blog post: ' + error.message);
    }
  }

  renderBlogPosts() {
    const blogContainer = document.getElementById('blog-posts');
    if (!blogContainer) return;

    if (this.blogPosts.length === 0) {
      blogContainer.innerHTML = '<p class="no-posts">No blog posts yet. Come back later!</p>';
      return;
    }

    blogContainer.innerHTML = this.blogPosts.map(post => `
      <article class="blog-post">
        <div class="blog-post-header">
          <div>
            <h3 class="blog-post-title">${post.title}</h3>
            <div class="blog-post-meta">
              <span>By ${post.author}</span>
              <span>•</span>
              <span>${new Date(post.date).toLocaleDateString()}</span>
              <span>•</span>
              <div class="blog-post-status">
                <span class="status-indicator ${post.published ? '' : 'draft'}"></span>
                <span>${post.published ? 'Published' : 'Draft'}</span>
              </div>
            </div>
          </div>
          ${this.user && this.user.isAdmin ? `
            <div class="blog-post-actions">
              <button onclick="window.hub.editBlogPost('${post.id}')">Edit</button>
              <button class="danger" onclick="window.hub.deleteBlogPostConfirm('${post.id}')">Delete</button>
            </div>
          ` : ''}
        </div>
        
        ${post.excerpt ? `
          <div class="blog-post-excerpt">${post.excerpt}</div>
        ` : ''}
        
        <div class="blog-post-content">${post.content}</div>
        
        ${post.tags && post.tags.length > 0 ? `
          <div class="blog-post-tags">
            ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
          </div>
        ` : ''}
      </article>
    `).join('');
  }

  editBlogPost(postId) {
    const post = this.blogPosts.find(p => p.id === postId);
    if (!post) return;

    document.getElementById('blog-modal-title').textContent = 'Edit Blog Post';
    document.getElementById('blog-title').value = post.title;
    document.getElementById('blog-excerpt').value = post.excerpt || '';
    document.getElementById('blog-content').value = post.content;
    document.getElementById('blog-tags').value = post.tags ? post.tags.join(', ') : '';
    document.getElementById('blog-published').checked = post.published;
    document.getElementById('blog-post-form').dataset.editId = postId;
    document.getElementById('blog-post-modal').style.display = 'block';
  }

  async deleteBlogPostConfirm(postId) {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        await this.deleteBlogPost(postId);
      } catch (error) {
        alert('Failed to delete blog post: ' + error.message);
      }
    }
  }
}

// Initialize the productivity hub when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.hub = new ProductivityHub();
  window.hub.loadTheme();
});