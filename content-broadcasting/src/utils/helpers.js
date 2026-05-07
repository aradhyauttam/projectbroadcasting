import { format, isAfter, isBefore, parseISO } from 'date-fns'
import { SCHEDULE_STATUS } from './constants'

/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateStr, fmt = 'MMM d, yyyy h:mm a') {
  if (!dateStr) return '—'
  try {
    return format(parseISO(dateStr), fmt)
  } catch {
    return dateStr
  }
}

/**
 * Get content schedule status based on start/end times
 */
export function getScheduleStatus(startTime, endTime) {
  if (!startTime || !endTime) return SCHEDULE_STATUS.SCHEDULED
  try {
    const now = new Date()
    const start = parseISO(startTime)
    const end = parseISO(endTime)
    if (isAfter(start, now)) return SCHEDULE_STATUS.SCHEDULED
    if (isBefore(end, now)) return SCHEDULE_STATUS.EXPIRED
    return SCHEDULE_STATUS.ACTIVE
  } catch {
    return SCHEDULE_STATUS.SCHEDULED
  }
}

/**
 * Format file size from bytes to human-readable string
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Truncate text to a max length with ellipsis
 */
export function truncate(text, maxLength = 60) {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '…' : text
}

/**
 * Get initials from a name
 */
export function getInitials(name = '') {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Safe JSON parse with a fallback
 */
export function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}

/**
 * Generate a mock UUID
 */
export function uuid() {
  return crypto.randomUUID()
}

/**
 * Debounce a function
 */
export function debounce(fn, delay = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Clamp a number between min and max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}
