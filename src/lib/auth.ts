import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here'

export interface UserPayload {
  id: string
  email: string
  role: 'customer' | 'admin'
  name: string
}

export function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, 12)
}

export function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcryptjs.compare(password, hashedPassword)
}

export function signToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): UserPayload {
  return jwt.verify(token, JWT_SECRET) as UserPayload
}

export function generateResetToken(): string {
  return jwt.sign({ type: 'reset' }, JWT_SECRET, { expiresIn: '1h' })
}

export function verifyResetToken(token: string): boolean {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as { type: string }
    return decoded.type === 'reset'
  } catch {
    return false
  }
}
