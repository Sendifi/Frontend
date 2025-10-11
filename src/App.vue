<template>
  <div class="app-shell">
    <LanguageSwitcher />
    <RouterView />
    <Toast />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: var(--surface-ground);
}
</style>
