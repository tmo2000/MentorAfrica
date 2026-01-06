"use client"

/**
 * Lightweight client-side matching store.
 * Swap implementations with real API calls when backend endpoints are ready.
 */
export type EOIStatus = "EOI" | "INVITED" | "WITHDRAWN" | "LOCKED" | "EXPIRED"
export type InviteStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "LOCKED" | "EXPIRED"
export type ApplicationStatus = "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED"
export type MentorshipStatus = "ACTIVE" | "COMPLETED" | "CANCELLED"

export type ExpressionOfInterest = {
  id: string
  mentorId: string
  menteeId: string
  menteeGoal: string
  note?: string | null
  rankedPreference: 1 | 2 | 3
  status: EOIStatus
  createdAt: string
}

export type Invite = {
  id: string
  eoiId: string
  mentorId: string
  menteeId: string
  status: InviteStatus
  createdAt: string
  expiresAt?: string | null
}

export type Application = {
  id: string
  mentorId: string
  menteeId: string
  inviteId: string
  status: ApplicationStatus
  submittedAt: string
  payload: Record<string, any>
}

export type Mentorship = {
  id: string
  mentorId: string
  menteeId: string
  status: MentorshipStatus
  startedAt: string
}

type MatchingState = {
  eois: ExpressionOfInterest[]
  invites: Invite[]
  applications: Application[]
  mentorships: Mentorship[]
}

const STORAGE_KEY = "mentorconnect_matching_state"
const defaultState: MatchingState = {
  eois: [],
  invites: [],
  applications: [],
  mentorships: [],
}

let memoryState: MatchingState = defaultState

const now = () => new Date().toISOString()
const makeId = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`

function loadState(): MatchingState {
  if (typeof window === "undefined") return memoryState
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      memoryState = JSON.parse(raw)
      return memoryState
    }
  } catch (err) {
    console.error("Matching store load error", err)
  }
  saveState(defaultState)
  return defaultState
}

function saveState(state: MatchingState) {
  memoryState = state
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (err) {
    console.error("Matching store save error", err)
  }
}

function isEOIActive(status: EOIStatus) {
  return status === "EOI" || status === "INVITED"
}

export const eoiService = {
  listMyEOIs(menteeId: string) {
    const state = loadState()
    return state.eois.filter((e) => e.menteeId === menteeId)
  },
  listEOIsForMentor(mentorId: string) {
    const state = loadState()
    return state.eois.filter((e) => e.mentorId === mentorId && e.status !== "WITHDRAWN" && e.status !== "EXPIRED")
  },
  createEOI(params: { mentorId: string; menteeId: string; menteeGoal: string; note?: string; rankedPreference: 1 | 2 | 3 }) {
    const state = loadState()
    const activeEOIs = state.eois.filter((e) => e.menteeId === params.menteeId && isEOIActive(e.status))
    if (activeEOIs.length >= 3) {
      return { ok: false, error: "You can only have up to 3 active interests." }
    }
    const duplicate = activeEOIs.find((e) => e.mentorId === params.mentorId)
    if (duplicate) {
      return { ok: false, error: "You already expressed interest in this mentor." }
    }

    const eoi: ExpressionOfInterest = {
      id: makeId(),
      mentorId: params.mentorId,
      menteeId: params.menteeId,
      menteeGoal: params.menteeGoal.slice(0, 280),
      note: params.note?.slice(0, 280) || null,
      rankedPreference: params.rankedPreference,
      status: "EOI",
      createdAt: now(),
    }
    saveState({ ...state, eois: [eoi, ...state.eois] })
    return { ok: true, eoi }
  },
  withdrawEOI(eoiId: string, menteeId: string) {
    const state = loadState()
    const eoi = state.eois.find((e) => e.id === eoiId && e.menteeId === menteeId)
    if (!eoi) return { ok: false, error: "EOI not found" }
    eoi.status = "WITHDRAWN"
    // expire related invites
    state.invites = state.invites.map((inv) => (inv.eoiId === eoiId ? { ...inv, status: "EXPIRED" as InviteStatus } : inv))
    saveState({ ...state })
    return { ok: true }
  },
}

export const inviteService = {
  listEOIsForMentor(mentorId: string) {
    return eoiService.listEOIsForMentor(mentorId)
  },
  listInvitesForMentor(mentorId: string) {
    const state = loadState()
    return state.invites.filter((i) => i.mentorId === mentorId)
  },
  listMyInvites(menteeId: string) {
    const state = loadState()
    return state.invites.filter((i) => i.menteeId === menteeId)
  },
  sendInvite(params: { eoiId: string; mentorId: string; menteeId: string; quotaRemaining: number }) {
    const state = loadState()
    if (params.quotaRemaining <= 0) return { ok: false, error: "Invite quota reached." }
    const existing = state.invites.find(
      (inv) => inv.eoiId === params.eoiId && inv.mentorId === params.mentorId && inv.status !== "EXPIRED"
    )
    if (existing) return { ok: false, error: "Invite already sent." }

    const invite: Invite = {
      id: makeId(),
      eoiId: params.eoiId,
      mentorId: params.mentorId,
      menteeId: params.menteeId,
      status: "PENDING",
      createdAt: now(),
    }
    const eois = state.eois.map((e) => (e.id === params.eoiId ? { ...e, status: "INVITED" as EOIStatus } : e))
    saveState({ ...state, invites: [invite, ...state.invites], eois })
    return { ok: true, invite }
  },
  acceptInvite(inviteId: string, menteeId: string) {
    const state = loadState()
    const invite = state.invites.find((i) => i.id === inviteId && i.menteeId === menteeId)
    if (!invite) return { ok: false, error: "Invite not found" }

    // lock all other invites for this mentee
    const invites = state.invites.map((inv) => {
      if (inv.id === inviteId) return { ...inv, status: "ACCEPTED" as InviteStatus }
      if (inv.menteeId === menteeId && inv.status === "PENDING") return { ...inv, status: "LOCKED" as InviteStatus }
      return inv
    })
    const eois = state.eois.map((e) => {
      if (e.id === invite.eoiId) return { ...e, status: "INVITED" as EOIStatus }
      if (e.menteeId === menteeId && e.id !== invite.eoiId && isEOIActive(e.status)) {
        return { ...e, status: "LOCKED" as EOIStatus }
      }
      return e
    })
    saveState({ ...state, invites, eois })
    return { ok: true }
  },
  declineInvite(inviteId: string, menteeId: string) {
    const state = loadState()
    const invite = state.invites.find((i) => i.id === inviteId && i.menteeId === menteeId)
    if (!invite) return { ok: false, error: "Invite not found" }
    invite.status = "DECLINED"
    saveState({ ...state })
    return { ok: true }
  },
}

export const applicationService = {
  listMyApplications(menteeId: string) {
    const state = loadState()
    return state.applications.filter((a) => a.menteeId === menteeId)
  },
  listApplicationsForMentor(mentorId: string) {
    const state = loadState()
    return state.applications.filter((a) => a.mentorId === mentorId)
  },
  submitApplication(params: { inviteId: string; mentorId: string; menteeId: string; payload: Record<string, any> }) {
    const state = loadState()
    const invite = state.invites.find((i) => i.id === params.inviteId && i.status === "ACCEPTED")
    if (!invite) return { ok: false, error: "An accepted invite is required to apply." }
    const application: Application = {
      id: makeId(),
      inviteId: params.inviteId,
      mentorId: params.mentorId,
      menteeId: params.menteeId,
      status: "SUBMITTED",
      submittedAt: now(),
      payload: params.payload,
    }
    saveState({ ...state, applications: [application, ...state.applications] })
    return { ok: true, application }
  },
  updateStatus(applicationId: string, status: ApplicationStatus) {
    const state = loadState()
    const application = state.applications.find((a) => a.id === applicationId)
    if (!application) return { ok: false, error: "Application not found" }
    application.status = status
    if (status === "ACCEPTED") {
      // create active mentorship
      state.mentorships = [
        {
          id: makeId(),
          mentorId: application.mentorId,
          menteeId: application.menteeId,
          status: "ACTIVE",
          startedAt: now(),
        },
        ...state.mentorships,
      ]
    }
    saveState({ ...state })
    return { ok: true }
  },
}

export const mentorshipService = {
  hasActiveMentorship(menteeId: string) {
    const state = loadState()
    return state.mentorships.some((m) => m.menteeId === menteeId && m.status === "ACTIVE")
  },
  listMentorshipsForMentor(mentorId: string) {
    const state = loadState()
    return state.mentorships.filter((m) => m.mentorId === mentorId)
  },
}
