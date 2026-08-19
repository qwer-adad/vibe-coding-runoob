import { reactive, watch } from 'vue'
import type { Task } from '../types/task'
import { loadTasks, saveTasks } from '../utils/storage'

const sampleTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Design the onboarding flow',
    description: 'Map the first-time experience and identify key touchpoints.',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-08-22',
    createdAt: '2026-08-15',
  },
  {
    id: 'task-2',
    title: 'Set up analytics dashboard',
    description: 'Create a lightweight dashboard for weekly product signals.',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-08-25',
    createdAt: '2026-08-16',
  },
  {
    id: 'task-3',
    title: 'Review visual language',
    description: 'Check spacing, color contrast, and component consistency.',
    status: 'todo',
    priority: 'low',
    dueDate: '2026-08-18',
    createdAt: '2026-08-12',
  },
]

const storedTasks = loadTasks()
export const tasks = reactive<Task[]>(storedTasks.length ? storedTasks : sampleTasks)

if (!storedTasks.length) saveTasks(tasks)

watch(tasks, (currentTasks) => saveTasks(currentTasks), { deep: true })

export function addTask(task: Task) {
  tasks.unshift(task)
}

export function updateTask(taskId: string, updates: Partial<Task>) {
  const task = tasks.find((currentTask) => currentTask.id === taskId)
  if (task) Object.assign(task, updates)
}

export function deleteTask(taskId: string) {
  const taskIndex = tasks.findIndex((currentTask) => currentTask.id === taskId)
  if (taskIndex !== -1) tasks.splice(taskIndex, 1)
}