import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockMentors } from "@/lib/mock-mentors"
import { Clock, MapPin, Star, Users, ArrowLeft } from "lucide-react"

export default async function MentorDetailsPage({ params }: any) {
  const resolvedParams = params && "then" in params ? await params : params
  const mentor = mockMentors.find((m) => m.id === resolvedParams?.id)
  if (!mentor) return notFound()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">MentorAfrica</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/mentors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to mentors
            </Link>
          </Button>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16">
                <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                  {mentor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-3xl">{mentor.name}</CardTitle>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {mentor.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {mentor.timezone}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {mentor.rating} rating
              </Badge>
              <Badge variant={mentor.available ? "default" : "outline"}>
                {mentor.available ? "Accepting mentees" : "Currently full"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {mentor.expertise.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-700">
              <div className="rounded-xl bg-blue-50 p-3">
                <div className="flex items-center gap-2 text-blue-800 font-semibold">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {mentor.rating} rating
                </div>
                <p className="text-gray-500 mt-1">{mentor.totalMentees} total mentees</p>
              </div>
              <div className="rounded-xl bg-indigo-50 p-3">
                <div className="flex items-center gap-2 text-indigo-800 font-semibold">
                  <Users className="h-4 w-4" />
                  {mentor.currentMentees}/{mentor.maxMentees} mentees
                </div>
                <p className="text-gray-500 mt-1">{mentor.programDuration}-month programs</p>
              </div>
              <div className="rounded-xl bg-green-50 p-3">
                <div className="flex items-center gap-2 text-green-800 font-semibold">
                  {mentor.available ? "Accepting mentees" : "Currently full"}
                </div>
                <p className="text-gray-500 mt-1">Availability updates weekly</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">About this mentor</h3>
                <p className="leading-relaxed text-gray-700">{mentor.bio}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Program fit</h3>
                <p className="text-sm text-gray-700">Track length: {mentor.programDuration} months</p>
                <p className="text-sm text-gray-700">Timezone: {mentor.timezone}</p>
                <p className="text-sm text-gray-700">Location: {mentor.location}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href={`/apply/${mentor.id}`}>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">Apply for this mentor</Button>
              </Link>
              <Link href="/mentors">
                <Button variant="outline">Back to mentors</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
