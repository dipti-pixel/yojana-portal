import Link from 'next/link'
import {
  IconKisan, IconShramik, IconVriddhajan, IconMahilaye,
  IconVidhwa, IconAnath, IconDivyang, IconYuva,
  IconPashupalan, IconVidyarthi, IconMachhware, IconKaarigar, IconAwaashin,
} from '@/components/CategoryIcons'

const CATEGORIES = [
  { name: 'किसान',                      Icon: IconKisan,      bg: 'bg-green-100',  text: 'text-green-700' },
  { name: 'प्रवासी / श्रमिक',           Icon: IconShramik,    bg: 'bg-yellow-100', text: 'text-yellow-700' },
  { name: 'वृद्धजन',                    Icon: IconVriddhajan, bg: 'bg-blue-100',   text: 'text-blue-700' },
  { name: 'महिलाएं',                    Icon: IconMahilaye,   bg: 'bg-pink-100',   text: 'text-pink-700' },
  { name: 'विधवा / निराश्रित महिलाएं',  Icon: IconVidhwa,     bg: 'bg-purple-100', text: 'text-purple-700' },
  { name: 'अनाथ बच्चे',                Icon: IconAnath,      bg: 'bg-rose-100',   text: 'text-rose-700' },
  { name: 'दिव्यांगजन',                Icon: IconDivyang,    bg: 'bg-indigo-100', text: 'text-indigo-700' },
  { name: 'बेरोजगार युवा',             Icon: IconYuva,       bg: 'bg-cyan-100',   text: 'text-cyan-700' },
  { name: 'पशुपालक',                   Icon: IconPashupalan, bg: 'bg-orange-100', text: 'text-orange-700' },
  { name: 'विद्यार्थी',                Icon: IconVidyarthi,  bg: 'bg-teal-100',   text: 'text-teal-700' },
  { name: 'मछुआरे / केवट',             Icon: IconMachhware,  bg: 'bg-sky-100',    text: 'text-sky-700' },
  { name: 'पारंपरिक कारीगर',           Icon: IconKaarigar,   bg: 'bg-amber-100',  text: 'text-amber-700' },
  { name: 'आवासहीन परिवार',            Icon: IconAwaashin,   bg: 'bg-lime-100',   text: 'text-lime-700' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-[#1B3A6B] text-white px-4 pt-8 pb-6 text-center">
        <svg className="w-12 h-12 mx-auto mb-2 text-blue-200" viewBox="0 0 48 48" fill="none">
          <rect x="4" y="20" width="40" height="24" rx="2" fill="currentColor" fillOpacity="0.3"/>
          <path d="M2 22 L24 6 L46 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="18" y="30" width="12" height="14" rx="1" fill="currentColor" fillOpacity="0.6"/>
          <rect x="8" y="26" width="8" height="8" rx="1" fill="currentColor" fillOpacity="0.5"/>
          <rect x="32" y="26" width="8" height="8" rx="1" fill="currentColor" fillOpacity="0.5"/>
        </svg>
        <h1 className="text-3xl font-extrabold leading-snug tracking-wide">योजना मित्र</h1>
        <p className="text-blue-200 text-base mt-1 font-semibold">प्रयागराज जिला — सरकारी योजनाएं</p>
        <div className="mt-3 inline-flex items-center gap-1.5 bg-orange-500 text-white text-sm px-4 py-1.5 rounded-full font-bold">
          📍 QR आधारित प्रवेश
        </div>
      </div>

      {/* Introduction */}
      <div className="bg-white mx-4 mt-4 rounded-2xl p-4 shadow-sm border border-blue-100">
        <h2 className="text-[#1B3A6B] font-extrabold text-base mb-2">जनपद जन-सेवा पोर्टल — परिचय</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          यह पोर्टल जनपद प्रशासन द्वारा नागरिकों तक सरकारी योजनाओं की जानकारी सुलभ रूप से पहुँचाने हेतु विकसित किया गया है। इस पोर्टल के माध्यम से आप विभिन्न सरकारी योजनाओं का विवरण, अर्हताएँ एवं आवश्यक दस्तावेज़ों की जानकारी एक स्थान पर प्राप्त कर सकते हैं।
        </p>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          यदि आप किसी योजना के अंतर्गत स्वयं को पात्र समझते हैं, तो आप उस योजना में अपनी रुचि दर्ज कर सकते हैं। रुचि दर्ज होने के पश्चात् संबंधित विभाग आपसे संपर्क कर आपकी पात्रता का परीक्षण करेगा।
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="text-amber-800 text-xs font-bold mb-1">⚠️ महत्त्वपूर्ण सूचना</p>
          <p className="text-amber-700 text-xs leading-relaxed">
            रुचि दर्ज करना मात्र एक अभिव्यक्ति है — यह किसी भी प्रकार की गारंटी या स्वीकृति नहीं है। योजना का लाभ केवल तभी प्रदान किया जाएगा जब संबंधित विभाग द्वारा आपकी पात्रता एवं दस्तावेज़ों का विधिवत सत्यापन पूर्ण हो जाए।
          </p>
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
