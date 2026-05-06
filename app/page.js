import Link from 'next/link'

const CATEGORIES = [
  { name: 'किसान',                    icon: '🌾', color: 'bg-green-50   border-green-200 text-green-800' },
  { name: 'प्रवासी / श्रमिक',        icon: '🔨', color: 'bg-yellow-50  border-yellow-200 text-yellow-800' },
  { name: 'वृद्धजन',                  icon: '👴', color: 'bg-blue-50    border-blue-200 text-blue-800' },
  { name: 'महिलाएं',                  icon: '👩', color: 'bg-pink-50    border-pink-200 text-pink-800' },
  { name: 'विधवा / निराश्रित महिलाएं', icon: '🙏', color: 'bg-purple-50  border-purple-200 text-purple-800' },
  { name: 'अनाथ बच्चे',              icon: '👶', color: 'bg-rose-50    border-rose-200 text-rose-800' },
  { name: 'दिव्यांगजन',              icon: '♿', color: 'bg-indigo-50  border-indigo-200 text-indigo-800' },
  { name: 'बेरोजगार युवा',           icon: '🎓', color: 'bg-cyan-50    border-cyan-200 text-cyan-800' },
  { name: 'पशुपालक',                 icon: '🐄', color: 'bg-orange-50  border-orange-200 text-orange-800' },
  { name: 'विद्यार्थी',              icon: '📚', color: 'bg-teal-50    border-teal-200 text-teal-800' },
  { name: 'मछुआरे / केवट',           icon: '🐟', color: 'bg-sky-50     border-sky-200 text-sky-800' },
  { name: 'पारंपरिक कारीगर',         icon: '🏺', color: 'bg-amber-50   border-amber-200 text-amber-800' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-[#1B3A6B] text-white px-4 pt-10 pb-8 text-center">
        <div className="text-4xl mb-2">🏛️</div>
        <h1 className="text-2xl font-bold leading-snug">योजना मित्र</h1>
        <p className="text-blue-200 text-sm mt-1">प्रयागराज जिला — सरकारी योजनाएं</p>
        <div className="mt-4 inline-block bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
          📍 QR आधारित प्रवेश
        </div>
      </div>

      {/* Category Grid */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <h2 className="text-gray-600 text-sm font-semibold mb-4 text-center uppercase tracking-wide">
          अपनी श्रेणी चुनें
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/schemes?category=${encodeURIComponent(cat.name)}`}
            >
              <div className={`border-2 rounded-2xl p-4 text-center active:scale-95 transition-transform ${cat.color}`}>
                <div className="text-4xl mb-2">{cat.icon}</div>
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
