'use client'

import type { FormEvent } from 'react'
import { useState } from 'react'
import { AuthField } from '../Field'
import type { IAuthSignUpProps } from './types'

export const AuthSignUp = ({ inert, onSwitch }: IAuthSignUpProps) => {
  const [name, setName] = useState('')
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
      inert={inert}
      onSubmit={handleSubmit}
      className='w-1/2 shrink-0 flex flex-col gap-y-[24px] p-[32px]'
    >
      <button
        type='button'
        onClick={onSwitch}
        aria-label='Back to sign in'
        className='w-[40px] h-[40px] -ml-[8px] flex items-center justify-center rounded-[8px] text-gray-400 hover:bg-primary-50 hover:text-primary-600'
      >
        <svg
          fill='none'
          strokeWidth='2'
          aria-hidden='true'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='w-[20px] h-[20px]'
        >
          <path d='M19 12H5' />
          <path d='M12 19l-7-7 7-7' />
        </svg>
      </button>

      <h1 className='text-[32px] text-gray-700 font-[600]'>Sign up</h1>

      <AuthField
        required
        name='name'
        type='text'
        label='Name'
        value={name}
        id='signup-name'
        autoComplete='name'
        placeholder='Your name'
        onChange={(event) => setName(event.target.value)}
      />

      <AuthField
        required
        name='email'
        type='email'
        label='Email'
        value={email}
        id='signup-email'
        autoComplete='email'
        placeholder='you@example.com'
        onChange={(event) => setEmail(event.target.value)}
      />

      <AuthField
        required
        name='password'
        type='password'
        label='Password'
        value={password}
        id='signup-password'
        placeholder='••••••••'
        autoComplete='new-password'
        onChange={(event) => setPassword(event.target.value)}
      />

      <div className='flex flex-col gap-y-[8px]'>
        <AuthField
          required
          type='password'
          name='confirmPassword'
          placeholder='••••••••'
          value={confirmPassword}
          label='Confirm password'
          autoComplete='new-password'
          id='signup-confirm-password'
          aria-invalid={passwordsMismatch}
          onChange={(event) => setConfirmPassword(event.target.value)}
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
