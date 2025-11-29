"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, CheckCircle, User, Target, Settings } from "lucide-react"

export default function OnboardingPage() {
  const { user, updateUser } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Common fields
    bio: "",
    location: "",
    timezone: "",
    // Mentor specific
    expertise: [] as string[],
    maxMentees: 3,
    programDuration: "3",
    experience: "",
    // Mentee specific
    goals: "",
    careerBackground: "",
    interests: [] as string[],
    // Admin specific
    department: "",
    permissions: [] as string[],
  })

  if (!user) {
    router.push("/auth/login")
    return null
  }

  const totalSteps = user.role === "admin" ? 1 : 3

  const expertiseOptions = [
    "Software Engineering",
    "Product Management",
    "Data Science",
    "Design",
    "Marketing",
    "Sales",
    "Finance",
    "Operations",
    "Leadership",
    "Entrepreneurship",
  ]

  const interestOptions = [
    "Career Growth",
    "Technical Skills",
    "Leadership",
    "Networking",
    "Industry Knowledge",
    "Work-Life Balance",
    "Entrepreneurship",
    "Public Speaking",
  ]

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    if (user.role === "mentor") {
      const required =
        formData.bio.trim() &&
        formData.location.trim() &&
        formData.timezone.trim() &&
        formData.expertise.length > 0 &&
        formData.programDuration
      if (!required) {
        alert("Please complete bio, location, timezone, expertise, and program duration.")
        return
      }
    }

    // Save profile locally
    updateUser({
      isOnboarded: true,
      profile: { ...formData },
      mentorApprovalStatus: user.role === "mentor" ? "pending" : user.mentorApprovalStatus,
    })

    // Redirect based on role
    switch (user.role) {
      case "mentor":
        router.push("/mentor/dashboard")
        break
      case "mentee":
        router.push("/mentee/dashboard")
        break
      case "admin":
        router.push("/admin/dashboard")
        break
      default:
        router.push("/")
    }
  }

  const toggleArrayItem = (array: string[], item: string, setter: (items: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter((i) => i !== item))
    } else {
      setter([...array, item])
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        if (user.role === "admin") {
          return (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <Settings className="h-12 w-12 text-blue-600 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-900">Admin Configuration</h2>
                <p className="text-gray-600">Set up your administrative preferences</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="it">Information Technology</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="management">Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Administrative Permissions</Label>
                  <div className="space-y-2 mt-2">
                    {["User Management", "Program Oversight", "Analytics Access", "System Configuration"].map(
                      (permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission}
                            checked={formData.permissions.includes(permission)}
                            onCheckedChange={() =>
                              toggleArrayItem(formData.permissions, permission, (items) =>
                                setFormData({ ...formData, permissions: items }),
                              )
                            }
                          />
                          <Label htmlFor={permission} className="text-sm">
                            {permission}
                          </Label>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        }

        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <User className="h-12 w-12 text-blue-600 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-900">Tell us about yourself</h2>
              <p className="text-gray-600">Help others get to know you better</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about your background, interests, and what drives you..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., San Francisco, CA"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) => setFormData({ ...formData, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                      <SelectItem value="MST">Mountain Time (MST)</SelectItem>
                      <SelectItem value="CST">Central Time (CST)</SelectItem>
                      <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        if (user.role === "mentor") {
          return (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <Target className="h-12 w-12 text-blue-600 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-900">Your Mentoring Preferences</h2>
                <p className="text-gray-600">Set up your mentoring capacity and expertise</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Areas of Expertise</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {expertiseOptions.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={formData.expertise.includes(skill)}
                          onCheckedChange={() =>
                            toggleArrayItem(formData.expertise, skill, (items) =>
                              setFormData({ ...formData, expertise: items }),
                            )
                          }
                        />
                        <Label htmlFor={skill} className="text-sm">
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxMentees">Max Mentees per Cycle</Label>
                    <Select
                      value={formData.maxMentees.toString()}
                      onValueChange={(value) => setFormData({ ...formData, maxMentees: Number.parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 mentee</SelectItem>
                        <SelectItem value="2">2 mentees</SelectItem>
                        <SelectItem value="3">3 mentees</SelectItem>
                        <SelectItem value="4">4 mentees</SelectItem>
                        <SelectItem value="5">5 mentees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="programDuration">Preferred Program Duration</Label>
                    <Select
                      value={formData.programDuration}
                      onValueChange={(value) => setFormData({ ...formData, programDuration: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 months</SelectItem>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )
        } else if (user.role === "mentee") {
          return (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <Target className="h-12 w-12 text-blue-600 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-900">Your Goals & Background</h2>
                <p className="text-gray-600">Help us match you with the right mentor</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="goals">What are your goals?</Label>
                  <Textarea
                    id="goals"
                    placeholder="Describe what you want to achieve through mentorship..."
                    value={formData.goals}
                    onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="careerBackground">Career Background</Label>
                  <Textarea
                    id="careerBackground"
                    placeholder="Tell us about your current role, experience, and career journey..."
                    value={formData.careerBackground}
                    onChange={(e) => setFormData({ ...formData, careerBackground: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label>Areas of Interest</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {interestOptions.map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox
                          id={interest}
                          checked={formData.interests.includes(interest)}
                          onCheckedChange={() =>
                            toggleArrayItem(formData.interests, interest, (items) =>
                              setFormData({ ...formData, interests: items }),
                            )
                          }
                        />
                        <Label htmlFor={interest} className="text-sm">
                          {interest}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        }

      case 3:
        if (user.role === "mentor") {
          return (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-900">Experience & Availability</h2>
                <p className="text-gray-600">Final details about your mentoring experience</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="experience">Mentoring Experience</Label>
                  <Textarea
                    id="experience"
                    placeholder="Describe your previous mentoring experience, leadership roles, or teaching background..."
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Your Mentoring Profile Summary</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p>
                      <strong>Expertise:</strong> {formData.expertise.join(", ") || "Not specified"}
                    </p>
                    <p>
                      <strong>Capacity:</strong> {formData.maxMentees} mentees per {formData.programDuration} month
                      cycle
                    </p>
                    <p>
                      <strong>Location:</strong> {formData.location || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        } else {
          // Mentee final step
          return (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-900">Ready to Get Started!</h2>
                <p className="text-gray-600">Review your profile and complete setup</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Your Profile Summary</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>
                    <strong>Goals:</strong> {formData.goals || "Not specified"}
                  </p>
                  <p>
                    <strong>Interests:</strong> {formData.interests.join(", ") || "Not specified"}
                  </p>
                  <p>
                    <strong>Location:</strong> {formData.location || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-gray-600">
                  Once you complete onboarding, you'll be able to browse available mentors and apply to programs that
                  match your goals.
                </p>
              </div>
            </div>
          )
        }

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep} of {totalSteps}
              </span>
              <Badge variant="secondary" className="capitalize">
                {user.role} Setup
              </Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome to MentorConnect
              </CardTitle>
              <CardDescription className="text-lg">Let's set up your {user.role} profile</CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              {renderStepContent()}

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                {currentStep === totalSteps ? (
                  <Button onClick={handleComplete} className="flex items-center gap-2">
                    Complete Setup
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="flex items-center gap-2">
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
