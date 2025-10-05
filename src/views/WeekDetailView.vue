<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import { useTodoStore } from '@/stores/todoStore.js'
import { ArrowBigLeftDash, ArrowBigRightDash } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const todoStore = useTodoStore()
const toast = useToast()

const weekId = computed(() => parseInt(route.params.weekId) || 1)

const currentWeek = computed(() => {
  return todoStore.getWeekById(weekId.value)
})

const weekDays = computed(() => {
  return todoStore.getWeekDays(weekId.value)
})

const weekTaskCount = computed(() => {
  return todoStore.getTaskCountForWeek(weekId.value)
})

const canGoPrevious = computed(() => {
  return currentWeek.value && currentWeek.value.weekNumber > 1
})

const getTaskCounts = (dayId) => {
  return todoStore.getTaskCountsForDay(dayId)
}

const handlePreviousWeek = () => {
  if (!canGoPrevious.value) return

  const prevWeek = todoStore.goToPreviousWeek()
  router.push(`/week/${prevWeek.id}`)
}

const handleNextWeek = () => {
  const current = currentWeek.value
  if (!current) return

  const nextWeekStart = new Date(current.startDate)
  nextWeekStart.setDate(nextWeekStart.getDate() + 7)

  const existingWeek = todoStore.weeks.find(
    (w) => w.startDate === nextWeekStart.toISOString().split('T')[0],
  )

  if (!existingWeek) {
    toast.info('Creating a new week...', {
      timeout: 2000,
      icon: '➕',
    })
  }

  const result = todoStore.goToNextWeek()
  router.push(`/week/${result.week.id}`)
}
onMounted(() => {
  todoStore.initializeStore()
  todoStore.setCurrentWeekById(weekId.value)
})
</script>

<template>
  <div class="week-view">
    <div class="week-header">
      <div class="week-navigation">
        <button
          @click="handlePreviousWeek"
          class="nav-button text-secondary"
          :class="{ 'nav-button--disabled': !canGoPrevious }"
          :disabled="!canGoPrevious"
          title="Previous Week"
        >
          <ArrowBigLeftDash size="18" />
        </button>

        <div class="week-info">
          <h2 class="week-title text-primary">
            {{ currentWeek?.name || 'Loading...' }}
          </h2>
          <p class="week-date text-secondary">{{ currentWeek?.dateRange || '' }}</p>
        </div>

        <button @click="handleNextWeek" class="nav-button text-secondary" title="Next Week">
          <ArrowBigRightDash size="18" />
        </button>
      </div>

      <p class="week-stats text-primary">{{ weekTaskCount }} total tasks this week</p>
    </div>

    <div class="days-tasks">
      <RouterLink v-for="day in weekDays" :key="day.id" :to="`/day/${day.id}`" class="day-card">
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
  margin: 0px auto;
  padding: 16px;
  border-radius: 24px;
}

.week-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.nav-button {
  background: var(--bg-card);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  width: 35px;
  height: 35px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
}

.nav-button:hover:not(:disabled) {
  background: var(--bg-hover);
}

.nav-button:active:not(:disabled) {
  transform: translateY(0);
}

.nav-button--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.week-info {
  flex: 1;
  text-align: center;
}

.week-title {
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 24px;
}

.week-date {
  font-weight: 500;
  font-size: 16px;
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

  .week-navigation {
    gap: 12px;
  }

  .nav-button {
    width: 10%;
  }
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

.day-date {
  font-weight: 400;
  font-size: 18px;
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
