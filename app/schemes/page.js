'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import SchemeCard from '@/components/SchemeCard'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const DEPARTMENTS = [
  'सभी',
  'ग्राम्य विकास',
  'समाज कल्याण विभाग',
  'श्रम विभाग',
  'दिव्यांग विभाग',
  'पशुपालन विभाग',
  'मत्सय विभाग',
  'जिला प्रोबेशन',
]

const PAGE_SIZE = 20

function SchemesContent() {
  const searchParams = useSearchParams()

  const [schemes, setSchemes]   = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [dept, setDept]         = useState(searchParams.get('vibhag') || 'सभी')
  const [page, setPage]         = useState(1)

  // Fetch all schemes once on mount
  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      const { data, error } = await supabase
        .from('schemes')
        .select('id, naam, vivaran, vibhag')
        .order('id')
      if (!error) setSchemes(data || [])
      setLoading(false)
    }
    fetchAll()
  }, [])

  // Re-filter whenever search or dept changes
  useEffect(() => {
    let result = schemes

    if (dept !== 'सभी') {
      result = result.filter((s) => s.vibhag === dept)
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(
        (s) =>
          s.naam?.toLowerCase().includes(q) ||
          s.vivaran?.toLowerCase().includes(q)
      )
    }

    setFiltered(result)
    setPage(1)
  }, [search, dept, schemes])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-6 w-full flex-1">

        {/* Search bar */}
        <input
          type="text"
          placeholder="🔍  योजना का नाम खोजें..."
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Department filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
          {DEPARTMENTS.map((d) => (
            <button
              key={d}
              onClick={() => setDept(d)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium border transition flex-shrink-0
                ${dept === d
                  ? 'bg-[#1B3A6B] text-white border-[#1B3A6B]'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-gray-500 text-sm mb-3">
          {loading
            ? 'योजनाएं लोड हो रही हैं...'
            : `${filtered.length} योजनाएं मिलीं`}
        </p>

        {/* Cards */}
        {loading ? (
          <div className="text-center py-24 text-gray-400 text-xl animate-pulse">
            लोड हो रहा है...
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <div className="text-4xl mb-3">🔍</div>
            <p>कोई योजना नहीं मिली</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {paginated.map((s) => (
              <SchemeCard key={s.id} scheme={s} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo(0,0) }}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border bg-white disabled:opacity-40 hover:bg-gray-100 transition"
            >
              ← पिछला
            </button>
            <span className="text-sm text-gray-600 font-medium">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo(0,0) }}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border bg-white disabled:opacity-40 hover:bg-gray-100 transition"
            >
              अगला →
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default function SchemesPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-24 text-gray-400 text-xl">लोड हो रहा है...</div>
    }>
      <SchemesContent />
    </Suspense>
  )
}
