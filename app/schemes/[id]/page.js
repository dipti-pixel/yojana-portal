import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export async function generateMetadata({ params }) {
  const { data } = await supabase
    .from('schemes')
    .select('"योजना का नाम"')
    .eq('id', params.id)
    .single()
  return { title: data?.['योजना का नाम'] || 'योजना विवरण' }
}

function Section({ title, content, icon }) {
  if (!content) return null
  return (
    <details className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group" open>
      <summary className="flex items-center justify-between px-4 py-3 cursor-pointer select-none list-none">
        <span className="font-bold text-[#1B3A6B] flex items-center gap-2 text-base">
          <span>{icon}</span> {title}
        </span>
        <span className="text-gray-400 group-open:rotate-180 transition-transform text-sm">▼</span>
      </summary>
      <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap border-t border-gray-50 pt-3">
        {content}
      </div>
    </details>
  )
}

export default async function SchemeDetail({ params, searchParams }) {
  const { data: scheme, error } = await supabase
    .from('schemes')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !scheme) return notFound()

  const backCategory = searchParams?.category || ''

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1B3A6B] text-white px-4 py-4 flex items-start gap-3 sticky top-0 z-10">
        <Link
          href={backCategory ? `/schemes?category=${encodeURIComponent(backCategory)}` : '/'}
          className="text-white text-xl mt-0.5 flex-shrink-0"
        >←</Link>
        <div>
          <p className="text-xs text-blue-300">{scheme['श्रेणी'] || scheme['कार्यदायी विभाग']}</p>
          <h1 className="font-bold text-base leading-snug">{scheme['योजना का नाम']}</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-3">

        {/* Dept badge */}
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
            🏢 {scheme['कार्यदायी विभाग']}
          </span>
        </div>

        {/* Info sections */}
        <Section title="योजना का विवरण"         content={scheme['योजना का विवरण']}          icon="📋" />
        <Section title="पात्रता का विवरण"        content={scheme['पात्रता का विवरण']}         icon="✅" />
        <Section title="आवश्यक दस्तावेज़"        content={scheme['आवश्यक दस्तावेज़']}         icon="📄" />
        <Section title="मिलने वाले लाभ का विवरण" content={scheme['मिलने वाले लाभ का विवरण']} icon="🎁" />

        {/* Apply Button */}
        <Link
          href={`/apply/${params.id}?name=${encodeURIComponent(scheme['योजना का नाम'])}&category=${encodeURIComponent(backCategory)}`}
          className="block w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-center py-4 rounded-2xl font-bold text-base transition mt-2"
        >
          👉 रुचि दर्ज करें
        </Link>
      </div>

      <div className="h-10" />
    </div>
  )
}
