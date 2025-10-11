<template>
  <div class="shipment-create view-container">
    <Card class="app-card form-card">
      <template #title>{{ t('shipment.create.title') }}</template>
      <template #content>
        <form class="shipment-form" @submit.prevent="submit">
          <section>
            <h3>{{ t('shipment.create.sections.sender') }}</h3>
            <div class="form-grid">
              <span class="p-float-label">
                <InputText id="sender-name" v-model="form.sender.name" class="w-full" required />
                <label for="sender-name">{{ t('common.labels.name') }}</label>
              </span>
              <span class="p-float-label">
                <InputText id="sender-email" v-model="form.sender.email" type="email" class="w-full" required />
                <label for="sender-email">{{ t('common.labels.email') }}</label>
              </span>
              <span class="p-float-label">
                <InputText id="sender-phone" v-model="form.sender.phone" class="w-full" />
                <label for="sender-phone">{{ t('common.labels.phone') }}</label>
              </span>
            </div>
          </section>

          <section>
            <h3>{{ t('shipment.create.sections.recipient') }}</h3>
            <div class="form-grid">
              <span class="p-float-label">
                <InputText id="recipient-name" v-model="form.recipient.name" class="w-full" required />
                <label for="recipient-name">{{ t('common.labels.name') }}</label>
              </span>
              <span class="p-float-label">
                <InputText id="recipient-email" v-model="form.recipient.email" type="email" class="w-full" required />
                <label for="recipient-email">{{ t('common.labels.email') }}</label>
              </span>
              <span class="p-float-label">
                <InputText id="recipient-phone" v-model="form.recipient.phone" class="w-full" />
                <label for="recipient-phone">{{ t('common.labels.phone') }}</label>
              </span>
            </div>
          </section>

          <section>
            <h3>{{ t('shipment.create.sections.origin') }}</h3>
            <div class="form-grid">
              <span class="p-float-label">
                <InputText id="origin-street" v-model="form.originAddress.street" class="w-full" required />
                <label for="origin-street">{{ t('common.labels.street') }}</label>
              </span>
              <span class="p-float-label">
                <InputText id="origin-city" v-model="form.originAddress.city" class="w-full" required />
                <label for="origin-city">{{ t('common.labels.city') }}</label>
              </span>
              <span class="p-float-label">
                <InputText id="origin-state" v-model="form.originAddress.state" class="w-full" required />
                <label for="origin-state">{{ t('common.labels.state') }}</label>
              </span>
              <span class="p-float-label">
                <InputText id="origin-zip" v-model="form.originAddress.zipCode" class="w-full" required />
                <label for="origin-zip">{{ t('common.labels.zip') }}</label>
              </span>
              <span class="p-float-label">
                <InputText id="origin-country" v-model="form.originAddress.country" class="w-full" required />
                <label for="origin-country">{{ t('common.labels.country') }}</label>
              </span>
            </div>
          </section>

          <section>
            <h3>{{ t('shipment.create.sections.destination') }}</h3>
            <div class="form-grid">
              <span class="p-float-label">
                <InputText id="dest-street" v-model="form.destinationAddress.street" class="w-full" required />
                <label for="dest-street">{{ t('common.labels.street') }}</label>
              </span>
              <span class="p-float-label">
                <InputText id="dest-city" v-model="form.destinationAddress.city" class="w-full" required />
                <label for="dest-city">{{ t('common.labels.city') }}</label>
              </span>
              <span class="p-float-label">
                <InputText id="dest-state" v-model="form.destinationAddress.state" class="w-full" required />
                <label for="dest-state">{{ t('common.labels.state') }}</label>
              </span>
              <span class="p-float-label">
                <InputText id="dest-zip" v-model="form.destinationAddress.zipCode" class="w-full" required />
                <label for="dest-zip">{{ t('common.labels.zip') }}</label>
              </span>
              <span class="p-float-label">
                <InputText id="dest-country" v-model="form.destinationAddress.country" class="w-full" required />
                <label for="dest-country">{{ t('common.labels.country') }}</label>
              </span>
            </div>
          </section>

          <section>
            <h3>{{ t('shipment.create.sections.details') }}</h3>
            <div class="form-grid">
              <span class="p-float-label">
                <InputNumber
                  id="weight"
                  v-model="form.weight"
                  class="w-full"
                  :min="0"
                  :step="0.1"
                  mode="decimal"
                  :max-fraction-digits="2"
                  @blur="updateQuote"
                  @input="updateQuote"
                />
                <label for="weight">{{ t('common.labels.weight') }}</label>
              </span>
              <span class="p-float-label">
                <Calendar id="estimated" v-model="form.estimatedDelivery" class="w-full" date-format="yy-mm-dd" />
                <label for="estimated">{{ t('common.labels.estimatedDelivery') }}</label>
              </span>
              <span class="p-float-label">
                <Dropdown
                  id="delivery-person"
                  v-model="form.deliveryPersonId"
                  :options="deliveryOptions"
                  option-label="label"
                  option-value="value"
                  class="w-full"
                  required
                />
                <label for="delivery-person">{{ t('common.labels.deliveryPerson') }}</label>
              </span>
              <span class="p-float-label">
                <Dropdown
                  id="courier"
                  v-model="form.courierId"
                  :options="pricingStore.couriers"
                  option-label="name"
                  option-value="id"
                  class="w-full"
                  required
                  @change="updateQuote"
                />
                <label for="courier">{{ t('common.labels.courier') }}</label>
              </span>
            </div>
          </section>

          <section class="summary">
            <Card class="app-card summary-card">
              <template #title>{{ t('shipment.create.sections.summary') }}</template>
              <template #content>
                <ul>
                  <li>{{ t('shipment.create.summary.tracking') }}: {{ previewTracking }}</li>
                  <li>
                    {{ t('shipment.create.summary.cost') }}:
                    {{ formatCurrency(pricingStore.quote || form.cost) }}
                  </li>
                  <li>
                    {{ t('shipment.create.summary.deliveryPerson') }}:
                    {{ selectedDeliveryPersonName }}
                  </li>
                </ul>
              </template>
            </Card>
          </section>

          <div class="form-actions">
            <Button
              type="button"
              :label="t('common.actions.cancel')"
              icon="pi pi-arrow-left"
              class="ghost-button"
              @click="goBack"
            />
            <Button
              type="submit"
              :label="t('common.actions.createShipment')"
              icon="pi pi-save"
              class="primary-button"
              :loading="shippingStore.loading"
            />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import { useShippingStore } from '../../application/shipping.store.js'
import { usePricingStore } from '../../../pricing/application/pricing.store.js'
import { useDeliveryStore } from '../../../delivery/application/delivery.store.js'

const router = useRouter()
const shippingStore = useShippingStore()
const pricingStore = usePricingStore()
const deliveryStore = useDeliveryStore()
const { t } = useI18n()

const form = reactive({
  sender: { name: '', email: '', phone: '' },
  recipient: { name: '', email: '', phone: '' },
  originAddress: { street: '', city: '', state: '', zipCode: '', country: '' },
  destinationAddress: { street: '', city: '', state: '', zipCode: '', country: '' },
  weight: 1,
  cost: 0,
  courierId: null,
  deliveryPersonId: null,
  estimatedDelivery: null,
})

const previewTracking = ref(generateTrackingCode())

onMounted(async () => {
  await Promise.all([
    pricingStore.couriers.length ? Promise.resolve() : pricingStore.fetchCouriers(),
    deliveryStore.deliveryPersons.length ? Promise.resolve() : deliveryStore.fetchDeliveryPersons(),
  ])
})

const deliveryOptions = computed(() =>
  deliveryStore.deliveryPersons.map((person) => ({
    label: person.name,
    value: person.id,
  })),
)

const selectedDeliveryPersonName = computed(() => {
  const match = deliveryOptions.value.find((option) => option.value === form.deliveryPersonId)
  if (!match) return t('common.messages.none')
  return match.label
})

watch(
  () => pricingStore.couriers,
  (couriers) => {
    if (!couriers?.length) return
    if (!form.courierId) {
      form.courierId = couriers[0].id
      updateQuote()
    }
  },
  { immediate: true },
)

watch(
  () => deliveryOptions.value,
  (options) => {
    if (!options?.length) return
    if (!form.deliveryPersonId) {
      form.deliveryPersonId = options[0].value
    }
  },
  { immediate: true },
)

async function updateQuote() {
  if (!form.courierId || !form.weight) return
  form.cost = await pricingStore.calculateQuote({ courierId: form.courierId, weight: form.weight })
}

async function submit() {
  try {
    await updateQuote()
    const payload = {
      ...form,
      estimatedDelivery: form.estimatedDelivery
        ? new Date(form.estimatedDelivery).toISOString().split('T')[0]
        : null,
    }
    await shippingStore.createShipment(payload)
    router.push({ name: 'admin-dashboard' })
  } catch (error) {
    console.error(error)
  }
}

function goBack() {
  router.back()
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value || 0)
}

function generateTrackingCode() {
  const random = Math.floor(Math.random() * 1_000_000_000)
  return `SFY${random.toString().padStart(9, '0')}`
}
</script>

<style scoped>
.shipment-create {
  gap: 2rem;
}

.form-card :deep(.p-card-body) {
  padding: 2.5rem;
}

.form-card :deep(.p-card-title) {
  font-size: 1.5rem;
  color: #ffffff;
}

.shipment-form {
  display: grid;
  gap: 2rem;
}

.shipment-form section {
  display: grid;
  gap: 1rem;
}

.shipment-form h3 {
  margin: 0;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--app-primary-soft);
}

.form-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.form-grid :deep(label) {
  color: rgba(245, 245, 245, 0.8);
}

.summary-card :deep(.p-card-body) {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 1rem;
  border: 1px solid rgba(255, 140, 50, 0.25);
}

.summary-card :deep(.p-card-title) {
  color: var(--app-primary);
}

.summary ul {
  padding-left: 1rem;
  margin: 0;
  display: grid;
  gap: 0.5rem;
  color: #f5f5f5;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.form-actions .primary-button,
.form-actions .ghost-button {
  min-width: 180px;
}
</style>
