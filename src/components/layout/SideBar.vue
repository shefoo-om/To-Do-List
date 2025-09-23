<script setup>
import { ref } from 'vue'
import SearchComponent from '../ui/SearchComponent.vue'

// Mock tasks data (replace with real data later)
const mockTasks = ref([
  {
    id: 1,
    name: 'Complete Vue.js project',
    status: 'doing',
    date: '2025-01-15',
    category: { name: 'Work', emoji: '💼' },
  },
  {
    id: 2,
    name: 'Buy groceries',
    status: 'todo',
    date: '2025-01-16',
    category: { name: 'Personal', emoji: '🏠' },
  },
  {
    id: 3,
    name: 'Exercise routine',
    status: 'done',
    date: '2025-01-15',
    category: { name: 'Health', emoji: '🏃' },
  },
  {
    id: 4,
    name: 'Read documentation',
    status: 'todo',
    date: '2025-10-17',
    category: { name: 'Learning', emoji: '📚' },
  },
])

// Handle task selection from search
function handleTaskSelected(task) {
  console.log('Selected task:', task)
}
</script>

<template>
  <aside class="sidebar bg-sidebar">
    <!-- App Title -->
    <h1 class="sidebar__title text-primary">📅 To-Do List</h1>

    <!-- Search Component -->
    <div class="sidebar__search-container">
      <SearchComponent :tasks="mockTasks" @task-selected="handleTaskSelected" />
    </div>

    <!-- Week List -->
    <div class="week-list">
      <h3 class="text-primary">📋 Weeks</h3>
      <div class="week-item bg-card text-primary">
        <span>Jan 15-21</span>
        <span class="task-count text-secondary">12 tasks</span>
      </div>
      <div class="week-item bg-card text-primary">
        <span>Jan 22-28</span>
        <span class="task-count text-secondary">8 tasks</span>
      </div>
      <div class="week-item bg-card text-primary">
        <span>Jan 29 - Feb 4</span>
        <span class="task-count text-secondary">5 tasks</span>
      </div>
    </div>

    <!-- Navigation Links -->
    <nav class="sidebar__nav">
      <RouterLink to="/" class="nav-link text-secondary"> 📅 Current Week </RouterLink>
      <a href="#" class="nav-link text-secondary">⚙️ Settings</a>
      <a href="#" class="nav-link text-secondary">📊 Statistics</a>
    </nav>

    <!-- Footer -->
    <footer class="sidebar__footer">
      <small class="text-secondary">© 2025 My To-Do App</small>
    </footer>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 300px;
  padding: 1.5rem;
  height: 100vh;
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar__title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.sidebar__search-container {
  position: relative;
}

.week-list {
  flex: 1;
  min-height: 0;
}

.week-list h3 {
  font-size: 1rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.week-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.2s;
}

.week-item:hover {
  background-color: var(--bg-hover);
  transform: translateX(4px);
}

.task-count {
  font-size: 0.85rem;
  font-weight: 500;
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  padding: 0px 14px;
  gap: 8px;
}

.nav-link {
  display: block;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-link:hover {
  background-color: var(--bg-card);
  color: var(--text-primary);
  transform: translateX(4px);
}

.sidebar__footer {
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
  text-align: center;
}
</style>
