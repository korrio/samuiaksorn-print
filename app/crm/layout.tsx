import { Noto_Sans_Thai } from 'next/font/google'

const thaiFont = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-thai',
  display: 'swap',
})

export default function CRMLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${thaiFont.variable} font-thai antialiased`}>
      {children}
    </div>
  )
}