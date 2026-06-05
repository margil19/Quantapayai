import { useState } from 'react'

const ROWS = [
  {
    id: 'worker_id',
    workday: 'Worker_ID',
    mapsTo: 'employee_external_id',
    confidence: 98,
    status: 'auto',
    sample: 'WD-48291',
    locked: false,
    blockingGoLive: false,
  },
  {
    id: 'legal_name',
    workday: 'Legal_Name_First',
    mapsTo: 'legal_first_name',
    confidence: 97,
    sample: 'Sarah',
    status: 'auto',
    locked: false,
    blockingGoLive: false,
  },
  {
    id: 'hire_date',
    workday: 'Hire_Date',
    mapsTo: 'employment_start_date',
    confidence: 95,
    sample: '2025-03-15',
    status: 'auto',
    locked: false,
    blockingGoLive: false,
  },
  {
    id: 'salary',
    workday: 'Annual_Base_Salary',
    mapsTo: 'annual_salary_amount',
    confidence: 88,
    sample: '$92,000.00 USD',
    status: 'warning',
    locked: false,
    blockingGoLive: false,
    warningTitle: 'Format mismatch',
    warningDetail: 'Workday sends this field as formatted text (e.g. "$92,000.00 USD"). QuantapayAI expects a plain number (92000.00). We\'ll convert it automatically — confirm in preview that the conversion looks right.',
    workdaySent: '"$92,000.00 USD"',
    quantapayWillStore: '92000.00  (currency: USD)',
  },
  {
    id: 'worker_type',
    workday: 'Contingent_Worker_Type',
    mapsTo: '',
    confidence: 61,
    sample: 'CONTINGENT_SUBTYPE_A',
    status: 'amber',
    locked: false,
    blockingGoLive: false,
    options: ['employment_classification', 'worker_type', 'employment_subtype', '— skip this field —'],
  },
  {
    id: 'reg_class',
    workday: 'Custom_Reg_Classification',
    mapsTo: '',
    confidence: 0,
    sample: 'REG_CLASS_EU_1',
    status: 'red',
    locked: false,
    blockingGoLive: false,
    options: ['regulatory_classification', 'compliance_code', 'custom_attribute_1', '— skip this field —'],
  },
  {
    id: 'schedule',
    workday: 'Work_Schedule_Code',
    mapsTo: '',
    confidence: 0,
    sample: '—',
    status: 'blocked',
    locked: false,
    blockingGoLive: true,
    blockedReason: 'Required for payroll — no matching Workday field found. Contact your Workday admin to add this field before going live.',
  },
  {
    id: 'pay_group',
    workday: 'Pay_Group_Reference',
    mapsTo: '',
    confidence: 0,
    sample: 'PG-US-SEMI',
    status: 'red',
    locked: false,
    blockingGoLive: false,
    options: ['pay_group_id', 'payroll_schedule', 'pay_frequency', '— skip this field —'],
  },
  {
    id: 'national_id',
    workday: 'National_ID',
    mapsTo: 'tax_identification_number',
    confidence: 99,
    sample: '***-**-****',
    status: 'locked',
    locked: true,
    blockingGoLive: false,
  },
  {
    id: 'bank',
    workday: 'Bank_Account',
    mapsTo: '— not synced from Workday',
    confidence: null,
    sample: '***',
    status: 'locked',
    locked: true,
    blockingGoLive: false,
  },
]

function statusStyle(status) {
  if (status === 'auto') return { row: 'border-l-4 border-l-emerald-400 bg-white', badge: 'bg-emerald-100 text-emerald-700', label: 'Auto-confirmed' }
  if (status === 'warning') return { row: 'border-l-4 border-l-amber-400 bg-amber-50/30', badge: 'bg-amber-100 text-amber-700', label: 'Needs review' }
  if (status === 'amber') return { row: 'border-l-4 border-l-amber-400 bg-white', badge: 'bg-amber-100 text-amber-700', label: 'Needs review' }
  if (status === 'red') return { row: 'border-l-4 border-l-red-400 bg-white', badge: 'bg-red-100 text-red-700', label: 'Unmapped' }
  if (status === 'blocked') return { row: 'border-l-4 border-l-red-600 bg-red-50/30', badge: 'bg-red-600 text-white', label: 'Blocking' }
  if (status === 'locked') return { row: 'bg-gray-50 border-l-4 border-l-gray-200', badge: 'bg-gray-100 text-gray-500', label: 'PII — locked' }
  return { row: 'bg-white', badge: 'bg-gray-100 text-gray-500', label: '' }
}

function FieldRow({ row }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(row.mapsTo || '')
  const [confirmed, setConfirmed] = useState(false)
  const s = statusStyle(row.status)
  const isClickable = ['warning', 'amber', 'red'].includes(row.status)

  return (
    <>
      <tr
        className={`border-b border-gray-100 transition-colors ${s.row} ${isClickable ? 'cursor-pointer hover:brightness-[0.98]' : ''}`}
        onClick={() => isClickable && setOpen(v => !v)}
      >
        <td className="px-4 py-3">
          <span className="text-xs font-mono text-dark">{row.workday}</span>
          {row.blockingGoLive && <span className="ml-2 text-xs text-red-600 font-semibold">⛔</span>}
          {row.locked && <span className="ml-2 text-gray-400">🔒</span>}
        </td>
        <td className="px-4 py-3">
          {row.locked ? (
            <span className="text-xs font-mono text-gray-400 italic">{row.mapsTo}</span>
          ) : confirmed && selected ? (
            <span className="text-xs font-mono text-primary font-medium">{selected}</span>
          ) : row.status === 'auto' ? (
            <span className="text-xs font-mono text-gray-600">{row.mapsTo}</span>
          ) : (
            <span className="text-xs text-gray-400 italic">{selected || '— select mapping'}</span>
          )}
        </td>
        <td className="px-4 py-3">
          {row.confidence !== null ? (
            <span className={`text-xs font-medium ${row.confidence >= 90 ? 'text-emerald-600' : row.confidence >= 60 ? 'text-amber-600' : 'text-red-500'}`}>
              {row.confidence > 0 ? `${row.confidence}%` : '—'}
            </span>
          ) : (
            <span className="text-xs text-gray-300">N/A</span>
          )}
        </td>
        <td className="px-4 py-3">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.badge}`}>{s.label}</span>
        </td>
        <td className="px-4 py-3 text-xs font-mono text-gray-400">{row.sample}</td>
      </tr>

      {/* Expanded inline panel */}
      {open && (
        <tr className="border-b border-amber-100 bg-amber-50/40">
          <td colSpan={5} className="px-4 py-4" onClick={e => e.stopPropagation()}>
            {row.status === 'warning' && (
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-amber-800 mb-1">{row.warningTitle}</p>
                  <p className="text-xs text-amber-700 leading-relaxed">{row.warningDetail}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-amber-200 rounded-lg px-3 py-2">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Workday sends</p>
                    <p className="text-sm font-mono text-dark">{row.workdaySent}</p>
                  </div>
                  <div className="bg-white border border-emerald-200 rounded-lg px-3 py-2">
                    <p className="text-xs font-semibold text-gray-500 mb-1">QuantapayAI will store</p>
                    <p className="text-sm font-mono text-dark">{row.quantapayWillStore}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setConfirmed(true); setOpen(false) }}
                  className="text-xs bg-amber-600 text-white rounded-lg px-3 py-1.5 hover:bg-amber-700 transition-colors"
                >
                  Understood — confirm this conversion
                </button>
              </div>
            )}

            {(row.status === 'amber' || row.status === 'red') && (
              <div className="flex items-center gap-3">
                <p className="text-xs text-gray-600 shrink-0">Select the correct field in QuantapayAI:</p>
                <select
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-dark bg-white flex-1 max-w-xs"
                  value={selected}
                  onChange={e => setSelected(e.target.value)}
                >
                  <option value="">— choose mapping —</option>
                  {row.options.map(o => <option key={o}>{o}</option>)}
                </select>
                <button
                  onClick={() => { setConfirmed(true); setOpen(false) }}
                  disabled={!selected}
                  className="text-xs bg-primary text-white rounded-lg px-3 py-1.5 hover:bg-primary/90 transition-colors disabled:opacity-40"
                >
                  Confirm
                </button>
              </div>
            )}

            {row.status === 'blocked' && (
              <div className="flex items-start gap-2">
                <span className="text-red-500 shrink-0">⛔</span>
                <div>
                  <p className="text-xs font-semibold text-red-700 mb-1">Cannot be skipped</p>
                  <p className="text-xs text-red-600 leading-relaxed">{row.blockedReason}</p>
                </div>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  )
}

export default function Part4FieldMapping() {
  const [savedLater, setSavedLater] = useState(false)
  const hasBlocking = ROWS.some(r => r.blockingGoLive)

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 max-w-xl">
        <span className="text-gray-400 text-xs mt-0.5 shrink-0">ⓘ</span>
        <p className="text-xs text-muted leading-relaxed">
          "Go Live" is intentionally absent from this screen. It only appears after the admin has previewed the mapping against real employee data — preventing misconfigured fields from going live silently. Blocking rows (⛔) cannot be skipped: they stay red until resolved.
        </p>
      </div>

      <div className="bg-[#f5f6fa] rounded-2xl overflow-hidden border border-gray-200 shadow-sm">

        {/* Mock product nav */}
        <div className="bg-[#0f172a] px-6 py-3 flex items-center gap-2">
          <span className="text-white text-sm font-semibold">QuantapayAI</span>
          <span className="text-slate-500 text-sm">|</span>
          <span className="text-slate-400 text-sm">Setup</span>
          <span className="text-slate-500 text-sm">|</span>
          <span className="text-slate-300 text-sm font-medium">Step 2 of 3: Map Your Fields</span>
        </div>

        {/* Status summary bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-6 flex-wrap">
          <span className="text-xs flex items-center gap-1.5">
            <span className="text-emerald-600 font-semibold">✓</span>
            <span className="text-dark font-medium">34 fields mapped automatically</span>
          </span>
          <span className="text-xs flex items-center gap-1.5">
            <span className="text-amber-500 font-semibold">⚠</span>
            <span className="text-dark font-medium">4 fields need review</span>
          </span>
          <span className="text-xs flex items-center gap-1.5">
            <span className="text-red-600 font-semibold">✕</span>
            <span className="text-dark font-medium">2 fields unmapped</span>
          </span>
          {hasBlocking && (
            <span className="ml-auto text-xs bg-red-50 border border-red-200 text-red-700 px-2.5 py-1 rounded-full font-medium">
              ⛔ 1 blocking issue — Go Live unavailable
            </span>
          )}
        </div>

        {/* Legend */}
        <div className="px-6 pt-3 pb-1 flex items-center gap-4 flex-wrap">
          {[
            { color: 'bg-emerald-400', label: 'Auto-confirmed (>90%)' },
            { color: 'bg-amber-400', label: 'Needs review (60–90%)' },
            { color: 'bg-red-400', label: 'Unmapped' },
            { color: 'bg-red-600', label: 'Blocking' },
            { color: 'bg-gray-300', label: 'PII — locked 🔒' },
          ].map(l => (
            <span key={l.label} className="flex items-center gap-1.5 text-xs text-muted">
              <span className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
              {l.label}
            </span>
          ))}
        </div>

        {/* Table */}
        <div className="px-6 pb-2 overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-200">
                {['Workday Field', 'Maps to in QuantapayAI', 'Confidence', 'Status', 'Sample Value'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-muted px-4 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(row => <FieldRow key={row.id} row={row} />)}
            </tbody>
          </table>
        </div>

        {/* Bottom actions */}
        <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between flex-wrap gap-3">
          <button className="text-sm text-muted border border-gray-200 rounded-xl px-4 py-2.5 hover:bg-gray-50 transition-colors">
            ← Back
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            {savedLater ? (
              <span className="text-xs text-emerald-600 font-medium">✓ Progress saved</span>
            ) : (
              <button
                onClick={() => setSavedLater(true)}
                className="text-sm text-muted border border-gray-200 rounded-xl px-4 py-2.5 hover:bg-gray-50 transition-colors"
              >
                Save and continue later
              </button>
            )}
            <button className="text-sm font-semibold rounded-xl px-5 py-2.5 transition-colors bg-blue-600 text-white hover:bg-blue-700">
              Preview with real data →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
