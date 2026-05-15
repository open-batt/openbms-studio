export function formatMinutes(minutes: number): string {
  if (minutes === 65535) return "—"
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}:${String(m).padStart(2, "0")}`
}
