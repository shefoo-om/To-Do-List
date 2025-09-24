<script setup></script>

<template>
  <div class="week-view">
    <div class="week-header bg-sidebar">
      <h2 class="week-title text-primary">
        Week Of <span class="text-secondary week-date"> January 15 - 21, 2024 </span>
      </h2>
    </div>
    <div class="days-tasks">
      <div class="day-card bg-sidebar">
        <h3 class="day-head">MON</h3>
        <h3 class="day-date">Jan 15</h3>
        <h3 class="day-num-tasks">10 tasks</h3>
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
  border: 1px solid var(--color-border);
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
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
@media (max-width: 1199px) {
  .days-tasks {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 767px) {
  .days-tasks {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 575px) {
  .days-tasks {
    grid-template-columns: 1fr;
  }
}

.day-card {
  width: 100%;
  height: 100%;
  max-height: 200px;
  padding: 4px 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 8px;
  border-radius: 16px;
  border: 1px solid var(--color-border);
}
</style>
