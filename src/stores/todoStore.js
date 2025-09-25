import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTodoStore = defineStore('todoStore', () => {
  const weeks = ref([])
  const days = ref([])
  const tasks = ref([])

  const initializeMockData = () => {
    const mockTasks = [
      { id: 1, name: 'Review project requirements', status: 'todo', category: 'work', dayId: 1, date: '2024-01-15' },
      { id: 2, name: 'Update documentation', status: 'todo', category: 'work', dayId: 1, date: '2024-01-15' },
      { id: 3, name: 'Team meeting preparation', status: 'doing', category: 'work', dayId: 1, date: '2024-01-15' },
      { id: 4, name: 'Code review', status: 'doing', category: 'work', dayId: 1, date: '2024-01-15' },
      { id: 5, name: 'Fix bug #123', status: 'done', category: 'work', dayId: 1, date: '2024-01-15' },

      { id: 6, name: 'Design mockups', status: 'todo', category: 'design', dayId: 2, date: '2024-01-16' },
      { id: 7, name: 'Client presentation', status: 'todo', category: 'work', dayId: 2, date: '2024-01-16' },
      { id: 8, name: 'Database optimization', status: 'doing', category: 'work', dayId: 2, date: '2024-01-16' },
      { id: 9, name: 'Write unit tests', status: 'done', category: 'work', dayId: 2, date: '2024-01-16' },
      { id: 10, name: 'Deploy to staging', status: 'done', category: 'work', dayId: 2, date: '2024-01-16' },

      { id: 11, name: 'Market research', status: 'todo', category: 'research', dayId: 3, date: '2024-01-17' },
      { id: 12, name: 'User interviews', status: 'doing', category: 'research', dayId: 3, date: '2024-01-17' },
      { id: 13, name: 'Feature planning', status: 'done', category: 'planning', dayId: 3, date: '2024-01-17' },

      { id: 14, name: 'API integration', status: 'todo', category: 'work', dayId: 4, date: '2024-01-18' },
      { id: 15, name: 'Performance testing', status: 'todo', category: 'work', dayId: 4, date: '2024-01-18' },
      { id: 16, name: 'Security audit', status: 'doing', category: 'work', dayId: 4, date: '2024-01-18' },
      { id: 17, name: 'Backup systems', status: 'done', category: 'work', dayId: 4, date: '2024-01-18' },

      { id: 18, name: 'Weekly report', status: 'todo', category: 'admin', dayId: 5, date: '2024-01-19' },
      { id: 19, name: 'Team retrospective', status: 'doing', category: 'work', dayId: 5, date: '2024-01-19' },
      { id: 20, name: 'Sprint planning', status: 'done', category: 'planning', dayId: 5, date: '2024-01-19' },

      { id: 21, name: 'Personal project', status: 'todo', category: 'personal', dayId: 6, date: '2024-01-20' },
      { id: 22, name: 'Learn new technology', status: 'doing', category: 'learning', dayId: 6, date: '2024-01-20' },

      { id: 23, name: 'Week planning', status: 'todo', category: 'planning', dayId: 7, date: '2024-01-21' },
      { id: 24, name: 'Rest and recharge', status: 'done', category: 'personal', dayId: 7, date: '2024-01-21' }
    ]

    const mockDays = [
      {
        id: 1,
        name: 'MON',
        date: 'Jan 15',
        fullDate: '2024-01-15',
        weekId: 1
      },
      {
        id: 2,
        name: 'TUE',
        date: 'Jan 16',
        fullDate: '2024-01-16',
        weekId: 1
      },
      {
        id: 3,
        name: 'WED',
        date: 'Jan 17',
        fullDate: '2024-01-17',
        weekId: 1
      },
      {
        id: 4,
        name: 'THU',
        date: 'Jan 18',
        fullDate: '2024-01-18',
        weekId: 1
      },
      {
        id: 5,
        name: 'FRI',
        date: 'Jan 19',
        fullDate: '2024-01-19',
        weekId: 1
      },
      {
        id: 6,
        name: 'SAT',
        date: 'Jan 20',
        fullDate: '2024-01-20',
        weekId: 1
      },
      {
        id: 7,
        name: 'SUN',
        date: 'Jan 21',
        fullDate: '2024-01-21',
        weekId: 1
      }
    ]

    const mockWeeks = [
      {
        id: 1,
        name: 'Sprint Week 1',
        startDate: '2024-01-15',
        endDate: '2024-01-21',
        dateRange: 'January 15 - 21, 2024'
      }
    ]

    tasks.value = mockTasks
    days.value = mockDays
    weeks.value = mockWeeks
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
    return weeks.value.find(week => week.id === 1) || null
  })

  const getCurrentWeekDays = computed(() => {
    return days.value.filter(day => day.weekId === 1)
  })

  const getWeekTaskCount = computed(() => {
    const weekTasks = tasks.value.filter(task => {
      const day = days.value.find(d => d.id === task.dayId)
      return day && day.weekId === 1
    })
    return weekTasks.length
  })

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
    const newTask = {
      id: Math.max(...tasks.value.map(t => t.id), 0) + 1,
      ...taskData
    }
    tasks.value.push(newTask)
  }

  const updateTask = (taskId, updates) => {
    const taskIndex = tasks.value.findIndex(task => task.id === taskId)
    if (taskIndex !== -1) {
      tasks.value[taskIndex] = { ...tasks.value[taskIndex], ...updates }
    }
  }

  const deleteTask = (taskId) => {
    const taskIndex = tasks.value.findIndex(task => task.id === taskId)
    if (taskIndex !== -1) {
      tasks.value.splice(taskIndex, 1)
    }
  }

  const updateWeekName = (weekId, newName) => {
    const weekIndex = weeks.value.findIndex(week => week.id === weekId)
    if (weekIndex !== -1) {
      weeks.value[weekIndex].name = newName
    }
  }

  return {
    weeks,
    days,
    tasks,

    getCurrentWeek,
    getCurrentWeekDays,
    getWeekTaskCount,

    initializeMockData,
    getTaskCountsForDay,
    getTaskWithDay,
    addTask,
    updateTask,
    deleteTask,
    updateWeekName
  }
})
