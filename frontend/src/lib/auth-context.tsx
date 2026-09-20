import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import * as api from "@/lib/api"

const TOKEN_STORAGE_KEY = "flowsync.token"

type AuthStatus = "restoring" | "signed-out" | "signed-in"

type AuthContextValue = {
  status: AuthStatus
  user: api.User | null
  login: (email: string, password: string) => Promise<void>
  signup: (
    fullName: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("restoring")
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<api.User | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!storedToken) {
      setStatus("signed-out")
      return
    }

    api
      .getProfile(storedToken)
      .then((profile) => {
        setToken(storedToken)
        setUser(profile)
        setStatus("signed-in")
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        setStatus("signed-out")
      })
  }, [])

  function signIn({ user, token }: api.AuthResponse) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
    setToken(token)
    setUser(user)
    setStatus("signed-in")
  }

  async function login(email: string, password: string) {
    signIn(await api.login(email, password))
  }

  async function signup(
    fullName: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ) {
    signIn(await api.signup(fullName, email, password, passwordConfirmation))
  }

  async function logout() {
    if (token) {
      await api.logout(token).catch(() => {})
    }
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    setToken(null)
    setUser(null)
    setStatus("signed-out")
  }

  return (
    <AuthContext.Provider value={{ status, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
