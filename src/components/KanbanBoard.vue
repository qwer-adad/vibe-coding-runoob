<script setup lang="ts">
import { computed, ref } from 'vue'
import TaskCard from './TaskCard.vue'
import type { Task, TaskStatus } from '../types/task'

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  toggle: [task: Task]
  delete: [task: Task]
  move: [task: Task, status: TaskStatus]
}>()

const columns: Array<{ status: TaskStatus; title: string; color: string }> = [
  { status: 'todo', title: '待办', color: 'bg-slate-400' },
  { status: 'in-progress', title: '进行中', color: 'bg-indigo-500' },
  { status: 'done', title: '已完成', color: 'bg-emerald-500' },
]

const draggedTaskId = ref<string | null>(null)
const activeDropColumn = ref<TaskStatus | null>(null)

const tasksByStatus = computed(() => (status: TaskStatus) =>
  [...props.tasks]
    .filter((task) => task.status === status)
    .sort((firstTask, secondTask) =>
      new Date(secondTask.createdAt).getTime() - new Date(firstTask.createdAt).getTime(),
    ),
)

function handleDragStart(event: DragEvent, task: Task) {
  draggedTaskId.value = task.id
  event.dataTransfer?.setData('text/plain', task.id)
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}

function handleDragEnd() {
  draggedTaskId.value = null
  activeDropColumn.value = null
}

function handleDragOver(event: DragEvent, status: TaskStatus) {
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
  activeDropColumn.value = status
}

function handleDrop(event: DragEvent, status: TaskStatus) {
  event.preventDefault()
  const taskId = event.dataTransfer?.getData('text/plain') || draggedTaskId.value
  const task = props.tasks.find((currentTask) => currentTask.id === taskId)

  if (task && task.status !== status) emit('move', task, status)
  handleDragEnd()
}
</script>

<template>
  <section class="grid grid-cols-1 gap-5 lg:grid-cols-3">
    <div
      v-for="column in columns"
      :key="column.status"
      class="min-h-96 rounded-xl bg-slate-100/80 p-4 transition-colors dark:bg-slate-800/80"
      :class="activeDropColumn === column.status ? 'bg-indigo-50 ring-2 ring-inset ring-indigo-300 dark:bg-indigo-950/50 dark:ring-indigo-700' : ''"
      @dragover="handleDragOver($event, column.status)"
      @drop="handleDrop($event, column.status)"
    >
      <div class="mb-4 flex items-center justify-between">
        <h3 class="flex items-center gap-2 font-display font-semibold text-slate-800 dark:text-slate-100">
          <span class="h-2.5 w-2.5 rounded-full" :class="column.color"></span>
          {{ column.title }}
        </h3>
        <span class="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
          {{ tasksByStatus(column.status).length }}
        </span>
      </div>

      <div class="grid min-h-72 content-start gap-3">
        <div
          v-for="task in tasksByStatus(column.status)"
          :key="task.id"
          draggable="true"
          class="transition-opacity"
          :class="draggedTaskId === task.id ? 'opacity-50' : ''"
          @dragstart="handleDragStart($event, task)"
          @dragend="handleDragEnd"
        >
          <TaskCard :task="task" @toggle="emit('toggle', task)" @delete="emit('delete', task)" />
        </div>
      </div>
    </div>
  </section>
</template>