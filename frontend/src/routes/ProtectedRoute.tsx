import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/lib/auth-context"

export function ProtectedRoute() {
  const { status } = useAuth()

  if (status === "restoring") {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    )
  }

  if (status === "signed-out") {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
