import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const DEPARTMENTS = [
  { name: 'ग्राम्य विकास',      icon: '🏘', color: 'bg-green-100  text-green-800' },
  { name: 'समाज कल्याण विभाग', icon: '🤝', color: 'bg-blue-100   text-blue-800'  },
  { name: 'श्रम विभाग',          icon: '🔨', color: 'bg-yellow-100 text-yellow-800'},
  { name: 'दिव्यांग विभाग',      icon: '♿', color: 'bg-purple-100 text-purple-800'},
  { name: 'पशुपालन विभाग',       icon: '🐄', color: 'bg-orange-100 text-orange-800'},
  { name: 'मत्सय विभाग',         icon: '🐟', color: 'bg-cyan-100   text-cyan-800'  },
  { name: 'जिला प्रोबेशन',       icon: '⚖️', color: 'bg-red-100    text-red-800'   },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="bg-[#1B3A6B] text-white text-center px-4 py-12">
        <div className="text-5xl mb-3">🏛</div>
        <h1 className="text-2xl font-bold mb-2">सरकारी योजनाएं खोजें</h1>
        <p className="text-blue-200 mb-6 text-sm">
          999 योजनाएं &bull; 7 विभाग &bull; प्रयागराज जिला
        </p>
        <Link href="/schemes">
          <button className="bg-orange-500 hover:bg-orange-600 transition text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg">
            🔍 योजना खोजें
          </button>
        </Link>
      </div>

      {/* Department Cards */}
      <div className="max-w-2xl mx-auto px-4 py-8 w-full">
        <h2 className="text-gray-700 font-bold mb-4 text-center text-lg">
          विभाग के अनुसार खोजें
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {DEPARTMENTS.map((dept) => (
            <Link
              key={dept.name}
              href={`/schemes?vibhag=${encodeURIComponent(dept.name)}`}
            >
              <div
                className={`rounded-xl p-4 text-center font-medium text-sm cursor-pointer hover:opacity-80 transition ${dept.color}`}
              >
                <div className="text-3xl mb-1">{dept.icon}</div>
                {dept.name}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
