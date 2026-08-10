export const UnmemoizedComponent = ({
  object,
  array,
  function: fn
}: {
  object?: any
  array?: any[]
  function?: () => void
}) => {
  return (
    <div className='text-[#fff] text-[24px] flex flex-col gap-[16px] items-center justify-center border p-[24px]'>
      <span>UnmemoizedComponent</span>

      <p className='text-[16px]'>
        this component is re-rendered on every count update if you don't use the react compiler (or
        memoization)
      </p>

      <span>{`{a: ${object?.a}, b: ${object?.b}}`}</span>

      <span>{`[${array?.[0]}, ${array?.[1]}]`}</span>

      <button onClick={fn} type='button' className='text-[#fff] text-[32px]'>
        call function
      </button>
    </div>
  )
}
