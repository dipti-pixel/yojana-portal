'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function InterestForm({ schemeId, schemeName }) {
  const [open, setOpen]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors]   = useState({})
  const [form, setForm]       = useState({
    naam: '', pita: '', gaon: '', block: '', mobile: '', aadhaar: ''
  })

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
      'नाम':           form.naam,
      'पिता का नाम':   form.pita,
      'गाँव':          form.gaon,
      'ब्लॉक':         form.block,
      'मोबाइल नंबर':  form.mobile,
      'आधार नंबर':    form.aadhaar,
      selected_scheme_id: parseInt(schemeId),
    }])
    setLoading(false)
    if (error) {
      setErrors({ submit: 'कुछ गड़बड़ हुई। फिर से कोशिश करें।' })
    } else {
      setSuccess(true)
    }
  }

  function Field({ label, field, type = 'text', inputMode, maxLength, placeholder }) {
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
        <input
          type={type}
          inputMode={inputMode}
          maxLength={maxLength}
          placeholder={placeholder}
          value={form[field]}
          onChange={e => { setForm(f => ({...f, [field]: e.target.value})); setErrors(er => ({...er, [field]: ''})) }}
          className={`w-full border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white
            ${errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
        />
        {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
      </div>
    )
  }

  if (success) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
        <div className="text-5xl mb-3">✅</div>
        <h3 className="text-green-700 font-bold text-lg">रुचि दर्ज हो गई!</h3>
        <p className="text-green-600 text-sm mt-2">
          आपकी जानकारी सफलतापूर्वक जमा हो गई है।<br/>
          संबंधित विभाग जल्द संपर्क करेगा।
        </p>
        <p className="text-gray-500 text-xs mt-3">योजना: {schemeName}</p>
      </div>
    )
  }

  return (
    <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-5 py-4 flex items-center justify-between bg-orange-500 text-white font-bold text-base active:bg-orange-600 transition"
      >
        <span>👉 रुचि दर्ज करें</span>
        <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="px-4 py-5 space-y-4">
          <p className="text-orange-700 text-sm font-medium">
            नीचे अपनी जानकारी भरें — यह बिल्कुल मुफ़्त है।
          </p>
          <Field label="नाम *"           field="naam"    placeholder="अपना पूरा नाम लिखें" />
          <Field label="पिता का नाम *"   field="pita"    placeholder="पिता का नाम लिखें" />
          <Field label="गाँव *"          field="gaon"    placeholder="गाँव / कस्बे का नाम" />
          <Field label="ब्लॉक *"         field="block"   placeholder="ब्लॉक का नाम" />
          <Field label="मोबाइल नंबर *"  field="mobile"  inputMode="numeric" maxLength={10} placeholder="10 अंकों का नंबर" />
          <Field label="आधार नंबर *"    field="aadhaar" inputMode="numeric" maxLength={12} placeholder="12 अंकों का आधार नंबर" />

          {errors.submit && (
            <p className="text-red-500 text-sm text-center">{errors.submit}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B3A6B] text-white py-3 rounded-xl font-bold text-base disabled:opacity-60 active:bg-blue-900 transition"
          >
            {loading ? 'जमा हो रहा है...' : '✅ जमा करें'}
          </button>
        </form>
      )}
    </div>
  )
}
