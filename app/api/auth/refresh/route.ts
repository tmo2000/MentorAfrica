import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { verifyPassword, signAccessToken, hashPassword } from '../../../../lib/auth'

export async function POST(req: Request) {
  try {
    const { refreshToken } = await req.json()
    if (!refreshToken) return NextResponse.json({ error: 'Missing refresh token' }, { status: 400 })

    const user = await prisma.user.findFirst({ where: { refreshToken: { not: null } } })
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    // verify by comparing hashed refresh token
    const ok = await verifyPassword(refreshToken, user.refreshToken as string)
    if (!ok) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role })
    const newRefresh = cryptoRandom()
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: await hashPassword(newRefresh) } })

    return NextResponse.json({ accessToken, refreshToken: newRefresh })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

function cryptoRandom() {
  return require('crypto').randomBytes(64).toString('hex')
}
