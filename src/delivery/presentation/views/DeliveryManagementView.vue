<template>
  <div class="delivery-management view-container">
    <header class="header">
      <div>
        <h2>{{ t('delivery.management.title') }}</h2>
        <span class="muted">{{ t('delivery.management.subtitle') }}</span>
      </div>
      <Button
        :label="t('common.actions.newCourier')"
        icon="pi pi-user-plus"
        class="primary-button"
        @click="goCreate"
      />
    </header>

    <Card class="app-card">
      <template #title>{{ t('delivery.management.title') }}</template>
      <template #content>
        <DataTable :value="deliveryStore.deliveryPersons" :loading="deliveryStore.loading" data-key="id">
          <Column field="name" :header="t('delivery.management.table.name')" />
          <Column field="code" :header="t('delivery.management.table.code')" />
          <Column field="phone" :header="t('delivery.management.table.phone')" />
          <Column :header="t('delivery.management.table.assigned')">
            <template #body="{ data }">{{ data.assignedShipments.length }}</template>
          </Column>
          <Column :header="t('delivery.management.table.actions')">
            <template #body="{ data }">
              <div class="table-actions">
                <Button
                  icon="pi pi-eye"
                  class="ghost-button icon"
                  rounded
                  :aria-label="t('common.actions.view')"
                  @click="viewAssigned(data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="danger-button icon"
                  rounded
                  :aria-label="t('common.actions.delete')"
                  @click="remove(data.id)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Dialog
      v-model:visible="dialogVisible"
      modal
      :header="t('delivery.management.dialogTitle')"
      :style="{ width: '520px' }"
      class="app-dialog"
    >
      <ul v-if="selectedDelivery">
        <li v-for="shipmentId in selectedDelivery.assignedShipments" :key="shipmentId">
          {{ t('delivery.management.dialogItem', { id: shipmentId }) }}
        </li>
      </ul>
      <span v-else class="muted">{{ t('delivery.management.dialogEmpty') }}</span>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'
import { useDeliveryStore } from '../../application/delivery.store.js'

const router = useRouter()
const deliveryStore = useDeliveryStore()
const toast = useToast()
const dialogVisible = ref(false)
const selectedDelivery = ref(null)
const { t } = useI18n()

onMounted(() => {
  deliveryStore.fetchDeliveryPersons()
})

function goCreate() {
  router.push({ name: 'delivery-create' })
}

function viewAssigned(delivery) {
  selectedDelivery.value = delivery
  dialogVisible.value = true
}

async function remove(id) {
  await deliveryStore.deleteDeliveryPerson(id)
  toast.add({ severity: 'success', summary: t('common.actions.delete'), detail: t('toast.courierDeleted'), life: 2000 })
}
</script>

<style scoped>
.delivery-management {
  display: grid;
  gap: 1.75rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0 0 1rem;
  border-bottom: 1px solid rgba(255, 140, 50, 0.2);
}

.header h2 {
  margin: 0;
  color: #ffffff;
}

.muted {
  color: var(--app-text-muted);
}

.app-card :deep(.p-card-body) {
  padding: 2rem;
}

.app-card :deep(.p-card-title) {
  color: #ffffff;
  font-size: 1.25rem;
}

:deep(.p-datatable) {
  background: transparent;
  color: #f5f5f5;
}

:deep(.p-datatable-thead > tr > th) {
  background: rgba(255, 255, 255, 0.05) !important;
  color: var(--app-text-muted) !important;
  border: none !important;
}

:deep(.p-datatable-tbody > tr) {
  background: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

:deep(.p-datatable-tbody > tr:hover) {
  background: rgba(255, 140, 50, 0.08);
}

.table-actions {
  display: flex;
  gap: 0.5rem;
}

.icon {
  width: 2.5rem;
  height: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.app-dialog :deep(.p-dialog-content),
.app-dialog :deep(.p-dialog-header) {
  background: var(--app-card-bg);
  color: #f5f5f5;
}

ul {
  margin: 0;
  padding-left: 1rem;
  display: grid;
  gap: 0.5rem;
  color: #f5f5f5;
}
</style>
