import Link from 'next/link'
import {
  IconKisan, IconShramik, IconVriddhajan, IconMahilaye,
  IconVidhwa, IconAnath, IconDivyang, IconYuva,
  IconPashupalan, IconVidyarthi, IconMachhware, IconKaarigar,
} from '@/components/CategoryIcons'

const CATEGORIES = [
  { name: 'किसान',                      Icon: IconKisan,      color: 'bg-green-50   border-green-200  text-green-700' },
  { name: 'प्रवासी / श्रमिक',           Icon: IconShramik,    color: 'bg-yellow-50  border-yellow-200 text-yellow-700' },
  { name: 'वृद्धजन',                    Icon: IconVriddhajan, color: 'bg-blue-50    border-blue-200   text-blue-700' },
  { name: 'महिलाएं',                    Icon: IconMahilaye,   color: 'bg-pink-50    border-pink-200   text-pink-700' },
  { name: 'विधवा / निराश्रित महिलाएं',  Icon: IconVidhwa,     color: 'bg-purple-50  border-purple-200 text-purple-700' },
  { name: 'अनाथ बच्चे',                Icon: IconAnath,      color: 'bg-rose-50    border-rose-200   text-rose-700' },
  { name: 'दिव्यांगजन',                Icon: IconDivyang,    color: 'bg-indigo-50  border-indigo-200 text-indigo-700' },
  { name: 'बेरोजगार युवा',             Icon: IconYuva,       color: 'bg-cyan-50    border-cyan-200   text-cyan-700' },
  { name: 'पशुपालक',                   Icon: IconPashupalan, color: 'bg-orange-50  border-orange-200 text-orange-700' },
  { name: 'विद्यार्थी',                Icon: IconVidyarthi,  color: 'bg-teal-50    border-teal-200   text-teal-700' },
  { name: 'मछुआरे / केवट',             Icon: IconMachhware,  color: 'bg-sky-50     border-sky-200    text-sky-700' },
  { name: 'पारंपरिक कारीगर',           Icon: IconKaarigar,   color: 'bg-amber-50   border-amber-200  text-amber-700' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-[#1B3A6B] text-white px-4 pt-10 pb-8 text-center">
        <svg className="w-10 h-10 mx-auto mb-2 text-blue-200" viewBox="0 0 48 48" fill="none">
          <rect x="4" y="20" width="40" height="24" rx="2" fill="currentColor" fillOpacity="0.3"/>
          <path d="M2 22 L24 6 L46 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="18" y="30" width="12" height="14" rx="1" fill="currentColor" fillOpacity="0.6"/>
          <rect x="8" y="26" width="8" height="8" rx="1" fill="currentColor" fillOpacity="0.5"/>
          <rect x="32" y="26" width="8" height="8" rx="1" fill="currentColor" fillOpacity="0.5"/>
        </svg>
        <h1 className="text-2xl font-bold leading-snug">योजना मित्र</h1>
        <p className="text-blue-200 text-sm mt-1">प्रयागराज जिला — सरकारी योजनाएं</p>
        <div className="mt-4 inline-flex items-center gap-1.5 bg-orange-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold">
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 0C3.8 0 2 1.8 2 4c0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4zm0 5.5C5.2 5.5 4.5 4.8 4.5 4S5.2 2.5 6 2.5 7.5 3.2 7.5 4 6.8 5.5 6 5.5z"/>
          </svg>
          QR आधारित प्रवेश
        </div>
      </div>

      {/* Category Grid */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <h2 className="text-gray-500 text-xs font-semibold mb-4 text-center uppercase tracking-widest">
          अपनी श्रेणी चुनें
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/schemes?category=${encodeURIComponent(cat.name)}`}
            >
              <div className={`border-2 rounded-2xl p-4 text-center active:scale-95 transition-transform ${cat.color}`}>
                <cat.Icon className="w-10 h-10 mx-auto mb-2" />
                <p className="font-bold text-sm leading-snug">{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-gray-400 text-xs">
        <p>योजना मित्र • प्रयागराज जिला प्रशासन</p>
      </div>
    </div>
  )
}
