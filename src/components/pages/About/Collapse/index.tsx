'use client'

import { useId, useState } from 'react'
import type { IChildrenProps } from '@/types/react.types'
import { tw } from '@/utils/tailwind'

export type TAboutCollapseVariant = 'section' | 'card' | 'item' | 'attribute' | 'option'

export interface IAboutCollapseProps extends IChildrenProps {
  title: string
  variant?: TAboutCollapseVariant
  defaultOpen?: boolean
}

const VARIANTS: Record<
  TAboutCollapseVariant,
  { root: string; header: string; title: string; chevron: string; content: string }
> = {
  section: {
    root: 'w-full',
    header: 'px-[4px] py-[8px] text-white',
    title: 'text-[13px] font-[600] tracking-[0.08em] uppercase',
    chevron: 'w-[16px] h-[16px]',
    content: 'flex flex-col gap-y-[16px] pt-[12px]'
  },
  card: {
    root: 'w-full rounded-[8px] bg-white',
    header: 'p-[24px]',
    title: 'text-[18px] text-black font-[600]',
    chevron: 'w-[20px] h-[20px]',
    content: 'px-[24px] pb-[24px] text-[16px]'
  },
  item: {
    root: 'w-full',
    header: 'py-[10px]',
    title: 'text-[16px] text-black font-[600]',
    chevron: 'w-[16px] h-[16px]',
    content: 'pb-[12px] text-[16px]'
  },
  attribute: {
    root: 'w-full',
    header: 'py-[10px]',
    title:
      'rounded-[4px] bg-primary-50 px-[6px] py-[2px] text-[14px] text-primary-700 font-[600] font-primary',
    chevron: 'w-[16px] h-[16px]',
    content: 'pb-[12px] text-[16px]'
  },
  option: {
    root: 'w-full',
    header: 'py-[8px]',
    title: 'text-[14px] text-primary-700 font-[600] font-primary',
    chevron: 'w-[14px] h-[14px]',
    content: 'pb-[10px] text-[15px]'
  }
}

export const AboutCollapse = ({
  title,
  children,
  variant = 'card',
  defaultOpen = false
}: IAboutCollapseProps) => {
  const contentId = useId()
  const styles = VARIANTS[variant]
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const Title = variant === 'attribute' || variant === 'option' ? 'code' : 'span'

  return (
    <div className={styles.root}>
      <button
        type='button'
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((state) => !state)}
        className={tw(
          'w-full flex items-center justify-between gap-x-[16px] text-left text-black',
          styles.header
        )}
      >
        <Title className={styles.title}>{title}</Title>

        <svg
          fill='none'
          strokeWidth='2'
          aria-hidden='true'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          className={tw(
            'shrink-0 transition-transform duration-300 ease-in-out motion-reduce:transition-none',
            styles.chevron,
            isOpen && 'rotate-180'
          )}
        >
          <path d='M6 9l6 6 6-6' />
        </svg>
      </button>

      <div
        id={contentId}
        inert={!isOpen}
        className={tw(
          'grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className='overflow-hidden'>
          <div className={tw('text-black leading-[1.6]', styles.content)}>{children}</div>
        </div>
      </div>
    </div>
  )
}
