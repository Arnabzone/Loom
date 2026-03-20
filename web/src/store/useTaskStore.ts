import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '@/src/services/api'
import type { ApiResponse, Task, TaskListPayload, TaskStatus } from '@/src/types'
import { useNotificationStore } from './useNotificationStore'

interface CreateTaskInput {
  title: string
  description: string
  status: TaskStatus
  priority: 'low' | 'medium' | 'high'
  dueDate: string | null
}

interface TaskState {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  setTasks: (tasks: Task[]) => void
  fetchTasks: (params?: { page?: number; limit?: number; status?: TaskStatus; search?: string }) => Promise<void>
  addTask: (task: CreateTaskInput) => Promise<void>
  updateTask: (id: string, updatedTask: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  moveTask: (id: string, newStatus: TaskStatus) => Promise<void>
  reorderTask: (activeId: string, overId: string, newStatus?: TaskStatus) => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      isLoading: false,
      error: null,
      setTasks: (tasks) => set({ tasks }),
      fetchTasks: async (params) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.get<ApiResponse<TaskListPayload>>('/tasks', {
            params: {
              page: params?.page ?? 1,
              limit: params?.limit ?? 100,
              status: params?.status,
              search: params?.search,
            },
          })

          set({ tasks: response.data.data.items, isLoading: false })
        } catch (error) {
          set({ isLoading: false, error: 'Failed to load tasks' })
          throw error
        }
      },
      addTask: async (task) => {
        const response = await api.post<ApiResponse<Task>>('/tasks', task)
        set((state) => ({ tasks: [response.data.data, ...state.tasks] }))
        useNotificationStore.getState().addNotification({
          title: 'New Task Created',
          description: `"${response.data.data.title}" has been added to your tasks.`,
          time: 'Just now'
        })
      },
      updateTask: async (id, updatedTask) => {
        const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}`, updatedTask)
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? response.data.data : task)),
        }))
      },
      deleteTask: async (id) => {
        const task = get().tasks.find((item) => item.id === id)
        await api.delete(`/tasks/${id}`)
        set((state) => ({
          tasks: state.tasks.filter((item) => item.id !== id),
        }))

        if (task) {
          useNotificationStore.getState().addNotification({
            title: 'Task Deleted',
            description: `"${task.title}" was removed.`,
            time: 'Just now'
          })
        }
      },
      moveTask: async (id, newStatus) => {
        const currentTask = get().tasks.find((task) => task.id === id)
        const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}`, { status: newStatus })
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? response.data.data : task)),
        }))

        if (currentTask && currentTask.status !== 'done' && newStatus === 'done') {
          useNotificationStore.getState().addNotification({
            title: 'Task Completed!',
            description: `You finished "${currentTask.title}". Great job!`,
            time: 'Just now'
          })
        }
      },
      reorderTask: (activeId, overId, newStatus) =>
        set((state) => {
          const oldIndex = state.tasks.findIndex((task) => task.id === activeId)
          const newIndex = state.tasks.findIndex((task) => task.id === overId)

          if (oldIndex === -1) return state

          const newTasks = [...state.tasks]
          const [movedTask] = newTasks.splice(oldIndex, 1)

          if (newStatus) {
            movedTask.status = newStatus
          }

          if (newIndex !== -1) {
            newTasks.splice(newIndex, 0, movedTask)
          } else {
            newTasks.push(movedTask)
          }

          return { tasks: newTasks }
        }),
    }),
    {
      name: 'task-storage',
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
)
