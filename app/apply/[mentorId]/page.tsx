"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Send } from "lucide-react"

export default function MentorSpecificApplyRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/apply")
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <SiteHeader />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Applications are centralized
              </CardTitle>
              <CardDescription>Apply once and we&apos;ll match you to the best mentor for your goals.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Individual mentor applications are no longer used. Submit a single application and our team will pair
                you with an available mentor.
              </p>
              <div className="flex gap-3">
                <Button onClick={() => router.push("/apply")}>Go to application</Button>
                <Button variant="outline" onClick={() => router.push("/mentors")} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to mentors
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
