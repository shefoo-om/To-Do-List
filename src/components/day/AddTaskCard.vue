<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const emit = defineEmits(['add-task'])

const categories = [
  { value: 'work', label: 'Work', emoji: '💼' },
  { value: 'personal', label: 'Personal', emoji: '🏠' },
  { value: 'health', label: 'Health', emoji: '🏃' },
  { value: 'learning', label: 'Learning', emoji: '📚' },
  { value: 'design', label: 'Design', emoji: '🎨' },
  { value: 'research', label: 'Research', emoji: '🔍' },
  { value: 'planning', label: 'Planning', emoji: '📋' },
  { value: 'admin', label: 'Admin', emoji: '📊' },
]

const selected = ref(null)
const taskName = ref('')
const isOpen = ref(false)
const searchTerm = ref('')
const selectRef = ref(null)

// Filtered options based on search
const filteredCategories = computed(() => {
  if (!searchTerm.value) return categories
  return categories.filter((category) =>
    category.label.toLowerCase().includes(searchTerm.value.toLowerCase()),
  )
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchTerm.value = ''
  }
}

const selectOption = (option) => {
  selected.value = option
  isOpen.value = false
  searchTerm.value = ''
}

const clearSelection = () => {
  selected.value = null
  isOpen.value = false
}

const handleClickOutside = (event) => {
  if (selectRef.value && !selectRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    isOpen.value = false
  }
}

const handleSubmit = () => {
  if (!taskName.value.trim() || !selected.value) return

  console.log('Task:', taskName.value)
  console.log('Category:', selected.value)

  // Emit or handle the form submission
  emit('add-task', { name: taskName.value.trim(), category: selected.value })

  // Reset form
  taskName.value = ''
  selected.value = null
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="add-task-card">
    <h3 class="add-task-header">Add Task</h3>
    <form class="add-task-form" @submit.prevent="handleSubmit">
      <input v-model="taskName" placeholder="Enter your Task..." class="add-task-input" required />

      <div class="custom-select" ref="selectRef">
        <div class="select-trigger" @click="toggleDropdown" :class="{ 'select-open': isOpen }">
          <div class="select-content">
            <span v-if="selected" class="selected-option">
              {{ selected.emoji }} {{ selected.label }}
            </span>
            <span v-else class="placeholder"> Select category </span>
          </div>

          <div class="select-actions">
            <button v-if="selected" type="button" class="clear-btn" @click.stop="clearSelection">
              ✕
            </button>
            <div class="dropdown-arrow" :class="{ 'arrow-up': isOpen }">▼</div>
          </div>
        </div>

        <div v-if="isOpen" class="dropdown-menu">

          <div class="options-list">
            <div
              v-for="category in filteredCategories"
              :key="category.value"
              class="option-item"
              :class="{ 'option-selected': selected?.value === category.value }"
              @click="selectOption(category)"
            >
              <span class="option-content"> {{ category.emoji }} {{ category.label }} </span>
              <span v-if="selected?.value === category.value" class="check-mark"> ✓ </span>
            </div>

            <div v-if="filteredCategories.length === 0" class="no-options">No categories found</div>
          </div>
        </div>
      </div>

      <button type="submit" class="add-task-button" :disabled="!taskName.trim() || !selected">
        Add Task
      </button>
    </form>
  </div>
</template>

<style scoped>
.add-task-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 22px;
  padding: 10px 24px 20px;
  border-radius: 18px;
  background: var(--bg-card, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
}

.add-task-header {
  font-weight: 500;
  color: var(--text-primary, #1f2937);
}

.add-task-form {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: flex-start;
}

.add-task-input {
  width: 65%;
  padding: 10px;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.2s ease;
  background: var(--bg-input, #fff);
}

.add-task-input:focus {
  outline: none;
  border-color: var(--primary-color, #3b82f6);
}

.custom-select {
  width: 20%;
  position: relative;
  font-size: 15px;
}

.select-trigger {
  width: 100%;
  padding: 0 10px;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 10px;
  background: var(--bg-input, #fff);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  min-height: 40px;
}

.select-trigger.select-open {
  border-color: var(--primary-color, #3b82f6);
}

.select-content {
  flex: 1;
  text-align: left;
}

.selected-option {
  color: var(--text-primary, #1f2937);
  font-weight: 500;
}

.select-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.clear-btn {
  background: none;
  border: none;
  color: var(--text-secondary, #6b7280);
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  transition: all 0.2s ease;
  font-size: 12px;
}

.clear-btn:hover {
  color: var(--primary-hover);
}

.dropdown-arrow {
  color: var(--text-secondary, #6b7280);
  transition: transform 0.2s ease;
  font-size: 12px;
}

.dropdown-arrow.arrow-up {
  transform: rotate(180deg);
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  background: var(--bg-card, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 10px;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  margin-top: 4px;
  overflow: hidden;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-wrapper {
  padding: 8px;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
}


.options-list {
  max-height: 200px;
  overflow-y: auto;
}

.option-item {
  padding: 10px 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.1s ease;
  border-bottom: 1px solid var(--color-border-light, #f3f4f6);
}

.option-item:last-child {
  border-bottom: none;
}

.option-item:hover {
  background: var(--bg-hover, #f8fafc);
  color: var(--primary-color, #3b82f6);
}

.option-item.option-selected {
  background: var(--primary-light, #eff6ff);
  color: var(--primary-color, #3b82f6);
  font-weight: 500;
}

.option-content {
  flex: 1;
}

.check-mark {
  color: var(--primary-color, #3b82f6);
  font-weight: bold;
}

.no-options {
  padding: 12px;
  text-align: center;
  color: var(--text-secondary, #6b7280);
  font-style: italic;
}

.add-task-button {
  width: 12%;
  border: 1px solid var(--primary-color, #3b82f6);
  border-radius: 10px;
  font-size: 15px;
  padding: 10px;
  background: var(--primary-color, #3b82f6);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.add-task-button:hover:not(:disabled) {
  background: var(--primary-hover, #2563eb);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.add-task-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

@media (max-width: 768px) {
  .add-task-form {
    flex-direction: column;
    gap: 12px;
  }

  .add-task-input,
  .custom-select,
  .add-task-button {
    width: 100%;
  }
}

.options-list::-webkit-scrollbar {
  width: 6px;
}

.options-list::-webkit-scrollbar-track {
  background: var(--bg-scroll-track, #f1f5f9);
}

.options-list::-webkit-scrollbar-thumb {
  background: var(--bg-scroll-thumb, #cbd5e1);
  border-radius: 3px;
}

.options-list::-webkit-scrollbar-thumb:hover {
  background: var(--bg-scroll-thumb-hover, #94a3b8);
}
</style>
