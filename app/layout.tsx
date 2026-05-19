import './globals.css'
import './components/animations.css'
import Script from 'next/script'

export const metadata = {
  title: 'NexPool',
  description: 'Smart hostel contribution platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />

        {children}
      </body>
    </html>
  )
}