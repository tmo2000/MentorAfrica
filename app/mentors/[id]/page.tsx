"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import type { Mentor } from "@/lib/mock-mentors"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Clock, Star, ArrowLeft, CheckCircle } from "lucide-react"

export default function MentorDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const mentorId = params.id as string

  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!mentorId) return

    ;(async () => {
      setLoading(true)
      const { data, error } = await supabase.from("mentors").select("*").eq("id", mentorId).single()

      if (error || !data) {
        console.error("Supabase mentor fetch error:", error)
        setMentor(null)
        setLoading(false)
        return
      }

      const mapped: Mentor = {
        id: data.id,
        name: data.name,
        bio: data.bio ?? "",
        location: data.location ?? "",
        timezone: data.timezone ?? "",
        expertise: Array.isArray(data.expertise) ? data.expertise : [],
        maxMentees: data.max_mentees ?? 0,
        currentMentees: data.current_mentees ?? 0,
        programDuration: String(data.program_duration_months ?? ""),
        rating: Number(data.rating ?? 0),
        totalMentees: data.total_mentees ?? 0,
        avatar: data.avatar || null,
        available: Boolean(data.available),
      }

      setMentor(mapped)
      setLoading(false)
    })()
  }, [mentorId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">Loading mentor...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <SiteHeader />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center space-y-4">
              <p className="text-gray-700">Mentor not found.</p>
              <Button onClick={() => router.push("/mentors")} className="flex items-center gap-2 justify-center">
                <ArrowLeft className="h-4 w-4" />
                Back to mentors
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <SiteHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <Button variant="ghost" onClick={() => router.push("/mentors")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to mentors
          </Button>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
                  <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-700">
                    {mentor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">{mentor.name}</h1>
                    {mentor.available && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        Available
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {mentor.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {mentor.timezone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {mentor.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => router.push("/apply")} className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  Apply for mentorship
                </Button>
                <Button variant="outline" onClick={() => router.push("/mentors")}>
                  Browse mentors
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <CardTitle>About</CardTitle>
                <CardDescription className="text-gray-700 leading-relaxed">{mentor.bio || "No bio provided yet."}</CardDescription>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.length === 0 ? (
                    <span className="text-sm text-gray-500">No expertise listed.</span>
                  ) : (
                    mentor.expertise.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-500">Program duration</p>
                    <p className="text-xl font-semibold text-gray-900">{mentor.programDuration || "N/A"} months</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-500">Mentee capacity</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {mentor.currentMentees}/{mentor.maxMentees || 0} mentees
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-500">Past mentees</p>
                    <p className="text-xl font-semibold text-gray-900">{mentor.totalMentees}</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
