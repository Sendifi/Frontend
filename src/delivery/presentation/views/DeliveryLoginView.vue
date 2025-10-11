<template>
  <div class="delivery-login-page view-container">
    <Card class="delivery-login-card app-card">
      <template #title>{{ t('delivery.login.title') }}</template>
      <template #content>
        <form class="delivery-login-form" @submit.prevent="handleLogin">
          <span class="p-float-label">
            <InputText
              id="code"
              v-model="code"
              autocomplete="off"
              required
              class="w-full"
              :placeholder="t('common.placeholders.courierCode')"
              :aria-label="t('delivery.login.codeLabel')"
            />
            <label for="code">{{ t('delivery.login.codeLabel') }}</label>
          </span>
          <Button
            type="submit"
            :label="t('common.actions.login')"
            icon="pi pi-send"
            :loading="deliveryStore.loading"
            class="w-full primary-button"
          />
          <small v-if="deliveryStore.error" class="error">{{ t(deliveryStore.error) }}</small>
        </form>
        <Divider />
        <Button
          :label="t('common.actions.back')"
          icon="pi pi-arrow-left"
          class="w-full ghost-button"
          @click="goBack"
        />
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import { useDeliveryStore } from '../../application/delivery.store.js'

const deliveryStore = useDeliveryStore()
const router = useRouter()
const code = ref('')
const { t } = useI18n()

async function handleLogin() {
  try {
    await deliveryStore.getDeliveryPersonByCode(code.value)
    await deliveryStore.getAssignedShipments(deliveryStore.currentDeliveryPerson?.id)
    router.push({ name: 'delivery-dashboard' })
  } catch (error) {
    console.error(error)
  }
}

function goBack() {
  router.push({ name: 'login' })
}
</script>

<style scoped>
.delivery-login-page {
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 2.5rem;
  background-image: radial-gradient(circle at 20% 15%, rgba(255, 140, 50, 0.22), transparent 55%),
    radial-gradient(circle at 80% 0%, rgba(255, 140, 50, 0.18), transparent 45%);
}

.delivery-login-card {
  width: min(420px, 100%);
}

.delivery-login-card :deep(.p-card-body) {
  padding: 2.5rem;
}

.delivery-login-card :deep(.p-card-title) {
  font-size: 1.35rem;
  color: #ffffff;
}

.delivery-login-form {
  display: grid;
  gap: 1.25rem;
}

.delivery-login-form :deep(.p-inputtext) {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 140, 50, 0.35);
  color: #f5f5f5;
  padding: 0.85rem 1rem;
}

.delivery-login-form :deep(.p-inputtext::placeholder) {
  color: rgba(245, 245, 245, 0.45);
}

.delivery-login-form :deep(label) {
  color: rgba(245, 245, 245, 0.8);
}

.error {
  color: #ff7b7b;
  font-size: 0.85rem;
  text-align: center;
}
</style>
