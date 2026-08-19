import type { Task } from '../types/task'

const STORAGE_KEY = 'vibe-coding-runoob-tasks'

export function saveTasks(tasks: Task[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // Storage may be unavailable in private browsing or restricted environments.
  }
}

export function loadTasks(): Task[] {
  try {
    const storedTasks = localStorage.getItem(STORAGE_KEY)
    if (!storedTasks) return []

    const parsedTasks = JSON.parse(storedTasks)
    return Array.isArray(parsedTasks) ? parsedTasks : []
  } catch {
    return []
  }
}