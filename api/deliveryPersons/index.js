import { loadDb, saveDb } from '../_lib/db.js'

function nextId(collection) {
  return collection.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1
}

export default async function handler(req, res) {
  const db = loadDb()
  const deliveryPersons = db.deliveryPersons || []

  if (req.method === 'GET') {
    const { code } = req.query || {}
    if (code) {
      const match = deliveryPersons.find((person) => person.code === code)
      res.status(200).json(match ? [match] : [])
      return
    }
    res.status(200).json(deliveryPersons)
    return
  }

  if (req.method === 'POST') {
    const payload = req.body || {}
    const id = payload.id ?? nextId(deliveryPersons)
    const newDeliveryPerson = {
      id,
      name: payload.name,
      code: payload.code || `DEL${Math.random().toString().slice(2, 5)}`,
      phone: payload.phone,
      assignedShipments: payload.assignedShipments ?? [],
    }
    deliveryPersons.push(newDeliveryPerson)
    db.deliveryPersons = deliveryPersons
    saveDb(db)
    res.status(201).json(newDeliveryPerson)
    return
  }

  res.status(405).json({ message: 'Method Not Allowed' })
}
