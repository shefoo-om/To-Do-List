<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useTodoStore } from '@/stores/todoStore.js'

const todoStore = useTodoStore()

const allWeeks = computed(() => {
  return [...todoStore.weeks].sort((a, b) => {
    return new Date(b.startDate) - new Date(a.startDate)
  })
})

const getTaskCounts = (weekId) => {
  return todoStore.getTaskCountForWeek(weekId)
}

const isCurrentWeek = (weekId) => {
  return todoStore.getCurrentWeek?.id === weekId
}

onMounted(() => {
  todoStore.initializeStore()
})
</script>

<template>
  <div class="all-weeks-view">
    <div class="weeks-header">
      <h1 class="text-primary">All Weeks</h1>
      <p class="text-secondary">Browse through all your weekly task schedules</p>
    </div>

    <div class="weeks-grid">
      <RouterLink
        v-for="week in allWeeks"
        :key="week.id"
        :to="`/week/${week.id}`"
        class="week-card"
        :class="{ 'week-card--current': isCurrentWeek(week.id) }"
      >
        <div class="week-card-header">
          <div class="week-info">
            <h2 class="week-name text-primary">{{ week.name }}</h2>
            <span v-if="isCurrentWeek(week.id)" class="current-badge">Current Week</span>
          </div>
          <p class="week-date text-secondary">{{ week.dateRange }}</p>
        </div>

        <div class="week-card-stats">
          <div class="stat-item">
            <span class="stat-label text-secondary">Total Tasks</span>
            <span class="stat-value text-primary">{{ getTaskCounts(week.id) }}</span>
          </div>
        </div>

        <div class="week-card-footer">
          <span class="view-link text-primary">View Details</span>
        </div>
      </RouterLink>
    </div>

    <div v-if="allWeeks.length === 0" class="empty-state">
      <p class="text-secondary">No weeks available. Start by navigating through weeks!</p>
    </div>
  </div>
</template>

<style scoped>
.all-weeks-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.weeks-header {
  width: 100%;
  padding: 16px;
  border-radius: 16px;
}

.weeks-header h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.weeks-header p {
  font-size: 16px;
}

.weeks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  width: 100%;
}

@media (max-width: 768px) {
  .weeks-grid {
    grid-template-columns: 1fr;
  }
}

.week-card {
  background: var(--bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.week-card:hover {
  background: var(--bg-hover);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.week-card--current {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px var(--primary-color);
}

.week-card-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.week-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.week-name {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.current-badge {
  background: var(--primary-color);
  color: white;
  padding: 3px 6px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.week-date {
  font-size: 14px;
}

.week-card-stats {
  display: flex;
  gap: 16px;
  padding: 12px;
  background: var(--bg-main);
  border-radius: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  margin-left: 15px;
}

.week-card-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
  border-top: 1px solid var(--color-border);
}

.view-link {
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s;
}
.view-link:hover {
  color: var(--primary-color);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-state p {
  font-size: 16px;
}
</style>
