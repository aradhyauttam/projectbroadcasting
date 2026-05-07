/**
 * Approval Service — handles content approval / rejection
 */

import { updateContent, delay } from '@/lib/mockData'
import { CONTENT_STATUS } from '@/utils/constants'

/**
 * Approve a content item
 * @param {string} contentId
 */
export async function approveContent(contentId) {
  await delay(700)
  return updateContent(contentId, {
    status: CONTENT_STATUS.APPROVED,
    rejectionReason: null,
    updatedAt: new Date().toISOString(),
  })
}

/**
 * Reject a content item with a reason
 * @param {string} contentId
 * @param {string} reason
 */
export async function rejectContent(contentId, reason) {
  await delay(700)
  if (!reason?.trim()) {
    throw new Error('A rejection reason is required.')
  }
  return updateContent(contentId, {
    status: CONTENT_STATUS.REJECTED,
    rejectionReason: reason.trim(),
    updatedAt: new Date().toISOString(),
  })
}