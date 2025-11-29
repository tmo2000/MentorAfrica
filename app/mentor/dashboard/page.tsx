"use client"

import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Calendar,
  Clock,
  TrendingUp,
  MessageSquare,
  Star,
  Award,
  BookOpen,
  CheckCircle,
  LogOut,
  Settings,
  User,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock dashboard data
const mockDashboardData = {
  stats: {
    currentMentees: 2,
    totalMentees: 15,
    completedPrograms: 12,
    averageRating: 4.9,
    pendingApplications: 2,
  },
  currentMentees: [
    {
      id: "1",
      name: "Alex Chen",
      email: "alex@example.com",
      program: "6-month Technical Leadership",
      startDate: "2024-01-15",
      progress: 65,
      nextSession: "2024-02-15T14:00:00",
      goals: ["Become Senior Engineer", "Learn System Design", "Improve Leadership Skills"],
      completedMilestones: 4,
      totalMilestones: 6,
    },
    {
      id: "2",
      name: "Jordan Smith",
      email: "jordan@example.com",
      program: "3-month Product Transition",
      startDate: "2024-02-01",
      progress: 30,
      nextSession: "2024-02-16T10:00:00",
      goals: ["Transition to PM Role", "Learn Product Strategy", "Build PM Portfolio"],
      completedMilestones: 2,
      totalMilestones: 4,
    },
  ],
  upcomingSessions: [
    {
      id: "1",
      mentee: "Alex Chen",
      date: "2024-02-15T14:00:00",
      type: "Progress Review",
      duration: 60,
    },
    {
      id: "2",
      mentee: "Jordan Smith",
      date: "2024-02-16T10:00:00",
      type: "Goal Setting",
      duration: 45,
    },
  ],
  recentActivity: [
    {
      id: "1",
      type: "milestone_completed",
      mentee: "Alex Chen",
      description: "Completed System Design milestone",
      date: "2024-02-10",
    },
    {
      id: "2",
      type: "application_received",
      mentee: "Sarah Wilson",
      description: "New application received",
      date: "2024-02-09",
    },
  ],
}

export default function MentorDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) {
    router.push("/auth/login")
    return null
  }

  if (user.role !== "mentor") {
    router.push("/")
    return null
  }

  const { stats, currentMentees, upcomingSessions, recentActivity } = mockDashboardData
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">MentorAfrica</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/about">
                <Button variant="ghost">About</Button>
              </Link>
              <Link href="/mentors">
                <Button variant="ghost">Our Mentors</Button>
              </Link>
              <Link href="/faq">
                <Button variant="ghost">FAQs</Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || undefined} alt={user.name} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>
                    <div className="text-sm font-semibold">{user.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/mentor/dashboard" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Profile & Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2 text-red-600" onSelect={() => logout()}>
                    <LogOut className="h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {user.name}</h1>
            <p className="text-xl text-gray-600">Here's what's happening with your mentees</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.currentMentees}</p>
                    <p className="text-sm text-gray-600">Current Mentees</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.completedPrograms}</p>
                    <p className="text-sm text-gray-600">Completed Programs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                    <p className="text-sm text-gray-600">Average Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalMentees}</p>
                    <p className="text-sm text-gray-600">Total Mentees</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
                    <p className="text-sm text-gray-600">Pending Applications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Mentees */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Current Mentees
                  </CardTitle>
                  <CardDescription>Track progress and manage your mentees</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {currentMentees.map((mentee) => (
                      <div key={mentee.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-green-100 text-green-700">
                                {mentee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg">{mentee.name}</h3>
                              <p className="text-gray-600 text-sm">{mentee.program}</p>
                              <p className="text-gray-500 text-xs">
                                Started {new Date(mentee.startDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {mentee.completedMilestones}/{mentee.totalMilestones} milestones
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">Program Progress</span>
                              <span>{mentee.progress}%</span>
                            </div>
                            <Progress value={mentee.progress} className="h-2" />
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Goals</p>
                            <div className="flex flex-wrap gap-1">
                              {mentee.goals.map((goal, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {goal}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="text-sm text-gray-600">
                              Next session: {new Date(mentee.nextSession).toLocaleDateString()} at{" "}
                              {new Date(mentee.nextSession).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-full">
                          {activity.type === "milestone_completed" ? (
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                          ) : (
                            <MessageSquare className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-gray-500">
                            {activity.mentee} &middot; {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div key={session.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{session.mentee}</h4>
                          <Badge variant="outline" className="text-xs">
                            {session.duration}min
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{session.type}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(session.date).toLocaleDateString()} at{" "}
                          {new Date(session.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-transparent" variant="outline">
                    View All Sessions
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => router.push("/applications")}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Review Applications ({stats.pendingApplications})
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => router.push("/profile")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Resources & Guides
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
