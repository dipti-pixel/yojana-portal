import Link from 'next/link'

const DEPT_COLORS = {
  'ग्राम्य विकास':       'bg-green-100 text-green-800',
  'समाज कल्याण विभाग':  'bg-blue-100 text-blue-800',
  'श्रम विभाग':          'bg-yellow-100 text-yellow-800',
  'दिव्यांग विभाग':      'bg-purple-100 text-purple-800',
  'पशुपालन विभाग':       'bg-orange-100 text-orange-800',
  'मत्सय विभाग':         'bg-cyan-100 text-cyan-800',
  'जिला प्रोबेशन':       'bg-red-100 text-red-800',
}

export default function SchemeCard({ scheme }) {
  const colorClass = DEPT_COLORS[scheme.vibhag] || 'bg-gray-100 text-gray-700'

  return (
    <Link href={`/schemes/${scheme.id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-blue-200 transition-all h-full">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colorClass}`}>
          {scheme.vibhag || 'विभाग'}
        </span>
        <h2 className="font-bold text-gray-800 mt-2 mb-1 text-base leading-snug line-clamp-2">
          {scheme.naam}
        </h2>
        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
          {scheme.vivaran}
        </p>
        <div className="mt-3 text-orange-600 text-sm font-semibold">
          पूरी जानकारी देखें →
        </div>
      </div>
    </Link>
  )
}
