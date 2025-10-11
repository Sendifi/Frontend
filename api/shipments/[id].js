import { loadDb, saveDb } from '../_lib/db.js'

export default async function handler(req, res) {
  const { id } = req.query
  const shipmentId = Number(id)
  const db = loadDb()
  const shipments = db.shipments || []
  const index = shipments.findIndex((item) => Number(item.id) === shipmentId)

  if (index === -1) {
    res.status(404).json({ message: 'Shipment not found' })
    return
  }

  if (req.method === 'GET') {
    res.status(200).json(shipments[index])
    return
  }

  if (req.method === 'PATCH') {
    const updates = req.body || {}
    const now = new Date().toISOString()
    const updated = {
      ...shipments[index],
      ...updates,
      updatedAt: updates.updatedAt ?? now,
    }
    shipments[index] = updated
    db.shipments = shipments
    saveDb(db)
    res.status(200).json(updated)
    return
  }

  if (req.method === 'DELETE') {
    shipments.splice(index, 1)
    db.shipments = shipments
    saveDb(db)
    res.status(200).json({ success: true })
    return
  }

  res.status(405).json({ message: 'Method Not Allowed' })
}
