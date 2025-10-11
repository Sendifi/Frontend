import { loadDb } from '../_lib/db.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' })
    return
  }
  const { id } = req.query
  const userId = Number(id)
  const db = loadDb()
  const user = (db.users || []).find((item) => Number(item.id) === userId)
  if (!user) {
    res.status(404).json({ message: 'User not found' })
    return
  }
  res.status(200).json(user)
}
