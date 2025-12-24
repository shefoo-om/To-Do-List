<script setup>
import { ref, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme.js'
import { CloudMoonRain } from 'lucide-vue-next'
import CategoryManager from '@/components/ui/CategoryManager.vue'
// import CategoryManager from '@/components/settings/CategoryManager.vue'

const themeStore = useThemeStore()

const primaryColor = ref('#3B82F6')
const hoverColor = ref('#2563EB')

const colorSets = [
  { name: 'Blue', primary: '#3B82F6', hover: '#2563EB' },
  { name: 'Indigo', primary: '#6366F1', hover: '#4F46E5' },
  { name: 'Purple', primary: '#A855F7', hover: '#9333EA' },
  { name: 'Pink', primary: '#EC4899', hover: '#DB2777' },
  { name: 'Red', primary: '#EF4444', hover: '#DC2626' },
  { name: 'Orange', primary: '#F97316', hover: '#EA580C' },
  { name: 'Amber', primary: '#F59E0B', hover: '#D97706' },
  { name: 'Green', primary: '#10B981', hover: '#059669' },
  { name: 'Teal', primary: '#14B8A6', hover: '#0D9488' },
  { name: 'Cyan', primary: '#06B6D4', hover: '#0891B2' },
]

onMounted(() => {
  themeStore.loadTheme()
  loadSavedColors()
})

function loadSavedColors() {
  const saved = localStorage.getItem('custom-primary-colors')
  if (saved) {
    try {
      const colors = JSON.parse(saved)
      primaryColor.value = colors.primary
      hoverColor.value = colors.hover
      applyColors()
    } catch (e) {
      console.error('Failed to load colors:', e)
    }
  }
}

function selectColorSet(set) {
  primaryColor.value = set.primary
  hoverColor.value = set.hover
  applyColors()
}

function applyColors() {
  document.documentElement.style.setProperty('--primary-color', primaryColor.value)
  document.documentElement.style.setProperty('--primary-hover', hoverColor.value)

  localStorage.setItem(
    'custom-primary-colors',
    JSON.stringify({
      primary: primaryColor.value,
      hover: hoverColor.value,
    }),
  )
}

function resetColors() {
  primaryColor.value = '#3B82F6'
  hoverColor.value = '#2563EB'
  applyColors()
}
</script>

<template>
  <div class="settings-page bg-main">
    <div class="settings-wrapper">
      <div class="settings-header">
        <h1 class="text-primary">Settings</h1>
        <p class="text-secondary">Personalize your workspace</p>
      </div>

      <div class="settings-content">
        <div class="settings-card bg-card">
          <div class="card-header">
            <div class="card-icon">
              <CloudMoonRain size="32" />
            </div>
            <div>
              <h2 class="text-primary">Brand Colors</h2>
              <p class="text-secondary">Customize your primary and hover colors</p>
            </div>
          </div>

          <div class="color-preview-section">
            <div class="color-preview-item">
              <label class="text-secondary">Primary Color</label>
              <div class="color-display">
                <div class="color-circle" :style="{ backgroundColor: primaryColor }"></div>
                <span class="color-code text-primary">{{ primaryColor }}</span>
              </div>
            </div>

            <div class="color-preview-item">
              <label class="text-secondary">Hover Color</label>
              <div class="color-display">
                <div class="color-circle" :style="{ backgroundColor: hoverColor }"></div>
                <span class="color-code text-primary">{{ hoverColor }}</span>
              </div>
            </div>
          </div>
          <div class="preview-section bg-main">
            <p class="text-secondary preview-label">Preview</p>
            <div class="preview-buttons">
              <button
                class="preview-btn"
                :style="{ backgroundColor: primaryColor, color: 'white' }"
              >
                Primary Button
              </button>
              <button
                class="preview-btn hover-demo"
                :style="{ backgroundColor: primaryColor, color: 'white' }"
                @mouseenter="(e) => (e.target.style.backgroundColor = hoverColor)"
                @mouseleave="(e) => (e.target.style.backgroundColor = primaryColor)"
              >
                Hover Me
              </button>
            </div>
          </div>
          <div class="section-divider">
            <label class="section-label text-secondary">Quick Presets</label>
          </div>

          <div class="preset-grid">
            <button
              v-for="set in colorSets"
              :key="set.name"
              class="preset-button"
              :class="{ active: primaryColor === set.primary }"
              @click="selectColorSet(set)"
            >
              <div class="preset-colors">
                <div class="preset-color" :style="{ backgroundColor: set.primary }"></div>
                <div class="preset-color small" :style="{ backgroundColor: set.hover }"></div>
              </div>
              <span class="preset-name text-secondary">{{ set.name }}</span>
            </button>
          </div>

          <div class="action-buttons">
            <button class="btn-secondary text-secondary" @click="resetColors">
              <span>↺</span> Reset Colors
            </button>
          </div>
        </div>
        <div class="settings-card bg-card">
          <CategoryManager @update-categories="handleCategoryUpdate" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  min-height: 100vh;
}

.settings-wrapper {
  width: 95%;
  margin: 0 auto;
}

.settings-header {
  margin-bottom: 32px;
}

.settings-header h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 5px;
}

.settings-header p {
  font-size: 16px;
  margin: 0;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.settings-card {
  border-radius: 16px;
  padding: 24px 32px;
  border: 1px solid var(--color-border);
}

@media (max-width: 768px) {
  .settings-card {
    padding: 24px 20px;
  }
}

.card-header {
  display: flex;
  gap: 16px;
  margin-bottom: 28px;
  align-items: flex-start;
}

.card-icon {
  line-height: 1;
}

.card-header h2 {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.card-header p {
  font-size: 14px;
  margin: 0;
  opacity: 0.8;
}

.color-preview-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 600px) {
  .color-preview-section {
    grid-template-columns: 1fr;
  }
}

.color-preview-item label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
}

.color-display {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: var(--bg-main);
  border-radius: 10px;
  border: 1px solid var(--color-border);
}

.color-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.color-code {
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: 600;
}

.section-divider {
  margin: 24px 0 16px 0;
}

.section-label {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.8px;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 12px;
  margin-bottom: 28px;
}

@media (max-width: 600px) {
  .preset-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.preset-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  background: var(--bg-main);
  border: 2px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preset-button:hover {
  border-color: var(--primary-color);
  background: var(--bg-hover);
}

.preset-button.active {
  border-color: var(--primary-color);
  background: var(--bg-hover);
}

.preset-colors {
  display: flex;
  gap: 5px;
  align-items: flex-end;
}

.preset-color {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 2px solid rgba(0, 0, 0, 0.1);
}

.preset-color.small {
  width: 24px;
  height: 24px;
}

.preset-name {
  font-size: 12px;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
}

.btn-secondary {
  padding: 12px 20px;
  background: var(--bg-main);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-secondary:hover {
  background: var(--bg-hover);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.preview-section {
  padding: 10px 20px;
  margin-top: 20px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
}

.preview-label {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.8px;
  margin: 0 0 14px 0;
}

.preview-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.preview-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
</style>
