<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTodoStore } from '@/stores/todoStore.js'
import AddTaskCard from '@/components/day/AddTaskCard.vue'
import TodoColumn from '@/components/day/TodoColumn.vue'
import DoingColumn from '@/components/day/DoingColumn.vue'
import DoneColumn from '@/components/day/DoneColumn.vue'

const route = useRoute()
const router = useRouter()
const todoStore = useTodoStore()

const dayId = computed(() => parseInt(route.params.dayId) || 1)

const currentDay = computed(() => {
  return todoStore.days.find((day) => day.id === dayId.value) || null
})

onMounted(() => {
  todoStore.initializeStore()

  if (!currentDay.value) {
    router.push({ name: 'not-found' })
    return
  }

  updateTime()
  setInterval(updateTime, 1000)
})

const dayTasks = computed(() => {
  if (!currentDay.value) return { todo: [], doing: [], done: [] }

  const allTasks = todoStore.tasks.filter((task) => task.dayId === dayId.value)

  return {
    todo: allTasks.filter((task) => task.status === 'todo'),
    doing: allTasks.filter((task) => task.status === 'doing'),
    done: allTasks.filter((task) => task.status === 'done'),
  }
})

const currentTime = ref('')

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

const taskCounts = computed(() => {
  return {
    todo: dayTasks.value.todo.length,
    doing: dayTasks.value.doing.length,
    done: dayTasks.value.done.length,
    total: dayTasks.value.todo.length + dayTasks.value.doing.length + dayTasks.value.done.length,
  }
})

const handleAddTask = (taskData) => {
  todoStore.addTask({
    ...taskData,
    dayId: dayId.value,
    status: 'todo',
  })
}

const handleTaskStatusChange = (taskId, newStatus) => {
  todoStore.updateTask(taskId, { status: newStatus })
}

const handleDeleteTask = (taskId) => {
  todoStore.deleteTask(taskId)
}

const handleEditTask = (taskId, updates) => {
  todoStore.updateTask(taskId, updates)
}
</script>

<template>
  <div v-if="currentDay" class="day-view">
    <div class="day-header">
      <div class="header-left">
        <h1 class="day-name">{{ currentDay.name }}</h1>
        <p class="day-date">{{ currentDay.date }}</p>
        <p class="time-displayyy">
          {{ currentTime }}
        </p>
      </div>
      <div class="stats-group">
        <div class="stat-item">
          <span class="stat-label">To-Do</span>
          <span class="stat-value todo-color">{{ taskCounts.todo }}</span>
        </div>

        <div class="stat-item">
          <span class="stat-label">Doing</span>
          <span class="stat-value doing-color">{{ taskCounts.doing }}</span>
        </div>

        <div class="stat-item">
          <span class="stat-label">Done</span>
          <span class="stat-value done-color">{{ taskCounts.done }}</span>
        </div>

        <div class="stat-item">
          <span class="stat-label">Total</span>
          <span class="stat-value total-color">{{ taskCounts.total }}</span>
        </div>
      </div>
      <div class="time-display">
        {{ currentTime }}
      </div>
    </div>

    <AddTaskCard @add-task="handleAddTask" />

    <div class="day-tasks-Column">
      <TodoColumn
        :tasks="dayTasks.todo"
        :task-count="taskCounts.todo"
        @status-change="handleTaskStatusChange"
        @delete-task="handleDeleteTask"
        @edit-task="handleEditTask"
      />
      <DoingColumn
        :tasks="dayTasks.doing"
        :task-count="taskCounts.doing"
        @status-change="handleTaskStatusChange"
        @delete-task="handleDeleteTask"
        @edit-task="handleEditTask"
      />
      <DoneColumn
        :tasks="dayTasks.done"
        :task-count="taskCounts.done"
        @status-change="handleTaskStatusChange"
        @delete-task="handleDeleteTask"
        @edit-task="handleEditTask"
      />
    </div>
  </div>
</template>

<style scoped>
.day-view {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 14px;
}

.day-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-radius: 16px;
  background: var(--bg-card);
  border: 1px solid var(--color-border);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.time-displayyy {
  display: none;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  padding: 6px 16px;
  background: var(--bg-hover, rgba(0, 0, 0, 0.03));
  border-radius: 8px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.5px;
}
.day-name {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.day-date {
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 500;
}

.stats-group {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-label {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 600;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  line-height: 1;
}

.todo-color,
.doing-color,
.done-color {
  color: var(--primary-color);
}

.total-color {
  color: var(--text-primary);
}

.time-display {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  padding: 6px 16px;
  background: var(--bg-hover, rgba(0, 0, 0, 0.03));
  border-radius: 8px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.5px;
}

@media (max-width: 968px) {
  .day-header {
    flex-direction: column;
    gap: 16px;
    padding: 16px 20px;
  }

  .header-left,
  .header-right {
    width: 100%;
  }

  .header-left {
    justify-content: space-between;
  }

  .header-right {
    justify-content: space-between;
  }

  .stats-group {
    gap: 16px;
  }
}

@media (max-width: 640px) {
  .header-left {
    gap: 4px;
    margin-bottom: 10pxX;
  }

  .day-name {
    font-size: 22px;
  }

  .stats-group {
    gap: 12px;
  }

  .stat-value {
    font-size: 18px;
  }

  .time-displayyy {
    display: block;
    font-size: 16px;
    padding: 6px 12px;
  }
  .time-display {
    display: none;
  }
}

.day-tasks-Column {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 1160px) {
  .day-tasks-Column {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .day-tasks-Column {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
