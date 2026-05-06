'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const CATEGORIES = [
  'किसान','प्रवासी / श्रमिक','वृद्धजन','महिलाएं',
  'विधवा / निराश्रित महिलाएं','अनाथ बच्चे','दिव्यांगजन',
  'बेरोजगार युवा','पशुपालक','विद्यार्थी','मछुआरे / केवट','पारंपरिक कारीगर'
]

const BLANK_SCHEME = {
  'श्रेणी':'', 'योजना का नाम':'', 'योजना का विवरण':'',
  'पात्रता का विवरण':'', 'आवश्यक दस्तावेज़':'',
  'मिलने वाले लाभ का विवरण':'', 'कार्यदायी विभाग':''
}

export default function AdminPage() {
  const [tab, setTab]               = useState('applications')
  const [applications, setApps]     = useState([])
  const [schemes, setSchemes]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [modal, setModal]           = useState(null) // null | 'add' | scheme-object
  const [form, setForm]             = useState(BLANK_SCHEME)
  const [saving, setSaving]         = useState(false)
  const [toast, setToast]           = useState('')
  const [search, setSearch]         = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function loadAll() {
    setLoading(true)
    const [a, s] = await Promise.all([
      supabase.from('applications')
        .select('*, schemes("योजना का नाम")')
        .order('created_at', { ascending: false }),
      supabase.from('schemes').select('*').order('id')
    ])
    setApps(a.data || [])
    setSchemes(s.data || [])
    setLoading(false)
  }

  useEffect(() => { loadAll() }, [])

  // ── Save scheme (add or edit) ──
  async function saveScheme() {
    if (!form['योजना का नाम'].trim()) { showToast('⚠️ योजना का नाम आवश्यक है'); return }
    setSaving(true)
    if (modal === 'add') {
      const { error } = await supabase.from('schemes').insert([form])
      if (error) showToast('❌ Error: ' + error.message)
      else { showToast('✅ योजना जोड़ी गई'); loadAll() }
    } else {
      const { error } = await supabase.from('schemes')
        .update(form).eq('id', modal.id)
      if (error) showToast('❌ Error: ' + error.message)
      else { showToast('✅ योजना अपडेट हुई'); loadAll() }
    }
    setSaving(false)
    setModal(null)
  }

  // ── Delete scheme ──
  async function deleteScheme(id) {
    const { error } = await supabase.from('schemes').delete().eq('id', id)
    if (error) showToast('❌ Error: ' + error.message)
    else { showToast('🗑️ योजना हटाई गई'); loadAll() }
    setDeleteConfirm(null)
  }

  // ── Delete application ──
  async function deleteApp(id) {
    await supabase.from('applications').delete().eq('id', id)
    showToast('🗑️ आवेदन हटाया गया')
    loadAll()
  }

  // ── Export CSV ──
  function exportCSV() {
    const headers = ['ID','नाम','पिता का नाम','गाँव','ब्लॉक','मोबाइल','आधार','योजना','दिनांक']
    const rows = applications.map(a => [
      a.id, a['नाम'], a['पिता का नाम'], a['गाँव'], a['ब्लॉक'],
      a['मोबाइल नंबर'], a['आधार नंबर'],
      a.schemes?.['योजना का नाम'] || '',
      new Date(a.created_at).toLocaleDateString('hi-IN')
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = 'applications_' + new Date().toISOString().slice(0,10) + '.csv'
    a.click()
  }

  const filteredApps = applications.filter(a =>
    !search || [a['नाम'], a['मोबाइल नंबर'], a['गाँव'], a['ब्लॉक']]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()))
  )
  const filteredSchemes = schemes.filter(s =>
    !search || s['योजना का नाम']?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-[#1B3A6B] text-white px-4 py-4 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h1 className="font-bold text-lg">🛡️ Admin Panel</h1>
          <p className="text-blue-300 text-xs">योजना मित्र — प्रयागराज</p>
        </div>
        <a href="/" className="text-xs bg-white/20 px-3 py-1 rounded-full">← पोर्टल</a>
      </div>

      {/* Stats bar */}
      {!loading && (
        <div className="grid grid-cols-2 gap-3 px-4 py-4 max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-3xl font-bold text-[#1B3A6B]">{applications.length}</p>
            <p className="text-gray-500 text-sm mt-1">कुल आवेदन</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-3xl font-bold text-orange-500">{schemes.length}</p>
            <p className="text-gray-500 text-sm mt-1">कुल योजनाएं</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex max-w-2xl mx-auto px-4 gap-2 mb-4">
        {[['applications','📋 आवेदन'],['schemes','📁 योजनाएं']].map(([key, label]) => (
          <button key={key} onClick={() => { setTab(key); setSearch('') }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition
              ${tab === key ? 'bg-[#1B3A6B] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-10">

        {/* Search + actions */}
        <div className="flex gap-2 mb-4">
          <input
            type="text" placeholder="🔍 खोजें..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
          {tab === 'applications' && (
            <button onClick={exportCSV}
              className="bg-green-600 text-white px-3 py-2 rounded-xl text-sm font-bold whitespace-nowrap">
              ⬇ CSV
            </button>
          )}
          {tab === 'schemes' && (
            <button onClick={() => { setForm(BLANK_SCHEME); setModal('add') }}
              className="bg-orange-500 text-white px-3 py-2 rounded-xl text-sm font-bold whitespace-nowrap">
              ＋ नई
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-20 animate-pulse border border-gray-100"/>)}
          </div>

        ) : tab === 'applications' ? (
          filteredApps.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-2">📭</div>
              <p>कोई आवेदन नहीं मिला</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApps.map(a => (
                <div key={a.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-800">{a['नाम']}</p>
                      <p className="text-gray-500 text-xs">पिता: {a['पिता का नाम']}</p>
                    </div>
                    <button onClick={() => deleteApp(a.id)}
                      className="text-red-400 hover:text-red-600 text-lg">🗑</button>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                    <p>📍 {a['गाँव']}, {a['ब्लॉक']}</p>
                    <p>📞 {a['मोबाइल नंबर']}</p>
                    <p>🆔 {a['आधार नंबर']}</p>
                    <p>📅 {new Date(a.created_at).toLocaleDateString('hi-IN')}</p>
                  </div>
                  {a.schemes && (
                    <p className="mt-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg inline-block">
                      📋 {a.schemes['योजना का नाम']}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )

        ) : (
          filteredSchemes.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-2">📋</div>
              <p>कोई योजना नहीं मिली</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSchemes.map(s => (
                <div key={s.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                        {s['श्रेणी']}
                      </span>
                      <p className="font-bold text-gray-800 mt-1 leading-snug">{s['योजना का नाम']}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{s['कार्यदायी विभाग']}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => { setForm({...s}); setModal(s) }}
                        className="text-blue-500 hover:text-blue-700 text-lg">✏️</button>
                      <button
                        onClick={() => setDeleteConfirm(s.id)}
                        className="text-red-400 hover:text-red-600 text-lg">🗑</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* ── Edit/Add Modal ── */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-30 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex justify-between items-center">
              <h2 className="font-bold text-lg text-[#1B3A6B]">
                {modal === 'add' ? '＋ नई योजना जोड़ें' : 'योजना संपादित करें'}
              </h2>
              <button onClick={() => setModal(null)} className="text-gray-400 text-2xl leading-none">×</button>
            </div>
            <div className="px-5 py-4 space-y-4">

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">श्रेणी *</label>
                <select
                  value={form['श्रेणी']}
                  onChange={e => setForm(f => ({...f, 'श्रेणी': e.target.value}))}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="">-- चुनें --</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {[
                ['योजना का नाम','text'],
                ['कार्यदायी विभाग','text'],
                ['योजना का विवरण','textarea'],
                ['पात्रता का विवरण','textarea'],
                ['आवश्यक दस्तावेज़','textarea'],
                ['मिलने वाले लाभ का विवरण','textarea'],
              ].map(([field, type]) => (
                <div key={field}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{field}</label>
                  {type === 'textarea' ? (
                    <textarea rows={3}
                      value={form[field] || ''}
                      onChange={e => setForm(f => ({...f, [field]: e.target.value}))}
                      className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    />
                  ) : (
                    <input type="text"
                      value={form[field] || ''}
                      onChange={e => setForm(f => ({...f, [field]: e.target.value}))}
                      className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  )}
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)}
                  className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-bold">
                  रद्द करें
                </button>
                <button onClick={saveScheme} disabled={saving}
                  className="flex-1 bg-[#1B3A6B] text-white py-3 rounded-xl font-bold disabled:opacity-60">
                  {saving ? 'सहेज रहे हैं...' : '✅ सहेजें'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-30 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="font-bold text-gray-800 mb-2">क्या आप इस योजना को हटाना चाहते हैं?</h3>
            <p className="text-gray-500 text-sm mb-5">यह कार्य वापस नहीं होगा।</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-xl font-bold">
                रद्द करें
              </button>
              <button onClick={() => deleteScheme(deleteConfirm)}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-bold">
                हाँ, हटाएं
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-full text-sm font-medium shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  )
}
