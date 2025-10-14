import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: 'light',
    availableThemes: [
      {
        id: 'light',
        name: 'Light',
        preview: '#FFFFFF',
        description: 'Clean and bright'
      },
      {
        id: 'dark',
        name: 'Dark',
        preview: '#1F2937',
        description: 'Easy on the eyes'
      },
      {
        id: 'blue',
        name: 'Ocean Blue',
        preview: '#EFF6FF',
        description: 'Calm and focused'
      },
      {
        id: 'green',
        name: 'Forest Green',
        preview: '#ECFDF5',
        description: 'Natural and fresh'
      },
      {
        id: 'purple',
        name: 'Royal Purple',
        preview: '#F3E8FF',
        description: 'Creative and unique'
      }
    ],
    customColors: {
      primary: '#3B82F6',
      background: '#FFFFFF',
      text: '#1F2937'
    }
  }),

  getters: {
    getCurrentTheme: (state) => {
      return state.availableThemes.find(theme => theme.id === state.currentTheme)
    },

    isDark: (state) => {
      return state.currentTheme === 'dark'
    }
  },

  actions: {
    setTheme(themeId) {
      this.currentTheme = themeId

      document.documentElement.setAttribute('data-theme', themeId)

      localStorage.setItem('user-theme', themeId)

      console.log(`Theme changed to: ${themeId}`)
    },

    loadTheme() {
      const savedTheme = localStorage.getItem('user-theme')

      if (savedTheme && this.availableThemes.find(theme => theme.id === savedTheme)) {
        this.setTheme(savedTheme)
      } else {
        this.setTheme('light')
      }
    },

    toggleTheme() {
      // Quick toggle between light and dark
      const newTheme = this.currentTheme === 'light' ? 'dark' : 'light'
      this.setTheme(newTheme)
    },

    setCustomColor(colorType, colorValue) {
      this.customColors[colorType] = colorValue

      document.documentElement.style.setProperty(`--${colorType}-color`, colorValue)

      localStorage.setItem('custom-colors', JSON.stringify(this.customColors))
    },

    loadCustomColors() {
      const savedColors = localStorage.getItem('custom-colors')
      if (savedColors) {
        try {
          this.customColors = JSON.parse(savedColors)

          Object.entries(this.customColors).forEach(([colorType, colorValue]) => {
            document.documentElement.style.setProperty(`--${colorType}-color`, colorValue)
          })
        } catch (error) {
          console.error('Failed to load custom colors:', error)
        }
      }
    },

    resetToDefault() {
      this.setTheme('light')
      this.customColors = {
        primary: '#3B82F6',
        background: '#FFFFFF',
        text: '#1F2937'
      }

      document.documentElement.style.removeProperty('--primary-color')
      document.documentElement.style.removeProperty('--background-color')
      document.documentElement.style.removeProperty('--text-color')

      localStorage.removeItem('custom-colors')
    }
  }
})
