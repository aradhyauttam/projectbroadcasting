import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { loginRequest, logoutRequest, restoreSession } from '@/services/auth.service'
import { TOKEN_KEY, USER_KEY } from '@/utils/constants'

const AuthContext = createContext(null)

const initialState = {
  user: null,
  token: null,
  isLoading: true, // start true to handle session restore
  error: null,
}

function authReducer(state, action) {
  switch (action.type) {
    case 'RESTORE_SESSION':
      return { ...state, user: action.user, token: action.token, isLoading: false, error: null }
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.user, token: action.token, isLoading: false, error: null }
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null }
    case 'LOGIN_FAILURE':
      return { ...state, isLoading: false, error: action.error }
    case 'LOGOUT':
      return { ...initialState, isLoading: false }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Restore session on mount
  useEffect(() => {
    const session = restoreSession()
    if (session) {
      dispatch({ type: 'RESTORE_SESSION', user: session.user, token: session.token })
    } else {
      dispatch({ type: 'LOGOUT' })
    }
  }, [])

  const login = useCallback(async (email, password) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const { user, token } = await loginRequest(email, password)
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      dispatch({ type: 'LOGIN_SUCCESS', user, token })
      return { success: true, user }
    } catch (err) {
      dispatch({ type: 'LOGIN_FAILURE', error: err.message })
      return { success: false, error: err.message }
    }
  }, [])

  const logout = useCallback(() => {
    logoutRequest()
    dispatch({ type: 'LOGOUT' })
  }, [])

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}