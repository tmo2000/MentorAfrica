"use client"

import Link from "next/link"
import { useState } from "react"
import { useAuth, type UserRole } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Edit,
  Save,
  X,
  MapPin,
  Clock,
  Users,
  Target,
  Award,
  Star,
  BookOpen,
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

type MentorProfile = {
  bio: string
  location: string
  timezone: string
  expertise: string[]
  maxMentees: number
  programDuration: string
  experience: string
  rating: number
  totalMentees: number
  completedPrograms: number
}

type MenteeProfile = {
  bio: string
  location: string
  timezone: string
  goals: string
  careerBackground: string
  interests: string[]
  currentProgram?: string
  mentor?: string
}

type Profile = MentorProfile | MenteeProfile

const mentorProfileTemplate: MentorProfile = {
  bio: "Experienced software engineer with 10+ years in tech leadership. Passionate about helping others grow their careers and navigate the complexities of the tech industry.",
  location: "San Francisco, CA",
  timezone: "PST",
  expertise: ["Software Engineering", "Leadership", "Product Management"],
  maxMentees: 3,
  programDuration: "6",
  experience:
    "I've mentored over 20 engineers throughout my career, helping them advance from junior to senior roles. I've led teams at both startups and Fortune 500 companies.",
  rating: 4.9,
  totalMentees: 15,
  completedPrograms: 12,
}

const menteeProfileTemplate: MenteeProfile = {
  bio: "Junior software developer eager to learn and grow. Currently working at a startup and looking to advance my technical and leadership skills.",
  location: "Austin, TX",
  timezone: "CST",
  goals: "I want to become a senior engineer within the next 2 years and eventually move into technical leadership roles.",
  careerBackground:
    "Recently graduated with a CS degree and have been working as a junior developer for 8 months. I'm passionate about full-stack development.",
  interests: ["Technical Skills", "Career Growth", "Leadership"],
  currentProgram: "6-month Technical Leadership Track",
  mentor: "Sarah Johnson",
}

const mentorProfilesByEmail: Record<string, MentorProfile> = {
  "mentor@example.com": { ...mentorProfileTemplate },
  "tobi@example.com": {
    bio: "Senior frontend engineer focused on delightful user experiences and mentoring new developers.",
    location: "Lagos, NG",
    timezone: "WAT",
    expertise: ["Frontend", "React", "TypeScript", "UI/UX"],
    maxMentees: 4,
    programDuration: "3",
    experience:
      "Led design systems and web performance initiatives across multiple startups. Mentored cohorts of junior developers into mid-level roles.",
    rating: 4.8,
    totalMentees: 18,
    completedPrograms: 10,
  },
}

const getProfileByRole = (role?: UserRole, email?: string, overrides?: Partial<Profile>): Profile => {
  if (role === "mentor") {
    const base = mentorProfilesByEmail[email ?? ""] ? { ...mentorProfilesByEmail[email ?? ""] } : { ...mentorProfileTemplate }
    return { ...base, ...(overrides || {}) } as MentorProfile
  }
  return { ...menteeProfileTemplate, ...(overrides || {}) } as MenteeProfile
}

const isMentorProfile = (profile: Profile): profile is MentorProfile => "maxMentees" in profile

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<Profile>(() => getProfileByRole(user?.role, user?.email, user?.profile as Partial<Profile>))
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  if (!user) {
    router.push("/auth/login")
    return null
  }

  const handleSave = () => {
    // Mock save - in real app, this would update the database
    console.log("[v0] Profile updated:", profileData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setProfileData(getProfileByRole(user.role, user.email, user.profile as Partial<Profile>))
    setIsEditing(false)
  }

  const renderApplicationStatus = () => {
    const status = user.applicationStatus || (user.appliedMentorId ? "submitted" : "none")
    const mentorName = user.appliedMentorName || "your mentor"

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Application status</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-2">
          {(() => {
            if (status === "accepted") {
              return (
                <>
                  <p>
                    You are currently in a mentorship program with <span className="font-semibold">{mentorName}</span>.
                  </p>
                  <p>No active applications. Explore more mentors anytime.</p>
                  <Link href="/mentors" className="text-blue-600 font-semibold underline">
                    Browse mentors
                  </Link>
                </>
              )
            }

            if (status === "draft") {
              return (
                <>
                  <p>
                    You started an application for <span className="font-semibold">{mentorName}</span> but haven&apos;t
                    completed it.
                  </p>
                  <Button asChild variant="outline" className="mt-1">
                    <Link href={user.appliedMentorId ? `/apply/${user.appliedMentorId}` : "/mentors"}>
                      Complete application
                    </Link>
                  </Button>
                </>
              )
            }

            if (status === "submitted") {
              return (
                <>
                  <p>
                    Application submitted to <span className="font-semibold">{mentorName}</span>. Awaiting response.
                  </p>
                  {user.applicationNote && (
                    <p className="text-gray-600">
                      <span className="font-semibold">Your note:</span> {user.applicationNote}
                    </p>
                  )}
                  <Button asChild variant="outline" className="mt-1">
                    <Link href="/mentors">Browse other mentors</Link>
                  </Button>
                </>
              )
            }

            if (status === "rejected") {
              return (
                <>
                  <p>Your last application was not accepted.</p>
                  <Button asChild className="mt-1">
                    <Link href="/mentors">Find another mentor</Link>
                  </Button>
                </>
              )
            }

            return (
              <>
                <p>No applications at the moment.</p>
                <Button asChild className="mt-1">
                  <Link href="/mentors">Browse mentors</Link>
                </Button>
              </>
            )
          })()}
        </CardContent>
      </Card>
    )
  }

  const renderMentorProfile = (profile: MentorProfile) => (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-700">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1 mt-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{profile.rating}</span>
                <span className="text-gray-500 text-sm">({profile.totalMentees} mentees)</span>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <Badge variant="secondary" className="mt-1 capitalize">
                    {user.role}
                  </Badge>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "outline" : "default"}
                  className="flex items-center gap-2"
                >
                  {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{profile.timezone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{profile.maxMentees} max mentees</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {user.mentorApprovalStatus === "pending" && (
        <Card>
          <CardContent className="text-sm text-blue-800 bg-blue-50 border-blue-200">
            Your profile is under review. Admin approval is required before you appear publicly.
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{profile.totalMentees}</p>
                <p className="text-sm text-gray-600">Total Mentees</p>
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
                <p className="text-2xl font-bold text-gray-900">{profile.completedPrograms}</p>
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
                <p className="text-2xl font-bold text-gray-900">{profile.rating}</p>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mentor edit section */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div>
                <Label htmlFor="mentor-bio">Bio</Label>
                <Textarea
                  id="mentor-bio"
                  value={profile.bio}
                  onChange={(e) => setProfileData({ ...profile, bio: e.target.value })}
                  className="min-h-[120px]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mentor-location">Location</Label>
                  <Input
                    id="mentor-location"
                    value={profile.location}
                    onChange={(e) => setProfileData({ ...profile, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="mentor-timezone">Timezone</Label>
                  <Input
                    id="mentor-timezone"
                    value={profile.timezone}
                    onChange={(e) => setProfileData({ ...profile, timezone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="mentor-expertise">Expertise (comma-separated)</Label>
                <Input
                  id="mentor-expertise"
                  value={profile.expertise.join(", ")}
                  onChange={(e) =>
                    setProfileData({
                      ...profile,
                      expertise: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mentor-max">Max mentees</Label>
                  <Input
                    id="mentor-max"
                    type="number"
                    value={profile.maxMentees}
                    onChange={(e) => setProfileData({ ...profile, maxMentees: Number(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="mentor-duration">Program duration (months)</Label>
                  <Input
                    id="mentor-duration"
                    type="number"
                    value={profile.programDuration}
                    onChange={(e) => setProfileData({ ...profile, programDuration: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="mentor-experience">Experience</Label>
                <Textarea
                  id="mentor-experience"
                  value={profile.experience}
                  onChange={(e) => setProfileData({ ...profile, experience: e.target.value })}
                  className="min-h-[120px]"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <p className="text-gray-600 text-sm">Click &ldquo;Edit Profile&rdquo; to update your mentoring details.</p>
          )}
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Tabs defaultValue="about" className="space-y-4">
        <TabsList>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="expertise">Expertise</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
        </TabsList>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfileData({ ...profile, bio: e.target.value })}
                      className="min-h-[120px]"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => setProfileData({ ...profile, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Input
                        id="timezone"
                        value={profile.timezone}
                        onChange={(e) => setProfileData({ ...profile, timezone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expertise">
          <Card>
            <CardHeader>
              <CardTitle>Areas of Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.expertise?.map((skill: string) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Program Duration:</strong> {profile.programDuration} months
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      <strong>Mentee Capacity:</strong> Up to {profile.maxMentees} mentees per cycle
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <CardTitle>Mentoring Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{profile.experience}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

  const renderMenteeProfile = (profile: MenteeProfile) => (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-lg font-semibold bg-green-100 text-green-700">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {profile.currentProgram && (
                <Badge variant="default" className="mt-2 bg-green-600">
                  Active Program
                </Badge>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <Badge variant="secondary" className="mt-1 capitalize">
                    {user.role}
                  </Badge>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "outline" : "default"}
                  className="flex items-center gap-2"
                >
                  {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{profile.timezone}</span>
                </div>
              </div>

              {profile.currentProgram && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <BookOpen className="h-4 w-4" />
                    <span className="font-semibold">Current Program: {profile.currentProgram}</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">Mentor: {profile.mentor}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      {/* Profile Details */}
      <Tabs defaultValue="about" className="space-y-4">
        <TabsList>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="interests">Interests</TabsTrigger>
        </TabsList>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfileData({ ...profile, bio: e.target.value })}
                      className="min-h-[120px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="careerBackground">Career Background</Label>
                    <Textarea
                      id="careerBackground"
                      value={profile.careerBackground}
                      onChange={(e) => setProfileData({ ...profile, careerBackground: e.target.value })}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => setProfileData({ ...profile, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Input
                        id="timezone"
                        value={profile.timezone}
                        onChange={(e) => setProfileData({ ...profile, timezone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Bio</h3>
                    <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Career Background</h3>
                    <p className="text-gray-700 leading-relaxed">{profile.careerBackground}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                My Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="goals">Goals</Label>
                    <Textarea
                      id="goals"
                      value={profile.goals}
                      onChange={(e) => setProfileData({ ...profile, goals: e.target.value })}
                      className="min-h-[120px]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 leading-relaxed">{profile.goals}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interests">
          <Card>
            <CardHeader>
              <CardTitle>Areas of Interest</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.interests?.map((interest: string) => (
                  <Badge key={interest} variant="outline" className="px-3 py-1">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

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
        <div className="max-w-4xl mx-auto">
          {isMentorProfile(profileData) ? renderMentorProfile(profileData) : renderMenteeProfile(profileData)}
        </div>
      </div>
    </div>
  )
}
