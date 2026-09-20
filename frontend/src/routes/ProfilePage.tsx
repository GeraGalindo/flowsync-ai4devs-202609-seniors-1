import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"

export function ProfilePage() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
              {user?.initials}
            </div>
            <div>
              <CardTitle>{user?.fullName ?? user?.email}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => logout()} className="w-full">
            Log out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
