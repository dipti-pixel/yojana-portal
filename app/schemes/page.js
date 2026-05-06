'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const DEPT_COLOR = {
  'ग्राम्य विकास':       'bg-green-100 text-green-700',
  'समाज कल्याण विभाग':  'bg-blue-100 text-blue-700',
  'श्रम विभाग':          'bg-yellow-100 text-yellow-700',
  'दिव्यांग विभाग':      'bg-purple-100 text-purple-700',
  'पशुपालन विभाग':       'bg-orange-100 text-orange-700',
  'मत्सय विभाग':         'bg-cyan-100 text-cyan-700',
  'जिला प्रोबेशन':       'bg-red-100 text-red-700',
  'कृषि विभाग':          'bg-lime-100 text-lime-700',
}

function SchemesList() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const category = searchParams.get('category') || ''

  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('schemes')
        .select('id, "योजना का नाम", "कार्यदायी विभाग", "श्रेणी"')
        .order('id')
      if (error) {
        setError('योजनाएं लोड नहीं हो पाईं। कृपया पुनः प्रयास करें।')
      } else {
        const filtered = category
          ? (data || []).filter(s => s['श्रेणी'] === category)
          : (data || [])
        setSchemes(filtered)
      }
      setLoading(false)
    }
    fetch()
  }, [category])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1B3A6B] text-white px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-white text-xl">←</button>
        <div>
          <p className="text-xs text-blue-300">श्रेणी</p>
          <h1 className="font-bold text-lg leading-tight">{category || 'सभी योजनाएं'}</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5">
        {loading ? (
          <div className="space-y-3 mt-2">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse h-24 border border-gray-100"/>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            <div className="text-4xl mb-3">⚠️</div>
            <p>{error}</p>
          </div>
        ) : schemes.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">📋</div>
            <p className="font-medium">इस श्रेणी में अभी कोई योजना नहीं है</p>
            <Link href="/" className="mt-4 inline-block text-blue-600 underline text-sm">
              वापस जाएं
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-4">{schemes.length} योजनाएं मिलीं</p>
            <div className="space-y-3">
              {schemes.map((s) => {
                const deptColor = DEPT_COLOR[s['कार्यदायी विभाग']] || 'bg-gray-100 text-gray-600'
                return (
                  <Link key={s.id} href={`/schemes/${s.id}?category=${encodeURIComponent(category)}`}>
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm active:scale-98 transition">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${deptColor}`}>
                        {s['कार्यदायी विभाग']}
                      </span>
                      <p className="font-bold text-gray-800 mt-2 text-base leading-snug">
                        {s['योजना का नाम']}
                      </p>
                      <p className="text-orange-500 text-sm mt-2 font-semibold">पूरी जानकारी देखें →</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function SchemesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-lg">
        लोड हो रहा है...
      </div>
    }>
      <SchemesList />
    </Suspense>
  )
}
