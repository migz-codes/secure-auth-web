'use client'

import type { FormEvent } from 'react'
import { useState } from 'react'
import { AuthField } from '../Field'
import type { IAuthSignUpProps } from './types'

export const AuthSignUp = ({ inert, onSwitch }: IAuthSignUpProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (passwordsMismatch) return
  }

  return (
    <form
      onSubmit={handleSubmit}
      inert={inert}
      className='w-1/2 shrink-0 flex flex-col gap-y-[24px] p-[32px]'
    >
      <button
        type='button'
        onClick={onSwitch}
        aria-label='Back to sign in'
        className='w-[40px] h-[40px] -ml-[8px] flex items-center justify-center rounded-[8px] text-gray-400 hover:bg-primary-50 hover:text-primary-600'
      >
        <svg
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          aria-hidden='true'
          className='w-[20px] h-[20px]'
        >
          <path d='M19 12H5' />
          <path d='M12 19l-7-7 7-7' />
        </svg>
      </button>

      <h1 className='text-[32px] text-gray-700 font-[600]'>Sign up</h1>

      <AuthField
        id='signup-email'
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
        id='signup-password'
        label='Password'
        name='password'
        type='password'
        autoComplete='new-password'
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder='••••••••'
      />

      <div className='flex flex-col gap-y-[8px]'>
        <AuthField
          id='signup-confirm-password'
          label='Confirm password'
          name='confirmPassword'
          type='password'
          autoComplete='new-password'
          required
          aria-invalid={passwordsMismatch}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder='••••••••'
        />

        {passwordsMismatch && (
          <span className='text-[12px] text-error-500 font-[600]'>Passwords do not match</span>
        )}
      </div>

      <button
        type='submit'
        className='w-full h-[48px] rounded-[8px] bg-primary-500 text-[16px] text-gray-50 font-[600] hover:bg-primary-600'
      >
        Sign up
      </button>
    </form>
  )
}
