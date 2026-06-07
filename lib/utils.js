import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateString) {
  if (!dateString) return ""
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date)
}

// Parsea "06/06/26 10:07 p.m." → ISO string
export function parseFechaInput(input) {
  if (!input) return null
  const match = input
    .trim()
    .match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})\s+(\d{1,2}):(\d{2})\s*(a\.?m\.?|p\.?m\.?)/i)
  if (!match) return null

  let [, day, month, year, hours, minutes, period] = match
  day = parseInt(day, 10)
  month = parseInt(month, 10) - 1
  year = parseInt(year, 10)
  if (year < 100) year += 2000
  hours = parseInt(hours, 10)
  minutes = parseInt(minutes, 10)

  const isPM = /p/i.test(period)
  if (isPM && hours !== 12) hours += 12
  if (!isPM && hours === 12) hours = 0

  const date = new Date(year, month, day, hours, minutes)
  return isNaN(date.getTime()) ? null : date.toISOString()
}
