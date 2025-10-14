<script setup>
import { onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useTodoStore } from '@/stores/todoStore.js'

const todoStore = useTodoStore()

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
      <RouterLink :to="`/day/${currentDay.id}`" class="current-day-card">
        <div class="card-header">
          <div class="header-left">
            <h2 class="day-name text-primary">{{ currentDay.name }}</h2>
            <p class="day-date text-secondary">{{ currentDay.date }}</p>
          </div>
          <h1 class="card-title">Today's Tasks</h1>
          <span class="today-badge">Today</span>
        </div>

        <div class="stats-container">
          <div class="stat-box">
            <div class="stat-number text-primary">{{ currentDayTaskCounts.todo }}</div>
            <div class="stat-name">To-Do</div>
          </div>
          <div class="stat-box">
            <div class="stat-number text-primary">{{ currentDayTaskCounts.doing }}</div>
            <div class="stat-name">Doing</div>
          </div>
          <div class="stat-box">
            <div class="stat-number text-primary">{{ currentDayTaskCounts.done }}</div>
            <div class="stat-name">Done</div>
          </div>
          <div class="stat-box stat-box--total">
            <div class="stat-number stat-number--total">{{ currentDayTaskCounts.total }}</div>
            <div class="stat-name">Total</div>
          </div>
          <div class="card-footer">
            <span class="view-link text-primary">View All Tasks</span>
          </div>
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
  gap: 24px;
}

.week-header {
  width: 100%;
  height: max-content;
  margin: 0 auto;
}

.week-title {
  text-align: center;
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 8px;
  letter-spacing: 0.3px;
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
  letter-spacing: 0.2px;
}

.week-stats {
  text-align: center;
  font-weight: 500;
  margin-top: 8px;
  font-size: 16px;
}

@media (max-width: 768px) {
  .week-header {
    padding: 16px;
    width: 100%;
  }

  .week-title {
    font-size: 16px;
  }

  .week-name {
    font-size: 16px;
  }

  .week-stats {
    font-size: 14px;
  }
}

.current-day-section {
  width: 100%;
}

.current-day-card {
  background: var(--bg-card);
  border: 1px solid var(--primary-color);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
}

.current-day-card:hover {
  background: var(--bg-hover);
}

.current-day-card:active {
  transform: translateY(0);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.header-left {
  display: flex;
  gap: 10px;
  align-items: center;
}

.day-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.3px;
}

.day-date {
  font-size: 13px;
  margin: 0;
  font-weight: 500;
}
.card-title {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.today-badge {
  background: var(--primary-color);
  color: white;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  letter-spacing: 0.5px;
  display: inline-block;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  justify-content: space-between;
}

.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  height: 80px;
  background: var(--bg-main);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
}

.stat-box:hover {
  border-color: var(--primary-color);
}

.stat-box--total {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.stat-box--total .stat-name {
  color: white;
}

.stat-box--total .stat-number {
  color: white;
}

.stat-number {
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
}

.stat-number--total {
  font-size: 20px;
}

.stat-name {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--color-text-secondary);
}

.card-footer {
  display: flex;
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  height: 80px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.view-link {
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.view-link:hover {
  color: var(--primary-color);
}

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

  .stats-container {
    grid-template-columns: repeat(5, 1fr);
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
    gap: 8px;
  }

  .current-day-card {
    padding: 20px;
    gap: 16px;
  }

  .card-title {
    font-size: 24px;
  }

  .day-name {
    font-size: 18px;
  }

  .stat-box {
    padding: 12px 8px;
  }

  .stat-number {
    font-size: 28px;
  }

  .stats-container {
    gap: 8px;
  }
}

@media (max-width: 600px) {
  .current-day-card {
    padding: 16px;
    gap: 12px;
    border-radius: 16px;
  }
  .card-header {
    margin-bottom: 12px;
  }
  .header-left {
    display: flex;
    flex-direction: column;
    gap: 2px;
    align-items: center;
  }
  .card-title {
    font-size: 20px;
  }

  .day-name {
    font-size: 16px;
  }

  .card-header {
    gap: 12px;
  }

  .stats-container {
    gap: 8px;
    grid-template-columns: repeat(4, 1fr);
  }

  .card-footer {
    height: max-content;
    margin: 5px 0;
    grid-column: 1 / -1;
  }

  .stat-box {
    padding: 12px;
    border-radius: 10px;
    gap: 6px;
  }

  .stat-number {
    font-size: 24px;
  }

  .stat-name {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .days-tasks {
    grid-template-columns: repeat(1, 1fr);
    gap: 12px;
  }

  .current-day-card {
    padding: 14px;
    gap: 10px;
    border-radius: 14px;
  }

  .card-header {
    gap: 10px;
  }

  .day-name {
    font-size: 14px;
  }

  .day-date {
    font-size: 12px;
  }

  .today-badge {
    padding: 4px 10px;
    font-size: 11px;
  }

  .card-title {
    font-size: 18px;
  }

  .stats-container {
    gap: 6px;
  }

  .stat-number {
    font-size: 20px;
  }

  .stat-name {
    font-size: 10px;
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
  transition: all 200ms ease;
  text-decoration: none;
  color: inherit;
}

.day-card:hover {
  border-color: var(--primary-color);
}

.day-card:active {
  transform: translateY(0);
}

.day-card--current {
  border-color: var(--primary-color);
  background: var(--bg-hover);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.main-day {
  width: 100%;
  height: max-content;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.day-head {
  font-weight: 600;
  font-size: 18px;
  margin: 0;
  letter-spacing: 0.3px;
}

.day-type-of-tasks {
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 4px;
}

.day-to-do-tasks,
.day-doing-tasks,
.day-done-tasks {
  font-weight: 500;
  margin-left: 5px;
  margin: 0;
  font-size: 14px;
  letter-spacing: 0.2px;
}

.total-tasks {
  font-weight: 600;
  text-align: center;
  margin: 0;
  font-size: 15px;
  letter-spacing: 0.2px;
}

.total-tasks span {
  font-weight: 700;
}

.number-of-tasks {
  color: var(--primary-color);
  margin-left: 6px;
  font-size: 16px;
  font-weight: 600;
}

@media (max-width: 767px) {
  .day-card {
    padding: 10px 16px;
    height: 200px;
  }

  .day-head {
    font-size: 14px;
  }

  .day-to-do-tasks,
  .day-doing-tasks,
  .day-done-tasks {
    font-size: 15px;
  }

  .total-tasks {
    font-size: 16px;
  }

  .number-of-tasks {
    font-size: 14px;
  }
}

</style>
