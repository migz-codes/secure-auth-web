import type { IUser } from '@/types/api.types'

const SESSION_KEY = 'secure-auth.session'

export interface ISession {
  user: IUser
  accessToken: string
  refreshToken: string
}

export const readSession = (): ISession | null => {
  if (typeof window === 'undefined') return null

  const raw = window.localStorage.getItem(SESSION_KEY)

  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as Partial<ISession>

    if (!parsed?.user?.id || !parsed.accessToken || !parsed.refreshToken) return null

    return parsed as ISession
  } catch {
    return null
  }
}

export const writeSession = (session: ISession) => {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export const clearSession = () => {
  window.localStorage.removeItem(SESSION_KEY)
}
