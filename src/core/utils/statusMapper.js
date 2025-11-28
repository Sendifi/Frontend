import { SHIPMENT_STATUS } from '../constants/domainConstants.js'

const SHIPMENT_API_TO_DOMAIN = {
  Pending: SHIPMENT_STATUS.PENDING,
  InTransit: SHIPMENT_STATUS.IN_TRANSIT,
  Delivered: SHIPMENT_STATUS.DELIVERED,
  Cancelled: SHIPMENT_STATUS.CANCELLED,
  Returned: SHIPMENT_STATUS.RETURNED,
  Registered: SHIPMENT_STATUS.REGISTERED,
  Delayed: SHIPMENT_STATUS.DELAYED,
}

const SHIPMENT_DOMAIN_TO_API = {
  [SHIPMENT_STATUS.PENDING]: 'Pending',
  [SHIPMENT_STATUS.IN_TRANSIT]: 'InTransit',
  [SHIPMENT_STATUS.DELIVERED]: 'Delivered',
  [SHIPMENT_STATUS.CANCELLED]: 'Cancelled',
  [SHIPMENT_STATUS.RETURNED]: 'Cancelled',
  [SHIPMENT_STATUS.REGISTERED]: 'Registered',
  [SHIPMENT_STATUS.DELAYED]: 'Delayed',
}

function normalizeDomainStatus(rawStatus) {
  if (!rawStatus) return rawStatus
  const normalized = rawStatus.toString().trim().toUpperCase().replace(/\s+/g, '_')
  if (normalized === 'INTRANSIT') return SHIPMENT_STATUS.IN_TRANSIT
  if (Object.values(SHIPMENT_STATUS).includes(normalized)) {
    return normalized
  }
  return rawStatus
}

export function toDomainShipmentStatus(status) {
  if (!status) return status
  return SHIPMENT_API_TO_DOMAIN[status] || normalizeDomainStatus(status)
}

export function toApiShipmentStatus(status) {
  if (!status) return status
  const normalized = normalizeDomainStatus(status)
  return SHIPMENT_DOMAIN_TO_API[normalized] || SHIPMENT_DOMAIN_TO_API[status] || status
}

export function toDomainTrackingStatus(status) {
  return toDomainShipmentStatus(status)
}

export function toApiTrackingStatus(status) {
  return toApiShipmentStatus(status)
}
