<script setup></script>

<template>
  <div class="week-view">
    <div class="week-header">
      <h2 class="week-title text-primary">
        Week Of <span class="text-secondary week-date"> January 15 - 21, 2024 </span>
      </h2>
    </div>
    <div class="days-tasks">
      <div class="day-card">
        <div class="main-day">
          <h2 class="day-head">MON</h2>
          <p class="day-date text-secondary">Jan 15</p>
        </div>
        <div class="day-type-of-tasks">
          <h3 class="day-to-do-tasks">To-Do: <span class="number-of-tasks">10 tasks</span></h3>
          <h3 class="day-donig-tasks">Donig: <span class="number-of-tasks">8 tasks</span></h3>
          <h3 class="day-done-tasks">Done: <span class="number-of-tasks">1 tasks</span></h3>
        </div>
        <h2 class="total-tasks">Total:<span class="number-of-tasks">19 tasks</span></h2>
      </div>
    </div>
  </div>
</template>

<style scoped>
.week-view {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
}
/*  */
.week-header {
  width: 100%;
  height: max-content;
  margin: 0px auto;
  padding: 16px;
  border-radius: 24px;
}
.week-title {
  text-align: center;
  font-weight: 600;
}
.week-date {
  font-weight: 500;
  margin-left: 2px;
}
@media (max-width: 768px) {
  .week-header {
    width: 100%;
  }
}
/*  */
.days-tasks {
  width: 100%;
  height: 100%;
  display: grid;
  justify-content: flex-start;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
@media (max-width: 1280px) {
  .days-tasks {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .days-tasks {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 900px) {
  .days-tasks {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 862px) {
  .days-tasks {
    grid-template-columns: repeat(1, 1fr);
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
.day-donig-tasks,
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
