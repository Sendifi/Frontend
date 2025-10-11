<template>
  <div class="language-switcher">
    <label class="language-label" :for="selectId">{{ t('common.language.label') }}</label>
    <select
      :id="selectId"
      class="language-select"
      v-model="selectedLocale"
      :aria-label="t('common.language.label')"
    >
      <option v-for="option in localeOptions" :key="option.value" :value="option.value">
        {{ t(option.labelKey) }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { LOCALE_STORAGE_KEY, SUPPORTED_LOCALES } from '../i18n.js'

const { locale, t } = useI18n()
const selectId = `language-switcher-${Math.random().toString(36).slice(2, 8)}`

const localeOptions = computed(() =>
  SUPPORTED_LOCALES.map((value) => ({
    value,
    labelKey: `common.language.${value}`,
  })),
)

const selectedLocale = computed({
  get: () => locale.value,
  set: (value) => {
    locale.value = value
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, value)
    }
  },
})
</script>

<style scoped>
.language-switcher {
  position: fixed;
  bottom: 1.25rem;
  right: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  background: rgba(30, 30, 30, 0.85);
  border: 1px solid rgba(255, 140, 50, 0.35);
  border-radius: 999px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35);
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.language-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(245, 245, 245, 0.75);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.language-select {
  appearance: none;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 140, 50, 0.35);
  border-radius: 999px;
  color: #f5f5f5;
  font-size: 0.85rem;
  padding: 0.35rem 1.5rem 0.35rem 0.75rem;
  cursor: pointer;
}

.language-select:focus {
  outline: none;
  border-color: rgba(255, 172, 82, 0.65);
  box-shadow: 0 0 0 1px rgba(30, 30, 30, 0.9), 0 0 0 4px rgba(255, 156, 70, 0.25);
}

@media (max-width: 768px) {
  .language-switcher {
    bottom: 0.75rem;
    right: 0.75rem;
  }

  .language-label {
    display: none;
  }
}
</style>
