<template>
  <div class="tracking-page view-container">
    <Card class="tracking-card app-card">
      <template #title>{{ t('tracking.title') }}</template>
      <template #content>
        <form class="tracking-form" @submit.prevent="handleSearch">
          <span class="p-input-icon-left w-full">
            <i class="pi pi-search" />
            <InputText
              v-model="trackingCode"
              :placeholder="t('common.placeholders.trackingCode')"
              class="w-full"
              :aria-label="t('common.placeholders.trackingCode')"
            />
          </span>
          <Button
            type="submit"
            :label="t('common.actions.search')"
            icon="pi pi-arrow-right"
            class="primary-button"
            :loading="store.loading"
          />
        </form>
        <small v-if="store.error" class="error-text">{{ t(store.error) }}</small>
        <div v-if="store.trackingInfo" class="tracking-result">
          <h3>{{ store.trackingInfo.shipment.trackingCode }}</h3>
          <div class="status-wrapper">
            <span class="status-label">
              {{ t('tracking.statusLabel') }}:
              {{ statusLabel(store.trackingInfo.shipment.status) }}
            </span>
            <ProgressBar :value="store.trackingInfo.progress" />
          </div>
          <p>{{ store.trackingInfo.currentStatusDescription || t('tracking.noUpdates') }}</p>

          <section class="shipment-info">
            <div>
              <h4>{{ t('tracking.sender') }}</h4>
              <p>{{ store.trackingInfo.shipment.sender.name }}</p>
              <small>{{ store.trackingInfo.shipment.sender.email }}</small>
            </div>
            <div>
              <h4>{{ t('tracking.recipient') }}</h4>
              <p>{{ store.trackingInfo.shipment.recipient.name }}</p>
              <small>{{ store.trackingInfo.shipment.recipient.email }}</small>
            </div>
            <div>
              <h4>{{ t('tracking.destination') }}</h4>
              <p>{{ formatAddress(store.trackingInfo.shipment.destinationAddress) }}</p>
            </div>
          </section>

          <Timeline :value="timeline" class="mt-4">
            <template #marker="slotProps">
              <span
                class="custom-marker"
                :class="{
                  delivered: slotProps.item.status === 'DELIVERED',
                  inTransit: slotProps.item.status === 'IN_TRANSIT',
                }"
              >
                <i :class="slotProps.item.icon"></i>
              </span>
            </template>
            <template #content="slotProps">
              <Card class="timeline-card app-card">
                <template #title>{{ slotProps.item.description }}</template>
                <template #subtitle>{{ formatDate(slotProps.item.timestamp) }} - {{ slotProps.item.location }}</template>
                <template #content>
                  <Tag :value="statusLabel(slotProps.item.status)" :severity="getStatusSeverity(slotProps.item.status)" />
                </template>
              </Card>
            </template>
          </Timeline>
        </div>
        <Button
          :label="t('common.actions.backToLogin')"
          icon="pi pi-home"
          class="w-full ghost-button"
          @click="goLogin"
        />
      </template>
    </Card>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import ProgressBar from 'primevue/progressbar'
import Timeline from 'primevue/timeline'
import Tag from 'primevue/tag'
import { usePublicStore } from '../../application/public.store.js'
import { formatDate } from '../../../core/utils/dateUtils.js'

const router = useRouter()
const store = usePublicStore()
const trackingCode = ref('')
const { t } = useI18n()

const timeline = computed(() =>
  store.trackingInfo?.events.map((event) => ({
    ...event,
    icon: event.status === 'DELIVERED' ? 'pi pi-check' : 'pi pi-send',
  })) ?? [],
)

const statusLabel = (status) => {
  const key = `common.status.${status}`
  const translated = t(key)
  return translated === key ? status : translated
}

function formatAddress(address) {
  if (!address) return ''
  return `${address.street}, ${address.city}, ${address.country}`
}

async function handleSearch() {
  if (!trackingCode.value) return
  await store.getTrackingByCode(trackingCode.value)
}

function getStatusSeverity(status) {
  switch (status) {
    case 'DELIVERED':
      return 'success'
    case 'IN_TRANSIT':
      return 'info'
    case 'PENDING':
      return 'warning'
    default:
      return 'secondary'
  }
}

function goLogin() {
  store.reset()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.tracking-page {
  flex: 1;
  align-items: center;
  justify-content: center;
}

.tracking-card {
  width: min(780px, 100%);
  margin: 0 auto;
}

.tracking-card :deep(.p-card-title) {
  font-size: 1.25rem;
  color: #ffffff;
}

.tracking-form {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.02);
  padding: 1.25rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 140, 50, 0.18);
}

.tracking-form :deep(.p-inputtext) {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 140, 50, 0.35);
  color: #f5f5f5;
  padding: 0.85rem 1rem;
}

.tracking-form :deep(.p-input-icon-left > i) {
  color: rgba(255, 255, 255, 0.45);
}

.tracking-result {
  margin-top: 2rem;
  display: grid;
  gap: 1.5rem;
}

.tracking-result h3 {
  font-size: 1.6rem;
  font-weight: 600;
  color: #ffffff;
}

.tracking-result p {
  color: var(--app-text-muted);
}

.status-wrapper {
  display: grid;
  gap: 0.5rem;
}

.status-label {
  color: var(--app-text-muted);
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.shipment-info {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.shipment-info h4 {
  margin-bottom: 0.35rem;
  color: var(--app-primary-soft);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.shipment-info p,
.shipment-info small {
  color: #f5f5f5;
}

:deep(.p-progressbar) {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  height: 0.85rem;
}

:deep(.p-progressbar .p-progressbar-value) {
  background: linear-gradient(135deg, #ff8c32, #ff6f3c);
  border-radius: 999px;
}

.timeline-card {
  width: 100%;
}

.timeline-card :deep(.p-card-body) {
  padding: 1rem 1.25rem;
}

.custom-marker {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: rgba(255, 140, 50, 0.35);
  color: #fff;
  border: 1px solid rgba(255, 140, 50, 0.6);
}

.custom-marker.delivered {
  background: rgba(76, 220, 151, 0.25);
  border-color: rgba(76, 220, 151, 0.65);
}

.custom-marker.inTransit {
  background: rgba(96, 165, 250, 0.25);
  border-color: rgba(96, 165, 250, 0.6);
}

.error-text {
  color: #ff7b7b;
  margin-top: 0.5rem;
  display: block;
}
</style>
