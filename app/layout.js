import "./globals.css";
import { LanguageProvider } from '@/contexts/LanguageContext'

export const metadata = {
  title: "योजना मित्र — प्रयागराज",
  description: "सरकारी योजनाओं की जानकारी एक जगह — प्रयागराज जिला प्रशासन",
  icons: {
    icon: '/icon-192.png',
    shortcut: '/favicon-32.png',
    apple: '/icon-192.png',
  },
  openGraph: {
    title: "योजना मित्र — प्रयागराज",
    description: "सरकारी योजनाओं की जानकारी एक जगह",
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    locale: 'hi_IN',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <body className="bg-gray-100 min-h-screen">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
