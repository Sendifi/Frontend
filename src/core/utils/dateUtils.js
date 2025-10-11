export function formatDate(dateLike) {
  if (!dateLike) return ''
  const date = new Date(dateLike)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString()
}

export function formatDateOnly(dateLike) {
  if (!dateLike) return ''
  const date = new Date(dateLike)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString()
}
