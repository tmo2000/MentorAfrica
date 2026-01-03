"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { supabase } from "@/lib/supabaseClient"

export type UserRole = "mentor" | "mentee" | "admin"

export type AppUser = {
  id: string
  email: string
  name: string
  role: UserRole
}

type AuthContextType = {
  user: AppUser | null
  isLoading: boolean
  signUp: (args: { email: string; password: string; fullName: string; role: UserRole }) => Promise<{ ok: boolean; error?: string }>
  signIn: (args: { email: string; password: string }) => Promise<{ ok: boolean; error?: string }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  async function loadProfile() {
    const { data: sessionData } = await supabase.auth.getSession()
    const session = sessionData.session

    if (!session?.user) {
      setUser(null)
      setIsLoading(false)
      return
    }

    const authUser = session.user

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id,email,full_name,role")
      .eq("id", authUser.id)
      .single()

    if (error || !profile) {
      console.error("Profile fetch error:", error)
      // still set something minimal
      setUser({
        id: authUser.id,
        email: authUser.email ?? "",
        name: authUser.user_metadata?.full_name ?? "",
        role: (authUser.user_metadata?.role as UserRole) ?? "mentee",
      })
      setIsLoading(false)
      return
    }

    setUser({
      id: profile.id,
      email: profile.email ?? authUser.email ?? "",
      name: profile.full_name ?? "",
      role: profile.role as UserRole,
    })
    setIsLoading(false)
  }

  useEffect(() => {
    loadProfile()

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      // whenever login/logout happens, refresh
      loadProfile()
    })

    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])

  async function signUp(args: { email: string; password: string; fullName: string; role: UserRole }) {
    const { error } = await supabase.auth.signUp({
      email: args.email,
      password: args.password,
      options: {
        data: {
          full_name: args.fullName,
          role: args.role,
        },
      },
    })

    if (error) return { ok: false, error: error.message }
    return { ok: true }
  }

  async function signIn(args: { email: string; password: string }) {
    const { error } = await supabase.auth.signInWithPassword({
      email: args.email,
      password: args.password,
    })

    if (error) return { ok: false, error: error.message }
    return { ok: true }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  async function refreshProfile() {
    setIsLoading(true)
    await loadProfile()
  }

  const value = useMemo(
    () => ({ user, isLoading, signUp, signIn, signOut, refreshProfile }),
    [user, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}




/**"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "mentor" | "mentee" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  isOnboarded: boolean
  appliedMentorId?: string | null
  appliedMentorName?: string | null
  applicationNote?: string | null
  profile?: Record<string, any>
  applicationStatus?: "none" | "draft" | "submitted" | "accepted" | "rejected"
  mentorApprovalStatus?: "pending" | "approved" | "rejected"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>
  register: (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    profile?: Record<string, any>
  ) => Promise<boolean>
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
    appliedMentorId: null,
    appliedMentorName: null,
    applicationNote: null,
    profile: {},
    applicationStatus: "none",
    mentorApprovalStatus: "approved",
  },
  {
    id: "4",
    email: "tobi@example.com",
    name: "Tobi Olaide",
    role: "mentor",
    isOnboarded: true,
    appliedMentorId: null,
    appliedMentorName: null,
    applicationNote: null,
    profile: {},
    applicationStatus: "none",
    mentorApprovalStatus: "approved",
  },
  {
    id: "2",
    email: "mentee@example.com",
    name: "Alex Chen",
    role: "mentee",
    isOnboarded: true,
    appliedMentorId: null,
    appliedMentorName: null,
    applicationNote: null,
    profile: {},
    applicationStatus: "none",
    mentorApprovalStatus: "approved",
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

  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    profile?: Record<string, any>
  ): Promise<boolean> => {
    setIsLoading(true)

    // Mock registration
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
    role,
    isOnboarded: false,
    appliedMentorId: null,
    appliedMentorName: null,
    applicationNote: null,
    profile: profile || {},
    applicationStatus: "none",
    mentorApprovalStatus: role === "mentor" ? "pending" : "approved",
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
}  **/
