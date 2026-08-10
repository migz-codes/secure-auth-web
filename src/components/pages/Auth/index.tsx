'use client'

import { useState } from 'react'
import { tw } from '@/utils/tailwind'
import { AuthSignIn } from './SignIn'
import { AuthSignUp } from './SignUp'

export const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false)

  return (
    <div className='min-h-screen flex items-center justify-center bg-primary-500 p-[16px]'>
      <div className='w-full max-w-[400px] rounded-[16px] bg-gray-50 shadow-[0_24px_64px_-12px_rgba(0,4,105,0.45)] overflow-hidden'>
        <div
          className={tw(
            'flex w-[200%] transition-transform duration-500 ease-in-out motion-reduce:transition-none',
            isSignUp && '-translate-x-1/2'
          )}
        >
          <AuthSignIn inert={isSignUp} onSwitch={() => setIsSignUp(true)} />

          <AuthSignUp inert={!isSignUp} onSwitch={() => setIsSignUp(false)} />
        </div>
      </div>
    </div>
  )
}
