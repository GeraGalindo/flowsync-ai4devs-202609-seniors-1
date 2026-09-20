const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333"

export type User = {
  id: number
  fullName: string | null
  email: string
  createdAt: string
  updatedAt: string
  initials: string
}

export type AuthResponse = {
  user: User
  token: string
}

export class ApiError extends Error {}

type ValidationErrorBody = { errors: { message: string }[] }
type MessageErrorBody = { message: string }

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const message =
      (body as ValidationErrorBody | null)?.errors?.[0]?.message ??
      (body as MessageErrorBody | null)?.message ??
      "Something went wrong. Please try again."
    throw new ApiError(message)
  }

  return response.json() as Promise<T>
}

// Handlers that call the `serialize()` HTTP context helper wrap their
// response in `{ data: ... }`; logout returns its plain object directly.
async function requestData<T>(path: string, init?: RequestInit): Promise<T> {
  const { data } = await request<{ data: T }>(path, init)
  return data
}

export function login(email: string, password: string) {
  return requestData<AuthResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export function signup(fullName: string, email: string, password: string, passwordConfirmation: string) {
  return requestData<AuthResponse>("/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify({ fullName, email, password, passwordConfirmation }),
  })
}

export function getProfile(token: string) {
  return requestData<User>("/api/v1/account/profile", {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function logout(token: string) {
  return request<{ message: string }>("/api/v1/account/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  })
}
