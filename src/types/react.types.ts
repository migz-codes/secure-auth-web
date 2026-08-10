import type {
  ButtonHTMLAttributes,
  CSSProperties,
  Dispatch,
  FormHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SetStateAction,
  TextareaHTMLAttributes
} from 'react'

export type TDivProps = HTMLAttributes<HTMLDivElement>
export type TFormProps = FormHTMLAttributes<HTMLFormElement>
export type TSetState<State> = Dispatch<SetStateAction<State>>
export type TInputProps = InputHTMLAttributes<HTMLInputElement>
export type TButtonProps = ButtonHTMLAttributes<HTMLButtonElement>
export type TLabelProps = ButtonHTMLAttributes<HTMLLabelElement>
export type TSpanProps = ButtonHTMLAttributes<HTMLSpanElement>
export type TAnchorProps = ButtonHTMLAttributes<HTMLAnchorElement>
export type TTimer = string | number | NodeJS.Timeout | undefined
export type TTextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export type TSetStateCallback<S> = (
  state: S | ((prevState: S) => S),
  cb?: (state: S) => void
) => void

export type TUseReducer<State, Payload, Type = string> = (
  state: State,
  action: { type: Type; payload: Payload }
) => State

export interface IAsProps {
  as?: TElement
  asChild?: boolean
  Element?: TElement
}

export interface IClassNameProps {
  className?: string
}

export interface IChildrenProps {
  children?: ReactNode | ReactNode[]
}

export interface IStyleProps {
  style?: CSSProperties
}

export type TStyles = Record<string, CSSProperties>

export type TListenerCallback = (this: Window, ev: WindowEventMap) => any

export interface IComponentProps extends IClassNameProps, IChildrenProps {}

export interface IStyleComponentProps extends IClassNameProps, IChildrenProps, IStyleProps {}

export interface IFullComponentProps
  extends IClassNameProps,
    IChildrenProps,
    IStyleProps,
    IAsProps {}

export type TElement =
  | 'path'
  | 'svg'
  | 'a'
  | 'abbr'
  | 'address'
  | 'area'
  | 'article'
  | 'aside'
  | 'audio'
  | 'b'
  | 'base'
  | 'bdi'
  | 'bdo'
  | 'blockquote'
  | 'body'
  | 'br'
  | 'button'
  | 'canvas'
  | 'caption'
  | 'cite'
  | 'code'
  | 'col'
  | 'colgroup'
  | 'data'
  | 'datalist'
  | 'dd'
  | 'del'
  | 'details'
  | 'dfn'
  | 'dialog'
  | 'div'
  | 'dl'
  | 'dt'
  | 'em'
  | 'embed'
  | 'fieldset'
  | 'figcaption'
  | 'figure'
  | 'footer'
  | 'form'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'head'
  | 'header'
  | 'hgroup'
  | 'hr'
  | 'html'
  | 'i'
  | 'iframe'
  | 'img'
  | 'input'
  | 'ins'
  | 'kbd'
  | 'label'
  | 'legend'
  | 'li'
  | 'link'
  | 'main'
  | 'map'
  | 'mark'
  | 'meta'
  | 'meter'
  | 'nav'
  | 'noscript'
  | 'object'
  | 'ol'
  | 'optgroup'
  | 'option'
  | 'output'
  | 'p'
  | 'param'
  | 'picture'
  | 'pre'
  | 'progress'
  | 'q'
  | 'rp'
  | 'rt'
  | 'ruby'
  | 's'
  | 'samp'
  | 'script'
  | 'section'
  | 'select'
  | 'small'
  | 'source'
  | 'span'
  | 'strong'
  | 'style'
  | 'sub'
  | 'summary'
  | 'sup'
  | 'svg'
  | 'table'
  | 'tbody'
  | 'td'
  | 'template'
  | 'textarea'
  | 'tfoot'
  | 'th'
  | 'thead'
  | 'time'
  | 'title'
  | 'tr'
  | 'track'
  | 'u'
  | 'ul'
  | 'var'
  | 'video'
  | 'wbr'
