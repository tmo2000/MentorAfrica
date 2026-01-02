import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabaseClient"
import { Clock, MapPin, Star, Users, ArrowLeft } from "lucide-react"

interface MentorPageProps {
  params: { id: string }
}

export default async function MentorDetailsPage({ params }: MentorPageProps) {
  const { data: mentor, error } = await supabase
    .from("mentors")
    .select("*")
    .eq("id", params.id)
    .single()

  if (error || !mentor) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/mentors" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            Back to mentors
          </Link>
        </div>

        {/* Mentor Card */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={mentor.avatar || undefined} />
              <AvatarFallback>
                {mentor.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <CardTitle className="text-2xl">{mentor.name}</CardTitle>
              <div className="flex flex-wrap gap-2">
                {mentor.expertise?.map((skill: string) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-gray-700">{mentor.bio}</p>

            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {mentor.location}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {mentor.timezone}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {mentor.current_mentees} / {mentor.max_mentees} mentees
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                {mentor.rating} rating
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
              Apply for Mentorship
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
