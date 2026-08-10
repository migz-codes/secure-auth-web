'use client'

import { useEffect, useState } from 'react'
import { UnmemoizedComponent } from './UnmemoizedComponent'

export const UnmemoizedTest = () => {
  const [count, setCount] = useState(0)
  const [anotherCount, setAnotherCount] = useState(0)

  const unmemoizedObject = { a: 1, b: 2 }

  const unmemoizedArray = [1, 2]

  const unmemoizedFunction = () => {
    console.log('unmemoizedFunction')
  }

  const logCount = () => {
    console.log(
      'this log displays when "anotherCount" is also changed, with react-compiler this log is displayed only when "count" is changed as if using useCallback, but it is still necessary to add "logCount" in useEffect dependecies to watch "count" changes',
      count
    )
  }

  useEffect(() => {
    logCount()
    // biome-ignore lint/correctness/useExhaustiveDependencies: useCallback not necessary because of react-compiler
  }, [logCount])

  return (
    <>
      <button
        onClick={() => setCount((prev) => prev + 1)}
        type='button'
        className='text-[#fff] text-[32px]'
      >
        update {count}
      </button>

      <button
        onClick={() => setAnotherCount((prev) => prev + 1)}
        type='button'
        className='text-[#fff] text-[32px]'
      >
        update another count {anotherCount}
      </button>

      <UnmemoizedComponent
        function={unmemoizedFunction}
        array={unmemoizedArray}
        object={unmemoizedObject}
      />
    </>
  )
}
