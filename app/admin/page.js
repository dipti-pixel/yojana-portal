'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'

const CATEGORIES = [
  'किसान','प्रवासी / श्रमिक','वृद्धजन','महिलाएं',
  'विधवा / निराश्रित महिलाएं','अनाथ बच्चे','दिव्यांगजन',
  'बेरोजगार युवा','पशुपालक','विद्यार्थी','मछुआरे / केवट',
  'पारंपरिक कारीगर','आवासहीन परिवार',
]

const REQUIRED_HEADERS = [
  'श्रेणी','योजना का नाम','योजना का विवरण',
  'पात्रता का विवरण','आवश्यक दस्तावेज़','मिलने वाले लाभ का विवरण','कार्यदायी विभाग',
]

const EMPTY = {
  'श्रेणी': '', 'योजना का नाम': '', 'योजना का विवरण': '',
  'पात्रता का विवरण': '', 'आवश्यक दस्तावेज़': '',
  'मिलने वाले लाभ का विवरण': '', 'कार्यदायी विभाग': '',
}

const PIN = '1234'

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false)
  const [pin, setPin]           = useState('')
  const [pinErr, setPinErr]     = useState(false)

  function tryUnlock() {
    if (pin === PIN) setUnlocked(true)
    else setPinErr(true)
  }

  if (!unlocked) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
        <div className="text-4xl mb-3">🔐</div>
        <h1 className="font-bold text-xl text-gray-800 mb-1">Admin Panel</h1>
        <p className="text-gray-500 text-sm mb-6">योजना मित्र — प्रशासन</p>
        <input
          type="password"
          placeholder="PIN डालें"
          value={pin}
          onChange={e => { setPin(e.target.value); setPinErr(false) }}
          onKeyDown={e => e.key === 'Enter' && tryUnlock()}
          className={`w-full border-2 rounded-xl px-4 py-3 text-center text-2xl tracking-widest mb-3 focus:outline-none
            ${pinErr ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-400'}`}
        />
        {pinErr && <p className="text-red-500 text-sm mb-3">गलत PIN</p>}
        <button onClick={tryUnlock} className="w-full bg-[#1B3A6B] text-white py-3 rounded-xl font-bold">
          प्रवेश करें
        </button>
        <p className="text-gray-400 text-xs mt-4">Default PIN: 1234</p>
      </div>
    </div>
  )

  return <Dashboard />
}

function Dashboard() {
  const [tab, setTab]             = useState('schemes')
  const [schemes, setSchemes]     = useState([])
  const [apps, setApps]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [catFilter, setCatFilter] = useState('सभी')
  const [modal, setModal]         = useState(null)
  const [form, setForm]           = useState(EMPTY)
  const [saving, setSaving]       = useState(false)
  const [toast, setToast]         = useState('')
  const [xlModal, setXlModal]     = useState(false)
  const [xlRows, setXlRows]       = useState([])
  const [xlError, setXlError]     = useState('')
  const [xlUploading, setXlUploading] = useState(false)
  const fileRef = useRef()

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  function downloadTemplate() {
    const ws = XLSX.utils.aoa_to_sheet([REQUIRED_HEADERS])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'योजनाएं')
    XLSX.writeFile(wb, 'yojana_template.xlsx')
  }

  function handleExcelUpload(e) {
    setXlError('')
    setXlRows([])
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = evt => {
      const wb = XLSX.read(evt.target.result, { type: 'array' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const data = XLSX.utils.sheet_to_json(ws, { defval: '' })
      if (!data.length) { setXlError('Excel में कोई डेटा नहीं मिला।'); return }
      const headers = Object.keys(data[0]).map(h => h.trim())
      const missing = REQUIRED_HEADERS.filter(h => !headers.includes(h))
      if (missing.length) { setXlError(`ये कॉलम नहीं मिले: ${missing.join(', ')}`); return }
      const rows = data.map(r => ({
        'श्रेणी': String(r['श्रेणी'] || '').trim(),
        'योजना का नाम': String(r['योजना का नाम'] || '').trim(),
        'योजना का विवरण': String(r['योजना का विवरण'] || '').trim(),
        'पात्रता का विवरण': String(r['पात्रता का विवरण'] || '').trim(),
        'आवश्यक दस्तावेज़': String(r['आवश्यक दस्तावेज़'] || '').trim(),
        'मिलने वाले लाभ का विवरण': String(r['मिलने वाले लाभ का विवरण'] || '').trim(),
        'कार्यदायी विभाग': String(r['कार्यदायी विभाग'] || '').trim(),
      })).filter(r => r['योजना का नाम'])
      if (!rows.length) { setXlError('Excel में कोई मान्य योजना नहीं मिली।'); return }
      setXlRows(rows)
    }
    reader.readAsArrayBuffer(file)
  }

  async function importExcelRows() {
    setXlUploading(true)
    const { error } = await supabase.from('schemes').insert(xlRows)
    setXlUploading(false)
    if (error) { setXlError('अपलोड में गड़बड़ हुई: ' + error.message); return }
    setXlModal(false); setXlRows([]); setXlError('')
    if (fileRef.current) fileRef.current.value = ''
    showToast(`✅ ${xlRows.length} योजनाएं जोड़ी गईं`)
    loadAll()
  }

  async function loadAll() {
    const [{ data: s }, { data: a }] = await Promise.all([
      supabase.from('schemes').select('*').order('id'),
      supabase.from('applications').select('*, schemes("योजना का नाम")').order('created_at', { ascending: false }),
    ])
    setSchemes(s || [])
    setApps(a || [])
    setLoading(false)
  }

  useEffect(() => { loadAll() }, [])

  async function saveScheme() {
    setSaving(true)
    if (modal === 'add') {
      await supabase.from('schemes').insert([form])
      showToast('✅ योजना जोड़ी गई')
    } else {
      const { id, created_at, ...data } = form
      await supabase.from('schemes').update(data).eq('id', modal.id)
      showToast('✅ योजना अपडेट हुई')
    }
    setSaving(false)
    setModal(null)
    loadAll()
  }

  async function deleteScheme(id, naam) {
    if (!confirm(`"${naam}" हटाना है?`)) return
    await supabase.from('schemes').delete().eq('id', id)
    showToast('🗑 हटाई गई')
    loadAll()
  }

  const filtered = schemes.filter(s =>
    (catFilter === 'सभी' || s['श्रेणी'] === catFilter) &&
    (!search || s['योजना का नाम']?.toLowerCase().includes(search.toLowerCase()))
  )

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">लोड हो रहा है...</div>
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-[#1B3A6B] text-white px-4 py-4 flex items-center justify-between sticky top-0 z-20 shadow">
        <div>
          <h1 className="font-bold text-lg">⚙️ Admin Panel</h1>
          <p className="text-blue-300 text-xs">योजना मित्र — प्रयागराज</p>
        </div>
        <a href="/" className="text-blue-200 text-sm underline">पोर्टल →</a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 px-4 py-4 max-w-2xl mx-auto">
        {[
          { label: 'योजनाएं', value: schemes.length, icon: '📋' },
          { label: 'आवेदन',    value: apps.length,    icon: '📝' },
          { label: 'श्रेणियां', value: [...new Set(schemes.map(s => s['श्रेणी']))].filter(Boolean).length, icon: '🗂' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <div className="text-2xl">{s.icon}</div>
            <div className="font-bold text-xl text-[#1B3A6B]">{s.value}</div>
            <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 max-w-2xl mx-auto mb-4">
        {[['schemes','📋 योजनाएं'],['applications','📝 आवेदन']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition
              ${tab === k ? 'bg-[#1B3A6B] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-10">

        {/* ─── SCHEMES TAB ─── */}
        {tab === 'schemes' && <>
          <div className="flex gap-2 mb-3">
            <input
              placeholder="🔍 खोजें..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
            />
            <button onClick={() => { setForm(EMPTY); setModal('add') }}
              className="bg-orange-500 text-white px-3 py-2.5 rounded-xl font-bold text-sm">
              + जोड़ें
            </button>
            <button onClick={() => { setXlModal(true); setXlRows([]); setXlError('') }}
              className="bg-green-600 text-white px-3 py-2.5 rounded-xl font-bold text-sm">
              📤 Excel
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
            {['सभी',...CATEGORIES].map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border flex-shrink-0
                  ${catFilter === c ? 'bg-[#1B3A6B] text-white border-[#1B3A6B]' : 'bg-white text-gray-600 border-gray-300'}`}>
                {c}
              </button>
            ))}
          </div>

          <p className="text-gray-400 text-xs mb-3">{filtered.length} योजनाएं</p>

          <div className="space-y-2">
            {filtered.map(s => (
              <div key={s.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{s['श्रेणी']}</span>
                  <p className="font-bold text-gray-800 mt-1.5 text-sm leading-snug">{s['योजना का नाम']}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{s['कार्यदायी विभाग']}</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => { setForm({...s}); setModal(s) }}
                    className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm">✏️</button>
                  <button onClick={() => deleteScheme(s.id, s['योजना का नाम'])}
                    className="bg-red-50 text-red-500 px-3 py-1.5 rounded-lg text-sm">🗑</button>
                </div>
              </div>
            ))}
          </div>
        </>}

        {/* ─── APPLICATIONS TAB ─── */}
        {tab === 'applications' && <>
          <p className="text-gray-400 text-xs mb-3">{apps.length} आवेदन</p>
          {apps.length === 0
            ? <div className="text-center py-16 text-gray-400"><div className="text-5xl mb-3">📭</div><p>कोई आवेदन नहीं</p></div>
            : <div className="space-y-3">
                {apps.map(a => (
                  <div key={a.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex justify-between mb-2">
                      <div>
                        <p className="font-bold text-gray-800">{a['नाम']}</p>
                        <p className="text-gray-500 text-xs">पिता: {a['पिता का नाम']}</p>
                      </div>
                      <span className="text-xs text-gray-400">#{a.id}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                      <span>📍 {a['गाँव']}, {a['ब्लॉक']}</span>
                      <span>📱 {a['मोबाइल नंबर']}</span>
                      <span>🪪 {a['आधार नंबर']}</span>
                      <span className="col-span-2 text-blue-600">📋 {a.schemes?.['योजना का नाम'] || '—'}</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-2">
                      {new Date(a.created_at).toLocaleString('hi-IN')}
                    </p>
                  </div>
                ))}
              </div>
          }
        </>}
      </div>

      {/* ─── MODAL ─── */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-5 pt-5 pb-3 border-b flex items-center justify-between">
              <h2 className="font-bold text-lg text-[#1B3A6B]">
                {modal === 'add' ? '+ नई योजना' : 'योजना संपादित करें'}
              </h2>
              <button onClick={() => setModal(null)} className="text-gray-400 text-3xl leading-none">×</button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">श्रेणी *</label>
                <select value={form['श्रेणी']} onChange={e => setForm(f => ({...f,'श्रेणी':e.target.value}))}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                  <option value="">— चुनें —</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {[
                ['योजना का नाम','योजना का नाम *',false],
                ['कार्यदायी विभाग','कार्यदायी विभाग',false],
                ['योजना का विवरण','योजना का विवरण',true],
                ['पात्रता का विवरण','पात्रता का विवरण',true],
                ['आवश्यक दस्तावेज़','आवश्यक दस्तावेज़',true],
                ['मिलने वाले लाभ का विवरण','मिलने वाले लाभ का विवरण',true],
              ].map(([field,label,multi]) => (
                <div key={field}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                  {multi
                    ? <textarea rows={3} value={form[field]||''} onChange={e => setForm(f => ({...f,[field]:e.target.value}))}
                        className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"/>
                    : <input type="text" value={form[field]||''} onChange={e => setForm(f => ({...f,[field]:e.target.value}))}
                        className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"/>
                  }
                </div>
              ))}
              <button onClick={saveScheme} disabled={saving||!form['योजना का नाम']||!form['श्रेणी']}
                className="w-full bg-[#1B3A6B] text-white py-3 rounded-xl font-bold disabled:opacity-50">
                {saving ? 'सहेजा जा रहा है...' : '✅ सहेजें'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Excel Upload Modal */}
      {xlModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-5 pt-5 pb-3 border-b flex items-center justify-between">
              <h2 className="font-bold text-lg text-[#1B3A6B]">📤 Excel से योजनाएं जोड़ें</h2>
              <button onClick={() => { setXlModal(false); setXlRows([]); setXlError('') }} className="text-gray-400 text-3xl leading-none">×</button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700">
                <p className="font-bold mb-1">📋 Steps:</p>
                <p>1. पहले blank template डाउनलोड करें</p>
                <p>2. उसमें योजनाओं की जानकारी भरें</p>
                <p>3. भरी हुई file यहाँ upload करें</p>
              </div>

              <button onClick={downloadTemplate}
                className="w-full bg-[#1B3A6B] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                📥 Blank Template डाउनलोड करें
              </button>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                <p className="text-gray-500 text-sm mb-2">भरी हुई Excel file चुनें</p>
                <input ref={fileRef} type="file" accept=".xlsx,.xls" onChange={handleExcelUpload}
                  className="text-sm text-gray-600" />
              </div>

              {xlError && <p className="text-red-500 text-sm font-semibold bg-red-50 p-3 rounded-xl">{xlError}</p>}

              {xlRows.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                  <p className="text-green-700 font-bold text-sm mb-2">✅ {xlRows.length} योजनाएं मिलीं — Preview:</p>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {xlRows.map((r, i) => (
                      <div key={i} className="text-xs text-gray-600 bg-white rounded p-2 border">
                        <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full mr-1">{r['श्रेणी']}</span>
                        {r['योजना का नाम']}
                      </div>
                    ))}
                  </div>
                  <button onClick={importExcelRows} disabled={xlUploading}
                    className="w-full mt-3 bg-green-600 text-white py-3 rounded-xl font-bold disabled:opacity-50">
                    {xlUploading ? 'जोड़ा जा रहा है...' : `✅ ${xlRows.length} योजनाएं जोड़ें`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-full text-sm font-medium shadow-xl z-50 whitespace-nowrap">
          {toast}
        </div>
      )}
    </div>
  )
}
