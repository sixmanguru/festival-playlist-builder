import { useState, useEffect } from 'react'
import {
  initiateLogin,
  handleCallback,
  isAuthenticated,
  getValidToken,
  logout as doLogout,
} from '../auth/spotify-auth.js'
import { getCurrentUser } from '../api/spotify.js'

export function useAuth() {
  const [status, setStatus] = useState('loading')
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function init() {
      if (window.location.pathname === '/callback') {
        try {
          await handleCallback()
          const u = await getCurrentUser()
          setUser(u)
          setStatus('authenticated')
        } catch (err) {
          setError(err.message)
          setStatus('unauthenticated')
          window.history.replaceState({}, '', '/')
        }
        return
      }

      if (isAuthenticated()) {
        try {
          await getValidToken()
          const u = await getCurrentUser()
          setUser(u)
          setStatus('authenticated')
        } catch {
          setStatus('unauthenticated')
        }
        return
      }

      setStatus('unauthenticated')
    }

    init()
  }, [])

  function login() {
    initiateLogin().catch(err => setError(err.message))
  }

  function logout() {
    doLogout()
    setUser(null)
    setStatus('unauthenticated')
    setError(null)
  }

  return { status, user, error, login, logout }
}
