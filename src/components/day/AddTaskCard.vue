<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useToast } from 'vue-toastification'
import {
  Briefcase,
  Sparkles,
  Dumbbell,
  Rocket,
  Heart,
  DollarSign,
  X,
  ChevronDown,
} from 'lucide-vue-next'

const emit = defineEmits(['add-task'])
const toast = useToast()

const categories = [
  { value: 'work', label: 'Work', icon: Briefcase },
  { value: 'personal', label: 'Personal', icon: Sparkles },
  { value: 'health', label: 'Health & Fitness', icon: Dumbbell },
  { value: 'learning', label: 'Learning', icon: Rocket },
  { value: 'social', label: 'Social & Family', icon: Heart },
  { value: 'finance', label: 'Finance', icon: DollarSign },
]

const selected = ref(null)
const taskName = ref('')
const isOpen = ref(false)
const searchTerm = ref('')
const selectRef = ref(null)
const selectTriggerRef = ref(null)
const highlightedIndex = ref(-1)
const taskInputRef = ref(null)

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
    highlightedIndex.value = selected.value
      ? categories.findIndex((c) => c.value === selected.value.value)
      : 0
  }
}
const addTaskButtonRef = ref(null)

const selectOption = (option) => {
  selected.value = option
  isOpen.value = false
  searchTerm.value = ''
  highlightedIndex.value = -1
  setTimeout(() => {
    addTaskButtonRef.value?.focus()
  }, 100)
}

const clearSelection = (event) => {
  event?.stopPropagation()
  selected.value = null
  isOpen.value = false
  highlightedIndex.value = -1
}

const handleClickOutside = (event) => {
  if (selectRef.value && !selectRef.value.contains(event.target)) {
    isOpen.value = false
    highlightedIndex.value = -1
  }
}

const handleSelectKeydown = (event) => {
  if (!isOpen.value && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault()
    toggleDropdown()
    return
  }

  if (isOpen.value) {
    switch (event.key) {
      case 'Escape':
        event.preventDefault()
        isOpen.value = false
        highlightedIndex.value = -1
        selectTriggerRef.value?.focus()
        break

      case 'ArrowDown':
        event.preventDefault()
        highlightedIndex.value = Math.min(
          highlightedIndex.value + 1,
          filteredCategories.value.length - 1,
        )
        break

      case 'ArrowUp':
        event.preventDefault()
        highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
        break

      case 'Enter':
        event.preventDefault()
        if (
          highlightedIndex.value >= 0 &&
          highlightedIndex.value < filteredCategories.value.length
        ) {
          selectOption(filteredCategories.value[highlightedIndex.value])
          selectTriggerRef.value?.focus()
        }
        break

      case 'Tab':
        isOpen.value = false
        highlightedIndex.value = -1
        break
    }
  }
}

const handleGlobalKeydown = (event) => {
  if (event.key === 'Escape' && isOpen.value) {
    isOpen.value = false
    highlightedIndex.value = -1
  }
}

const handleTaskInputEnter = () => {
  if (taskName.value.trim()) {
    selectTriggerRef.value?.focus()
    if (!isOpen.value) {
      toggleDropdown()
    }
  }
}

const handleSubmit = () => {
  if (!taskName.value.trim() || !selected.value) {
    toast.error('Please fill in all fields')
    return
  }

  emit('add-task', {
    name: taskName.value.trim(),
    category: selected.value.value,
  })

  const truncatedName = taskName.value.trim().split(' ').slice(0, 3).join(' ')
  toast.success(`"${truncatedName}" added successfully!`, {
    position: 'top-right',
    timeout: 2500,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: false,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: true,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
    rtl: false,
  })
  taskName.value = ''
  selected.value = null

  setTimeout(() => {
    taskInputRef.value?.focus()
  }, 100)
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleGlobalKeydown)
  setTimeout(() => {
    taskInputRef.value?.focus()
  }, 100)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<template>
  <div class="add-task-card">
    <h3 class="add-task-header">Add Task</h3>

    <form class="add-task-form" @submit.prevent="handleSubmit">
      <input
        ref="taskInputRef"
        v-model="taskName"
        placeholder="Enter your Task..."
        class="add-task-input"
        required
        aria-label="Task name"
        @keydown.enter.prevent="handleTaskInputEnter"
      />

      <div class="custom-select" ref="selectRef">
        <div
          class="select-trigger"
          ref="selectTriggerRef"
          @click="toggleDropdown"
          @keydown="handleSelectKeydown"
          :class="{ 'select-open': isOpen }"
          tabindex="0"
          role="combobox"
          :aria-expanded="isOpen"
          :aria-haspopup="true"
          aria-label="Select category"
          :aria-activedescendant="highlightedIndex >= 0 ? `option-${highlightedIndex}` : undefined"
        >
          <div class="select-content">
            <span v-if="selected" class="selected-option">
              <component :is="selected.icon" :size="16" :stroke-width="2" />
              {{ selected.label }}
            </span>
            <span v-else class="placeholder"> Select category </span>
          </div>

          <div class="select-actions">
            <button
              v-if="selected"
              type="button"
              class="clear-btn"
              @click="clearSelection"
              @keydown.enter.prevent="clearSelection"
              tabindex="-1"
              aria-label="Clear selection"
            >
              <X :size="14" />
            </button>
            <div class="dropdown-arrow" :class="{ 'arrow-up': isOpen }">
              <ChevronDown :size="16" />
            </div>
          </div>
        </div>

        <div v-if="isOpen" class="dropdown-menu" role="listbox">
          <div class="options-list">
            <div
              v-for="(category, index) in filteredCategories"
              :key="category.value"
              :id="`option-${index}`"
              class="option-item"
              :class="{
                'option-selected': selected?.value === category.value,
                'option-highlighted': highlightedIndex === index,
              }"
              @click="selectOption(category)"
              @mouseenter="highlightedIndex = index"
              role="option"
              :aria-selected="selected?.value === category.value"
            >
              <span class="option-content">
                <component :is="category.icon" :size="16" :stroke-width="2" />
                {{ category.label }}
              </span>
              <span v-if="selected?.value === category.value" class="check-mark"> ✓ </span>
            </div>

            <div v-if="filteredCategories.length === 0" class="no-options">No categories found</div>
          </div>
        </div>
      </div>

      <button
        ref="addTaskButtonRef"
        type="submit"
        class="add-task-button"
        :disabled="!taskName.trim() || !selected"
        aria-label="Add task"
      >
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
  padding: 10px 14px 20px;
  border-radius: 18px;
  background: var(--bg-card, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  position: relative;
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

.select-trigger:focus {
  outline: none;
  border-color: var(--primary-color, #3b82f6);
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
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.placeholder {
  color: var(--text-secondary, #9ca3af);
}

.select-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.clear-btn {
  background: none;
  border: none;
  color: var(--text-secondary, #6b7280);
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-btn:hover {
  color: var(--primary-hover);
}

.dropdown-arrow {
  color: var(--text-secondary, #6b7280);
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
}

.dropdown-arrow.arrow-up {
  transform: rotate(180deg);
}

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

.option-item:hover,
.option-item.option-highlighted {
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
  display: flex;
  align-items: center;
  gap: 8px;
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
  border: 0px;
  border-radius: 10px;
  font-size: 15px;
  padding: 10px;
  background: var(--primary-hover, #2563eb);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.add-task-button:focus {
  outline: none;
  background: var(--primary-color, #3b82f6);
}

.add-task-button:hover:not(:disabled) {
  background: var(--primary-color, #3b82f6);
}

.add-task-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

@media (max-width: 1111px) {
  .add-task-form {
    flex-wrap: wrap;
    gap: 12px;
  }

  .add-task-input {
    width: 100%;
  }
  .custom-select {
    width: 65%;
  }
  .add-task-button {
    width: 30%;
  }
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
