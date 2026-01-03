"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { Users, ArrowLeft, UserCheck, GraduationCap } from "lucide-react"
import { useAuth, type UserRole } from "@/components/auth-provider"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState<UserRole>("mentee")
  const [error, setError] = useState("")

  const { signUp, isLoading } = useAuth()

  const preselectedRole = searchParams.get("role") as UserRole | null
  const lockRole = searchParams.get("roleLocked") === "true" || preselectedRole === "admin"

  // set role once if passed in query string
  useEffect(() => {
    if (preselectedRole && (preselectedRole === "mentor" || preselectedRole === "mentee" || preselectedRole === "admin")) {
      setRole(preselectedRole)
    }
  }, [preselectedRole])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const res = await signUp({
      email,
      password,
      fullName,
      role,
    })

    if (!res.ok) {
      setError(res.error ?? "Registration failed. Please try again.")
      return
    }

    // If email confirmations are ON, they may need to confirm first.
    // Sending to login is the least confusing.
    router.push("/auth/login")
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
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>Join thousands of professionals in meaningful mentorship relationships</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

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
                  placeholder="Create a password"
                  required
                />
              </div>

              {!lockRole && (
                <div className="space-y-3">
                  <Label>I want to join as a:</Label>
                  <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)}>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="mentee" id="mentee" />
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <Label htmlFor="mentee" className="font-medium cursor-pointer">
                          Mentee
                        </Label>
                        <p className="text-sm text-gray-600">I want to learn and grow with guidance</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="mentor" id="mentor" />
                      <UserCheck className="w-5 h-5 text-indigo-600" />
                      <div className="flex-1">
                        <Label htmlFor="mentor" className="font-medium cursor-pointer">
                          Mentor
                        </Label>
                        <p className="text-sm text-gray-600">I want to share my expertise and guide others</p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              )}

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
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
