<script setup>
import { onMounted, ref } from 'vue'

const THEME_KEY = 'vibe-coding-runoob-theme'
const isDark = ref(false)

function applyTheme(dark) {
  isDark.value = dark
  document.documentElement.classList.toggle('dark', dark)
}

function toggleTheme() {
  const nextThemeIsDark = !isDark.value
  applyTheme(nextThemeIsDark)
  localStorage.setItem(THEME_KEY, nextThemeIsDark ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem(THEME_KEY)
  const followsSystem = savedTheme === null
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  applyTheme(followsSystem ? systemPrefersDark : savedTheme === 'dark')
})
</script>

<template>
  <button
    type="button"
    class="flex h-11 w-11 items-center justify-center rounded-lg text-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
    :aria-label="isDark ? '切换到亮色模式' : '切换到深色模式'"
    :title="isDark ? '亮色模式' : '深色模式'"
    @click="toggleTheme"
  >
    <span aria-hidden="true">{{ isDark ? '☀' : '☾' }}</span>
  </button>
</template>