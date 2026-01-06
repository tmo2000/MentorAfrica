"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { applicationService, type Application } from "@/lib/matchingService"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Check, Filter, Search } from "lucide-react"

type AppStatus = "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED"

export default function ApplicationsPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [applications, setApplications] = useState<Application[]>([])
  const [statusFilter, setStatusFilter] = useState<AppStatus | "all">("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    if (user.role === "mentor") {
      setApplications(applicationService.listApplicationsForMentor(user.id))
    } else {
      setApplications(applicationService.listMyApplications(user.id))
    }
  }, [router, user])

  if (!user) return null

  const filteredApps = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return applications.filter((app) => {
      const matchesStatus = statusFilter === "all" || app.status === statusFilter
      const matchesSearch =
        term === "" || app.mentorId.toLowerCase().includes(term) || app.payload.motivation?.toLowerCase().includes(term)
      return matchesStatus && matchesSearch
    })
  }, [applications, searchTerm, statusFilter])

  const isMentor = user.role === "mentor"

  const statusBadge = (status: AppStatus) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-yellow-100 text-yellow-800"
      case "UNDER_REVIEW":
        return "bg-blue-100 text-blue-800"
      case "ACCEPTED":
        return "bg-green-100 text-green-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Applications</h1>
              <p className="text-xl text-gray-600">
                {isMentor ? "Review submitted applications" : "Track your applications"}
              </p>
            </div>
            <Button variant="ghost" onClick={() => router.back()}>
              Back
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isMentor ? "Search by mentee goal..." : "Search by mentor id..."}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as AppStatus | "all")}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under review</SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Tabs defaultValue="list" className="space-y-4">
            <TabsList>
              <TabsTrigger value="list">Applications</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <div className="space-y-3">
                {filteredApps.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center text-sm text-gray-600">
                      No applications match your filters.
                    </CardContent>
                  </Card>
                ) : (
                  filteredApps.map((app) => (
                    <Card key={app.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4 flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <p className="text-base font-semibold text-gray-900">
                              {isMentor ? `Mentee ${app.menteeId}` : `Mentor ${app.mentorId}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              Submitted {new Date(app.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={statusBadge(app.status)}>{app.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-700">
                          {app.payload.motivation || "No motivation provided."}
                        </p>

                        {isMentor && app.status !== "ACCEPTED" && app.status !== "REJECTED" ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                applicationService.updateStatus(app.id, "ACCEPTED")
                                setApplications(applicationService.listApplicationsForMentor(user.id))
                              }}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Accept mentee
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                applicationService.updateStatus(app.id, "REJECTED")
                                setApplications(applicationService.listApplicationsForMentor(user.id))
                              }}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Reject
                            </Button>
                          </div>
                        ) : null}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
