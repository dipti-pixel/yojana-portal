'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function Field({ label, field, type = 'text', inputMode, maxLength, placeholder, value, onChange, error }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white
          ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

function ApplyForm({ schemeId, schemeName, category }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors]   = useState({})
  const [form, setForm]       = useState({
    naam: '', pita: '', gaon: '', block: '', mobile: '', aadhaar: ''
  })

  function set(field) {
    return e => {
      setForm(f => ({ ...f, [field]: e.target.value }))
      setErrors(er => ({ ...er, [field]: '' }))
    }
  }

  function validate() {
    const e = {}
    if (!form.naam.trim())   e.naam   = 'नाम आवश्यक है'
    if (!form.pita.trim())   e.pita   = 'पिता का नाम आवश्यक है'
    if (!form.gaon.trim())   e.gaon   = 'गाँव आवश्यक है'
    if (!form.block.trim())  e.block  = 'ब्लॉक आवश्यक है'
    if (!/^\d{10}$/.test(form.mobile))  e.mobile  = 'सही 10 अंकों का मोबाइल नंबर डालें'
    if (!/^\d{12}$/.test(form.aadhaar)) e.aadhaar = 'सही 12 अंकों का आधार नंबर डालें'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    const { error } = await supabase.from('applications').insert([{
      'नाम':          form.naam,
      'पिता का नाम':  form.pita,
      'गाँव':         form.gaon,
      'ब्लॉक':        form.block,
      'मोबाइल नंबर': form.mobile,
      'आधार नंबर':   form.aadhaar,
      selected_scheme_id: parseInt(schemeId),
    }])
    setLoading(false)
    if (error) {
      setErrors({ submit: 'कुछ गड़बड़ हुई। फिर से कोशिश करें।' })
    } else {
      setSuccess(true)
    }
  }

  const backHref = category
    ? `/schemes/${schemeId}?category=${encodeURIComponent(category)}`
    : `/schemes/${schemeId}`

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-green-700 font-bold text-xl mb-2">रुचि दर्ज हो गई!</h2>
        <p className="text-gray-600 text-sm mb-1">आपकी जानकारी सफलतापूर्वक जमा हो गई है।</p>
        <p className="text-gray-500 text-sm mb-6">संबंधित विभाग जल्द संपर्क करेगा।</p>
        <p className="text-xs text-gray-400 mb-8">योजना: {schemeName}</p>
        <button
          onClick={() => router.push('/')}
          className="bg-[#1B3A6B] text-white px-8 py-3 rounded-xl font-bold"
        >
          होम पेज पर जाएं
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1B3A6B] text-white px-4 py-4 flex items-start gap-3 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-white text-xl mt-0.5 flex-shrink-0">←</button>
        <div>
          <p className="text-xs text-blue-300">रुचि दर्ज करें</p>
          <h1 className="font-bold text-base leading-snug line-clamp-1">{schemeName}</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5">
        <div className="bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3 mb-5">
          <p className="text-orange-700 text-sm font-medium">
            👉 नीचे अपनी जानकारी भरें — यह बिल्कुल मुफ़्त है।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field
            label="नाम *" field="naam" placeholder="अपना पूरा नाम लिखें"
            value={form.naam} onChange={set('naam')} error={errors.naam}
          />
          <Field
            label="पिता का नाम *" field="pita" placeholder="पिता का नाम लिखें"
            value={form.pita} onChange={set('pita')} error={errors.pita}
          />
          <Field
            label="गाँव *" field="gaon" placeholder="गाँव / कस्बे का नाम"
            value={form.gaon} onChange={set('gaon')} error={errors.gaon}
          />
          <Field
            label="ब्लॉक *" field="block" placeholder="ब्लॉक का नाम"
            value={form.block} onChange={set('block')} error={errors.block}
          />
          <Field
            label="मोबाइल नंबर *" field="mobile" inputMode="numeric" maxLength={10}
            placeholder="10 अंकों का नंबर"
            value={form.mobile} onChange={set('mobile')} error={errors.mobile}
          />
          <Field
            label="आधार नंबर *" field="aadhaar" inputMode="numeric" maxLength={12}
            placeholder="12 अंकों का आधार नंबर"
            value={form.aadhaar} onChange={set('aadhaar')} error={errors.aadhaar}
          />

          {errors.submit && (
            <p className="text-red-500 text-sm text-center">{errors.submit}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B3A6B] text-white py-4 rounded-xl font-bold text-base disabled:opacity-60 active:bg-blue-900 transition mt-2"
          >
            {loading ? 'जमा हो रहा है...' : '✅ जमा करें'}
          </button>
        </form>
      </div>
      <div className="h-10" />
    </div>
  )
}

function ApplyPageInner() {
  const searchParams = useSearchParams()
  const [params, setParams] = useState(null)

  useEffect(() => {
    const path = window.location.pathname
    const id = path.split('/apply/')[1]?.split('/')[0]
    setParams({
      id,
      schemeName: searchParams.get('name') || 'योजना',
      category: searchParams.get('category') || '',
    })
  }, [searchParams])

  if (!params) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">लोड हो रहा है...</div>
  )

  return <ApplyForm schemeId={params.id} schemeName={params.schemeName} category={params.category} />
}

export default function ApplyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-gray-400">लोड हो रहा है...</div>
    }>
      <ApplyPageInner />
    </Suspense>
  )
}
