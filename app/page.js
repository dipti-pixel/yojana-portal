'use client'

import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'
import {
  IconKisan, IconShramik, IconVriddhajan, IconMahilaye,
  IconVidhwa, IconAnath, IconDivyang, IconYuva,
  IconPashupalan, IconVidyarthi, IconMachhware, IconKaarigar, IconAwaashin,
} from '@/components/CategoryIcons'

const CATEGORIES = [
  { hi: 'किसान',                      en: 'Farmers',               Icon: IconKisan,      bg: 'bg-green-100',  text: 'text-green-700' },
  { hi: 'महिलाएं',                    en: 'Women',                 Icon: IconMahilaye,   bg: 'bg-pink-100',   text: 'text-pink-700' },
  { hi: 'बेरोजगार युवा',             en: 'Unemployed Youth',       Icon: IconYuva,       bg: 'bg-cyan-100',   text: 'text-cyan-700' },
  { hi: 'वृद्धजन',                    en: 'Senior Citizens',       Icon: IconVriddhajan, bg: 'bg-blue-100',   text: 'text-blue-700' },
  { hi: 'विधवा / निराश्रित महिलाएं',  en: 'Widows / Destitute',   Icon: IconVidhwa,     bg: 'bg-purple-100', text: 'text-purple-700' },
  { hi: 'अनाथ बच्चे',                en: 'Orphan Children',       Icon: IconAnath,      bg: 'bg-rose-100',   text: 'text-rose-700' },
  { hi: 'पशुपालक',                   en: 'Livestock Farmers',      Icon: IconPashupalan, bg: 'bg-orange-100', text: 'text-orange-700' },
  { hi: 'मछुआरे / केवट',             en: 'Fishermen',             Icon: IconMachhware,  bg: 'bg-sky-100',    text: 'text-sky-700' },
  { hi: 'आवासहीन परिवार',            en: 'Homeless Families',     Icon: IconAwaashin,   bg: 'bg-lime-100',   text: 'text-lime-700' },
  { hi: 'प्रवासी / श्रमिक',           en: 'Migrant Workers',       Icon: IconShramik,    bg: 'bg-yellow-100', text: 'text-yellow-700' },
  { hi: 'दिव्यांगजन',                en: 'Differently Abled',     Icon: IconDivyang,    bg: 'bg-indigo-100', text: 'text-indigo-700' },
  { hi: 'विद्यार्थी',                en: 'Students',              Icon: IconVidyarthi,  bg: 'bg-teal-100',   text: 'text-teal-700' },
  { hi: 'पारंपरिक कारीगर',           en: 'Traditional Artisans',  Icon: IconKaarigar,   bg: 'bg-amber-100',  text: 'text-amber-700' },
]

const T = {
  title:    { hi: 'योजना मित्र',                             en: 'Yojana Mitra' },
  subtitle: { hi: 'प्रयागराज जिला — सरकारी योजनाएं',        en: 'Prayagraj District — Government Schemes' },
  portal:   { hi: 'योजना मित्र — ',                           en: 'Yojana Mitr — ' },
  intro:    {
    hi: 'यह पोर्टल नागरिकों तक सरकारी योजनाओं की जानकारी पहुँचाने हेतु बनाया गया है। अपनी श्रेणी चुनें, योजना जानें — और पात्र हों तो रुचि दर्ज करें, ताकि संबंधित विभाग आपसे संपर्क कर लाभ दिला सके।',
    en: 'This portal is built to bring government scheme information to every citizen. Select your category, learn about schemes — and if eligible, register your interest so the department can contact you.',
  },
  note:     {
    hi: '⚠️ रुचि दर्ज करना गारंटी नहीं — पात्रता व दस्तावेज़ सत्यापन के बाद ही लाभ मिलेगा।',
    en: '⚠️ Registering interest is not a guarantee — benefits are given only after eligibility & document verification.',
  },
  choose:   { hi: 'अपनी श्रेणी चुनें', en: 'Choose Your Category' },
  footer:   { hi: 'योजना मित्र • प्रयागराज जिला प्रशासन', en: 'Yojana Mitra • Prayagraj District Administration' },
}

export default function Home() {
  const { lang, toggleLang } = useLang()
  const t = k => T[k][lang]

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-[#1B3A6B] text-white px-4 pt-5 pb-4 text-center relative">
        {/* Lang Toggle */}
        <button
          onClick={toggleLang}
          className="absolute top-4 right-4 bg-white text-[#1B3A6B] text-xs font-extrabold px-3 py-1.5 rounded-full shadow"
        >
          {lang === 'hi' ? 'EN' : 'हि'}
        </button>
        <h1 className="text-2xl font-extrabold tracking-wide">{t('title')}</h1>
        <p className="text-blue-200 text-sm mt-0.5 font-semibold">{t('subtitle')}</p>
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
          <span className="font-extrabold text-[#1B3A6B]">{t('portal')}</span>
          {t('intro')}
        </p>
        <div className="bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 mt-2">
          <p className="text-amber-700 text-xs font-bold">{t('note')}</p>
        </div>
      </div>

      {/* Category Grid */}
      <div className="max-w-lg mx-auto px-4 py-5">
        <h2 className="text-gray-700 text-base font-extrabold mb-4 text-center uppercase tracking-wide">
          {t('choose')}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.hi} href={`/schemes?category=${encodeURIComponent(cat.hi)}`}>
              <div className="rounded-2xl overflow-hidden shadow-sm border-2 border-gray-200 active:scale-95 transition-transform">
                <div className={`${cat.bg} ${cat.text} flex items-center justify-center py-5`}>
                  <cat.Icon className="w-14 h-14" />
                </div>
                <div className="bg-white px-2 py-3 text-center border-t-2 border-gray-100">
                  <p className="font-extrabold text-gray-800 text-sm leading-snug">
                    {lang === 'hi' ? cat.hi : cat.en}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-gray-500 text-sm font-semibold">
        <p>{t('footer')}</p>
      </div>
    </div>
  )
}
