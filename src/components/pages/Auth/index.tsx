'use client'

import { useEffect, useState } from 'react'
import type { IUser } from '@/types/api.types'
import { ApiError, apiFetch } from '@/utils/api'
import { clearSession, readSession, writeSession } from '@/utils/session'
import { tw } from '@/utils/tailwind'
import { AuthSignedIn } from './SignedIn'
import { AuthSignIn } from './SignIn'
import { AuthSignUp } from './SignUp'

export const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [user, setUser] = useState<IUser | null>(null)
  const [isRestoring, setIsRestoring] = useState(true)

  useEffect(() => {
    const session = readSession()

    if (!session) {
      setIsRestoring(false)

      return
    }

    const restore = async () => {
      try {
        setUser(
          await apiFetch<IUser>('/auth/me', {
            headers: { Authorization: `Bearer ${session.accessToken}` }
          })
        )

        return
      } catch (exception) {
        // Anything other than a rejected token — the API being down, for
        // instance — must not discard a session that may still be good.
        if (!(exception instanceof ApiError)) return
      }

      // The access token lives 15 minutes, so an expired one on reload is the
      // normal case rather than an error. The refresh token decides.
      try {
        const renewed = await apiFetch<{
          user: IUser
          accessToken: string
          refreshToken: string
        }>('/auth/refresh', {
          method: 'POST',
          body: JSON.stringify({ refreshToken: session.refreshToken })
        })

        writeSession(renewed)
        setUser(renewed.user)
      } catch (exception) {
        if (exception instanceof ApiError) clearSession()
      }
    }

    restore().finally(() => setIsRestoring(false))
  }, [])

  return (
    <div className='min-h-screen flex items-center justify-center bg-primary-500 p-[16px]'>
      <div className='w-full max-w-[400px] rounded-[16px] bg-gray-50 shadow-[0_24px_64px_-12px_rgba(0,4,105,0.45)] overflow-hidden'>
        {isRestoring && (
          <output className='flex h-[320px] items-center justify-center text-[14px] text-gray-400 font-[600]'>
            Checking session…
          </output>
        )}

        {!isRestoring &&
          (user ? (
            <AuthSignedIn user={user} onSignOut={() => setUser(null)} />
          ) : (
            <div
              className={tw(
                'flex w-[200%] transition-transform duration-500 ease-in-out motion-reduce:transition-none',
                isSignUp && '-translate-x-1/2'
              )}
            >
              <AuthSignIn
                inert={isSignUp}
                onSignedIn={setUser}
                onSwitch={() => setIsSignUp(true)}
              />

              <AuthSignUp inert={!isSignUp} onSwitch={() => setIsSignUp(false)} />
            </div>
          ))}
      </div>
    </div>
  )
}
