<template>
  <div class="shipment-detail view-container" v-if="shipment">
    <div class="header">
      <div>
        <h2>{{ t('common.labels.trackingCode') }}: {{ shipment.trackingCode }}</h2>
        <Tag :value="statusLabel(shipment.status)" :severity="getStatusSeverity(shipment.status)" />
      </div>
      <div class="header-actions">
        <Dropdown
          v-model="statusSelection"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          :placeholder="t('shipment.detail.statusPlaceholder')"
        />
        <Button
          :label="t('shipment.detail.buttons.update')"
          icon="pi pi-refresh"
          class="primary-button"
          @click="updateStatus"
        />
        <Button
          :label="t('shipment.detail.buttons.back')"
          icon="pi pi-arrow-left"
          class="ghost-button"
          @click="goBack"
        />
      </div>
    </div>

    <div class="info-grid">
      <Card class="app-card info-card">
        <template #title>{{ t('shipment.detail.cards.sender') }}</template>
        <template #content>
          <strong>{{ shipment.sender.name }}</strong>
          <div>{{ shipment.sender.email }}</div>
          <div>{{ shipment.sender.phone }}</div>
        </template>
      </Card>
      <Card class="app-card info-card">
        <template #title>{{ t('shipment.detail.cards.recipient') }}</template>
        <template #content>
          <strong>{{ shipment.recipient.name }}</strong>
          <div>{{ shipment.recipient.email }}</div>
          <div>{{ shipment.recipient.phone }}</div>
        </template>
      </Card>
      <Card class="app-card info-card">
        <template #title>{{ t('shipment.detail.cards.origin') }}</template>
        <template #content>{{ formatAddress(shipment.originAddress) }}</template>
      </Card>
      <Card class="app-card info-card">
        <template #title>{{ t('shipment.detail.cards.destination') }}</template>
        <template #content>{{ formatAddress(shipment.destinationAddress) }}</template>
      </Card>
    </div>

    <Card class="app-card timeline-card">
      <template #title>{{ t('shipment.detail.timelineTitle') }}</template>
      <template #content>
        <Timeline :value="timeline">
          <template #marker="slotProps">
            <span class="marker" :class="slotProps.item.severity">
              <i :class="slotProps.item.icon" />
            </span>
          </template>
          <template #content="slotProps">
            <div class="timeline-entry">
              <strong>{{ slotProps.item.description }}</strong>
              <div class="muted">{{ formatDate(slotProps.item.timestamp) }} - {{ slotProps.item.location }}</div>
              <Tag :value="statusLabel(slotProps.item.status)" :severity="slotProps.item.severity" />
            </div>
          </template>
        </Timeline>
      </template>
    </Card>
  </div>
  <div v-else class="loading-state">
    <ProgressSpinner />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import Timeline from 'primevue/timeline'
import ProgressSpinner from 'primevue/progressspinner'
import { useShippingStore } from '../../application/shipping.store.js'
import { useTrackingStore } from '../../../tracking/application/tracking.store.js'
import { formatDate } from '../../../core/utils/dateUtils.js'

const route = useRoute()
const router = useRouter()
const shippingStore = useShippingStore()
const trackingStore = useTrackingStore()
const { t } = useI18n()

const shipmentId = route.params.id
const shipment = computed(() => shippingStore.selectedShipment)
const statusSelection = ref(null)

const statusOptions = computed(() => [
  { label: t('common.status.PENDING'), value: 'PENDING' },
  { label: t('common.status.IN_TRANSIT'), value: 'IN_TRANSIT' },
  { label: t('common.status.DELIVERED'), value: 'DELIVERED' },
  { label: t('common.status.CANCELLED'), value: 'CANCELLED' },
])

const timeline = computed(() =>
  trackingStore.events.map((event) => ({
    ...event,
    icon: event.status === 'DELIVERED' ? 'pi pi-check' : 'pi pi-circle',
    severity: getStatusSeverity(event.status),
  })),
)

onMounted(async () => {
  await shippingStore.fetchShipmentById(shipmentId)
  statusSelection.value = shipment.value?.status
  await trackingStore.fetchByShipmentId(shipmentId)
})

async function updateStatus() {
  if (!statusSelection.value) return
  await shippingStore.updateShipmentStatus({ shipmentId, status: statusSelection.value })
  await trackingStore.fetchByShipmentId(shipmentId)
}

function formatAddress(address) {
  return `${address.street}, ${address.city}, ${address.state}, ${address.country}`
}

function getStatusSeverity(status) {
  switch (status) {
    case 'DELIVERED':
      return 'success'
    case 'IN_TRANSIT':
      return 'info'
    case 'PENDING':
      return 'warning'
    case 'DELAYED':
      return 'warning'
    case 'CANCELLED':
      return 'danger'
    default:
      return 'secondary'
  }
}

function statusLabel(status) {
  const key = `common.status.${status}`
  const translated = t(key)
  return translated === key ? status : translated
}

function goBack() {
  router.back()
}
</script>

<style scoped>
.shipment-detail {
  display: grid;
  gap: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 140, 50, 0.2);
}

.header h2 {
  margin: 0;
  color: #ffffff;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
}

.info-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.info-card :deep(.p-card-body) {
  padding: 1.5rem;
}

.info-card :deep(.p-card-title) {
  color: var(--app-primary-soft);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.9rem;
}

.info-card :deep(.p-card-content) {
  display: grid;
  gap: 0.35rem;
  color: #f5f5f5;
}

.timeline-card :deep(.p-card-body) {
  padding: 1.75rem;
}

.timeline-entry {
  padding: 0.75rem 0;
}

.timeline-entry strong {
  color: #ffffff;
}

.marker {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border: 1px solid rgba(255, 140, 50, 0.45);
  background: rgba(255, 140, 50, 0.35);
}

.marker.success {
  background: rgba(76, 220, 151, 0.25);
  border-color: rgba(76, 220, 151, 0.6);
}

.marker.info {
  background: rgba(96, 165, 250, 0.25);
  border-color: rgba(96, 165, 250, 0.6);
}

.marker.warning {
  background: rgba(250, 204, 21, 0.25);
  border-color: rgba(250, 204, 21, 0.6);
}

.marker.danger {
  background: rgba(248, 113, 113, 0.25);
  border-color: rgba(248, 113, 113, 0.6);
}

.marker.secondary {
  background: rgba(148, 163, 184, 0.2);
  border-color: rgba(148, 163, 184, 0.45);
}

.muted {
  color: var(--app-text-muted);
  font-size: 0.85rem;
}

.loading-state {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
