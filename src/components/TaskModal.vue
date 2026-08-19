<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { Task, TaskPriority } from '../types/task'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [task: Task]
}>()

const title = ref('')
const description = ref('')
const priority = ref<TaskPriority>('medium')
const titleError = ref('')
const titleInput = ref<HTMLInputElement | null>(null)

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

function close() {
  isOpen.value = false
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

function resetForm() {
  title.value = ''
  description.value = ''
  priority.value = 'medium'
  titleError.value = ''
}

function submitForm() {
  if (!title.value.trim()) {
    titleError.value = '标题不能为空'
    titleInput.value?.focus()
    return
  }

  emit('submit', {
    id: `task-${Date.now()}`,
    title: title.value.trim(),
    description: description.value.trim(),
    status: 'todo',
    priority: priority.value,
    dueDate: '',
    createdAt: new Date().toISOString(),
  })
  close()
}

watch(isOpen, async (open) => {
  if (open) {
    resetForm()
    await nextTick()
    titleInput.value?.focus()
  }
})

watch(title, () => {
  if (title.value.trim()) titleError.value = ''
})

watch(isOpen, (open, wasOpen) => {
  if (open && !wasOpen) window.addEventListener('keydown', handleEscape)
  if (!open && wasOpen) window.removeEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => window.removeEventListener('keydown', handleEscape))
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/45 px-0 py-0 dark:bg-black/60 sm:items-center sm:px-4 sm:py-6"
      role="presentation"
      @click.self="close"
    >
      <Transition
        enter-active-class="transform transition duration-300 ease-out"
        enter-from-class="translate-y-full sm:translate-y-4 sm:opacity-0"
        enter-to-class="translate-y-0 sm:opacity-100"
        leave-active-class="transform transition duration-200 ease-in"
        leave-from-class="translate-y-0 sm:opacity-100"
        leave-to-class="translate-y-full sm:translate-y-4 sm:opacity-0"
      >
        <form
          class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl dark:bg-slate-900 sm:rounded-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="task-modal-title"
          @submit.prevent="submitForm"
        >
        <div class="mb-6 flex items-center justify-between">
          <h2 id="task-modal-title" class="font-display text-xl font-semibold text-slate-900 dark:text-slate-100">新建任务</h2>
          <button
            type="button"
            class="flex h-11 w-11 items-center justify-center rounded-md text-xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="关闭弹窗"
            @click="close"
          >&times;</button>
        </div>

        <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300" for="task-title">标题</label>
        <input
          id="task-title"
          ref="titleInput"
          v-model="title"
          type="text"
          class="mt-2 w-full rounded-lg border px-3 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-indigo-950"
          :class="titleError ? 'border-red-500' : 'border-slate-200'"
          placeholder="输入任务标题"
          :aria-invalid="Boolean(titleError)"
          aria-describedby="task-title-error"
        />
        <p v-if="titleError" id="task-title-error" class="mt-1.5 text-sm text-red-600">{{ titleError }}</p>

        <label class="mt-5 block text-sm font-semibold text-slate-700 dark:text-slate-300" for="task-description">描述</label>
        <textarea
          id="task-description"
          v-model="description"
          rows="3"
          class="mt-2 w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-indigo-950"
          placeholder="补充任务详情（选填）"
        />

        <label class="mt-5 block text-sm font-semibold text-slate-700 dark:text-slate-300" for="task-priority">优先级</label>
        <select
          id="task-priority"
          v-model="priority"
          class="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-indigo-950"
        >
          <option value="low">低</option>
          <option value="medium">中</option>
          <option value="high">高</option>
        </select>

        <div class="mt-7 flex justify-end gap-3">
          <button type="button" class="min-h-11 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" @click="close">取消</button>
          <button type="submit" class="min-h-11 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400">创建任务</button>
        </div>
        </form>
      </Transition>
    </div>
  </Teleport>
</template>