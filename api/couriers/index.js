import { loadDb } from '../_lib/db.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' })
    return
  }
  const db = loadDb()
  res.status(200).json(db.couriers || [])
}
