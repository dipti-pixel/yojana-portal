import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }) {
  const { data } = await supabase
    .from('schemes')
    .select('naam')
    .eq('id', params.id)
    .single()
  return { title: data?.naam || 'योजना विवरण' }
}

function Section({ title, content, icon }) {
  if (!content) return null
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <h3 className="font-bold text-[#1B3A6B] mb-2 flex items-center gap-2 text-base">
        <span className="text-xl">{icon}</span> {title}
      </h3>
      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
        {content}
      </p>
    </div>
  )
}

export default async function SchemeDetail({ params }) {
  const { data: scheme, error } = await supabase
    .from('schemes')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !scheme) return notFound()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-6 w-full flex-1">

        {/* Back */}
        <Link
          href="/schemes"
          className="inline-flex items-center gap-1 text-blue-600 text-sm mb-4 hover:underline"
        >
          ← वापस जाएं
        </Link>

        {/* Header card */}
        <div className="bg-[#1B3A6B] text-white rounded-xl p-5 mb-4 shadow">
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
            {scheme.vibhag}
          </span>
          <h1 className="text-xl font-bold mt-3 leading-snug">{scheme.naam}</h1>
        </div>

        {/* Detail sections */}
        <div className="flex flex-col gap-4">
          <Section title="योजना का विवरण"   content={scheme.vivaran}  icon="📋" />
          <Section title="पात्रता"            content={scheme.paatrata} icon="✅" />
          <Section title="आवश्यक दस्तावेज़"  content={scheme.dastavez} icon="📄" />
          <Section title="मिलने वाले लाभ"   content={scheme.labh}     icon="🎁" />
        </div>

        {/* CTA */}
        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-5 text-center">
          <p className="text-gray-700 font-semibold mb-3">
            इस योजना के लिए आवेदन करना है?
          </p>
          <p className="text-gray-500 text-sm mb-4">
            अपने नजदीकी ग्राम पंचायत या जनसेवा केंद्र पर संपर्क करें।
          </p>
          <Link href="/">
            <button className="bg-orange-500 hover:bg-orange-600 transition text-white px-6 py-2 rounded-full font-bold">
              🏠 होम पर जाएं
            </button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
