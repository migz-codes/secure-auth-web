import '@/styles/globals.css'
import { Fira_Code } from 'next/font/google'

export interface IAppLayoutProps {
  children: React.ReactNode
}

const firaCode = Fira_Code({ subsets: ['latin'], variable: '--fira-code-font' })

export const AppLayout = ({ children }: Readonly<IAppLayoutProps>) => (
  <html lang='en'>
    <body className={`${firaCode.variable}`}>{children}</body>
  </html>
)
