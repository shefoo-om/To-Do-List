import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTodoStore = defineStore('todoStore', () => {
  const weeks = ref([])
  const days = ref([])
  const tasks = ref([])

  const initializeMockData = () => {
    const mockTasks = [
      { id: 1, name: 'Review project requirements', status: 'todo', category: 'work', dayId: 1, date: '2024-01-15', history: [{ action: 'created', status: 'todo', timestamp: '2024-01-15T09:00:00Z' }] },
      { id: 2, name: 'Update documentation', status: 'todo', category: 'work', dayId: 1, date: '2024-01-15', history: [{ action: 'created', status: 'todo', timestamp: '2024-01-15T09:15:00Z' }] },
      { id: 3, name: 'Team meeting preparation', status: 'doing', category: 'work', dayId: 1, date: '2024-01-15', history: [{ action: 'created', status: 'todo', timestamp: '2024-01-15T09:30:00Z' }, { action: 'status_changed', status: 'doing', timestamp: '2024-01-15T10:00:00Z' }] },
      { id: 4, name: 'Code review', status: 'doing', category: 'work', dayId: 1, date: '2024-01-15', history: [{ action: 'created', status: 'todo', timestamp: '2024-01-15T09:45:00Z' }, { action: 'status_changed', status: 'doing', timestamp: '2024-01-15T11:00:00Z' }] },
      { id: 5, name: 'Fix bug #123', status: 'done', category: 'work', dayId: 1, date: '2024-01-15', history: [{ action: 'created', status: 'todo', timestamp: '2024-01-15T08:00:00Z' }, { action: 'status_changed', status: 'doing', timestamp: '2024-01-15T08:30:00Z' }, { action: 'status_changed', status: 'done', timestamp: '2024-01-15T12:00:00Z' }] },

      { id: 6, name: 'Design mockups', status: 'todo', category: 'design', dayId: 2, date: '2024-01-16', history: [{ action: 'created', status: 'todo', timestamp: '2024-01-16T09:00:00Z' }] },
      { id: 7, name: 'Client presentation', status: 'todo', category: 'work', dayId: 2, date: '2024-01-16', history: [{ action: 'created', status: 'todo', timestamp: '2024-01-16T09:30:00Z' }] },
      { id: 8, name: 'Database optimization', status: 'doing', category: 'work', dayId: 2, date: '2024-01-16', history: [{ action: 'created', status: 'todo', timestamp: '2024-01-16T10:00:00Z' }, { action: 'status_changed', status: 'doing', timestamp: '2024-01-16T11:00:00Z' }] },
      { id: 9, name: 'Write unit tests', status: 'done', category: 'work', dayId: 2, date: '2024-01-16', history: [{ action: 'created', status: 'todo', timestamp: '2024-01-16T08:00:00Z' }, { action: 'status_changed', status: 'doing', timestamp: '2024-01-16T09:00:00Z' }, { action: 'status_changed', status: 'done', timestamp: '2024-01-16T14:00:00Z' }] },
      { id: 10, name: 'Deploy to staging', status: 'done', category: 'work', dayId: 2, date: '2024-01-16', history: [{ action: 'created', status: 'todo', timestamp: '2024-01-16T13:00:00Z' }, { action: 'status_changed', status: 'doing', timestamp: '2024-01-16T13:30:00Z' }, { action: 'status_changed', status: 'done', timestamp: '2024-01-16T15:00:00Z' }] },

      { id: 11, name: 'Market research', status: 'todo', category: 'research', dayId: 3, date: '2024-01-17', history: [{ action: 'created', status: 'todo', timestamp: '2024-01-17T09:00:00Z' }] },
      { id: 12, name: 'User interviews', status: 'doing', category: 'research', dayId: 3, date: '2024-01-17', history: [{ action: 'created', status: 'todo', timestamp: '2024-01-17T10:00:00Z' }, { action: 'status_changed', status: 'doing', timestamp: '2024-01-17T11:00:00Z' }] },
      { id: 13, name: 'Feature planning', status: 'done', category: 'planning', dayId: 3, date: '2024-01-17', history: [{ action: 'created', status: 'todo', timestamp: '2024-01-17T08:00:00Z' }, { action: 'status_changed', status: 'doing', timestamp: '2024-01-17T09:00:00Z' }, { action: 'status_changed', status: 'done', timestamp: '2024-01-17T12:00:00Z' }] },

      { id: 14, name: 'API integration', status: 'todo', category: 'work', dayId: 4, date: '2024-01-18', history: [{ action: 'created', status: 'todo', timestamp: '2024-01-18T09:00:00Z' }] },
      { id: 15, name: 'Performance testing', status: 'todo', category: 'work', dayId: 4, date: '2024-01-18', history: [{ action: 'created', status: 'todo', timestamp: '2024-01-18T10:00:00Z' }] },
      { id: 16, name: 'Security audit', status: 'doing', category: 'work', dayId: 4, date: '2024-01-18', history: [{ action: 'created', status: 'todo', timestamp: '2024-01-18T08:00:00Z' }, { action: 'status_changed', status: 'doing', timestamp: '2024-01-18T09:00:00Z' }] },
      { id: 17, name: 'Backup systems', status: 'done', category: 'work', dayId: 4, date: '2024-01-18', history: [{ action: 'created', status: 'todo', timestamp: '2024-01-18T07:00:00Z' }, { action: 'status_changed', status: 'doing', timestamp: '2024-01-18T08:00:00Z' }, { action: 'status_changed', status: 'done', timestamp: '2024-01-18T13:00:00Z' }] },

      { id: 18, name: 'Weekly report', status: 'todo', category: 'admin', dayId: 5, date: '2024-01-19', history: [{ action: 'created', status: 'todo', timestamp: '2024-01-19T09:00:00Z' }] },
      { id: 19, name: 'Team retrospective', status: 'doing', category: 'work', dayId: 5, date: '2024-01-19', history: [{ action: 'created', status: 'todo', timestamp: '2024-01-19T10:00:00Z' }, { action: 'status_changed', status: 'doing', timestamp: '2024-01-19T14:00:00Z' }] },
      { id: 20, name: 'Sprint planning', status: 'done', category: 'planning', dayId: 5, date: '2024-01-19', history: [{ action: 'created', status: 'todo', timestamp: '2024-01-19T08:00:00Z' }, { action: 'status_changed', status: 'doing', timestamp: '2024-01-19T09:00:00Z' }, { action: 'status_changed', status: 'done', timestamp: '2024-01-19T11:00:00Z' }] },

      { id: 21, name: 'Personal project', status: 'todo', category: 'personal', dayId: 6, date: '2024-01-20', history: [{ action: 'created', status: 'todo', timestamp: '2024-01-20T10:00:00Z' }] },
      { id: 22, name: 'Learn new technology', status: 'doing', category: 'learning', dayId: 6, date: '2024-01-20', history: [{ action: 'created', status: 'todo', timestamp: '2024-01-20T11:00:00Z' }, { action: 'status_changed', status: 'doing', timestamp: '2024-01-20T12:00:00Z' }] },

      { id: 23, name: 'Week planning', status: 'todo', category: 'planning', dayId: 7, date: '2024-01-21', history: [{ action: 'created', status: 'todo', timestamp: '2024-01-21T09:00:00Z' }] },
      { id: 24, name: 'Rest and recharge', status: 'done', category: 'personal', dayId: 7, date: '2024-01-21', history: [{ action: 'created', status: 'todo', timestamp: '2024-01-21T10:00:00Z' }, { action: 'status_changed', status: 'done', timestamp: '2024-01-21T18:00:00Z' }] }
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
    const now = new Date()
    const currentDate = now.toISOString().split('T')[0]

    const newTask = {
      id: Math.max(...tasks.value.map(t => t.id), 0) + 1,
      status: 'todo',
      dayId: 1,
      date: currentDate,
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
    }
  }

  const deleteTask = (taskId) => {
    const taskIndex = tasks.value.findIndex(task => task.id === taskId)
    if (taskIndex !== -1) {
      tasks.value.splice(taskIndex, 1)
    }
  }

  const getTaskHistory = (taskId) => {
    const task = tasks.value.find(t => t.id === taskId)
    return task?.history || []
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
    getTaskHistory,
  }
})
