import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'

export const hashPassword = (password: string) => bcrypt.hash(password, 10)
export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash)

export const signAccessToken = (payload: object) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' })

export const signRefreshToken = () => crypto.randomBytes(64).toString('hex')

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (e) {
    return null
  }
}
