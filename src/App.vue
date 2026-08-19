<script setup>
import { computed, ref } from 'vue'
import KanbanBoard from './components/KanbanBoard.vue'
import TaskList from './components/TaskList.vue'
import TaskModal from './components/TaskModal.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { addTask, deleteTask, tasks, updateTask } from './stores/taskStore'

const isTaskModalOpen = ref(false)
const activeView = ref<'list' | 'kanban'>('list')
const isMobileMenuOpen = ref(false)

const inProgressCount = computed(() => tasks.filter((task) => task.status === 'in-progress').length)
const completedCount = computed(() => tasks.filter((task) => task.status === 'done').length)

function toggleTask(task) {
  updateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' })
}

function removeTask(task) {
  deleteTask(task.id)
}

function moveTask(task, status) {
  updateTask(task.id, { status })
}

function showListView() {
  activeView.value = 'list'
}

function showKanbanView() {
  activeView.value = 'kanban'
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
    <nav class="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8 lg:py-5">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-lg font-bold text-white">V</div>
          <span class="font-display text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">Vibe Coding Runoob</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">A calm place for focused work</span>
          <ThemeToggle />
          <button
            type="button"
            class="flex h-11 w-11 items-center justify-center rounded-lg text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 sm:hidden"
            :aria-expanded="isMobileMenuOpen"
            aria-controls="mobile-navigation"
            aria-label="打开导航菜单"
            @click="toggleMobileMenu"
          >
            <span aria-hidden="true">{{ isMobileMenuOpen ? '×' : '☰' }}</span>
          </button>
        </div>
      </div>
      <div v-if="isMobileMenuOpen" id="mobile-navigation" class="border-t border-slate-200 px-5 py-3 dark:border-slate-800 sm:hidden">
        <button type="button" class="min-h-11 w-full rounded-lg px-3 text-left text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" @click="closeMobileMenu">任务工作区</button>
      </div>
    </nav>

    <main class="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-14">
      <header class="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p class="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">Workspace</p>
          <h1 class="font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-100 sm:text-4xl">Task overview</h1>
          <p class="mt-2 text-slate-500 dark:text-slate-400">Keep the important things moving.</p>
        </div>
        <button
          type="button"
          class="min-h-11 w-fit rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          @click="isTaskModalOpen = true"
        >
          + New task
        </button>
      </header>

      <section class="mb-8 grid gap-4 sm:grid-cols-3">
        <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p class="text-sm text-slate-500 dark:text-slate-400">Total tasks</p>
          <p class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{{ tasks.length }}</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p class="text-sm text-slate-500 dark:text-slate-400">In progress</p>
          <p class="mt-2 text-2xl font-bold text-indigo-600">{{ inProgressCount }}</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p class="text-sm text-slate-500 dark:text-slate-400">Completed</p>
          <p class="mt-2 text-2xl font-bold text-emerald-600">{{ completedCount }}</p>
        </div>
      </section>

      <section class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">Your tasks</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Stay on top of your next steps.</p>
          </div>
          <div class="flex w-fit gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800" role="tablist" aria-label="任务视图">
            <button
              type="button"
              role="tab"
              :aria-selected="activeView === 'list'"
              class="min-h-11 rounded-md px-4 py-2 text-sm font-semibold transition"
              :class="activeView === 'list' ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-700 dark:text-indigo-300' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100'"
              @click="showListView"
            >
              列表
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="activeView === 'kanban'"
              class="min-h-11 rounded-md px-4 py-2 text-sm font-semibold transition"
              :class="activeView === 'kanban' ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-700 dark:text-indigo-300' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100'"
              @click="showKanbanView"
            >
              看板
            </button>
          </div>
        </div>
        <TaskList v-if="activeView === 'list'" :tasks="tasks" @toggle="toggleTask" @delete="removeTask" />
        <KanbanBoard v-else :tasks="tasks" @toggle="toggleTask" @delete="removeTask" @move="moveTask" />
      </section>
    </main>

    <TaskModal v-model="isTaskModalOpen" @submit="addTask" />
  </div>
</template>
