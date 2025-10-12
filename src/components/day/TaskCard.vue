<script setup>
import { ref, computed, h, nextTick } from 'vue'
import { useToast } from 'vue-toastification'
import {
  Play,
  CheckCircle2,
  RotateCcw,
  RefreshCw,
  Pencil,
  Trash2,
  Briefcase,
  Sparkles,
  Dumbbell,
  Rocket,
  Heart,
  DollarSign,
} from 'lucide-vue-next'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  nextStatus: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['status-change', 'delete-task', 'edit-task'])
const toast = useToast()

const isEditing = ref(false)
const editedName = ref('')

const categoryIcons = {
  work: Briefcase,
  personal: Sparkles,
  health: Dumbbell,
  learning: Rocket,
  social: Heart,
  finance: DollarSign,
}

const statusActions = computed(() => {
  switch (props.status) {
    case 'todo':
      return [
        { label: 'Start', action: 'doing', icon: Play, color: 'blue' },
        { label: 'Complete', action: 'done', icon: CheckCircle2, color: 'green' },
      ]
    case 'doing':
      return [
        { label: 'Back to Todo', action: 'todo', icon: RotateCcw, color: 'orange' },
        { label: 'Complete', action: 'done', icon: CheckCircle2, color: 'green' },
      ]
    case 'done':
      return [
        { label: 'Reopen', action: 'todo', icon: RotateCcw, color: 'orange' },
        { label: 'Continue', action: 'doing', icon: RefreshCw, color: 'blue' },
      ]
    default:
      return []
  }
})

const getCategoryIcon = (category) => {
  return categoryIcons[category] || Sparkles
}

const handleStatusChange = (newStatus) => {
  emit('status-change', props.task.id, newStatus)
}

const handleDelete = () => {
  let timeoutId = null
  let isDeleted = false

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault()
      const buttons = document.querySelectorAll('.delete-toast-btn')
      const currentIndex = Array.from(buttons).indexOf(document.activeElement)

      if (currentIndex !== -1) {
        let nextIndex
        if (event.key === 'ArrowRight') {
          nextIndex = (currentIndex + 1) % buttons.length
        } else {
          nextIndex = (currentIndex - 1 + buttons.length) % buttons.length
        }
        buttons[nextIndex]?.focus()
      }
    }
  }

  const content = h(
    'div',
    {
      class: 'delete-toast-content',
      onKeydown: handleKeyDown,
    },
    [
      h('p', { class: 'delete-toast-message' }, `Delete "${props.task.name}"?`),
      h('div', { class: 'delete-toast-actions' }, [
        h(
          'button',
          {
            class: 'delete-toast-btn confirm-btn',
            onClick: () => {
              if (!isDeleted) {
                isDeleted = true
                clearTimeout(timeoutId)
                toast.clear()
                emit('delete-task', props.task.id)
                toast.success('Task deleted successfully', { timeout: 2000 })
              }
            },
          },
          'Delete',
        ),
        h(
          'button',
          {
            class: 'delete-toast-btn cancel-btn',
            onClick: () => {
              if (!isDeleted) {
                clearTimeout(timeoutId)
                toast.clear()
              }
            },
          },
          'Cancel',
        ),
      ]),
    ],
  )

  toast.warning(content, {
    timeout: 5000,
    closeOnClick: false,
    closeButton: false,
    onClose: () => {
      clearTimeout(timeoutId)
    },
  })

  // Focus the delete button after toast is rendered
  nextTick(() => {
    setTimeout(() => {
      const deleteButton = document.querySelector('.delete-toast-btn.confirm-btn')
      if (deleteButton) {
        deleteButton.focus()
      }
    }, 100)
  })
}

const startEditing = () => {
  isEditing.value = true
  editedName.value = props.task.name
}

const saveEdit = () => {
  if (editedName.value.trim() && editedName.value !== props.task.name) {
    emit('edit-task', props.task.id, { name: editedName.value.trim() })
    toast.success('Task updated', { timeout: 2000 })
  }
  isEditing.value = false
}

const cancelEdit = () => {
  isEditing.value = false
  editedName.value = ''
}

const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    saveEdit()
  } else if (event.key === 'Escape') {
    cancelEdit()
  }
}
</script>

<template>
  <div class="task-card" :class="[`status-${status}`]">
    <div class="task-content">
      <div class="task-name-section">
        <input
          v-if="isEditing"
          v-model="editedName"
          @keydown="handleKeyPress"
          @blur="saveEdit"
          class="task-name-input"
          autofocus
        />
        <h4 v-else class="task-name text-primary">{{ task.name }}</h4>
      </div>
      <div class="task-meta">
        <span class="task-category">
          <component :is="getCategoryIcon(task.category)" :size="14" :stroke-width="2" />
          {{ task.category }}
        </span>
        <span v-if="task.date" class="task-date">{{ task.date }}</span>
      </div>
    </div>

    <div class="task-actions">
      <button v-if="!isEditing" @click="startEditing" class="action-btn edit-btn" title="Edit task">
        <Pencil :size="16" />
      </button>

      <div class="status-actions">
        <button
          v-for="action in statusActions"
          :key="action.action"
          @click="handleStatusChange(action.action)"
          :class="['action-btn', 'status-btn', `btn-${action.color}`]"
          :title="action.label"
        >
          <component :is="action.icon" :size="16" />
        </button>
      </div>

      <button @click="handleDelete" class="action-btn delete-btn" title="Delete task">
        <Trash2 :size="16" />
      </button>
    </div>
  </div>
</template>

<style>
.delete-toast-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 4px;
}

.delete-toast-message {
  margin: 0;
  font-weight: 600;
  font-size: 15px;
  color: #1f2937;
  letter-spacing: -0.01em;
}

.delete-toast-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.delete-toast-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.delete-toast-btn:focus {
  outline: none;
  box-shadow: 0 5px 3px rgba(0, 0, 0, 0.1);
}

.delete-toast-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition:
    width 0.4s,
    height 0.4s;
}

.delete-toast-btn:active::before {
  width: 300px;
  height: 300px;
}

.confirm-btn {
  background: #dc2626;
  color: white;
  border: 1px solid rgba(220, 38, 38, 0.3);
}

.confirm-btn:hover {
  background: #ef4444;
}

.confirm-btn:active {
  transform: translateY(0);
}

.confirm-btn:focus {
  background: #ef4444;
}

.cancel-btn {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #374151;
  border: 1px solid #d1d5db;
}

.cancel-btn:hover {
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.cancel-btn:active {
  transform: translateY(0);
}

.Vue-Toastification__toast--warning {
  background: linear-gradient(135deg, #ffffff 0%, #fefefe 100%);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.15),
    0 0 1px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.Vue-Toastification__toast--warning .Vue-Toastification__toast-body {
  padding: 8px 4px;
}
</style>

<style scoped>
.task-card {
  background: var(--bg-main);
  padding: 14px;
  border-radius: 8px;
  margin: 4px 4px 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.2 ease;
}

.task-card:hover {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .task-card {
    margin: 2px 0px 0px 0px;
  }
}

.status-todo {
  border-left: 2px solid var(--primary-color);
}

.status-doing {
  border-left: 2px solid var(--primary-color);
}

.status-done {
  border-left: 2px solid var(--primary-color);
  opacity: 0.8;
}

.task-name-section {
  margin-bottom: 10px;
}

.task-name {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
  word-wrap: break-word;
}

.task-name-input {
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  padding: 4px 6px;
  border: 1px solid var(--primary-color);
  border-radius: 4px;
  background: var(--bg-card);
  color: var(--text-primary);
}

.task-name-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.task-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.task-category {
  font-weight: 500;
  background: var(--bg-hover);
  padding: 3px 6px;
  border-radius: 4px;
  text-transform: capitalize;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.task-date {
  font-size: 12px;
  opacity: 0.8;
}

.task-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.action-btn {
  background: none;
  border: none;
  padding: 4px 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  opacity: 0.7;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
}

.action-btn:hover {
  opacity: 1;
}

.edit-btn:hover {
  color: #3b82f6;
}

.delete-btn:hover {
  color: #ef4444;
}

.status-actions {
  display: flex;
  gap: 4px;
}

.status-btn {
  padding: 4px;
}

.btn-blue:hover {
  color: var(--status-doing);
}

.btn-green:hover {
  color: var(--status-done);
}

.btn-orange:hover {
  color: var(--status-todo);
}

.status-done .task-name {
  text-decoration: line-through;
  opacity: 0.7;
}

.status-done .task-card {
  background: var(--bg-hover);
}

@media (max-width: 768px) {
  .task-card {
    padding: 12px;
  }

  .task-actions {
    flex-wrap: wrap;
  }

  .action-btn {
    padding: 6px 8px;
  }
}
</style>
