import "./globals.css";

export const metadata = {
  title: "योजना मित्र — प्रयागराज",
  description: "सरकारी योजनाओं की जानकारी एक जगह",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
