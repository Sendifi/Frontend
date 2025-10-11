<template>
  <div class="delivery-create view-container">
    <Card class="app-card">
      <template #title>{{ t('delivery.create.title') }}</template>
      <template #content>
        <form class="delivery-form app-form" @submit.prevent="submit">
          <span class="p-float-label">
            <InputText
              id="name"
              v-model="form.name"
              class="w-full"
              required
              :placeholder="t('common.placeholders.courierName')"
              :aria-label="t('common.labels.name')"
            />
            <label for="name">{{ t('common.labels.name') }}</label>
          </span>
          <span class="p-float-label">
            <InputText
              id="phone"
              v-model="form.phone"
              class="w-full"
              :placeholder="t('common.placeholders.courierPhone')"
              :aria-label="t('common.labels.phone')"
            />
            <label for="phone">{{ t('common.labels.phone') }}</label>
          </span>
          <span class="p-float-label">
            <InputText
              id="code"
              v-model="form.code"
              class="w-full"
              :placeholder="t('common.placeholders.courierCode')"
              :aria-label="t('common.labels.courierCode')"
            />
            <label for="code">{{ t('common.labels.courierCode') }} ({{ t('common.labels.optional') }})</label>
          </span>
          <div class="actions">
            <Button
              type="button"
              :label="t('common.actions.cancel')"
              icon="pi pi-arrow-left"
              class="ghost-button"
              @click="goBack"
            />
            <Button
              type="submit"
              :label="t('common.actions.createCourier')"
              icon="pi pi-save"
              class="primary-button"
              :loading="deliveryStore.loading"
            />
          </div>
        </form>
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
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { useDeliveryStore } from '../../application/delivery.store.js'

const router = useRouter()
const toast = useToast()
const deliveryStore = useDeliveryStore()
const { t } = useI18n()

const form = reactive({
  name: '',
  phone: '',
  code: '',
})

async function submit() {
  await deliveryStore.createDeliveryPerson({ ...form })
  toast.add({ severity: 'success', summary: t('common.actions.createCourier'), detail: t('toast.courierCreated'), life: 2000 })
  router.push({ name: 'delivery-management' })
}

function goBack() {
  router.back()
}
</script>

<style scoped>
.delivery-create {
  align-items: center;
  justify-content: center;
  padding: 2.5rem;
}

.app-card :deep(.p-card-body) {
  padding: 2.5rem;
}

.delivery-form {
  display: grid;
  gap: 1.5rem;
  width: min(420px, 100%);
}

.delivery-form :deep(label) {
  color: rgba(245, 245, 245, 0.8);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.actions .primary-button,
.actions .ghost-button {
  min-width: 160px;
}
</style>
