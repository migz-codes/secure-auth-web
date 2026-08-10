import '@/styles/globals.css'
import { Roboto } from 'next/font/google'
import type { IAppLayoutProps } from './types'

const roboto = Roboto({ subsets: ['latin'], variable: '--roboto-font' })

export const AppLayout = ({ children }: Readonly<IAppLayoutProps>) => (
  <html lang='en'>
    <body className={`${roboto.variable}`}>{children}</body>
  </html>
)
