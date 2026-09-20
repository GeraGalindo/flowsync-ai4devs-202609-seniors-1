import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AuthProvider } from "@/lib/auth-context"
import { ProtectedRoute } from "@/routes/ProtectedRoute"
import { LoginPage } from "@/routes/LoginPage"
import { SignupPage } from "@/routes/SignupPage"
import { ProfilePage } from "@/routes/ProfilePage"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route path="/" element={<Navigate to="/profile" replace />} />
          <Route path="*" element={<Navigate to="/profile" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
