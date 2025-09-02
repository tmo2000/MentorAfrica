"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Save, X, MapPin, Clock, Users, Target, Award, Star, BookOpen } from "lucide-react"

// Mock profile data - in real app, this would come from database
const mockProfiles = {
  mentor: {
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
  },
  mentee: {
    bio: "Junior software developer eager to learn and grow. Currently working at a startup and looking to advance my technical and leadership skills.",
    location: "Austin, TX",
    timezone: "CST",
    goals:
      "I want to become a senior engineer within the next 2 years and eventually move into technical leadership roles.",
    careerBackground:
      "Recently graduated with a CS degree and have been working as a junior developer for 8 months. I'm passionate about full-stack development.",
    interests: ["Technical Skills", "Career Growth", "Leadership"],
    currentProgram: "6-month Technical Leadership Track",
    mentor: "Sarah Johnson",
  },
}

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState(mockProfiles[user?.role as keyof typeof mockProfiles] || {})

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
    setProfileData(mockProfiles[user.role as keyof typeof mockProfiles] || {})
    setIsEditing(false)
  }

  const renderMentorProfile = () => (
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
                <span className="font-semibold">{profileData.rating}</span>
                <span className="text-gray-500 text-sm">({profileData.totalMentees} mentees)</span>
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
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{profileData.timezone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{profileData.maxMentees} max mentees</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{profileData.totalMentees}</p>
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
                <p className="text-2xl font-bold text-gray-900">{profileData.completedPrograms}</p>
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
                <p className="text-2xl font-bold text-gray-900">{profileData.rating}</p>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="min-h-[120px]"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Input
                        id="timezone"
                        value={profileData.timezone}
                        onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
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
                <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
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
                {profileData.expertise?.map((skill: string) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Program Duration:</strong> {profileData.programDuration} months
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  <strong>Mentee Capacity:</strong> Up to {profileData.maxMentees} mentees per cycle
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
              <p className="text-gray-700 leading-relaxed">{profileData.experience}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

  const renderMenteeProfile = () => (
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
              {profileData.currentProgram && (
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
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{profileData.timezone}</span>
                </div>
              </div>

              {profileData.currentProgram && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <BookOpen className="h-4 w-4" />
                    <span className="font-semibold">Current Program: {profileData.currentProgram}</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">Mentor: {profileData.mentor}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

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
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="min-h-[120px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="careerBackground">Career Background</Label>
                    <Textarea
                      id="careerBackground"
                      value={profileData.careerBackground}
                      onChange={(e) => setProfileData({ ...profileData, careerBackground: e.target.value })}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Input
                        id="timezone"
                        value={profileData.timezone}
                        onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
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
                    <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Career Background</h3>
                    <p className="text-gray-700 leading-relaxed">{profileData.careerBackground}</p>
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
                      value={profileData.goals}
                      onChange={(e) => setProfileData({ ...profileData, goals: e.target.value })}
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
                <p className="text-gray-700 leading-relaxed">{profileData.goals}</p>
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
                {profileData.interests?.map((interest: string) => (
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {user.role === "mentor" ? renderMentorProfile() : renderMenteeProfile()}
        </div>
      </div>
    </div>
  )
}
