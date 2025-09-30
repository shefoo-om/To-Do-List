<script setup>
import { ref, computed } from 'vue'
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
  if (confirm(`Are you sure you want to delete "${props.task.name}"?`)) {
    emit('delete-task', props.task.id)
  }
}

const startEditing = () => {
  isEditing.value = true
  editedName.value = props.task.name
}

const saveEdit = () => {
  if (editedName.value.trim() && editedName.value !== props.task.name) {
    emit('edit-task', props.task.id, { name: editedName.value.trim() })
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

<style scoped>
.task-card {
  background: var(--bg-main);
  padding: 14px;
  border-radius: 8px;
  margin: 4px 4px 0px 4px;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
@media (max-width: 768px) {
.task-card {
  margin: 2px 0px 0px 0px;

}
}
.status-todo {
  border-left: 2px solid var(--status-todo);
}
.status-doing {
  border-left: 2px solid var(--status-doing);
}
.status-done {
  border-left: 2px solid var(--status-done);
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
