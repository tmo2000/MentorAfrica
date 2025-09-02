"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "mentor" | "mentee" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  isOnboarded: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>
  register: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for prototype
const mockUsers: User[] = [
  {
    id: "1",
    email: "mentor@example.com",
    name: "Sarah Johnson",
    role: "mentor",
    isOnboarded: true,
  },
  {
    id: "2",
    email: "mentee@example.com",
    name: "Alex Chen",
    role: "mentee",
    isOnboarded: true,
  },
  {
    id: "3",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    isOnboarded: true,
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("mentorconnect_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role?: UserRole): Promise<boolean> => {
    setIsLoading(true)

    // Mock authentication
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email === email)
    if (foundUser && (role ? foundUser.role === role : true)) {
      setUser(foundUser)
      localStorage.setItem("mentorconnect_user", JSON.stringify(foundUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const register = async (email: string, password: string, name: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true)

    // Mock registration
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
      isOnboarded: false,
    }

    setUser(newUser)
    localStorage.setItem("mentorconnect_user", JSON.stringify(newUser))
    setIsLoading(false)
    return true
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("mentorconnect_user", JSON.stringify(updatedUser))
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("mentorconnect_user")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
