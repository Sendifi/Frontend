<template>
  <div class="delivery-dashboard view-container">
    <Card class="app-card">
      <template #title>
        <div class="header">
          <div>
            <h2>{{ deliveryStore.currentDeliveryPerson?.name }}</h2>
            <small>{{ t('delivery.dashboard.codeLabel') }}: {{ deliveryStore.currentDeliveryPerson?.code }}</small>
          </div>
          <div class="actions">
            <Button
              :label="t('common.actions.logout')"
              icon="pi pi-sign-out"
              class="ghost-button"
              @click="logout"
            />
          </div>
        </div>
      </template>
      <template #content>
        <DataTable
          :value="deliveryStore.assignedShipments"
          :loading="deliveryStore.loading"
          data-key="id"
          responsive-layout="scroll"
          :empty-message="t('delivery.dashboard.empty')"
        >
          <Column field="trackingCode" :header="t('delivery.dashboard.columns.tracking')" />
          <Column :header="t('delivery.dashboard.columns.origin')">
            <template #body="{ data }">
              {{ formatAddress(data.originAddress) }}
            </template>
          </Column>
          <Column :header="t('delivery.dashboard.columns.destination')">
            <template #body="{ data }">
              {{ formatAddress(data.destinationAddress) }}
            </template>
          </Column>
          <Column :header="t('delivery.dashboard.columns.recipient')">
            <template #body="{ data }">
              <strong>{{ data.recipient.name }}</strong>
              <div class="muted">{{ data.destinationAddress.city }}, {{ data.destinationAddress.country }}</div>
            </template>
          </Column>
          <Column field="estimatedDelivery" :header="t('delivery.dashboard.columns.estimatedDelivery')">
            <template #body="{ data }">
              {{ formatDateOnly(data.estimatedDelivery) }}
            </template>
          </Column>
          <Column field="status" :header="t('delivery.dashboard.columns.status')">
            <template #body="{ data }">
              <Tag :value="statusLabel(data.status)" :severity="getStatusSeverity(data.status)" />
            </template>
          </Column>
          <Column :header="t('delivery.dashboard.columns.actions')">
            <template #body="{ data }">
              <Button
              :label="t('common.actions.confirmDelivery')"
              icon="pi pi-check"
              class="primary-button"
              size="small"
              :disabled="['DELIVERED', 'CANCELLED'].includes(data.status)"
              @click="confirmDelivery(data.id)"
            />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import { useDeliveryStore } from '../../application/delivery.store.js'
import { formatDateOnly } from '../../../core/utils/dateUtils.js'

const deliveryStore = useDeliveryStore()
const router = useRouter()
const { t } = useI18n()

onMounted(async () => {
  if (!deliveryStore.currentDeliveryPerson) {
    router.push({ name: 'delivery-login' })
    return
  }
  await deliveryStore.getAssignedShipments(deliveryStore.currentDeliveryPerson.id)
})

async function confirmDelivery(shipmentId) {
  await deliveryStore.markDelivered(shipmentId)
  await deliveryStore.getAssignedShipments(deliveryStore.currentDeliveryPerson.id)
}

function logout() {
  deliveryStore.currentDeliveryPerson = null
  deliveryStore.assignedShipments = []
  router.push({ name: 'delivery-login' })
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

function formatAddress(address) {
  if (!address) return ''
  const parts = [address.street, address.city, address.state, address.country].filter(Boolean)
  return parts.join(', ')
}
</script>

<style scoped>
.delivery-dashboard {
  gap: 2rem;
}

.app-card :deep(.p-card-body) {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 140, 50, 0.2);
}

.header h2 {
  margin: 0;
  color: #ffffff;
}

.header small {
  color: var(--app-text-muted);
  font-size: 0.95rem;
}

.actions {
  display: flex;
  gap: 0.75rem;
}

:deep(.p-datatable) {
  background: transparent;
  color: #f5f5f5;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--app-text-muted);
  border: none;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  background-color: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: rgba(255, 140, 50, 0.08);
}

:deep(.p-tag) {
  background: rgba(255, 140, 50, 0.18);
  color: #ff8c32;
  border: 1px solid rgba(255, 140, 50, 0.35);
}

.muted {
  color: var(--app-text-muted);
  font-size: 0.85rem;
}
</style>
