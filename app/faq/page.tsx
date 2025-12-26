"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

import { SiteHeader } from "@/components/site-header"

export default function FaqPage() {
  const faqs = [
    {
      q: "How do I become a mentor?",
      a: "Sign up as a mentor, complete onboarding, and our team will review and approve your profile before you are listed.",
    },
    {
      q: "How do mentee applications work?",
      a: "Mentees browse mentors, submit an application, and mentors review and accept based on fit and availability.",
    },
    {
      q: "Can I change my mentor after applying?",
      a: "If your application is pending or declined, you can apply to another mentor. Active mentees can request a change through support.",
    },
    {
      q: "What is the typical program length?",
      a: "Programs run 3, 6, or 12 months depending on the mentor's offering and your agreed plan.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <SiteHeader />

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <HelpCircle className="h-4 w-4" />
            FAQs
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Answers to common questions</h1>
          <p className="text-gray-600">No account needed—browse freely.</p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((item, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border rounded-lg bg-white shadow-sm px-4">
              <AccordionTrigger className="text-left text-base font-semibold text-gray-900">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 pb-4">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
    </div>
  )
}
