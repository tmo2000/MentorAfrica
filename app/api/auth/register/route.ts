import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { hashPassword, signAccessToken, signRefreshToken } from '../../../../lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, role } = body
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'User already exists' }, { status: 409 })

    const hashed = await hashPassword(password)
    const refreshToken = signRefreshToken()

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: role || 'USER',
        refreshToken: await hashPassword(refreshToken)
      }
    })

    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role })

    return NextResponse.json({ user: { id: user.id, email: user.email, role: user.role }, accessToken, refreshToken })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
