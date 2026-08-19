<script setup lang="ts">
import type { Task } from '../types/task'

defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  toggle: []
  delete: []
}>()

const priorityLabel: Record<Task['priority'], string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

const priorityBorder: Record<Task['priority'], string> = {
  high: 'border-l-red-500',
  medium: 'border-l-yellow-400',
  low: 'border-l-green-500',
}
</script>

<template>
  <article
    class="relative rounded-xl border border-slate-200 border-l-4 bg-white p-5 shadow-sm transition-transform duration-200 hover:scale-[1.02] dark:border-slate-700 dark:bg-slate-800"
    :class="priorityBorder[task.priority]"
  >
    <button
      type="button"
      class="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-md text-xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-100"
      aria-label="Delete task"
      @click="emit('delete')"
    >
      <span aria-hidden="true">&times;</span>
    </button>

    <div class="flex items-start gap-3 pr-8">
      <input
        :checked="task.status === 'done'"
        type="checkbox"
        class="mt-1 h-4 w-4 shrink-0 accent-indigo-600"
        :aria-label="`Mark ${task.title} as complete`"
        @change="emit('toggle')"
      />
      <div class="min-w-0">
        <h3
          class="font-semibold text-slate-900 dark:text-slate-100"
          :class="task.status === 'done' ? 'text-slate-400 line-through dark:text-slate-500' : ''"
        >
          {{ task.title }}
        </h3>
        <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{ task.description }}</p>
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between gap-3 pl-7 text-xs font-semibold">
      <span class="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
        {{ priorityLabel[task.priority] }} priority
      </span>
      <time class="text-slate-400 dark:text-slate-500" :datetime="task.dueDate">Due {{ task.dueDate }}</time>
    </div>
  </article>
</template>