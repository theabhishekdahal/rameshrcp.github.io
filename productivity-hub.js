// Productivity Hub JavaScript
class ProductivityHub {
  constructor() {
    this.data = {
      books: [],
      screenTime: { daily: 0, weekly: 0 },
      journalPhotos: [],
      notionTasks: []
    };
    this.editMode = false;
    this.init();
  }

  async init() {
    await this.loadData();
    this.setupEventListeners();
    this.setupDragAndDrop();
    this.renderDashboard();
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
        method: 'DELETE'
      });

      if (response.ok) {
        this.data.journalPhotos = this.data.journalPhotos.filter(photo => photo.filename !== filename);
        this.renderJournalPhotos();
      }
    } catch (error) {
      console.error('Failed to delete journal photo:', error);
    }
  }
}

// Initialize the productivity hub when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.hub = new ProductivityHub();
  window.hub.loadTheme();
});