'use client'

import type { FormEvent } from 'react'
import { useState } from 'react'
import { AuthField } from '../Field'
import type { IAuthSignInProps } from './types'

export const AuthSignIn = ({ inert, onSwitch }: IAuthSignInProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <form
      onSubmit={handleSubmit}
      inert={inert}
      className='w-1/2 shrink-0 flex flex-col justify-center gap-y-[24px] p-[32px]'
    >
      <h1 className='text-[32px] text-gray-700 font-[600]'>Sign in</h1>

      <AuthField
        id='signin-email'
        label='Email'
        name='email'
        type='email'
        autoComplete='email'
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder='you@example.com'
      />

      <AuthField
        id='signin-password'
        label='Password'
        name='password'
        type='password'
        autoComplete='current-password'
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder='••••••••'
      />

      <button
        type='submit'
        className='w-full h-[48px] rounded-[8px] bg-primary-500 text-[16px] text-gray-50 font-[600] hover:bg-primary-600'
      >
        Sign in
      </button>

      <button
        type='button'
        onClick={onSwitch}
        className='w-full h-[48px] rounded-[8px] border border-primary-500 text-[16px] text-primary-600 font-[600] hover:bg-primary-50'
      >
        Sign up
      </button>
    </form>
  )
}
