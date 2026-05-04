import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-[#1B3A6B] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
      <Link href="/" className="text-lg font-bold flex items-center gap-2">
        🏛 योजना मित्र
      </Link>
      <Link
        href="/schemes"
        className="text-sm bg-orange-500 hover:bg-orange-600 transition px-4 py-1.5 rounded-full font-medium"
      >
        सभी योजनाएं
      </Link>
    </nav>
  )
}
