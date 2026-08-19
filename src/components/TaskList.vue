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
}>()

const activeFilter = ref<'all' | TaskStatus>('all')

const filters: Array<{ id: 'all' | TaskStatus; label: string }> = [
  { id: 'all', label: '全部' },
  { id: 'todo', label: '待办' },
  { id: 'in-progress', label: '进行中' },
  { id: 'done', label: '完成' },
]

const visibleTasks = computed(() => {
  const filteredTasks = activeFilter.value === 'all'
    ? props.tasks
    : props.tasks.filter((task) => task.status === activeFilter.value)

  return [...filteredTasks].sort(
    (firstTask, secondTask) =>
      new Date(secondTask.createdAt).getTime() - new Date(firstTask.createdAt).getTime(),
  )
})
</script>

<template>
  <section>
    <div class="mb-5 flex flex-wrap gap-2" role="group" aria-label="按状态筛选任务">
      <button
        v-for="filter in filters"
        :key="filter.id"
        type="button"
        class="min-h-11 rounded-lg px-4 py-2 text-sm font-semibold transition"
        :class="activeFilter === filter.id
          ? 'bg-indigo-600 text-white shadow-sm dark:bg-indigo-500'
          : 'bg-white text-slate-500 ring-1 ring-inset ring-slate-200 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700 dark:hover:bg-slate-700 dark:hover:text-indigo-300'"
        :aria-pressed="activeFilter === filter.id"
        @click="activeFilter = filter.id"
      >
        {{ filter.label }}
      </button>
    </div>

    <div v-if="visibleTasks.length" class="grid gap-4">
      <TaskCard
        v-for="task in visibleTasks"
        :key="task.id"
        :task="task"
        @toggle="emit('toggle', task)"
        @delete="emit('delete', task)"
      />
    </div>
    <p
      v-else
      class="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
    >
      还没有任务，点击下方按钮创建第一个吧
    </p>
  </section>
</template>