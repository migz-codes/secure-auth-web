'use client'

import Link from 'next/link'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Field } from '@/components/shared/Field'
import { ApiError, apiFetch } from '@/utils/api'

export interface IAuthSignInProps {
  inert?: boolean
  onSwitch: () => void
}

export interface IUser {
  id: string
  name: string
  email: string
}

export const AuthSignIn = ({ inert, onSwitch }: IAuthSignInProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [signedInUser, setSignedInUser] = useState<IUser | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitting) return

    setError('')
    setIsSubmitting(true)

    try {
      const { user } = await apiFetch<{ user: IUser }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })

      setSignedInUser(user)
      setPassword('')
    } catch (exception) {
      if (!(exception instanceof ApiError)) {
        setError('Could not reach the server. Try again.')

        return
      }

      setError(exception.validationErrors?.[0] ?? exception.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      inert={inert}
      className='w-1/2 shrink-0 flex flex-col justify-center gap-y-[24px] p-[32px]'
    >
      <h1 className='text-[32px] text-gray-700 font-[600]'>Sign in</h1>

      <Field
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

      <Field
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

      {error && (
        <span role='alert' className='text-[12px] text-error-500 font-[600]'>
          {error}
        </span>
      )}

      {signedInUser && (
        <output className='text-[12px] text-primary-600 font-[600]'>
          Signed in as {signedInUser.email}
        </output>
      )}

      <button
        type='submit'
        disabled={isSubmitting}
        className='w-full h-[48px] rounded-[8px] bg-primary-500 text-[16px] text-gray-50 font-[600] hover:bg-primary-600 disabled:opacity-60'
      >
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </button>

      <button
        type='button'
        onClick={onSwitch}
        className='w-full h-[48px] rounded-[8px] border border-primary-500 text-[16px] text-primary-600 font-[600] hover:bg-primary-50'
      >
        Sign up
      </button>

      <Link
        href='/about'
        className='text-[14px] text-gray-400 text-center underline underline-offset-[4px] hover:text-primary-600'
      >
        Como funciona
      </Link>
    </form>
  )
}
