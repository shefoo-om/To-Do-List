<script setup>
import { ref, computed } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  tasks: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Search tasks...',
  },
})

const emit = defineEmits(['task-selected'])

const query = ref('')

const searchResults = computed(() => {
  if (!query.value.trim()) return []

  return props.tasks.filter(
    (task) =>
      task.name.toLowerCase().includes(query.value.toLowerCase()) ||
      task.category?.toLowerCase().includes(query.value.toLowerCase()) ||
      task.status.toLowerCase().includes(query.value.toLowerCase()),
  )
})

function onBeforeEnter(el) {
  el.style.opacity = 0
  el.style.transform = 'translateY(-10px)'
}

function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    transform: 'translateY(0)',
    duration: 0.4,
    delay: el.dataset.index * 0.1,
    onComplete: done,
  })
}

function onLeave(el, done) {
  gsap.to(el, {
    opacity: 0,
    transform: 'translateY(-10px)',
    duration: 0.2,
    delay: el.dataset.index * 0.05,
    onComplete: done,
  })
}

function selectTask(task) {
  emit('task-selected', task)
  query.value = ''
}

function clearSearch() {
  query.value = ''
}

function getStatusClass(status) {
  const statusClasses = {
    todo: 'status-todo',
    doing: 'status-doing',
    done: 'status-done',
  }
  return statusClasses[status.toLowerCase()] || 'status-todo'
}

function getCategoryEmoji(category) {
  const categoryEmojis = {
    work: '💼',
    personal: '🏠',
    health: '🏃',
    learning: '📚',
    design: '🎨',
    research: '🔍',
    planning: '📋',
    admin: '📊',
  }
  return categoryEmojis[category.toLowerCase()] || '📝'
}

function formatDate(dateString) {
  if (!dateString) return 'No date'

  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="search-component">
    <div class="search-input-container">
      <input
        v-model="query"
        type="text"
        :placeholder="placeholder"
        class="search-input bg-card text-primary"
      />
      <button v-if="query" @click="clearSearch" class="clear-button text-secondary">✕</button>
    </div>

    <div class="results-container">
      <div v-if="!query.trim()" class="default-state text-secondary">
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
                <span class="category">
                  {{ getCategoryEmoji(task.category) }} {{ task.category }}
                </span>
                <span class="date-info" v-if="task.date">{{ formatDate(task.date) }}</span>
              </div>
            </div>
            <span :class="['task-status', getStatusClass(task.status)]">
              {{ task.status }}
            </span>
          </li>
        </TransitionGroup>
      </div>

      <div v-else class="no-results text-secondary">
        <div>
          No tasks found for <span class="no-results-word">"{{ query }}"</span>
        </div>
        <div class="no-results-hint">Try different keywords</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-component {
  position: relative;
  height: 270px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.search-input {
  width: 100%;
  padding: 12px;
  padding-right: 40px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.clear-button {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  padding: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-button:hover {
  color: var(--primary-hover);
}

.results-container {
  flex: 1;
  min-height: 0;
  margin-top: 8px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background-color: var(--bg-card);
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
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.results-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 5px;
  justify-content: space-between;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid var(--color-border);
}

.result-item:first-child {
  padding-top: 14px;
}

.result-item:last-child {
  border-bottom: none;
}

.result-item:hover {
  background-color: var(--bg-hover);
}

.task-info {
  width: 70%;
}

.task-name {
  font-weight: 500;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
}

.category {
  font-weight: 600;
}

.date-info {
  font-weight: 600;
}

.task-status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  white-space: nowrap;
}

.status-todo {
  background-color: #fef3c7;
  color: var(--status-todo);
}

.status-doing {
  background-color: #dbeafe;
  color: var(--status-doing);
}

.status-done {
  background-color: #d1fae5;
  color: var(--status-done);
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

.no-results-word {
  font-weight: 500;
}

.no-results-hint {
  font-size: 12px;
  margin-top: 4px;
  opacity: 0.7;
}

/* Scrollbar styling */
.results-list::-webkit-scrollbar {
  width: 4px;
  transition: all 0.3s ease;
}

.results-list::-webkit-scrollbar-track {
  background: var(--bg-main);
  transition: background 0.3s ease;
}

.results-list::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  transition: all 0.3s ease;
}

.results-list::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
  transform: scaleX(1.1);
}
</style>
