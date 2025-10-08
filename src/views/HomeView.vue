<script setup>
import { onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useTodoStore } from '@/stores/todoStore.js'

const todoStore = useTodoStore()

// Don't destructure - keep store reference for reactivity
const currentWeek = computed(() => todoStore.getCurrentWeekByDate)
const currentWeekDays = computed(() => todoStore.getCurrentWeekDaysByDate)
const weekTaskCount = computed(() => todoStore.getWeekTaskCountByDate)
const currentDay = computed(() => todoStore.getCurrentDay)

const getTaskCounts = (dayId) => {
  return todoStore.getTaskCountsForDay(dayId)
}

const currentDayTaskCounts = computed(() => {
  const day = currentDay.value
  if (!day) return { todo: 0, doing: 0, done: 0, total: 0 }
  return todoStore.getTaskCountsForDay(day.id)
})

onMounted(() => {
  todoStore.initializeStore()
})
</script>

<template>
  <div class="week-view">
    <div class="week-header">
      <h2 class="week-title text-primary">
        Week Of
        <span class="text-secondary week-date">{{ currentWeek?.dateRange || 'Loading...' }}</span>
      </h2>
      <p class="week-name text-secondary">{{ currentWeek?.name ? `"${currentWeek.name}"` : '' }}</p>
      <p class="week-stats text-primary">{{ weekTaskCount }} total tasks this week</p>
    </div>
    <div v-if="currentDay" class="current-day-section">
      <h1 class="text-primary section-title">Today's Tasks</h1>
      <RouterLink :to="`/day/${currentDay.id}`" class="current-day-card">
        <div class="current-day-header">
          <div class="day-info">
            <h2 class="day-name text-primary">{{ currentDay.name }}</h2>
            <span class="current-badge">Today</span>
          </div>
          <p class="day-date text-secondary">{{ currentDay.date }}</p>
        </div>

        <div class="current-day-stats">
          <div class="stat-item">
            <span class="stat-label text-secondary">To-Do</span>
            <span class="stat-value text-primary">{{ currentDayTaskCounts.todo }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label text-secondary">Doing</span>
            <span class="stat-value text-primary">{{ currentDayTaskCounts.doing }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label text-secondary">Done</span>
            <span class="stat-value text-primary">{{ currentDayTaskCounts.done }}</span>
          </div>
          <div class="stat-item stat-item--total">
            <span class="stat-label text-secondary">Total</span>
            <span class="stat-value stat-value--large text-primary">{{
              currentDayTaskCounts.total
            }}</span>
          </div>
        </div>

        <div class="current-day-footer">
          <span class="view-link text-primary">View Tasks</span>
        </div>
      </RouterLink>
    </div>

    <div class="days-tasks">
      <RouterLink
        v-for="day in currentWeekDays"
        :key="day.id"
        :to="`/day/${day.id}`"
        class="day-card"
        :class="{ 'day-card--current': currentDay?.id === day.id }"
      >
        <div class="main-day">
          <h2 class="day-head">{{ day.name }}</h2>
          <p class="day-date text-secondary">{{ day.date }}</p>
        </div>
        <div class="day-type-of-tasks">
          <h3 class="day-to-do-tasks">
            To-Do: <span class="number-of-tasks">{{ getTaskCounts(day.id).todo }} tasks</span>
          </h3>
          <h3 class="day-doing-tasks">
            Doing: <span class="number-of-tasks">{{ getTaskCounts(day.id).doing }} tasks</span>
          </h3>
          <h3 class="day-done-tasks">
            Done: <span class="number-of-tasks">{{ getTaskCounts(day.id).done }} tasks</span>
          </h3>
        </div>
        <h2 class="total-tasks">
          Total: <span class="number-of-tasks">{{ getTaskCounts(day.id).total }} tasks</span>
        </h2>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.week-view {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 32px;
}

.current-day-section {
  width: 100%;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 16px;
  padding: 0 16px;
}

.current-day-card {
  background: var(--bg-card);
  border: 2px solid var(--primary-color);
  border-radius: 20px;
  padding: 14px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
}

.current-day-card:hover {
  background: var(--bg-hover);
}

.current-day-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.day-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.day-name {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.current-badge {
  background: var(--primary-color);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
}

.day-date {
  font-size: 16px;
}

.current-day-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 20px;
  background: var(--bg-main);
  border-radius: 12px;
}

@media (max-width: 768px) {
  .current-day-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .current-day-stats {
    gap: 20px;
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  padding: 12px;
  background: var(--bg-card);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.stat-item--total {
  background: var(--bg-hover);
}

.stat-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
}

.stat-value--large {
  font-size: 32px;
  color: var(--primary-color);
}

.current-day-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

.view-link {
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s;
}

.view-link:hover {
  color: var(--primary-color);
}

.week-header {
  width: 100%;
  height: max-content;
  margin: 0px auto;
  /* padding: 16px; */
  /* border-radius: 24px; */
}
@media (max-width: 768px) {
  .week-header {
    padding: 16px;
  }
}

.week-title {
  text-align: center;
  font-weight: 600;
  margin-bottom: 8px;
}

.week-date {
  font-weight: 500;
  margin-left: 2px;
}

.week-name {
  text-align: center;
  font-style: italic;
  margin: 8px 0;
  font-size: 18px;
}

.week-stats {
  text-align: center;
  font-weight: 500;
  margin-top: 8px;
}

@media (max-width: 768px) {
  .week-header {
    width: 100%;
  }
}

/* Days Grid */
.days-tasks {
  width: 100%;
  display: grid;
  justify-content: flex-start;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

@media (max-width: 1280px) {
  .days-tasks {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
}

@media (max-width: 1024px) {
  .days-tasks {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}

@media (max-width: 900px) {
  .days-tasks {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}

@media (max-width: 862px) {
  .days-tasks {
    grid-template-columns: repeat(1, 1fr);
    gap: 16px;
  }
}

@media (max-width: 767px) {
  .days-tasks {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .days-tasks {
    grid-template-columns: repeat(1, 1fr);
  }
}

.day-card {
  width: 100%;
  height: 240px;
  padding: 12px 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 8px;
  border-radius: 16px;
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 200ms;
  text-decoration: none;
  color: inherit;
}

.day-card:hover {
  background: var(--bg-hover);
}

.day-card--current {
  border-color: var(--primary-color);
  background: var(--bg-hover);
}

@media (max-width: 767px) {
  .day-card {
    padding: 10px 16px;
  }
}

.main-day {
  width: 100%;
  height: max-content;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.day-head {
  font-weight: 500;
}

.day-type-of-tasks {
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.day-to-do-tasks,
.day-doing-tasks,
.day-done-tasks,
.total-tasks {
  font-weight: 500;
  margin-left: 5px;
}

.total-tasks {
  text-align: center;
}

.total-tasks span {
  font-weight: 600;
}

.number-of-tasks {
  color: var(--primary-color);
  margin-left: 6px;
  font-size: 18px;
}
</style>
