/**
 * Auth Service — handles all authentication-related API calls
 * Uses mock data to simulate a real backend
 */

import { MOCK_USERS, delay } from '@/lib/mockData'
import { TOKEN_KEY, USER_KEY } from '@/utils/constants'

/**
 * Simulate login — validates credentials and returns user + token
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: object, token: string}>}
 */
export async function loginRequest(email, password) {
  await delay(800)

  const user = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )

  if (!user) {
    const error = new Error('Invalid email or password.')
    error.status = 401
    throw error
  }

  const { password: _pwd, ...safeUser } = user
  const token = btoa(`${safeUser.id}:${safeUser.role}:${Date.now()}`)

  return { user: safeUser, token }
}

/**
 * Logout — clear local storage
 */
export function logoutRequest() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

/**
 * Validate stored token and restore session
 * @returns {{user: object, token: string} | null}
 */
export function restoreSession() {
  const token = localStorage.getItem(TOKEN_KEY)
  const rawUser = localStorage.getItem(USER_KEY)
  if (!token || !rawUser) return null
  try {
    const user = JSON.parse(rawUser)
    return { user, token }
  } catch {
    return null
  }
}