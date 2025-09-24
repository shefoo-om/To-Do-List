<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import SearchComponent from '../ui/SearchComponent.vue'

const mockTasks = reactive([
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

const showSideBar = ref(true)
const isMobile = ref(false)

function checkScreenSize() {
  if (window.innerWidth < 767) {
    isMobile.value = true
    showSideBar.value = false
  } else {
    isMobile.value = false
    showSideBar.value = true
  }
}

function toggleSidebar() {
  showSideBar.value = !showSideBar.value
}

function handleClickOutside(event) {
  if (isMobile.value && showSideBar.value) {
    const sidebar = document.querySelector('.sidebar')
    const toggleButton = document.querySelector('.sidebar-toggle')

    if (
      sidebar &&
      !sidebar.contains(event.target) &&
      toggleButton &&
      !toggleButton.contains(event.target)
    ) {
      showSideBar.value = false
    }
  }
}
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
  document.removeEventListener('click', handleClickOutside)
})

function handleTaskSelected(task) {
  console.log('Selected task:', task)
}
</script>

<template>
  <button
    class="sidebar-toggle text-secondary"
    :class="{ 'sidebar-toggle--mobile': isMobile }"
    @click="toggleSidebar"
  >
    {{ showSideBar ? '✕' : '☰' }}
  </button>

  <aside
    class="sidebar bg-sidebar"
    :class="{
      'sidebar--hidden': !showSideBar,
      'sidebar--mobile': isMobile,
    }"
  >
    <h1 class="sidebar__title text-primary">To-Do List</h1>

    <div class="sidebar__search-container">
      <SearchComponent :tasks="mockTasks" @task-selected="handleTaskSelected" />
    </div>

    <!-- <div class="week-list">
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

    <nav class="sidebar__nav">
      <RouterLink to="/" class="nav-link text-secondary"> 📅 Current Week </RouterLink>
      <a href="#" class="nav-link text-secondary">⚙️ Settings</a>
      <a href="#" class="nav-link text-secondary">📊 Statistics</a>
    </nav> -->

    <footer class="sidebar__footer">
      <small class="text-secondary">© 2025 My To-Do App</small>
    </footer>
  </aside>

  <div v-if="isMobile && showSideBar" class="sidebar-overlay" @click="showSideBar = false"></div>
</template>

<style scoped>
.sidebar {
  width: 300px;
  padding: 24px;
  height: 100vh;
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 24px;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
  position: relative;
  z-index: 100;
}

@media (max-width: 768px) {
  .sidebar {
    width: 265px;
    padding: 40px 16px 6px;
    height: 100vh; /* could make it max height*/
    gap: 12px;
  }
}

.sidebar--hidden {
  transform: translateX(-100%);
  opacity: 0;
  pointer-events: none;
}

.sidebar--mobile {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.sidebar-toggle {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1001;
  background: var(--bg-card);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.sidebar-toggle:hover {
  background: var(--bg-hover);
  color: var(--primary-hover);
}

.sidebar-toggle--mobile {
  position: fixed;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.65);
  z-index: 999;
}

@media (max-width: 767px) {
  .sidebar:not(.sidebar--hidden) {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (min-width: 768px) {
  .sidebar-toggle {
    display: none;
  }

  .sidebar--hidden {
    transform: translateX(-100%);
  }
}

.sidebar__title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}
@media (max-width: 768px) {
  .sidebar__title {
    margin-bottom: 5px;
  }
}

.sidebar__search-container {
  position: relative;
}

/* .week-list {
  flex: 1;
  min-height: 0;
}

.week-list h3 {
  font-size: 16px;
  margin-bottom: 12px;
  font-weight: 600;
}

.week-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.2s;
}

.week-item:hover {
  background-color: var(--bg-hover);
  transform: translateX(4px);
}

.task-count {
  font-size: 14px;
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
} */

/* .nav-link:hover {
  background-color: var(--bg-card);
  color: var(--text-primary);
  transform: translateX(4px);
} */

.sidebar__footer {
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
  text-align: center;
}
</style>
