import { useState } from 'react'

const FIELDS = [
  { workday: 'Worker_ID', quantapay: 'employee_external_id', confidence: 98, sample: 'WD-48291', status: 'auto' },
  { workday: 'Legal_Name_First', quantapay: 'legal_first_name', confidence: 97, sample: 'Sarah', status: 'auto' },
  { workday: 'Legal_Name_Last', quantapay: 'legal_last_name', confidence: 96, sample: 'Chen', status: 'auto' },
  { workday: 'Hire_Date', quantapay: 'employment_start_date', confidence: 94, sample: '2025-07-01', status: 'auto' },
  { workday: 'Annual_Base_Salary', quantapay: 'annual_salary_amount', confidence: 88, sample: '$112,000.00 USD', status: 'suggested' },
  { workday: 'Worker_Type', quantapay: 'employment_classification', confidence: 79, sample: 'Employee', status: 'suggested' },
  { workday: 'Work_Location_Country', quantapay: 'work_country', confidence: 72, sample: 'United States', status: 'suggested' },
  { workday: 'Termination_Date', quantapay: 'termination_date', confidence: 55, sample: '—', status: 'flagged' },
  { workday: 'Cost_Center_Reference', quantapay: 'cost_center_id', confidence: 41, sample: 'CC-1042-ENG', status: 'flagged' },
  { workday: 'Custom_Attr_EOR_Flag', quantapay: null, confidence: 0, sample: 'TRUE', status: 'unknown' },
]

const MANUAL_FIELDS = [
  'Worker_ID', 'Legal_Name_First', 'Legal_Name_Last', 'Hire_Date',
  'Annual_Base_Salary', 'Worker_Type', 'Work_Location_Country',
  'Termination_Date', 'Cost_Center_Reference', 'Custom_Attr_EOR_Flag',
]

const OVERRIDE_OPTIONS = ['termination_date', 'employment_end_date', 'last_working_day', '— skip this field —']
const OVERRIDE_OPTIONS_CC = ['cost_center_id', 'department_name', 'cost_allocation_code', '— skip this field —']

function confidenceBadge(score, status) {
  if (status === 'unknown') return { bg: 'bg-red-100 text-red-700', label: 'No match' }
  if (score >= 90) return { bg: 'bg-emerald-100 text-emerald-700', label: `${score}%` }
  if (score >= 60) return { bg: 'bg-amber-100 text-amber-700', label: `${score}%` }
  return { bg: 'bg-red-100 text-red-700', label: `${score}%` }
}

function rowBorder(status, overridden) {
  if (overridden) return 'border-l-4 border-l-primary bg-purple-50/30'
  if (status === 'auto') return 'border-l-4 border-l-emerald-400'
  if (status === 'suggested') return 'border-l-4 border-l-amber-400'
  if (status === 'flagged') return 'border-l-4 border-l-red-300'
  return 'border-l-4 border-l-red-500 bg-red-50/20'
}

export default function Part2FieldMapping({ onFirstCardClick }) {
  const [overrides, setOverrides] = useState({})
  const [confirmed, setConfirmed] = useState(false)
  const [manualStep, setManualStep] = useState(0)
  const [showManual, setShowManual] = useState(true)
  const [callbackFired, setCallbackFired] = useState(false)

  const fireCallback = () => {
    if (!callbackFired && onFirstCardClick) {
      onFirstCardClick()
      setCallbackFired(true)
    }
  }

  const handleOverride = (fieldName, value) => {
    setOverrides(prev => ({ ...prev, [fieldName]: value }))
  }

  if (confirmed) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl">✓</div>
        <h3 className="text-lg font-semibold text-dark">Mapping confirmed</h3>
        <p className="text-sm text-muted max-w-md">
          9 fields mapped, 1 skipped. Dry-run sync will validate against 10 sample employee records before go-live.
        </p>
        <button onClick={() => { setConfirmed(false); setOverrides({}) }} className="text-xs text-primary border border-primary/30 rounded-lg px-3 py-1.5 hover:bg-purple-50 transition-colors">
          Reset demo
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-dark mb-1">Intelligent Field Mapping</h2>
        <p className="text-sm text-muted mb-3">
          Without AI, an HR admin manually connects every Workday field to QuantapayAI — a 2–4 hour process that's easy to get wrong. With AI, the mapping is pre-filled with confidence scores. The admin reviews and confirms, not builds from scratch.
        </p>
        <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 max-w-xl">
          <span className="text-gray-400 text-xs mt-0.5 shrink-0">ⓘ</span>
          <p className="text-xs text-muted leading-relaxed">
            AI suggests based on field names, sample values, and patterns from similar Workday tenants. The HR admin confirms before anything goes live — even high-confidence fields.
          </p>
        </div>
      </div>

      {/* Before / After toggle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* BEFORE */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Without AI</span>
              <p className="text-sm font-medium text-dark mt-0.5">Manual mapping — field by field</p>
            </div>
            <span className="text-xs text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">2–4 hrs</span>
          </div>
          <div className="p-4 space-y-2">
            {MANUAL_FIELDS.map((field, i) => {
              const done = i < manualStep
              const active = i === manualStep
              return (
                <div key={field} className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-xs transition-all ${done ? 'border-gray-100 bg-gray-50 text-gray-400' : active ? 'border-primary/40 bg-purple-50' : 'border-gray-100 text-gray-300'}`}>
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${done ? 'bg-gray-300 border-gray-300 text-white' : active ? 'border-primary' : 'border-gray-200'}`}>
                    {done ? '✓' : ''}
                  </span>
                  <span className="font-mono">{field}</span>
                  {active && (
                    <span className="ml-auto">
                      <select className="text-xs border border-gray-200 rounded px-1 py-0.5 text-dark" defaultValue="">
                        <option value="">Select field…</option>
                        <option>employee_external_id</option>
                        <option>legal_first_name</option>
                        <option>annual_salary_amount</option>
                      </select>
                    </span>
                  )}
                </div>
              )
            })}
            {manualStep < MANUAL_FIELDS.length ? (
              <button
                onClick={() => { setManualStep(s => s + 1); fireCallback() }}
                className="w-full mt-2 text-xs text-gray-500 border border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition-colors"
              >
                Map next field ({manualStep}/{MANUAL_FIELDS.length} done)
              </button>
            ) : (
              <div className="mt-2 space-y-2">
                <div className="w-full text-xs text-center text-gray-400 border border-gray-100 rounded-lg py-2 bg-gray-50">
                  All fields mapped — 2 hrs 47 min later
                </div>
                <button
                  onClick={() => setManualStep(0)}
                  className="w-full text-xs text-muted border border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>

        {/* AFTER */}
        <div className="border border-primary/30 rounded-2xl overflow-hidden">
          <div className="bg-purple-50 border-b border-primary/20 px-4 py-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">With AI</span>
              <p className="text-sm font-medium text-dark mt-0.5">Pre-filled — review and confirm</p>
            </div>
            <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">15–20 min</span>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3 text-xs text-muted mb-3 px-1">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"/> Auto-confirmed (&gt;90%)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block"/> Needs review (60–90%)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block"/> Flag (&lt;60%)</span>
            </div>
            <div className="space-y-1.5">
              {FIELDS.map((f) => {
                const badge = confidenceBadge(f.confidence, f.status)
                const isOverridden = overrides[f.workday] !== undefined
                const borderCls = rowBorder(f.status, isOverridden)
                return (
                  <div key={f.workday} className={`rounded-lg border border-gray-100 px-3 py-2 ${borderCls}`}>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-gray-700 w-44 shrink-0 truncate">{f.workday}</span>
                      <span className="text-gray-300 shrink-0">→</span>
                      {f.status === 'unknown' ? (
                        <select
                          className="flex-1 text-xs border border-red-200 rounded px-1.5 py-0.5 text-dark bg-white"
                          onChange={(e) => handleOverride(f.workday, e.target.value)}
                          defaultValue=""
                        >
                          <option value="">Select mapping…</option>
                          <option>eor_flag</option>
                          <option>custom_attribute_1</option>
                          <option>— skip this field —</option>
                        </select>
                      ) : f.status === 'flagged' ? (
                        <select
                          className="flex-1 text-xs border border-red-200 rounded px-1.5 py-0.5 text-dark bg-white"
                          onChange={(e) => handleOverride(f.workday, e.target.value)}
                          defaultValue={f.quantapay || ''}
                        >
                          {(f.workday === 'Termination_Date' ? OVERRIDE_OPTIONS : OVERRIDE_OPTIONS_CC).map(o => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      ) : isOverridden ? (
                        <span className="flex-1 font-mono text-primary text-xs">{overrides[f.workday]}</span>
                      ) : (
                        <span
                          className="flex-1 font-mono text-gray-600 text-xs cursor-pointer hover:text-primary hover:underline"
                          onClick={() => handleOverride(f.workday, f.quantapay + ' (edited)')}
                          title="Click to override"
                        >{f.quantapay}</span>
                      )}
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0 ${badge.bg}`}>{badge.label}</span>
                    </div>
                    {f.sample && f.sample !== '—' && (
                      <p className="text-xs text-gray-400 mt-0.5 ml-0 pl-0">Sample: <span className="font-mono">{f.sample}</span></p>
                    )}
                  </div>
                )
              })}
            </div>
            <button
              onClick={() => setConfirmed(true)}
              className="w-full mt-4 bg-primary text-white text-sm font-medium rounded-xl py-2.5 hover:bg-primary/90 transition-colors"
            >
              Confirm Mapping
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
