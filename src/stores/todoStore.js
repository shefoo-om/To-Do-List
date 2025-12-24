import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTodoStore = defineStore('todoStore', () => {
  const weeks = ref([])
  const days = ref([])
  const tasks = ref([])
  const currentWeekIndex = ref(0)

  const getStartOfWeek = (date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  }

  const formatDate = (date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']
    const d = new Date(date)
    return `${months[d.getMonth()]} ${d.getDate()}`
  }

  const getISODate = (date) => {
    return new Date(date).toISOString().split('T')[0]
  }

  const getCurrentDay = computed(() => {
    const today = new Date()
    const todayISO = getISODate(today)

    // eslint-disable-next-line no-unused-vars
    const _ = tasks.value.length
    return days.value.find(day => day.fullDate === todayISO) || null
  })

  const generateWeekData = (weekId, weekNumber, startDate) => {
    const weekDays = []
    const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startDate)
      currentDay.setDate(startDate.getDate() + i)

      weekDays.push({
        id: (weekId - 1) * 7 + i + 1,
        name: dayNames[i],
        date: formatDate(currentDay),
        fullDate: getISODate(currentDay),
        weekId: weekId
      })
    }

    const endOfWeek = new Date(startDate)
    endOfWeek.setDate(startDate.getDate() + 6)

    const week = {
      id: weekId,
      name: `Week ${weekNumber}`,
      customName: null, // New field for custom week names
      weekNumber: weekNumber,
      startDate: getISODate(startDate),
      endDate: getISODate(endOfWeek),
      dateRange: `${formatDate(startDate)} - ${formatDate(endOfWeek)}, ${startDate.getFullYear()}`
    }

    return { week, weekDays }
  }

  const findWeekByDateRange = (startDate) => {
    const isoDate = getISODate(startDate)
    return weeks.value.find(w => w.startDate === isoDate)
  }

  const generateCurrentWeek = () => {
    const today = new Date()
    const startOfWeek = getStartOfWeek(today)
    return generateWeekData(1, 1, startOfWeek)
  }

  const goToNextWeek = (fromWeekId = null) => {
    const currentWeek = fromWeekId
      ? weeks.value.find(w => w.id === fromWeekId)
      : weeks.value[currentWeekIndex.value]

    if (!currentWeek) {
      console.error('Current week not found')
      return null
    }

    const nextWeekStart = new Date(currentWeek.startDate)
    nextWeekStart.setDate(nextWeekStart.getDate() + 7)

    const existingWeek = findWeekByDateRange(nextWeekStart)
    if (existingWeek) {
      setCurrentWeekById(existingWeek.id)
      return { week: existingWeek, isNew: false }
    }

    const newWeekId = Math.max(...weeks.value.map(w => w.id), 0) + 1
    const newWeekNumber = currentWeek.weekNumber + 1

    const { week, weekDays } = generateWeekData(newWeekId, newWeekNumber, nextWeekStart)

    weeks.value.push(week)
    days.value.push(...weekDays)

    setCurrentWeekById(newWeekId)
    saveToLocalStorage()

    return { week, isNew: true }
  }

  const goToPreviousWeek = (fromWeekId = null) => {
    const currentWeek = fromWeekId
      ? weeks.value.find(w => w.id === fromWeekId)
      : weeks.value[currentWeekIndex.value]

    if (!currentWeek || currentWeek.weekNumber === 1) {
      return currentWeek
    }

    const prevWeekStart = new Date(currentWeek.startDate)
    prevWeekStart.setDate(prevWeekStart.getDate() - 7)

    const existingWeek = findWeekByDateRange(prevWeekStart)
    if (existingWeek) {
      setCurrentWeekById(existingWeek.id)
      return existingWeek
    }

    const newWeekId = Math.max(...weeks.value.map(w => w.id), 0) + 1
    const newWeekNumber = currentWeek.weekNumber - 1

    const { week, weekDays } = generateWeekData(newWeekId, newWeekNumber, prevWeekStart)

    weeks.value.unshift(week)
    days.value.unshift(...weekDays)
    currentWeekIndex.value++

    saveToLocalStorage()
    return week
  }

  const canGoPrevious = computed(() => {
    const currentWeek = weeks.value[currentWeekIndex.value]
    return currentWeek && currentWeek.weekNumber > 1
  })

  const getCurrentWeekByDate = computed(() => {
    const today = new Date()
    const todayISO = getISODate(today)

    return weeks.value.find(week => {
      return todayISO >= week.startDate && todayISO <= week.endDate
    }) || weeks.value[0] || null
  })

  const getCurrentWeekDaysByDate = computed(() => {
    const currentWeek = getCurrentWeekByDate.value
    if (!currentWeek) return []
    return days.value.filter(day => day.weekId === currentWeek.id)
  })

  const getWeekTaskCountByDate = computed(() => {
    const currentWeek = getCurrentWeekByDate.value
    if (!currentWeek) return 0

    const weekDays = days.value.filter(d => d.weekId === currentWeek.id)
    const weekDayIds = weekDays.map(d => d.id)
    const weekTasks = tasks.value.filter(task => weekDayIds.includes(task.dayId))

    return weekTasks.length
  })

  const setCurrentWeekById = (weekId) => {
    const index = weeks.value.findIndex(w => w.id === weekId)
    if (index !== -1) {
      currentWeekIndex.value = index
      saveToLocalStorage()
    }
  }

  // New function to update week name
  const updateWeekName = (weekId, newName) => {
    const week = weeks.value.find(w => w.id === weekId)
    if (week) {
      week.customName = newName
      saveToLocalStorage()
      return true
    }
    return false
  }

  const getWeekDisplayName = (week) => {
    return week.customName || week.name
  }

  const loadFromLocalStorage = () => {
    try {
      const storedTasks = localStorage.getItem('todoTasks')
      const storedDays = localStorage.getItem('todoDays')
      const storedWeeks = localStorage.getItem('todoWeeks')
      const storedWeekIndex = localStorage.getItem('todoCurrentWeekIndex')

      if (storedTasks) tasks.value = JSON.parse(storedTasks)
      if (storedDays) days.value = JSON.parse(storedDays)
      if (storedWeeks) weeks.value = JSON.parse(storedWeeks)
      if (storedWeekIndex) currentWeekIndex.value = parseInt(storedWeekIndex)

      return !!(storedTasks || storedDays || storedWeeks)
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      return false
    }
  }

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('todoTasks', JSON.stringify(tasks.value))
      localStorage.setItem('todoDays', JSON.stringify(days.value))
      localStorage.setItem('todoWeeks', JSON.stringify(weeks.value))
      localStorage.setItem('todoCurrentWeekIndex', currentWeekIndex.value.toString())
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  const initializeStore = () => {
    const hasStoredData = loadFromLocalStorage()

    if (!hasStoredData) {
      const { week, weekDays } = generateCurrentWeek()
      weeks.value = [week]
      days.value = weekDays
      tasks.value = []
      currentWeekIndex.value = 0
      saveToLocalStorage()
    }
  }

  const getTaskCountsForDay = (dayId) => {
    const dayTasks = tasks.value.filter(task => task.dayId === dayId)
    return {
      todo: dayTasks.filter(task => task.status === 'todo').length,
      doing: dayTasks.filter(task => task.status === 'doing').length,
      done: dayTasks.filter(task => task.status === 'done').length,
      total: dayTasks.length
    }
  }

  const getCurrentWeek = computed(() => {
    return weeks.value[currentWeekIndex.value] || null
  })

  const getCurrentWeekDays = computed(() => {
    const currentWeek = weeks.value[currentWeekIndex.value]
    if (!currentWeek) return []
    return days.value.filter(day => day.weekId === currentWeek.id)
  })

  const getWeekById = (weekId) => {
    return weeks.value.find(w => w.id === weekId) || null
  }

  const getWeekDays = (weekId) => {
    return days.value.filter(day => day.weekId === weekId)
  }

  const getWeekTaskCount = computed(() => {
    const currentWeek = weeks.value[currentWeekIndex.value]
    if (!currentWeek) return 0

    const weekDays = days.value.filter(d => d.weekId === currentWeek.id)
    const weekDayIds = weekDays.map(d => d.id)
    const weekTasks = tasks.value.filter(task => weekDayIds.includes(task.dayId))

    return weekTasks.length
  })

  const getTaskCountForWeek = (weekId) => {
    const weekDays = days.value.filter(d => d.weekId === weekId)
    const weekDayIds = weekDays.map(d => d.id)
    return tasks.value.filter(task => weekDayIds.includes(task.dayId)).length
  }

  const getTaskWithDay = (taskId) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (!task) return null

    const day = days.value.find(d => d.id === task.dayId)
    return {
      ...task,
      dayName: day?.name || '',
      dayDate: day?.date || '',
      fullDate: day?.fullDate || ''
    }
  }

  const addTask = (taskData) => {
    const now = new Date()
    const day = days.value.find(d => d.id === taskData.dayId)
    const taskDate = day ? day.fullDate : getISODate(now)

    const newTask = {
      id: Math.max(...tasks.value.map(t => t.id), 0) + 1,
      status: 'todo',
      dayId: taskData.dayId || 1,
      date: taskDate,
      ...taskData,
      history: [
        {
          action: 'created',
          status: taskData.status || 'todo',
          timestamp: now.toISOString(),
          user: 'current_user'
        }
      ]
    }
    tasks.value.push(newTask)
    saveToLocalStorage()
    return newTask
  }

  const updateTask = (taskId, updates) => {
    const taskIndex = tasks.value.findIndex(task => task.id === taskId)
    if (taskIndex !== -1) {
      const oldTask = tasks.value[taskIndex]
      const newHistory = [...(oldTask.history || [])]

      if (updates.status && updates.status !== oldTask.status) {
        newHistory.push({
          action: 'status_changed',
          status: updates.status,
          previousStatus: oldTask.status,
          timestamp: new Date().toISOString()
        })
      }

      if (Object.keys(updates).some(key => key !== 'status' && updates[key] !== oldTask[key])) {
        const changes = Object.keys(updates)
          .filter(key => key !== 'status' && updates[key] !== oldTask[key])
          .reduce((acc, key) => {
            acc[key] = { old: oldTask[key], new: updates[key] }
            return acc
          }, {})

        if (Object.keys(changes).length > 0) {
          newHistory.push({
            action: 'updated',
            changes,
            timestamp: new Date().toISOString()
          })
        }
      }

      tasks.value[taskIndex] = {
        ...oldTask,
        ...updates,
        history: newHistory
      }
      saveToLocalStorage()
    }
  }

  const deleteTask = (taskId) => {
    const taskIndex = tasks.value.findIndex(task => task.id === taskId)
    if (taskIndex !== -1) {
      tasks.value.splice(taskIndex, 1)
      saveToLocalStorage()
    }
  }

  const getTaskHistory = (taskId) => {
    const task = tasks.value.find(t => t.id === taskId)
    return task?.history || []
  }

  const clearAllData = () => {
    tasks.value = []
    days.value = []
    weeks.value = []
    currentWeekIndex.value = 0
    localStorage.removeItem('todoTasks')
    localStorage.removeItem('todoDays')
    localStorage.removeItem('todoWeeks')
    localStorage.removeItem('todoCurrentWeekIndex')
  }

  return {
    weeks,
    days,
    tasks,
    currentWeekIndex,

    getCurrentWeek,
    getCurrentWeekDays,
    getWeekTaskCount,
    getWeekById,
    getWeekDays,
    getTaskCountForWeek,
    canGoPrevious,
    getCurrentWeekByDate,
    getCurrentWeekDaysByDate,
    getWeekTaskCountByDate,
    getCurrentDay,
    getWeekDisplayName,

    initializeStore,
    goToPreviousWeek,
    goToNextWeek,
    setCurrentWeekById,
    getTaskCountsForDay,
    getTaskWithDay,
    addTask,
    updateTask,
    updateWeekName,
    deleteTask,
    getTaskHistory,
    clearAllData,
  }
})
