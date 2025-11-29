"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Target, Star, TrendingUp, LogOut, Settings, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { mockMentors } from "@/lib/mock-mentors"
import { MentorCard } from "@/components/mentor-card"
import { useAuth } from "@/components/auth-provider"

export default function HomePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const previewMentors = mockMentors.slice(0, 3)

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
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
                        <Link href="/settings" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Track application
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="flex items-center gap-2 text-red-600"
                      onSelect={() => {
                        logout()
                        router.push("/")
                      }}
                    >
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

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100">Trusted by 10,000+ professionals</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
            Connect. Learn.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Grow.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-pretty">
            A curated ecosystem of African excellence and diaspora wisdom where 
            guidance is given out of love, responsibility, and cultural connection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register?role=mentee">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Find a Mentor <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/auth/register?role=mentor">
              <Button size="lg" variant="outline" className="border-2 bg-transparent">
                Become a Mentor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose MentorAfrica?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform is designed to create meaningful, structured mentorship relationships with young African mentees that drive real career
              growth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Structured Programs</CardTitle>
                <CardDescription>
                  Choose from 3, 6, or 12-month programs with clear milestones and progress tracking.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>Expert Mentors</CardTitle>
                <CardDescription>
                  Connect with industry leaders and experienced professionals who are passionate about giving back.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Track Progress</CardTitle>
                <CardDescription>
                  Monitor your growth with detailed dashboards, feedback systems, and milestone tracking.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    
      {/*Mentor's Section*/}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Mentors</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Learn from top industry experts across Africa who are passionate about guiding the next generation of leaders.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {previewMentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Link href="/mentors">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                See More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto text-center">
          <div className="grid md:grid-cols-3 gap-8 text-white">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Expert Mentors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">MentorAfrica</span>
          </div>
          <p className="text-gray-400">© 2024 MentorAfrica. <br /> A solution by Ascentree Services Ltd. <br /> All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
