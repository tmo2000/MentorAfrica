"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { Users, ArrowLeft } from "lucide-react"
import { useAuth, type UserRole } from "@/components/auth-provider"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // from updated AuthProvider (Supabase-based)
  const { signIn, user, isLoading, refreshProfile } = useAuth()

  const preselectedRole = (searchParams.get("role") as UserRole | null) ?? undefined
  const lockRole = searchParams.get("roleLocked") === "true" || preselectedRole === "admin"
  const [selectedRole, setSelectedRole] = useState<UserRole | undefined>(preselectedRole)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const res = await signIn({ email, password })

    if (!res.ok) {
      setError(res.error ?? "Invalid credentials.")
      return
    }

    // ensure profile loaded (role comes from DB)
    await refreshProfile()

    // user might update slightly after refreshProfile; safest is to route after a tick
    // but this works in most cases:
    const role = user?.role

    if (role === "mentor") router.push("/mentor/dashboard")
    else if (role === "mentee") router.push("/mentee/dashboard")
    else if (role === "admin") router.push("/admin")
    else router.push("/") // fallback
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">MentorAfrica</span>
          </div>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              {selectedRole ? `Sign in to your ${selectedRole} account` : "Sign in to your account"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!lockRole && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {(["mentee", "mentor"] as UserRole[]).map((r) => (
                  <Button
                    key={r}
                    type="button"
                    variant={selectedRole === r ? "default" : "outline"}
                    className="w-full capitalize"
                    onClick={() => setSelectedRole(r)}
                  >
                    {r}
                  </Button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  href={`/auth/register${selectedRole ? `?role=${selectedRole}` : ""}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>

            {/* Remove demo block now that Supabase auth is real */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
