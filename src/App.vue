<script setup>
import { RouterView } from 'vue-router'
import Sidebar from './components/layout/SideBar.vue'
</script>

<template>
  <div class="app-layout bg-main">
    <Sidebar />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  width: 100%;
  height: 100vh;
}

.main-content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}
@media (max-width: 768px) {
  .main-content {
    padding: 32px 16px 20px;
  }
}
</style>
