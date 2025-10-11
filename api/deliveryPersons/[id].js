import { loadDb, saveDb } from '../_lib/db.js'

export default async function handler(req, res) {
  const { id } = req.query
  const deliveryId = Number(id)
  const db = loadDb()
  const deliveryPersons = db.deliveryPersons || []
  const index = deliveryPersons.findIndex((person) => Number(person.id) === deliveryId)

  if (index === -1) {
    res.status(404).json({ message: 'Delivery person not found' })
    return
  }

  if (req.method === 'GET') {
    res.status(200).json(deliveryPersons[index])
    return
  }

  if (req.method === 'PATCH') {
    const updates = req.body || {}
    const updated = {
      ...deliveryPersons[index],
      ...updates,
    }
    deliveryPersons[index] = updated
    db.deliveryPersons = deliveryPersons
    saveDb(db)
    res.status(200).json(updated)
    return
  }

  if (req.method === 'DELETE') {
    deliveryPersons.splice(index, 1)
    db.deliveryPersons = deliveryPersons
    saveDb(db)
    res.status(200).json({ success: true })
    return
  }

  res.status(405).json({ message: 'Method Not Allowed' })
}
