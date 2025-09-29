<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTodoStore } from '@/stores/todoStore.js'
import AddTaskCard from '@/components/day/AddTaskCard.vue'
import TodoColumn from '@/components/day/TodoColumn.vue'
// import DoingColumn from '@/components/day/DoingColumn.vue'
// import DoneColumn from '@/components/day/DoneColumn.vue'

const route = useRoute()
const todoStore = useTodoStore()

const dayId = computed(() => parseInt(route.params.dayId) || 1)

const currentDay = computed(() => {
  return todoStore.days.find((day) => day.id === dayId.value) || null
})

const dayTasks = computed(() => {
  const allTasks = todoStore.tasks.filter((task) => task.dayId === dayId.value)

  return {
    todo: allTasks.filter((task) => task.status === 'todo'),
    doing: allTasks.filter((task) => task.status === 'doing'),
    done: allTasks.filter((task) => task.status === 'done'),
  }
})

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
  <div class="day-view">
    <div class="day-header">
      <div class="day-info">
        <div class="day-data">
          <h1 class="text-primary">{{ currentDay.name }}</h1>
          <h3 class="text-secondary">{{ currentDay.date }}</h3>
        </div>
        <p class="day-fulldate">{{ currentDay.fullDate }}</p>
      </div>
      <div class="day-status">
        <div class="day-tasks">
          <div class="to-do">
            <p>To-Do</p>
            <p class="todo-color">{{ taskCounts.todo }}</p>
          </div>
          <div class="doing">
            <p>Doing</p>
            <p class="doing-color">{{ taskCounts.doing }}</p>
          </div>
          <div class="done">
            <p>Done</p>
            <p class="done-color">{{ taskCounts.done }}</p>
          </div>
        </div>

        <div class="day-total-task">
          <p>Total</p>
          <p class="total-color">{{ taskCounts.total }}</p>
        </div>
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
      <TodoColumn />
      <TodoColumn />
    </div>

    <!-- <div class="task-columns">

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
    </div>  -->
  </div>
</template>

<style scoped>
.day-view {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 24px;
}
.day-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 10px 24px;
  border-radius: 18px;
  background: var(--bg-card);
  border: 1px solid var(--color-border);
}
.day-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
}
.day-data {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
.day-fulldate {
  font-size: 18px;
  margin-left: 10px;
}
.day-status {
  display: flex;
  justify-content: space-between;
  gap: 28px;
}
.day-tasks {
  display: flex;
  justify-content: space-between;
  gap: 14px;
}
.to-do,
.doing,
.done,
.day-total-task {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  /* text-transform: uppercase; */
  color: var(--text-primary);
}
.todo-color,
.doing-color,
.done-color,
.total-color {
  font-size: 22px;
}

.todo-color {
  color: var(--status-todo);
}
.doing-color {
  color: var(--status-doing);
}
.done-color {
  color: var(--status-done);
}
.total-color {
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .day-header {
    flex-direction: column;
    justify-content: space-between;
    gap: 18px;
    padding: 5px 24px;
  }
  .day-info {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  }
  .day-data {
    flex-direction: column;
    gap: 0px;
  }
  .day-fulldate {
    font-size: 16px;
    margin-left: 0px;
  }
  .day-status {
    width: 100%;
    justify-content: center;
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
