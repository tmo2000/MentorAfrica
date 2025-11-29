export type AdminStats = {
  totalUsers: number
  activeMentors: number
  activeMentees: number
  activePrograms: number
  completedPrograms: number
  pendingApplications: number
  averageRating: number
  successRate: number
}

export type AdminUser = {
  id: string
  name: string
  email: string
  role: string
  joinDate: string
  status: string
}

export type AdminProgramStat = {
  duration: string
  active: number
  completed: number
  successRate: number
}

export type AdminAlert = {
  id: string
  type: string
  message: string
  date: string
}

export type AdminDashboardData = {
  stats: AdminStats
  recentUsers: AdminUser[]
  programStats: AdminProgramStat[]
  alerts: AdminAlert[]
}

export async function fetchAdminDashboard(): Promise<AdminDashboardData | null> {
  try {
    const res = await fetch("/api/admin/dashboard")
    if (!res.ok) return null
    const json = (await res.json()) as AdminDashboardData
    return json
  } catch (err) {
    console.warn("[admin] dashboard fetch failed", err)
    return null
  }
}
