import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Target, Star, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function Page2() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MentorAfrica</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

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
            {/* Mentor 1 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-col items-center text-center">
                <img
                  src= "/mentor1.jpg"
                  alt="Mentor 1"
                  className="w-48 h-48 rounded-full mb-4 object-cover"
                />
                <CardTitle className="text-xl">Temisola Olajide</CardTitle>
                <CardDescription>Senior Software Engineer @ Google</CardDescription>
                <Badge className="mt-2 bg-blue-100 text-blue-700">Software Engineering</Badge>
              </CardHeader>
            </Card>

            {/* Mentor 2 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-col items-center text-center">
                <img
                  src="/mentor2.jpg"
                  alt="Mentor 2"
                  className="w-48 h-48 rounded-full mb-4 object-cover"
                />
                <CardTitle className="text-xl">Hakeem Olajide</CardTitle>
                <CardDescription>Product Manager @ Microsoft</CardDescription>
                <Badge className="mt-2 bg-green-100 text-green-700">Product Management</Badge>
              </CardHeader>
            </Card>

            {/* Mentor 3 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-col items-center text-center">
                <img
                  src="/mentor3.jpg"
                  alt="Mentor 3"
                  className="w-48 h-48 rounded-full mb-4 object-cover"
                />
                <CardTitle className="text-xl">Funmi Olajide</CardTitle>
                <CardDescription>Principal @ Greensprings</CardDescription>
                <Badge className="mt-2 bg-purple-100 text-purple-700">Data Science</Badge>
              </CardHeader>
            </Card>

            {/* Mentor 4 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-col items-center text-center">
                <img
                  src=""
                  alt="Mentor 4"
                  className="w-48 h-48 rounded-full mb-4 object-cover"
                />
                <CardTitle className="text-xl">Toyin Ogunmola</CardTitle>
                <CardDescription>Data Mining @ Standard Bank</CardDescription>
                <Badge className="mt-2 bg-purple-100 text-purple-700">Data Science</Badge>
              </CardHeader>
            </Card>
            
            {/* Mentor 5 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-col items-center text-center">
                <img
                  src=""
                  alt="Mentor 5"
                  className="w-48 h-48 rounded-full mb-4 object-cover"
                />
                <CardTitle className="text-xl">Toye Olalekan </CardTitle>
                <CardDescription>Data Scientist @ Meta</CardDescription>
                <Badge className="mt-2 bg-purple-100 text-purple-700">Data Science</Badge>
              </CardHeader>
            </Card>
            
            {/* Mentor 6 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-col items-center text-center">
                <img
                  src=""
                  alt="Mentor 6"
                  className="w-48 h-48 rounded-full mb-4 object-cover"
                />
                <CardTitle className="text-xl">Funmi Olajide</CardTitle>
                <CardDescription>Data Scientist @ Meta</CardDescription>
                <Badge className="mt-2 bg-purple-100 text-purple-700">Data Science</Badge>
              </CardHeader>
            </Card>
            
            {/* Mentor 7 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-col items-center text-center">
                <img
                  src=""
                  alt="Mentor 7"
                  className="w-48 h-48 rounded-full mb-4 object-cover"
                />
                <CardTitle className="text-xl">Funmi Olajide</CardTitle>
                <CardDescription>Data Scientist @ Meta</CardDescription>
                <Badge className="mt-2 bg-purple-100 text-purple-700">Data Science</Badge>
              </CardHeader>
            </Card>
            
            {/* Mentor 8 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-col items-center text-center">
                <img
                  src=""
                  alt="Mentor 8"
                  className="w-48 h-48 rounded-full mb-4 object-cover"
                />
                <CardTitle className="text-xl">Funmi Olajide</CardTitle>
                <CardDescription>Data Scientist @ Meta</CardDescription>
                <Badge className="mt-2 bg-purple-100 text-purple-700">Data Science</Badge>
              </CardHeader>
            </Card>
            
            {/* Mentor 9 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-col items-center text-center">
                <img
                  src=""
                  alt="Mentor 9"
                  className="w-48 h-48 rounded-full mb-4 object-cover"
                />
                <CardTitle className="text-xl">Funmi Olajide</CardTitle>
                <CardDescription>Data Scientist @ Meta</CardDescription>
                <Badge className="mt-2 bg-purple-100 text-purple-700">Data Science</Badge>
              </CardHeader>
            </Card>
            
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