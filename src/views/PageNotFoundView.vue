<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="not-found-view">
    <div class="not-found-card">
      <div class="error-content">
        <h1 class="error-code text-primary">404</h1>
        <h2 class="error-title text-primary">Page Not Found</h2>
        <p class="error-message text-secondary">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <div class="actions">
          <button @click="goHome" class="btn btn-primary">Go to Home</button>
          <button @click="goBack" class="btn btn-secondary">Go Back</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-view {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.not-found-card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 48px 32px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.error-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.error-code {
  font-size: 120px;
  font-weight: 700;
  margin: 0;
  line-height: 1;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.error-title {
  font-size: 32px;
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.error-message {
  font-size: 16px;
  margin: 0;
  line-height: 1.6;
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  padding: 12px 24px;
  font-size: 15px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  letter-spacing: 0.2px;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  background: var(--bg-main);
  color: var(--text-primary);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  border-color: var(--primary-color);
}

@media (max-width: 768px) {
  .not-found-card {
    padding: 32px 24px;
  }

  .error-code {
    font-size: 80px;
  }

  .error-title {
    font-size: 24px;
  }

  .error-message {
    font-size: 14px;
  }

  .actions {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
  }
}
</style>
