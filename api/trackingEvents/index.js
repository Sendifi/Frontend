import { loadDb, saveDb } from '../_lib/db.js'

function nextId(collection) {
  return collection.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1
}

export default async function handler(req, res) {
  const db = loadDb()
  const events = db.trackingEvents || []

  if (req.method === 'GET') {
    const { shipmentId } = req.query || {}
    let data = events
    if (shipmentId) {
      const id = Number(shipmentId)
      data = events.filter((event) => Number(event.shipmentId) === id)
    }
    res.status(200).json(data)
    return
  }

  if (req.method === 'POST') {
    const payload = req.body || {}
    const id = payload.id ?? nextId(events)
    const newEvent = {
      id,
      shipmentId: payload.shipmentId,
      status: payload.status,
      description: payload.description ?? '',
      location: payload.location ?? '',
      timestamp: payload.timestamp ?? new Date().toISOString(),
      courierReference: payload.courierReference ?? null,
    }
    events.push(newEvent)
    db.trackingEvents = events
    saveDb(db)
    res.status(201).json(newEvent)
    return
  }

  res.status(405).json({ message: 'Method Not Allowed' })
}
