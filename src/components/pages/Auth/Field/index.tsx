import type { IAuthFieldProps } from './types'

export const AuthField = ({ id, label, ...props }: IAuthFieldProps) => (
  <div className='flex flex-col gap-y-[8px]'>
    <label htmlFor={id} className='text-[14px] text-gray-400 font-[600]'>
      {label}
    </label>

    <input
      id={id}
      className='w-full h-[48px] px-[16px] rounded-[8px] border border-gray-200 text-[16px] text-gray-800 focus:border-primary-500'
      {...props}
    />
  </div>
)
