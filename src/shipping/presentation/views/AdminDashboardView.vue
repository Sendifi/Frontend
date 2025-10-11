<template>
  <div class="admin-dashboard view-container">
    <header class="top-bar">
      <div>
        <h1>{{ t('admin.title') }}</h1>
        <span class="subtitle">{{ t('admin.subtitle') }}</span>
      </div>
      <div class="top-actions">
        <Button
          :label="t('common.actions.newShipment')"
          icon="pi pi-plus"
          class="primary-button"
          @click="goCreateShipment"
        />
        <Button
          :label="t('common.actions.newCourier')"
          icon="pi pi-user-plus"
          class="secondary-button"
          @click="goCreateDelivery"
        />
        <Button
          :label="t('common.actions.logout')"
          icon="pi pi-sign-out"
          class="ghost-button"
          @click="logout"
        />
      </div>
    </header>

    <section class="stats-grid">
      <Card class="app-card stat-card">
        <template #title>{{ t('admin.stats.total') }}</template>
        <template #content>
          <div class="stat-value">{{ shippingStore.stats.total }}</div>
        </template>
      </Card>
      <Card class="app-card stat-card">
        <template #title>{{ t('admin.stats.inTransit') }}</template>
        <template #content>
          <div class="stat-value">{{ shippingStore.stats.inTransit }}</div>
        </template>
      </Card>
      <Card class="app-card stat-card">
        <template #title>{{ t('admin.stats.delivered') }}</template>
        <template #content>
          <div class="stat-value">{{ shippingStore.stats.delivered }}</div>
        </template>
      </Card>
      <Card class="app-card stat-card">
        <template #title>{{ t('admin.stats.pending') }}</template>
        <template #content>
          <div class="stat-value">{{ shippingStore.stats.pending }}</div>
        </template>
      </Card>
    </section>

    <Card class="app-card table-card">
      <template #title>{{ t('admin.shipments.title') }}</template>
      <template #content>
        <div class="filters">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText
              v-model="filters.search"
              :placeholder="t('admin.shipments.searchPlaceholder')"
              @input="applyFilters"
            />
          </span>
          <Dropdown
            v-model="filters.status"
            :options="statusOptions"
            :placeholder="t('admin.shipments.filters.status')"
            option-label="label"
            option-value="value"
            show-clear
            @change="applyFilters"
          />
          <Dropdown
            v-model="filters.deliveryPersonId"
            :options="deliveryOptions"
            :placeholder="t('admin.shipments.filters.courier')"
            option-label="name"
            option-value="id"
            show-clear
            @change="applyFilters"
          />
        </div>
        <DataTable
          :value="filteredShipments"
          :loading="shippingStore.loading"
          paginator
          :rows="8"
          data-key="id"
          responsive-layout="scroll"
          :empty-message="t('common.messages.noData')"
        >
          <Column field="trackingCode" :header="t('admin.shipments.table.tracking')" />
          <Column :header="t('admin.shipments.table.sender')">
            <template #body="{ data }">
              <strong>{{ data.sender.name }}</strong>
              <div class="muted">{{ data.sender.email }}</div>
            </template>
          </Column>
          <Column :header="t('admin.shipments.table.recipient')">
            <template #body="{ data }">
              <strong>{{ data.recipient.name }}</strong>
              <div class="muted">{{ data.destinationAddress.city }}, {{ data.destinationAddress.country }}</div>
            </template>
          </Column>
          <Column field="status" :header="t('admin.shipments.table.status')">
            <template #body="{ data }">
              <Tag :value="statusLabel(data.status)" :severity="getStatusSeverity(data.status)" />
            </template>
          </Column>
          <Column :header="t('admin.shipments.table.courier')">
            <template #body="{ data }">
              {{ resolveDeliveryPerson(data.deliveryPersonId)?.name ?? t('admin.shipments.unassigned') }}
            </template>
          </Column>
          <Column :header="t('admin.shipments.table.actions')">
            <template #body="{ data }">
              <div class="table-actions">
                <Button
                  icon="pi pi-eye"
                  class="ghost-button icon"
                  rounded
                  :aria-label="t('common.actions.view')"
                  @click="goDetail(data)"
                />
                <Button
                  icon="pi pi-user"
                  class="secondary-button icon"
                  rounded
                  :aria-label="t('common.actions.assign')"
                  @click="openAssignDialog(data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="danger-button icon"
                  rounded
                  :aria-label="t('common.actions.delete')"
                  @click="removeShipment(data.id)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Dialog
      v-model:visible="assignDialogVisible"
      modal
      :header="t('admin.shipments.assignDialog.title')"
      :style="{ width: '420px' }"
      class="app-dialog"
    >
      <div class="assign-dialog">
        <span class="p-float-label w-full">
          <Dropdown
            id="delivery-person"
            v-model="selectedDeliveryPersonId"
            :options="deliveryStore.deliveryPersons"
            option-label="name"
            option-value="id"
            class="w-full"
          />
          <label for="delivery-person">{{ t('admin.shipments.assignDialog.label') }}</label>
        </span>
        <Button
          :label="t('admin.shipments.assignDialog.assign')"
          icon="pi pi-save"
          class="w-full primary-button"
          @click="assignDeliveryPerson"
        />
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useShippingStore } from '../../application/shipping.store.js'
import { useDeliveryStore } from '../../../delivery/application/delivery.store.js'
import { useUserStore } from '../../../user/application/user.store.js'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const toast = useToast()
const confirm = useConfirm()
const shippingStore = useShippingStore()
const deliveryStore = useDeliveryStore()
const userStore = useUserStore()
const { t } = useI18n()

const filters = reactive({
  status: null,
  deliveryPersonId: null,
  search: '',
})

const assignDialogVisible = ref(false)
const selectedShipment = ref(null)
const selectedDeliveryPersonId = ref(null)

const statusOptions = computed(() => [
  { label: t('common.status.PENDING'), value: 'PENDING' },
  { label: t('common.status.IN_TRANSIT'), value: 'IN_TRANSIT' },
  { label: t('common.status.DELIVERED'), value: 'DELIVERED' },
  { label: t('common.status.CANCELLED'), value: 'CANCELLED' },
])

const deliveryOptions = computed(() => deliveryStore.deliveryPersons)

const filteredShipments = computed(() => {
  return shippingStore.shipments
    .filter((shipment) => {
      if (filters.status && shipment.status !== filters.status) return false
      if (filters.deliveryPersonId && shipment.deliveryPersonId !== filters.deliveryPersonId) return false
      if (filters.search && !shipment.trackingCode.toLowerCase().includes(filters.search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

onMounted(async () => {
  await Promise.all([shippingStore.fetchShipments(), shippingStore.loadCouriers(), deliveryStore.fetchDeliveryPersons()])
})

function applyFilters() {
  shippingStore.setFilters({ status: filters.status, deliveryPersonId: filters.deliveryPersonId })
}

function resolveDeliveryPerson(id) {
  return deliveryStore.deliveryPersons.find((person) => person.id === id)
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

function statusLabel(status) {
  const key = `common.status.${status}`
  const translated = t(key)
  return translated === key ? status : translated
}

function goCreateShipment() {
  router.push({ name: 'shipment-create' })
}

function goCreateDelivery() {
  router.push({ name: 'delivery-create' })
}

function goDetail(shipment) {
  router.push({ name: 'shipment-detail', params: { id: shipment.id } })
}

function openAssignDialog(shipment) {
  selectedShipment.value = shipment
  selectedDeliveryPersonId.value = shipment.deliveryPersonId
  assignDialogVisible.value = true
}

async function assignDeliveryPerson() {
  if (!selectedShipment.value || !selectedDeliveryPersonId.value) return
  await shippingStore.assignDeliveryPerson({
    shipmentId: selectedShipment.value.id,
    deliveryPersonId: selectedDeliveryPersonId.value,
  })
  await deliveryStore.addShipmentToDeliveryPerson({
    deliveryPersonId: selectedDeliveryPersonId.value,
    shipmentId: selectedShipment.value.id,
  })
  toast.add({ severity: 'success', summary: t('common.actions.assign'), detail: t('admin.shipments.toastAssigned'), life: 3000 })
  assignDialogVisible.value = false
}

function removeShipment(id) {
  confirm.require({
    message: t('confirm.deleteShipment'),
    header: t('common.actions.delete'),
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      await shippingStore.deleteShipment(id)
      toast.add({ severity: 'success', summary: t('common.actions.delete'), detail: t('admin.shipments.toastDeleted'), life: 2000 })
    },
  })
}

function logout() {
  userStore.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.admin-dashboard {
  display: grid;
  gap: 2rem;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 140, 50, 0.2);
}

.top-bar h1 {
  margin: 0;
  font-size: 2rem;
  color: #ffffff;
}

.subtitle {
  color: var(--app-text-muted);
}

.top-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.stats-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.stat-card :deep(.p-card-body) {
  padding: 1.5rem;
}

.stat-card :deep(.p-card-title) {
  color: var(--app-text-muted);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.stat-value {
  font-size: 2rem;
  font-weight: 600;
  color: #ffffff;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

:deep(.filters .p-inputtext),
:deep(.filters .p-dropdown) {
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 140, 50, 0.35);
  color: #f5f5f5;
}

:deep(.filters .p-input-icon-left > i) {
  color: rgba(255, 255, 255, 0.4);
}

.table-card :deep(.p-card-body) {
  padding: 2rem;
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

:deep(.p-paginator) {
  background: transparent;
  border: none;
  color: #f5f5f5;
}

.table-actions {
  display: flex;
  gap: 0.5rem;
}

:deep(.table-card .p-tag) {
  background-color: rgba(255, 140, 50, 0.15);
  color: #ff8c32;
  border: 1px solid rgba(255, 140, 50, 0.35);
}

.danger-button {
  background: rgba(255, 99, 99, 0.15);
  border: 1px solid rgba(255, 99, 99, 0.4);
  color: #ff7b7b;
}

:deep(.danger-button.p-button:hover) {
  background: rgba(255, 99, 99, 0.25);
  border-color: rgba(255, 135, 135, 0.6);
}

.icon {
  width: 2.5rem;
  height: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.assign-dialog {
  display: grid;
  gap: 1.25rem;
}

.assign-dialog :deep(label) {
  color: #f5f5f5;
}

.assign-dialog :deep(.p-dropdown),
.assign-dialog :deep(.p-inputtext) {
  background-color: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 140, 50, 0.35);
  color: #f5f5f5;
}

.app-dialog :deep(.p-dialog-content),
.app-dialog :deep(.p-dialog-header) {
  background: var(--app-card-bg);
  color: #f5f5f5;
  border: none;
}

.app-dialog :deep(.p-dialog-header-icon) {
  color: #f5f5f5;
}

.muted {
  color: var(--app-text-muted);
  font-size: 0.85rem;
}
</style>
