<script setup>
import { computed } from 'vue'
import TaskCard from './TaskCard.vue'

const props = defineProps({
  tasks: {
    type: Array,
    default: () => [],
  },
  taskCount: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['status-change', 'delete-task', 'edit-task'])

const nextStatus = 'doing'

const handleStatusChange = (taskId, newStatus) => {
  emit('status-change', taskId, newStatus)
}

const handleDeleteTask = (taskId) => {
  emit('delete-task', taskId)
}

const handleEditTask = (taskId, updates) => {
  emit('edit-task', taskId, updates)
}

const isEmpty = computed(() => props.tasks.length === 0)
</script>

<template>
  <div class="task-column todo-column">
    <div class="column-header text-primary">
      <h3 class="column-title">To-Do</h3>
      <span class="task-counter">{{ taskCount }}</span>
    </div>

    <div class="tasks-list" :class="{ empty: isEmpty }">
      <div v-if="isEmpty" class="empty-state">
        <div class="empty-icon">📋</div>
        <p class="empty-text text-primary">No tasks to do</p>
        <p class="empty-hint text-secondary">Add a new task to get started!</p>
      </div>
      <TransitionGroup v-else tag="div" name="task" class="tasks-container">
        <TaskCard
          v-for="task in tasks"
          :task="task"
          :key="task.id"
          :status="'todo'"
          :next-status="nextStatus"
          @status-change="handleStatusChange"
          @delete-task="handleDeleteTask"
          @edit-task="handleEditTask"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.task-column {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  overflow: hidden;
}
.column-header {
  color: var(--status-todo);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  font-size: 18px;
  font-weight: 500;
  border-bottom: 1px solid var(--color-border);
}
.tasks-list {
  flex: 1;
  flex: 1;
  padding-bottom: 10px;
  overflow-y: auto;
  min-height: 250px;
}
.empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
}
.empty-text {
  font-size: 22px;
  font-weight: 600;
}
.empty-hint {
  font-weight: 400;
  font-size: 16px;
}
.empty-icon {
  font-size: 40px;
}
.tasks-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-enter-active {
  transition: all 0.3s ease-out;
}

.task-leave-active {
  transition: all 0.3s ease-in;
}

.task-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.task-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.tasks-list::-webkit-scrollbar {
  width: 6px;
}

.tasks-list::-webkit-scrollbar-track {
  background: var(--bg-main);
  border-radius: 3px;
}

.tasks-list::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

.tasks-list::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

@media (max-width: 1024px) {
  .column-header {
    padding: 12px 16px;
  }

  .tasks-list {
    padding: 12px;
  }
}
</style>
