import { loadDb, saveDb } from '../_lib/db.js'

function filterShipments(shipments, query) {
  let result = [...shipments]
  if (query.status) {
    result = result.filter((shipment) => shipment.status === query.status)
  }
  if (query.trackingCode) {
    result = result.filter((shipment) => shipment.trackingCode === query.trackingCode)
  }
  if (query.deliveryPersonId) {
    const deliveryId = query.deliveryPersonId
    result = result.filter(
      (shipment) => String(shipment.deliveryPersonId) === String(deliveryId),
    )
  }
  return result
}

function nextId(collection) {
  return collection.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1
}

export default async function handler(req, res) {
  const db = loadDb()
  if (req.method === 'GET') {
    const data = filterShipments(db.shipments || [], req.query || {})
    res.status(200).json(data)
    return
  }

  if (req.method === 'POST') {
    const payload = req.body || {}
    const shipments = db.shipments || []
    const id = payload.id ?? nextId(shipments)
    const now = new Date().toISOString()
    const newShipment = {
      id,
      trackingCode: payload.trackingCode || `SFY${Math.floor(Math.random() * 1_000_000_000).toString().padStart(9, '0')}`,
      sender: payload.sender,
      recipient: payload.recipient,
      originAddress: payload.originAddress,
      destinationAddress: payload.destinationAddress,
      weight: payload.weight ?? 0,
      cost: payload.cost ?? 0,
      status: payload.status ?? 'PENDING',
      courierId: payload.courierId ?? null,
      deliveryPersonId: payload.deliveryPersonId ?? null,
      estimatedDelivery: payload.estimatedDelivery ?? null,
      createdAt: payload.createdAt ?? now,
      updatedAt: payload.updatedAt ?? now,
    }
    shipments.push(newShipment)
    db.shipments = shipments
    saveDb(db)
    res.status(201).json(newShipment)
    return
  }

  res.status(405).json({ message: 'Method Not Allowed' })
}
