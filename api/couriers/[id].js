import { loadDb } from '../_lib/db.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' })
    return
  }
  const { id } = req.query
  const courierId = Number(id)
  const db = loadDb()
  const courier = (db.couriers || []).find((item) => Number(item.id) === courierId)
  if (!courier) {
    res.status(404).json({ message: 'Courier not found' })
    return
  }
  res.status(200).json(courier)
}
