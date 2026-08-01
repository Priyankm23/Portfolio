import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Priyank Moradiya',
  description: 'Backend developer specializing in Node.js, PostgreSQL, Python, gRPC, and RabbitMQ. Building distributed systems with modern tech stacks.',
  generator: 'v0.app',
  icons: {
    icon: '/spidey-favicon.jpg',
    shortcut: '/spidey-favicon.jpg',
    apple: '/spidey-favicon.jpg',
  },
  openGraph: {
    title: 'Priyank Moradiya',
    description: 'Backend developer specializing in Node.js, PostgreSQL, Python, gRPC, and RabbitMQ.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/spidey-favicon.jpg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=IBM+Plex+Mono:wght@400;500&family=Bebas+Neue&family=BBH+Bartle&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}
