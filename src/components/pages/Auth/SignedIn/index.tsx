'use client'

import { useState } from 'react'
import type { IUser } from '@/types/api.types'
import { apiFetch } from '@/utils/api'
import { clearSession, readSession } from '@/utils/session'

export interface IAuthSignedInProps {
  user: IUser
  onSignOut: () => void
}

export const AuthSignedIn = ({ user, onSignOut }: IAuthSignedInProps) => {
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    if (isSigningOut) return

    setIsSigningOut(true)

    const refreshToken = readSession()?.refreshToken

    try {
      if (refreshToken)
        await apiFetch('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken })
        })
    } catch {
      // The row is revoked or already gone either way; the local session still
      // has to go, so a failure here must not strand the user signed in.
    } finally {
      clearSession()
      setIsSigningOut(false)
      onSignOut()
    }
  }

  return (
    <div className='flex flex-col justify-center gap-y-[24px] p-[32px]'>
      <h1 className='text-[32px] text-gray-700 font-[600]'>Signed in</h1>

      <div className='flex flex-col gap-y-[8px]'>
        <span className='text-[14px] text-gray-400 font-[600]'>Name</span>
        <span className='text-[16px] text-gray-800'>{user.name}</span>
      </div>

      <div className='flex flex-col gap-y-[8px]'>
        <span className='text-[14px] text-gray-400 font-[600]'>Email</span>
        <span className='text-[16px] text-gray-800'>{user.email}</span>
      </div>

      <button
        type='button'
        disabled={isSigningOut}
        onClick={handleSignOut}
        className='w-full h-[48px] rounded-[8px] bg-primary-500 text-[16px] text-gray-50 font-[600] hover:bg-primary-600 disabled:opacity-60'
      >
        {isSigningOut ? 'Logging out…' : 'Log out'}
      </button>
    </div>
  )
}
