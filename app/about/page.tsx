"use client"

import Link from "next/link"
import { ArrowRight, Globe2, HeartHandshake, Layers, Sparkles, Users } from "lucide-react"

import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 via-white to-indigo-100/50" />
        <div className="absolute -top-20 -right-10 h-48 w-48 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="absolute bottom-0 -left-20 h-56 w-56 rounded-full bg-indigo-300/30 blur-3xl" />

        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white shadow-sm px-3 py-2 text-sm font-medium text-blue-700">
              <Sparkles className="h-4 w-4" />
              The MentorAfrica story
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Culture-rooted mentorship for Africa&apos;s next generation
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              We connect emerging talent with seasoned experts across the continent and diaspora—pairing ambition with
              experience, and structure with heart.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-blue-100 bg-white/80 p-4 shadow-sm">
                <p className="text-sm text-blue-700 font-semibold">Community-first</p>
                <p className="text-xl font-bold text-gray-900">Accountability circles</p>
                <p className="text-sm text-gray-500">Weekly rituals that keep mentors and mentees in lockstep.</p>
              </div>
              <div className="rounded-2xl border border-indigo-100 bg-white/80 p-4 shadow-sm">
                <p className="text-sm text-indigo-700 font-semibold">Measured growth</p>
                <p className="text-xl font-bold text-gray-900">Structured pathways</p>
                <p className="text-sm text-gray-500">3, 6, and 12-month tracks with transparent milestones.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/register?role=mentee">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Join as a mentee <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/auth/register?role=mentor">
                <Button size="lg" variant="outline" className="border-2 bg-white">
                  Become a mentor
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-6 -left-6 h-20 w-20 bg-blue-200 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -right-10 h-24 w-24 bg-indigo-200 rounded-full blur-2xl" />

            <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 p-1 shadow-2xl">
              <div className="rounded-2xl bg-white p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">The network</p>
                      <p className="text-xl font-semibold text-gray-900">MentorAfrica cohort</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">Live</Badge>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Card className="border-0 shadow-md bg-blue-50/70">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Globe2 className="w-5 h-5 text-blue-600" />
                        25 countries
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Cross-border exchanges that celebrate our shared roots.
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className="border-0 shadow-md bg-indigo-50/70">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <HeartHandshake className="w-5 h-5 text-indigo-600" />
                        Human-led
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Matched by intent, chemistry, and learning style—not just CVs.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3">
                    <p className="text-2xl font-bold text-gray-900">10k+</p>
                    <p className="text-xs text-gray-500">Connections</p>
                  </div>
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">
                    <p className="text-2xl font-bold text-gray-900">500+</p>
                    <p className="text-xs text-gray-500">Mentors</p>
                  </div>
                  <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3">
                    <p className="text-2xl font-bold text-gray-900">95%</p>
                    <p className="text-xs text-gray-500">Growth confidence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-1 space-y-4">
            <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">Mission</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Building a continent-wide mentorship fabric
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We design purposeful journeys that feel human, stay accountable, and celebrate every milestone across
              Africa and the diaspora.
            </p>
          </div>

          <div className="lg:col-span-2 grid md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-blue-600" />
                  Human-first
                </CardTitle>
                <CardDescription>
                  Empathy-led matching, honest feedback, and support that meets people where they are.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  Structured growth
                </CardTitle>
                <CardDescription>
                  Playbooks, milestone templates, and progress dashboards that keep momentum visible.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe2 className="w-5 h-5 text-blue-600" />
                  Connected continent
                </CardTitle>
                <CardDescription>
                  A bridge between industries, regions, and cultures—lifting as we climb together.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Impact so far</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We measure success in transformed careers, confident leaders, and stronger communities.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-gray-900 mb-2">10k+</CardTitle>
                <CardDescription>Mentorship connections across Africa and diaspora</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-gray-900 mb-2">500+</CardTitle>
                <CardDescription>Expert mentors vetted for experience and empathy</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-gray-900 mb-2">25</CardTitle>
                <CardDescription>Countries represented in our learning circles</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-gray-900 mb-2">95%</CardTitle>
                <CardDescription>Reported confidence boost after 3 months</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-6xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to mentor or be mentored?</h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            Join a community that believes in lifting as we climb. Your next breakthrough conversation is waiting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/mentors">
              <Button variant="secondary" size="lg" className="text-blue-700 bg-white hover:bg-blue-50">
                Meet our mentors
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white">
                Get started
              </Button>
            </Link>
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
          <p className="text-gray-400">
            Ac 2024 MentorAfrica. <br /> A solution by Ascentree Services Ltd. <br /> All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
