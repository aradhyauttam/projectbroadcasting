/**
 * Content Service — handles all content CRUD operations
 * Operates against in-memory mock store (replaceable with real API)
 */

import {
  getContentStore,
  addContent,
  updateContent,
  delay,
} from '@/lib/mockData'
import { uuid } from '@/utils/helpers'
import { CONTENT_STATUS } from '@/utils/constants'

/**
 * Fetch all content items (principal view)
 * @param {{status?: string, search?: string}} filters
 */
export async function fetchAllContent(filters = {}) {
  await delay(600)
  let items = getContentStore()

  if (filters.status && filters.status !== 'all') {
    items = items.filter((c) => c.status === filters.status)
  }
  if (filters.search) {
    const q = filters.search.toLowerCase()
    items = items.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.teacherName.toLowerCase().includes(q)
    )
  }

  return items
}

/**
 * Fetch pending content (principal view)
 */
export async function fetchPendingContent() {
  await delay(500)
  return getContentStore().filter((c) => c.status === CONTENT_STATUS.PENDING)
}

/**
 * Fetch content by teacher ID (teacher's own content)
 * @param {string} teacherId
 */
export async function fetchContentByTeacher(teacherId) {
  await delay(500)
  return getContentStore().filter((c) => c.teacherId === teacherId)
}

/**
 * Fetch currently active content for a teacher (public live page)
 * @param {string} teacherId
 */
export async function fetchLiveContent(teacherId) {
  await delay(400)
  const now = new Date()
  return getContentStore().filter((c) => {
    if (c.teacherId !== teacherId) return false
    if (c.status !== CONTENT_STATUS.APPROVED) return false
    const start = new Date(c.startTime)
    const end = new Date(c.endTime)
    return start <= now && end >= now
  })
}

/**
 * Upload new content (teacher action)
 * @param {object} formData
 * @param {string} teacherId
 * @param {string} teacherName
 */
export async function uploadContent(formData, teacherId, teacherName) {
  await delay(1200)

  // Simulate occasional network error (5% chance)
  // if (Math.random() < 0.05) throw new Error('Upload failed. Please try again.')

  const fileUrl = URL.createObjectURL(formData.file)

  const newItem = {
    id: `c-${uuid().slice(0, 8)}`,
    title: formData.title,
    subject: formData.subject,
    description: formData.description || '',
    fileUrl,
    fileName: formData.file.name,
    fileSize: formData.file.size,
    fileType: formData.file.type,
    status: CONTENT_STATUS.PENDING,
    teacherId,
    teacherName,
    startTime: formData.startTime,
    endTime: formData.endTime,
    rotationDuration: formData.rotationDuration || 30,
    rejectionReason: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return addContent(newItem)
}

/**
 * Get dashboard stats for teacher
 * @param {string} teacherId
 */
export async function fetchTeacherStats(teacherId) {
  await delay(400)
  const items = getContentStore().filter((c) => c.teacherId === teacherId)
  return {
    total: items.length,
    pending: items.filter((c) => c.status === 'pending').length,
    approved: items.filter((c) => c.status === 'approved').length,
    rejected: items.filter((c) => c.status === 'rejected').length,
  }
}

/**
 * Get dashboard stats for principal
 */
export async function fetchPrincipalStats() {
  await delay(400)
  const items = getContentStore()
  return {
    total: items.length,
    pending: items.filter((c) => c.status === 'pending').length,
    approved: items.filter((c) => c.status === 'approved').length,
    rejected: items.filter((c) => c.status === 'rejected').length,
  }
}