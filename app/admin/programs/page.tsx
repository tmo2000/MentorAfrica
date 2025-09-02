"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Filter, Calendar, TrendingUp, Award, Eye, AlertTriangle, CheckCircle } from "lucide-react"

// Mock programs data
const mockPrograms = [
  {
    id: "1",
    mentor: "Sarah Johnson",
    mentee: "Alex Chen",
    programName: "6-month Technical Leadership Track",
    duration: "6",
    startDate: "2024-01-15",
    endDate: "2024-07-15",
    status: "active",
    progress: 65,
    sessionsCompleted: 8,
    totalSessions: 12,
    rating: 4.8,
    lastActivity: "2024-02-10",
  },
  {
    id: "2",
    mentor: "Michael Rodriguez",
    mentee: "Jordan Smith",
    programName: "3-month Product Transition",
    duration: "3",
    startDate: "2024-02-01",
    endDate: "2024-05-01",
    status: "active",
    progress: 30,
    sessionsCompleted: 2,
    totalSessions: 6,
    rating: null,
    lastActivity: "2024-02-09",
  },
  {
    id: "3",
    mentor: "Emily Davis",
    mentee: "Sam Wilson",
    programName: "12-month Career Development",
    duration: "12",
    startDate: "2023-08-01",
    endDate: "2024-08-01",
    status: "completed",
    progress: 100,
    sessionsCompleted: 24,
    totalSessions: 24,
    rating: 4.9,
    lastActivity: "2024-01-30",
  },
  {
    id: "4",
    mentor: "David Kim",
    mentee: "Lisa Park",
    programName: "6-month Data Science Mentorship",
    duration: "6",
    startDate: "2024-01-01",
    endDate: "2024-07-01",
    status: "at-risk",
    progress: 25,
    sessionsCompleted: 2,
    totalSessions: 12,
    rating: null,
    lastActivity: "2024-01-20",
  },
]

export default function AdminProgramsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [durationFilter, setDurationFilter] = useState("all")
  const [selectedProgram, setSelectedProgram] = useState<any>(null)

  if (!user) {
    router.push("/auth/login")
    return null
  }

  if (user.role !== "admin") {
    router.push("/")
    return null
  }

  const filteredPrograms = mockPrograms.filter((p) => {
    const matchesSearch =
      p.mentor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mentee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.programName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || p.status === statusFilter
    const matchesDuration = durationFilter === "all" || p.duration === durationFilter
    return matchesSearch && matchesStatus && matchesDuration
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "at-risk":
        return "bg-red-100 text-red-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "completed":
        return <Award className="h-4 w-4 text-blue-600" />
      case "at-risk":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />
    }
  }

  const programStats = {
    total: mockPrograms.length,
    active: mockPrograms.filter((p) => p.status === "active").length,
    completed: mockPrograms.filter((p) => p.status === "completed").length,
    atRisk: mockPrograms.filter((p) => p.status === "at-risk").length,
    averageProgress: Math.round(mockPrograms.reduce((acc, p) => acc + p.progress, 0) / mockPrograms.length),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Program Management</h1>
            <p className="text-xl text-gray-600">Monitor and manage all mentorship programs</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-2xl font-bold text-gray-900">{programStats.total}</p>
                <p className="text-sm text-gray-600">Total Programs</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-2xl font-bold text-green-600">{programStats.active}</p>
                <p className="text-sm text-gray-600">Active</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-2xl font-bold text-blue-600">{programStats.completed}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-2xl font-bold text-red-600">{programStats.atRisk}</p>
                <p className="text-sm text-gray-600">At Risk</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-2xl font-bold text-purple-600">{programStats.averageProgress}%</p>
                <p className="text-sm text-gray-600">Avg Progress</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Programs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search programs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="at-risk">At Risk</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={durationFilter} onValueChange={setDurationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Durations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Durations</SelectItem>
                    <SelectItem value="3">3 months</SelectItem>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Programs List */}
          <Card>
            <CardHeader>
              <CardTitle>Programs ({filteredPrograms.length})</CardTitle>
              <CardDescription>Monitor program progress and participant engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPrograms.map((program) => (
                  <div key={program.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(program.status)}
                        <div>
                          <h4 className="font-semibold text-lg">{program.programName}</h4>
                          <p className="text-sm text-gray-600">
                            {program.mentor} mentoring {program.mentee}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(program.startDate).toLocaleDateString()} -{" "}
                            {new Date(program.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(program.status)}>{program.status.replace("-", " ")}</Badge>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedProgram(program)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{program.programName}</DialogTitle>
                              <DialogDescription>Program details and progress tracking</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium">Mentor</p>
                                  <p className="text-sm text-gray-600">{program.mentor}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Mentee</p>
                                  <p className="text-sm text-gray-600">{program.mentee}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Duration</p>
                                  <p className="text-sm text-gray-600">{program.duration} months</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Status</p>
                                  <Badge className={getStatusColor(program.status)}>
                                    {program.status.replace("-", " ")}
                                  </Badge>
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between text-sm mb-2">
                                  <span className="font-medium">Program Progress</span>
                                  <span>{program.progress}%</span>
                                </div>
                                <Progress value={program.progress} className="h-3" />
                              </div>

                              <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                  <p className="text-2xl font-bold text-blue-600">{program.sessionsCompleted}</p>
                                  <p className="text-xs text-gray-600">Sessions Completed</p>
                                </div>
                                <div>
                                  <p className="text-2xl font-bold text-gray-900">{program.totalSessions}</p>
                                  <p className="text-xs text-gray-600">Total Sessions</p>
                                </div>
                                <div>
                                  <p className="text-2xl font-bold text-yellow-600">{program.rating || "N/A"}</p>
                                  <p className="text-xs text-gray-600">Rating</p>
                                </div>
                              </div>

                              <div className="pt-4 border-t">
                                <p className="text-sm text-gray-600">
                                  Last activity: {new Date(program.lastActivity).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{program.progress}%</span>
                        </div>
                        <Progress value={program.progress} className="h-2" />
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-medium">
                          {program.sessionsCompleted}/{program.totalSessions}
                        </p>
                        <p className="text-xs text-gray-600">Sessions</p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-medium">{program.rating || "N/A"}</p>
                        <p className="text-xs text-gray-600">Rating</p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-medium">{new Date(program.lastActivity).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-600">Last Activity</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredPrograms.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No programs found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
