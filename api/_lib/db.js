import fs from 'fs'
import path from 'path'

const SOURCE_PATH = path.join(process.cwd(), 'db.json')
const TMP_DIR = '/tmp'
const TMP_PATH = path.join(TMP_DIR, 'db.json')

function ensureTmpCopy() {
  if (!fs.existsSync(TMP_DIR)) {
    fs.mkdirSync(TMP_DIR, { recursive: true })
  }
  if (!fs.existsSync(TMP_PATH)) {
    const raw = fs.readFileSync(SOURCE_PATH, 'utf-8')
    fs.writeFileSync(TMP_PATH, raw)
  }
}

export function loadDb() {
  ensureTmpCopy()
  const raw = fs.readFileSync(TMP_PATH, 'utf-8')
  return JSON.parse(raw)
}

export function saveDb(data) {
  ensureTmpCopy()
  fs.writeFileSync(TMP_PATH, JSON.stringify(data, null, 2))
}
