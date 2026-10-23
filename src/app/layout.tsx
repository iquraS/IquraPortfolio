import type { Metadata } from 'next'
import './globals.css'
import { ResumeProvider } from '@/lib/resumeContext'
import defaultResume from '@/lib/defaultResume.json'

export const metadata: Metadata = {
  title: `${defaultResume.name} | ${defaultResume.title}`,
  description: defaultResume.summary,
  authors: [{ name: defaultResume.name }],
  openGraph: {
    title: `${defaultResume.name} | ${defaultResume.title}`,
    description: defaultResume.tagline,
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white font-sans">
        <ResumeProvider>{children}</ResumeProvider>
      </body>
    </html>
  )
}
