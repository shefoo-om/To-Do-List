<script setup>
import { ref, computed } from 'vue'
import gsap from 'gsap'

// Props
const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: '🔍 Search tasks...'
  }
})

// Emits
const emit = defineEmits(['task-selected'])

// Search query
const query = ref('')

// Computed filtered results
const searchResults = computed(() => {
  if (!query.value.trim()) return []

  return props.tasks.filter(task =>
    task.name.toLowerCase().includes(query.value.toLowerCase()) ||
    task.category?.name.toLowerCase().includes(query.value.toLowerCase()) ||
    task.status.toLowerCase().includes(query.value.toLowerCase())
  )
})

// Animation functions
function onBeforeEnter(el) {
  el.style.opacity = 0
  el.style.transform = 'translateY(-10px)'
}

function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    transform: 'translateY(0)',
    duration: 0.3,
    delay: el.dataset.index * 0.05,
    onComplete: done
  })
}

function onLeave(el, done) {
  gsap.to(el, {
    opacity: 0,
    transform: 'translateY(-10px)',
    duration: 0.2,
    delay: el.dataset.index * 0.03,
    onComplete: done
  })
}

// Handle task selection
function selectTask(task) {
  emit('task-selected', task)
  query.value = '' // Clear search after selection
}

// Clear search
function clearSearch() {
  query.value = ''
}

// Get status color class
function getStatusClass(status) {
  const statusClasses = {
    todo: 'status-todo',
    doing: 'status-doing',
    done: 'status-done'
  }
  return statusClasses[status.toLowerCase()] || 'status-todo'
}
</script>

<template>
  <div class="search-component">
    <!-- Search Input -->
    <div class="search-input-container">
      <input
        v-model="query"
        type="text"
        :placeholder="placeholder"
        class="search-input bg-card text-primary"
      />
      <button
        v-if="query"
        @click="clearSearch"
        class="clear-button text-secondary"
      >
        ✕
      </button>
    </div>

    <!-- Results Container - Always Visible -->
    <div class="results-container">
      <!-- Default State - No search -->
      <div v-if="!query.trim()" class="default-state text-secondary">
        <div class="default-icon">🔍</div>
        <div>Search for tasks...</div>
        <div class="default-hint">Try searching by name, category, or status</div>
      </div>

      <!-- Search Results -->
      <div v-else-if="searchResults.length > 0" class="search-results">
        <div class="results-header text-secondary">
          {{ searchResults.length }} result{{ searchResults.length !== 1 ? 's' : '' }}
        </div>

        <TransitionGroup
          tag="ul"
          class="results-list"
          :css="false"
          @before-enter="onBeforeEnter"
          @enter="onEnter"
          @leave="onLeave"
        >
          <li
            v-for="(task, index) in searchResults"
            :key="task.id"
            :data-index="index"
            @click="selectTask(task)"
            class="result-item bg-hover text-primary"
          >
            <div class="task-info">
              <div class="task-name">{{ task.name }}</div>
              <div class="task-meta text-secondary">
                <span v-if="task.category" class="category">
                  {{ task.category.emoji }} {{ task.category.name }}
                </span>
                <span class="date">{{ formatDate(task.date) }}</span>
              </div>
            </div>
            <span :class="['task-status', getStatusClass(task.status)]">
              {{ task.status }}
            </span>
          </li>
        </TransitionGroup>
      </div>

      <!-- No Results -->
      <div v-else class="no-results text-secondary">
        <div class="no-results-icon">🔍</div>
        <div>No tasks found for "{{ query }}"</div>
        <div class="no-results-hint">Try different keywords</div>
      </div>
    </div>
  </div>
</template>

<script>
// Helper function to format date
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.search-component {
  position: relative;
  height: 250px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  padding-right: 2.5rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.clear-button {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  font-size: 12px;
  transition: all 0.2s;
}

.clear-button:hover {
  background-color: var(--bg-hover);
}

.results-container {
  flex: 1;
  min-height: 0;
  margin-top: 8px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--bg-card);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.default-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
}

.default-icon {
  font-size: 24px;
  margin-bottom: 8px;
  opacity: 0.5;
}

.default-hint {
  font-size: 12px;
  margin-top: 4px;
  opacity: 0.7;
}

.search-results {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.results-header {
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.results-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  overflow-y: auto;
}

.result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid var(--color-border);
}

.result-item:last-child {
  border-bottom: none;
}

.result-item:hover {
  background-color: var(--bg-hover);
}

.task-info {
  flex: 1;
}

.task-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.task-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
}

.category {
  font-weight: 500;
}

.task-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.no-results {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
}

.no-results-icon {
  font-size: 24px;
  margin-bottom: 8px;
  opacity: 0.5;
}

.no-results-hint {
  font-size: 12px;
  margin-top: 4px;
  opacity: 0.7;
}

/* Scrollbar styling */
.results-list::-webkit-scrollbar {
  width: 6px;
}

.results-list::-webkit-scrollbar-track {
  background: var(--bg-main);
}

.results-list::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

.results-list::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}
</style>
