import { UnmemoizedTest } from './UnmemoizedTest'

export const Home = () => (
  <div className='min-h-screen flex items-center justify-center bg-primary-500 flex-col gap-y-[32px]'>
    <h1 className='text-[32px] text-[#fff] font-primary font-[600]'>Hello Next</h1>

    <UnmemoizedTest />
  </div>
)
