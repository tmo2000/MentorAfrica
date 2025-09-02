"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Clock, Users, Star, Filter } from "lucide-react"

// Mock mentor data
const mockMentors = [
  {
    id: "1",
    name: "Sarah Johnson",
    bio: "Experienced software engineer with 10+ years in tech leadership. Passionate about helping others grow their careers.",
    location: "San Francisco, CA",
    timezone: "PST",
    expertise: ["Software Engineering", "Leadership", "Product Management"],
    maxMentees: 3,
    currentMentees: 2,
    programDuration: "6",
    rating: 4.9,
    totalMentees: 15,
    avatar: null,
    available: true,
  },
  {
    id: "2",
    name: "Michael Chen",
    bio: "Senior Product Manager at a Fortune 500 company. Specializing in product strategy and team management.",
    location: "New York, NY",
    timezone: "EST",
    expertise: ["Product Management", "Strategy", "Analytics"],
    maxMentees: 2,
    currentMentees: 1,
    programDuration: "3",
    rating: 4.8,
    totalMentees: 8,
    avatar: null,
    available: true,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    bio: "UX Design Director with expertise in design systems and user research. Mentor to aspiring designers.",
    location: "Austin, TX",
    timezone: "CST",
    expertise: ["Design", "UX Research", "Design Systems"],
    maxMentees: 4,
    currentMentees: 4,
    programDuration: "6",
    rating: 4.9,
    totalMentees: 22,
    avatar: null,
    available: false,
  },
  {
    id: "4",
    name: "David Kim",
    bio: "Data Science Lead with experience in machine learning and analytics. Passionate about mentoring in tech.",
    location: "Seattle, WA",
    timezone: "PST",
    expertise: ["Data Science", "Machine Learning", "Analytics"],
    maxMentees: 3,
    currentMentees: 1,
    programDuration: "12",
    rating: 4.7,
    totalMentees: 12,
    avatar: null,
    available: true,
  },
]

export default function MentorsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedExpertise, setSelectedExpertise] = useState("All Expertise")
  const [selectedDuration, setSelectedDuration] = useState("Any Duration")
  const [showAvailableOnly, setShowAvailableOnly] = useState(true)

  const allExpertise = Array.from(new Set(mockMentors.flatMap((mentor) => mentor.expertise)))

  const filteredMentors = mockMentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.expertise.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesExpertise = selectedExpertise === "All Expertise" || mentor.expertise.includes(selectedExpertise)
    const matchesDuration = selectedDuration === "Any Duration" || mentor.programDuration === selectedDuration
    const matchesAvailability = !showAvailableOnly || mentor.available

    return matchesSearch && matchesExpertise && matchesDuration && matchesAvailability
  })

  const handleApply = (mentorId: string) => {
    if (user?.role === "mentee") {
      router.push(`/apply/${mentorId}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Mentor</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with experienced professionals who can guide your career growth
            </p>
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
              <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={mentor.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-700">
                        {mentor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{mentor.name}</CardTitle>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{mentor.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{mentor.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{mentor.timezone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>
                            {mentor.currentMentees}/{mentor.maxMentees} mentees
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <CardDescription className="mb-4 leading-relaxed">{mentor.bio}</CardDescription>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Expertise</p>
                      <div className="flex flex-wrap gap-1">
                        {mentor.expertise.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{mentor.programDuration} month</span> programs
                      </div>

                      {mentor.available ? (
                        <Button
                          onClick={() => handleApply(mentor.id)}
                          disabled={user?.role !== "mentee"}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Apply
                        </Button>
                      ) : (
                        <Badge variant="secondary">Full</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMentors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No mentors found matching your criteria.</p>
              <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
