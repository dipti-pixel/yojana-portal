import Link from 'next/link'
import {
  IconKisan, IconShramik, IconVriddhajan, IconMahilaye,
  IconVidhwa, IconAnath, IconDivyang, IconYuva,
  IconPashupalan, IconVidyarthi, IconMachhware, IconKaarigar, IconAwaashin,
} from '@/components/CategoryIcons'

const CATEGORIES = [
  { name: 'किसान',                      Icon: IconKisan,      bg: 'bg-green-100',  text: 'text-green-700' },
  { name: 'महिलाएं',                    Icon: IconMahilaye,   bg: 'bg-pink-100',   text: 'text-pink-700' },
  { name: 'बेरोजगार युवा',             Icon: IconYuva,       bg: 'bg-cyan-100',   text: 'text-cyan-700' },
  { name: 'वृद्धजन',                    Icon: IconVriddhajan, bg: 'bg-blue-100',   text: 'text-blue-700' },
  { name: 'विधवा / निराश्रित महिलाएं',  Icon: IconVidhwa,     bg: 'bg-purple-100', text: 'text-purple-700' },
  { name: 'अनाथ बच्चे',                Icon: IconAnath,      bg: 'bg-rose-100',   text: 'text-rose-700' },
  { name: 'पशुपालक',                   Icon: IconPashupalan, bg: 'bg-orange-100', text: 'text-orange-700' },
  { name: 'मछुआरे / केवट',             Icon: IconMachhware,  bg: 'bg-sky-100',    text: 'text-sky-700' },
  { name: 'आवासहीन परिवार',            Icon: IconAwaashin,   bg: 'bg-lime-100',   text: 'text-lime-700' },
  { name: 'प्रवासी / श्रमिक',           Icon: IconShramik,    bg: 'bg-yellow-100', text: 'text-yellow-700' },
  { name: 'दिव्यांगजन',                Icon: IconDivyang,    bg: 'bg-indigo-100', text: 'text-indigo-700' },
  { name: 'विद्यार्थी',                Icon: IconVidyarthi,  bg: 'bg-teal-100',   text: 'text-teal-700' },
  { name: 'पारंपरिक कारीगर',           Icon: IconKaarigar,   bg: 'bg-amber-100',  text: 'text-amber-700' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-[#1B3A6B] text-white px-4 pt-5 pb-4 text-center">
        <h1 className="text-2xl font-extrabold tracking-wide">योजना मित्र</h1>
        <p className="text-blue-200 text-sm mt-0.5 font-semibold">प्रयागराज जिला — सरकारी योजनाएं</p>
      </div>
      {/* Tricolor stripe */}
      <div className="flex h-2">
        <div className="flex-1 bg-orange-500"/>
        <div className="flex-1 bg-white"/>
        <div className="flex-1 bg-green-600"/>
      </div>

      {/* Intro card */}
      <div className="bg-white mx-4 mt-3 rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
        <p className="text-gray-700 text-sm leading-relaxed">
          <span className="font-extrabold text-[#1B3A6B]">जनपद जन-सेवा पोर्टल — </span>
          यह पोर्टल नागरिकों तक सरकारी योजनाओं की जानकारी पहुँचाने हेतु बनाया गया है। अपनी श्रेणी चुनें, योजना जानें — और पात्र हों तो रुचि दर्ज करें, ताकि संबंधित विभाग आपसे संपर्क कर लाभ दिला सके।
        </p>
        <div className="bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 mt-2">
          <p className="text-amber-700 text-xs font-bold">⚠️ रुचि दर्ज करना गारंटी नहीं — पात्रता व दस्तावेज़ सत्यापन के बाद ही लाभ मिलेगा।</p>
        </div>
      </div>

      {/* Category Grid */}
      <div className="max-w-lg mx-auto px-4 py-5">
        <h2 className="text-gray-700 text-base font-extrabold mb-4 text-center uppercase tracking-wide">
          अपनी श्रेणी चुनें
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.name} href={`/schemes?category=${encodeURIComponent(cat.name)}`}>
              <div className="rounded-2xl overflow-hidden shadow-sm border-2 border-gray-200 active:scale-95 transition-transform">
                <div className={`${cat.bg} ${cat.text} flex items-center justify-center py-5`}>
                  <cat.Icon className="w-14 h-14" />
                </div>
                <div className="bg-white px-2 py-3 text-center border-t-2 border-gray-100">
                  <p className="font-extrabold text-gray-800 text-sm leading-snug">{cat.name}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-gray-500 text-sm font-semibold">
        <p>योजना मित्र • प्रयागराज जिला प्रशासन</p>
      </div>
    </div>
  )
}
