<template>
  <div class="login-page">
    <Card class="login-card">
      <template #title>
        <div class="card-title">
          <span class="brand">{{ t('common.appName') }}</span>
          <span class="subtitle">{{ t('login.subtitle') }}</span>
        </div>
      </template>
      <template #content>
        <form class="login-form" @submit.prevent="onSubmit">
          <div class="field">
            <label :for="`username`">{{ t('common.labels.username') }}</label>
            <InputText
              id="username"
              v-model="form.username"
              class="w-full"
              autocomplete="username"
              :placeholder="t('common.placeholders.username')"
              :aria-label="t('common.labels.username')"
              required
            />
          </div>
          <div class="field">
            <label :for="`password`">{{ t('common.labels.password') }}</label>
            <Password
              id="password"
              v-model="form.password"
              class="w-full"
              toggle-mask
              :feedback="false"
              input-class="w-full"
              autocomplete="current-password"
              :placeholder="t('common.placeholders.password')"
              :aria-label="t('common.labels.password')"
              required
            />
          </div>
          <Button
            type="submit"
            :label="t('common.actions.login')"
            icon="pi pi-sign-in"
            class="w-full primary-button"
            :loading="userStore.loading"
          />
          <small v-if="userStore.error" class="error">{{ t(userStore.error) }}</small>
        </form>
        <Divider class="divider" />
        <div class="access-links">
          <Button
            :label="t('login.buttons.tracking')"
            icon="pi pi-search"
            class="w-full secondary-button"
            @click="goTracking"
          />
          <Button
            :label="t('login.buttons.deliveryAccess')"
            icon="pi pi-send"
            class="w-full ghost-button"
            @click="goDelivery"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import { useUserStore } from '../../../user/application/user.store.js'

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

const form = reactive({
  username: '',
  password: '',
})

async function onSubmit() {
  try {
    await userStore.login({ ...form })
    router.push({ name: 'admin-dashboard' })
  } catch (error) {
    console.error(error)
  }
}

function goTracking() {
  router.push({ name: 'public-tracking' })
}

function goDelivery() {
  router.push({ name: 'delivery-login' })
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem;
  background-color: #1e1e1e;
  background-image: radial-gradient(circle at 20% 20%, rgba(255, 140, 50, 0.25), transparent 55%),
    radial-gradient(circle at 80% 0%, rgba(255, 140, 50, 0.15), transparent 45%);
}

.login-card :deep(.p-card-body) {
  padding: 2.5rem;
}

.login-card {
  width: min(420px, 100%);
  background: linear-gradient(160deg, rgba(30, 30, 30, 0.95), rgba(18, 18, 18, 0.9));
  border: 1px solid rgba(255, 140, 50, 0.4);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45);
  color: #f5f5f5;
  backdrop-filter: blur(10px);
}

.card-title {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.brand {
  font-size: 1.75rem;
  font-weight: 700;
  color: #ff8c32;
}

.subtitle {
  font-size: 0.95rem;
  color: #f5f5f5;
  opacity: 0.8;
}

.login-form {
  display: grid;
  gap: 1.5rem;
}

.field {
  display: grid;
  gap: 0.5rem;
}

.field label {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(245, 245, 245, 0.85);
}

.field :deep(.p-inputtext),
.field :deep(.p-password-input) {
  background-color: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 140, 50, 0.35);
  color: #f5f5f5;
  padding: 0.85rem 1rem;
}

.field :deep(.p-inputtext::placeholder),
.field :deep(input::placeholder) {
  color: rgba(245, 245, 245, 0.45);
}

.divider {
  border-color: rgba(255, 255, 255, 0.08);
}

.access-links {
  display: grid;
  gap: 0.75rem;
}

.error {
  color: #ff6b6b;
  font-size: 0.85rem;
  text-align: center;
}

@media (max-width: 480px) {
  .login-card :deep(.p-card-body) {
    padding: 2rem;
  }

  .brand {
    font-size: 1.5rem;
  }
}
</style>
