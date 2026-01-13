"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { MentorCard } from "@/components/mentor-card"
import { SiteHeader } from "@/components/site-header"
import { supabase } from "@/lib/supabaseClient"
import type { Mentor } from "@/lib/mock-mentors"

export default function MentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedExpertise, setSelectedExpertise] = useState("All Expertise")
  const [selectedDuration, setSelectedDuration] = useState("Any Duration")
  const [showAvailableOnly, setShowAvailableOnly] = useState(true)

  // Fetch mentors from Supabase
  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabase
        .from("mentors")
        .select("*")

      if (error) {
        console.error("Supabase mentors error:", error)
        setMentors([])
        setLoading(false)
        return
      }

      const mapped: Mentor[] = (data ?? []).map((m: any) => ({
        id: String(m.user_id ?? m.id),
        name: m.name,
        bio: m.bio ?? "",
        location: m.location ?? "",
        timezone: m.timezone ?? "",
        expertise: Array.isArray(m.expertise) ? m.expertise : [],
        maxMentees: m.max_mentees ?? 0,
        currentMentees: m.current_mentees ?? 0,
        programDuration: String(m.program_duration_months ?? ""),
        rating: Number(m.rating ?? 0),
        totalMentees: m.total_mentees ?? 0,
        avatar: m.avatar || null,
        available: Boolean(m.available),
      }))

      setMentors(mapped)
      setLoading(false)
    })()
  }, [])

  const allExpertise = Array.from(
    new Set(mentors.flatMap((mentor) => mentor.expertise))
  )

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.expertise.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )

    const matchesExpertise =
      selectedExpertise === "All Expertise" ||
      mentor.expertise.includes(selectedExpertise)

    const matchesDuration =
      selectedDuration === "Any Duration" ||
      mentor.programDuration === selectedDuration

    const matchesAvailability =
      !showAvailableOnly || mentor.available

    return (
      matchesSearch &&
      matchesExpertise &&
      matchesDuration &&
      matchesAvailability
    )
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading mentors...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <SiteHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Mentor
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with experienced professionals who can guide your career growth
            </p>
            <div className="mt-6 flex justify-center">
              <Link href="/mentee/dashboard">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">View my interests</Button>
              </Link>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Mentors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search mentors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedExpertise} onValueChange={setSelectedExpertise}>
                  <SelectTrigger>
                    <SelectValue placeholder="Expertise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Expertise">All Expertise</SelectItem>
                    {allExpertise.map((skill) => (
                      <SelectItem key={skill} value={skill}>
                        {skill}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any Duration">Any Duration</SelectItem>
                    <SelectItem value="3">3 months</SelectItem>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">1 year</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="available"
                    checked={showAvailableOnly}
                    onChange={(e) => setShowAvailableOnly(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="available" className="text-sm font-medium">
                    Available only
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMentors.map((mentor) => (
              <Link key={mentor.id} href={`/mentors/${mentor.id}`} className="block">
                <MentorCard mentor={mentor} />
              </Link>
            ))}

          </div>

          {filteredMentors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No mentors found matching your criteria.
              </p>
              <p className="text-gray-400 mt-2">
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
