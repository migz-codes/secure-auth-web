import type { IChildrenProps } from '@/types/react.types'

/**
 * `card` is a top-level topic and `item` a plain subsection inside one.
 * `attribute` and `option` render the title as code: a cookie attribute and one
 * of its possible values.
 */
export type TAboutCollapseVariant = 'card' | 'item' | 'attribute' | 'option'

export interface IAboutCollapseProps extends IChildrenProps {
  title: string
  variant?: TAboutCollapseVariant
}
