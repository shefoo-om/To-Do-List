<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import SearchComponent from '../ui/SearchComponent.vue'
import { useTodoStore } from '@/stores/todoStore.js'
import { useRoute } from 'vue-router'
import { SettingsIcon } from 'lucide-vue-next'

const todoStore = useTodoStore()
const route = useRoute()

const showSideBar = ref(true)
const isMobile = ref(false)

const getTaskCountForWeek = (weekId) => {
  return todoStore.getTaskCountForWeek(weekId)
}

const currentRouteWeekId = computed(() => {
  if (route.params.weekId) {
    return parseInt(route.params.weekId)
  }

  if (route.path === '/' || route.name === 'home') {
    return todoStore.getCurrentWeekByDate?.id
  }

  return todoStore.getCurrentWeek?.id
})

const isCurrentWeek = (weekId) => {
  return currentRouteWeekId.value === weekId
}

const allWeeks = computed(() => {
  const currentId = currentRouteWeekId.value
  const currentWeek = todoStore.weeks.find((w) => w.id === currentId)

  if (!currentWeek) return todoStore.weeks

  const otherWeeks = todoStore.weeks.filter((w) => w.id !== currentId)
  const sortedOthers = [...otherWeeks].sort((a, b) => a.weekNumber - b.weekNumber)

  return [currentWeek, ...sortedOthers]
})

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

  todoStore.initializeStore()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
  document.removeEventListener('click', handleClickOutside)
})

function handleTaskSelected(task) {
  console.log('Selected task from store:', task)
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
    <div @click="$router.push('/')" class="sidebar__title text-primary">To-Do List</div>

    <div class="sidebar__search-container">
      <SearchComponent :tasks="todoStore.tasks" @task-selected="handleTaskSelected" />
    </div>

    <div class="week-list">
      <div class="week-list-header">
        <h3 class="text-primary">📋 All Weeks</h3>
        <button class="view-all-btn text-secondary" @click="$router.push('/weeks')">
          View All
        </button>
      </div>
      <div class="week-list-scroll">
        <div
          v-for="week in allWeeks"
          :key="week.id"
          class="week-item bg-card text-primary"
          :class="{ 'week-item--current': isCurrentWeek(week.id) }"
          @click="$router.push(`/week/${week.id}`)"
        >
          <div class="week-item-content">
            <div class="week-header-row">
              <span class="week-name">{{ week.name }}</span>
              <span v-if="isCurrentWeek(week.id)" class="current-indicator">●</span>
            </div>
            <span class="week-range text-secondary">{{ week.dateRange }}</span>
            <span class="task-count text-secondary">
              {{ getTaskCountForWeek(week.id) }} tasks
            </span>
          </div>
        </div>

        <div v-if="allWeeks.length === 0" class="empty-weeks">
          <p class="text-secondary">No weeks yet</p>
        </div>
      </div>
    </div>

    <div class="content-list">
      <div class="content-list-header">
        <h3 class="text-primary">More</h3>
      </div>
      <div class="content-list-items">
        <a @click="$router.push('/settings')" class="content-item text-secondary">
          <SettingsIcon class="content-item-icon" size="18" />
          <span class="content-item-text">Settings</span>
        </a>
      </div>
    </div>

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
  gap: 14px;
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
    height: 100vh;
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
  top: 4px;
  left: 4px;
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
  cursor: pointer;
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
  height: 28%;
  position: relative;
}

.week-list {
  flex: 1;
  height: 40%;
  display: flex;
  overflow-y: auto;
  flex-direction: column;
}

.content-list {
  height: 15%;
  display: flex;
  flex-direction: column;
}

.content-list-header {
  margin-bottom: 10px;
  flex-shrink: 0;
}

.content-list-header h3 {
  font-size: 16px;
  font-weight: 600;
}

.content-list-items {
  display: flex;
  flex-direction: column;
}

.content-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0px 6px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.content-item-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.content-item-text {
  font-size: 16px;
  font-weight: 500;
}

.week-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.week-list-header h3 {
  font-size: 16px;
  margin: 0;
  font-weight: 600;
}

.view-all-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.view-all-btn:hover {
  color: var(--primary-hover);
}

.week-list-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
}

.week-list-scroll::-webkit-scrollbar {
  width: 6px;
}

.week-list-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.week-list-scroll::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

.week-list-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

.week-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 4px 12px 14px;
  border-radius: 8px;
  margin-bottom: 8px;
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.week-item:hover {
  border: 1px solid var(--primary-color);
}

.week-item--current {
  border-color: var(--primary-color);
  background-color: var(--bg-hover);
}

.week-item-content {
  height: 60px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.week-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.week-name {
  font-weight: 600;
  font-size: 14px;
}

.current-indicator {
  color: var(--primary-color);
  font-size: 16px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.week-range {
  font-size: 12px;
  line-height: 1.3;
}

.task-count {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 6px;
  background: var(--bg-main);
  border-radius: 8px;
  align-self: flex-start;
}

.empty-weeks {
  text-align: center;
  padding: 20px;
}

.empty-weeks p {
  font-size: 13px;
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  padding: 0px 14px;
  gap: 8px;
  flex-shrink: 0;
}

.nav-link {
  display: block;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
  padding: 8px 12px;
}

.nav-link:hover {
  background-color: var(--bg-card);
  color: var(--text-primary);
}

.nav-link.router-link-active {
  background-color: var(--bg-card);
  color: var(--text-primary);
}

.sidebar__footer {
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
  text-align: center;
  flex-shrink: 0;
}
</style>
