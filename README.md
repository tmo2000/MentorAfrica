# MentorAfrica 🚀

MentorAfrica is a mentorship platform that connects experienced professionals with the next generation of African leaders.  
This project is built with **Next.js 14, TailwindCSS, and shadcn/ui**.

---

## ✨ Features

- 🌍 Landing page with modern responsive design
- 🧑‍🏫 Mentor showcase cards with profile pictures
- 🔐 Authentication pages (Login & Register)
- 🎯 Structured mentorship programs
- 📊 Stats and success metrics
- ⚡ Built with performance and scalability in mind

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) + [lucide-react icons](https://lucide.dev/)

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/mentorafrica.git
cd mentorafrica
2. Install dependencies
bash
Copy code
npm install
# or
yarn install
3. Run the development server
bash
Copy code
npm run dev
Open http://localhost:3000 to view it in the browser.

4. Build for production
bash
Copy code
npm run build
npm run start

## Developer note: matching flow

- The apply flow is now two-stage: mentees express interest (EOI) on a mentor profile (ranked, max 3); mentors invite them to apply (quota 8/month); mentees must accept exactly one invite to unlock the full application form.
- Frontend-only data for EOIs, invites, applications, and mentorships is stored via `lib/matchingService.ts` (localStorage-backed). Swap these helpers with real API calls when backend endpoints are ready.
- Key screens: `app/mentors/[id]/page.tsx` (Express Interest), `app/mentee/dashboard/page.tsx` (interests/invites/applications), `app/mentor/dashboard/page.tsx` (EOIs + invites), `app/apply/page.tsx` (gated full application), and `app/applications/page.tsx` (application list).
