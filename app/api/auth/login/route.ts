import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { verifyPassword, signAccessToken, signRefreshToken, hashPassword } from '../../../../lib/auth'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const ok = await verifyPassword(password, user.password)
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role })
    const refreshToken = signRefreshToken()

    // store hashed refresh token
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: await hashPassword(refreshToken) } })

    return NextResponse.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
