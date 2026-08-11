import type { IAboutSectionProps } from './types'

export const AboutSection = ({ title, children }: IAboutSectionProps) => (
  <section className='w-full flex flex-col gap-y-[12px]'>
    <h2 className='px-[4px] text-[13px] text-white font-[600] tracking-[0.08em] uppercase'>
      {title}
    </h2>

    <div className='flex flex-col gap-y-[16px]'>{children}</div>
  </section>
)
