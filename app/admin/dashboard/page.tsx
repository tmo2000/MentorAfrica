"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Users,
  TrendingUp,
  Award,
  AlertTriangle,
  UserCheck,
  Calendar,
  BarChart3,
  Settings,
  Shield,
  Check,
  X,
  ArrowLeft,
} from "lucide-react"
import { fetchAdminDashboard, type AdminDashboardData } from "@/lib/admin-data"

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingMentors, setPendingMentors] = useState<
    { id: string; name: string; email: string; bio?: string; expertise: string[]; duration: string; profileUrl?: string }[]
  >([])
  const [newMentor, setNewMentor] = useState({ name: "", email: "", expertise: "", duration: "3 months" })

  useEffect(() => {
    if (!user) return
    const load = async () => {
      setLoading(true)
      const dashboard = await fetchAdminDashboard()
      setData(dashboard)
      setLoading(false)
    }
    load()
  }, [user])

  if (!user) {
    router.push("/auth/login")
    return null
  }

  if (user.role !== "admin") {
    router.push("/")
    return null
  }

  const stats = data?.stats
  const recentUsers = data?.recentUsers || []
  const programStats = data?.programStats || []
  const alerts = data?.alerts || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "mentor":
        return "bg-blue-100 text-blue-800"
      case "mentee":
        return "bg-green-100 text-green-800"
      case "admin":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-xl text-gray-600">Manage users, programs, and platform activity</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex items-center gap-2" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button variant="secondary" onClick={() => router.push("/")}>
                Back to website
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total Users", value: stats?.totalUsers, icon: <Users className="h-5 w-5 text-blue-600" /> },
              {
                label: "Active Mentors",
                value: stats?.activeMentors,
                icon: <UserCheck className="h-5 w-5 text-green-600" />,
              },
              {
                label: "Active Mentees",
                value: stats?.activeMentees,
                icon: <TrendingUp className="h-5 w-5 text-purple-600" />,
              },
              {
                label: "Active Programs",
                value: stats?.activePrograms,
                icon: <Award className="h-5 w-5 text-orange-600" />,
              },
            ].map((item, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">{item.icon}</div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {loading ? "—" : item.value ?? "No data"}
                      </p>
                      <p className="text-sm text-gray-600">{item.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Platform Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Platform Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">
                        {loading ? "—" : stats?.successRate ?? "No data"}%
                      </p>
                      <p className="text-sm text-gray-600">Success Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">{loading ? "—" : stats?.averageRating ?? "No data"}</p>
                      <p className="text-sm text-gray-600">Average Rating</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-600">
                        {loading ? "—" : stats?.completedPrograms ?? "No data"}
                      </p>
                      <p className="text-sm text-gray-600">Completed Programs</p>
                    </div>
                  </div>
                  {!data && !loading && (
                    <p className="text-sm text-gray-500 mt-4">
                      Connect an API at <code>/api/admin/dashboard</code> to populate these figures.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Program Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Program Statistics
                  </CardTitle>
                  <CardDescription>Performance metrics by program duration</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-sm text-gray-500">Loading...</p>
                  ) : programStats.length === 0 ? (
                    <p className="text-sm text-gray-500">No program stats yet. Connect your backend.</p>
                  ) : (
                    <div className="space-y-4">
                      {programStats.map((program, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold">{program.duration} Programs</h4>
                            <Badge variant="secondary">{program.successRate}% success rate</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Active</p>
                              <p className="font-semibold text-blue-600">{program.active}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Completed</p>
                              <p className="font-semibold text-green-600">{program.completed}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Total</p>
                              <p className="font-semibold">{program.active + program.completed}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Users */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Recent Users
                  </CardTitle>
                  <CardDescription>Newly registered users requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-sm text-gray-500">Loading...</p>
                  ) : recentUsers.length === 0 ? (
                    <p className="text-sm text-gray-500">No recent users. Connect your backend feed.</p>
                  ) : (
                    <div className="space-y-4">
                      {recentUsers.map((u) => (
                        <div key={u.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-gray-100 text-gray-700">
                                {u.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{u.name}</h4>
                              <p className="text-sm text-gray-600">{u.email}</p>
                              <p className="text-xs text-gray-500">Joined {new Date(u.joinDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getRoleColor(u.role)}>{u.role}</Badge>
                            <Badge className={getStatusColor(u.status)}>{u.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    System Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-sm text-gray-500">Loading...</p>
                  ) : alerts.length === 0 ? (
                    <p className="text-sm text-gray-500">No alerts yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {alerts.map((alert) => (
                        <div key={alert.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm font-medium text-yellow-800">{alert.message}</p>
                          <p className="text-xs text-yellow-600 mt-1">{new Date(alert.date).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => router.push("/admin/users")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => router.push("/admin/programs")}
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Review Programs
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    System Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Pending Mentor Approvals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Pending mentor approvals
                  </CardTitle>
                  <CardDescription>Review and approve mentors before they go public</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 p-3 border rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <Input
                        placeholder="Name"
                        value={newMentor.name}
                        onChange={(e) => setNewMentor((p) => ({ ...p, name: e.target.value }))}
                      />
                      <Input
                        placeholder="Email"
                        value={newMentor.email}
                        onChange={(e) => setNewMentor((p) => ({ ...p, email: e.target.value }))}
                      />
                      <Input
                        placeholder="Expertise (comma-separated)"
                        value={newMentor.expertise}
                        onChange={(e) => setNewMentor((p) => ({ ...p, expertise: e.target.value }))}
                      />
                      <Input
                        placeholder="Duration"
                        value={newMentor.duration}
                        onChange={(e) => setNewMentor((p) => ({ ...p, duration: e.target.value }))}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => {
                          if (!newMentor.name.trim() || !newMentor.email.trim()) return
                          setPendingMentors((list) => [
                            {
                              id: `m-${Date.now()}`,
                              name: newMentor.name.trim(),
                              email: newMentor.email.trim(),
                              bio: "",
                              expertise: newMentor.expertise
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                              duration: newMentor.duration.trim() || "6 months",
                              profileUrl: "/mentors",
                            },
                            ...list,
                          ])
                          setNewMentor({ name: "", email: "", expertise: "", duration: "3 months" })
                        }}
                      >
                        Add mentor
                      </Button>
                    </div>
                  </div>
                  {pendingMentors.length === 0 ? (
                    <p className="text-sm text-gray-600">No pending mentor approvals.</p>
                  ) : (
                    pendingMentors.map((mentor) => (
                      <div key={mentor.id} className="p-3 border rounded-lg flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{mentor.name}</p>
                          <p className="text-sm text-gray-600">{mentor.email}</p>
                          <p className="text-sm text-gray-600 mt-1">Duration: {mentor.duration}</p>
                          <p className="text-xs text-gray-500 mt-1">Expertise: {mentor.expertise.join(", ")}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(mentor.profileUrl || "/mentors")}
                          >
                            View profile
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1 text-green-700 border-green-200"
                            onClick={() => setPendingMentors((list) => list.filter((m) => m.id !== mentor.id))}
                          >
                            <Check className="h-4 w-4" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1 text-red-700 border-red-200"
                            onClick={() => setPendingMentors((list) => list.filter((m) => m.id !== mentor.id))}
                          >
                            <X className="h-4 w-4" /> Reject
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Platform Health */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">System Status</span>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Sessions</span>
                    <span className="font-semibold">{loading ? "—" : data ? "Live data" : "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pending Reviews</span>
                    <span className="font-semibold">{pendingMentors.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="font-semibold">—</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
