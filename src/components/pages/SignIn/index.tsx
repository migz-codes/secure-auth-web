'use client'

import type { FormEvent } from 'react'
import { useState } from 'react'

export const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-primary-500 flex-col gap-y-[32px]'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-[400px] flex flex-col gap-y-[24px] bg-gray-50 rounded-[16px] p-[32px]'
      >
        <h1 className='text-[32px] text-gray-700 font-primary font-[600]'>Sign in</h1>

        <div className='flex flex-col gap-y-[8px]'>
          <label htmlFor='email' className='text-[14px] text-gray-400 font-[600]'>
            Email
          </label>

          <input
            required
            id='email'
            name='email'
            type='email'
            value={email}
            autoComplete='email'
            placeholder='you@example.com'
            onChange={(event) => setEmail(event.target.value)}
            className='w-full h-[48px] px-[16px] rounded-[8px] border border-gray-200 text-[16px] text-gray-800 focus:border-primary-500'
          />
        </div>

        <div className='flex flex-col gap-y-[8px]'>
          <label htmlFor='password' className='text-[14px] text-gray-400 font-[600]'>
            Password
          </label>

          <input
            required
            id='password'
            name='password'
            type='password'
            value={password}
            placeholder='••••••••'
            autoComplete='current-password'
            onChange={(event) => setPassword(event.target.value)}
            className='w-full h-[48px] px-[16px] rounded-[8px] border border-gray-200 text-[16px] text-gray-800 focus:border-primary-500'
          />
        </div>

        <button
          type='submit'
          className='w-full h-[48px] rounded-[8px] bg-primary-500 text-[16px] text-gray-50 font-[600] hover:bg-primary-600'
        >
          Sign in
        </button>
      </form>
    </div>
  )
}
