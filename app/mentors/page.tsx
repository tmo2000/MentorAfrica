"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockMentors } from "@/lib/mock-mentors"
import { Search, Filter, Users, LogOut, Settings, User } from "lucide-react"
import { MentorCard } from "@/components/mentor-card"
import { useAuth } from "@/components/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function MentorsPage() {
  const allExpertise = Array.from(new Set(mockMentors.flatMap((mentor) => mentor.expertise)))

  const { user, logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedExpertise, setSelectedExpertise] = useState("All Expertise")
  const [selectedDuration, setSelectedDuration] = useState("Any Duration")
  const [showAvailableOnly, setShowAvailableOnly] = useState(true)
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navbar */}
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
              {user ? (
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
                      <Link
                        href={user.role === "mentor" ? "/mentor/dashboard" : "/settings"}
                        className="flex items-center gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        Profile & Settings
                      </Link>
                    </DropdownMenuItem>
                    {user.role !== "mentor" && (
                      <DropdownMenuItem asChild>
                        <Link href="/applications" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Track application
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center gap-2 text-red-600" onSelect={() => logout()}>
                      <LogOut className="h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

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
              <MentorCard key={mentor.id} mentor={mentor} />
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
