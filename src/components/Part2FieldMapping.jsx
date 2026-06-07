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

const MANUAL_FIELDS_SIMPLE = [
  { name: 'Worker_ID',              done: true  },
  { name: 'Legal_Name_First',       done: true  },
  { name: 'Legal_Name_Last',        done: true  },
  { name: 'Hire_Date',              done: false, dropdownKey: 'hire_date'   },
  { name: 'Annual_Base_Salary',     done: false, dropdownKey: 'salary'      },
  { name: 'Worker_Type',            done: false, dropdownKey: 'worker_type' },
  { name: 'Work_Location_Country',  done: false },
  { name: 'Termination_Date',       done: false },
  { name: 'Cost_Center_Reference',  done: false },
  { name: 'Custom_Attr_EOR_Flag',   done: false },
]

const PAINFUL_DROPDOWNS = {
  salary: [
    '— select a field —',
    'Total_Comp_Package',
    'Base_Salary_Annual',
    'Comp_Grade_Amount',
    'Hourly_Billing_Rate',
    'Bonus_Target_USD',
    'Salary_Band_Midpoint',
    'Annual_Salary_Amount',
  ],
  hire_date: [
    '— select a field —',
    'Onboarding_Start_Date',
    'Contract_Effective_Date',
    'Employment_Start_Date',
    'Position_Fill_Date',
    'Probation_Start_Date',
    'Benefits_Eligibility_Date',
  ],
  worker_type: [
    '— select a field —',
    'Employment_Classification',
    'Contingent_Worker_Subtype',
    'Worker_Category_Code',
    'Engagement_Type',
    'Contract_Type',
    'Resource_Type',
    'Worker_Status',
  ],
}

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
  const [confirmedFlash, setConfirmedFlash] = useState(false)
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

  const handleConfirmMapping = () => {
    setConfirmedFlash(true)
    setTimeout(() => setConfirmedFlash(false), 2000)
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
          <div className="p-4 space-y-1.5">
            {MANUAL_FIELDS_SIMPLE.map((field) => (
              <div
                key={field.name}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-xs ${field.done ? 'border-gray-100 bg-gray-50 text-gray-400' : 'border-gray-200 bg-white text-dark'}`}
              >
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 text-[10px] ${field.done ? 'bg-gray-300 border-gray-300 text-white' : 'border-gray-300'}`}>
                  {field.done ? '✓' : ''}
                </span>
                <span className="font-mono flex-1">{field.name}</span>
                {field.dropdownKey ? (
                  <select
                    className="text-xs border border-gray-300 rounded px-1.5 py-1 text-dark bg-white max-w-[180px] truncate"
                    defaultValue=""
                    onChange={fireCallback}
                  >
                    {PAINFUL_DROPDOWNS[field.dropdownKey].map((o, i) => (
                      <option key={o} value={i === 0 ? '' : o}>{o}</option>
                    ))}
                  </select>
                ) : !field.done ? (
                  <span className="text-gray-300 text-xs italic">not started</span>
                ) : null}
              </div>
            ))}
          </div>
          <p className="px-4 pb-4 text-xs text-gray-400 leading-relaxed">
            An admin mapping 40 fields like this takes 2–4 hours — and one wrong pick corrupts every sync that follows.
          </p>
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
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted mb-3 px-1">
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
                    <div className="flex items-center gap-2 text-xs min-w-0">
                      <span className="font-mono text-gray-700 w-32 shrink-0 truncate">{f.workday}</span>
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
              onClick={handleConfirmMapping}
              disabled={confirmedFlash}
              className={`w-full mt-4 text-sm font-medium rounded-xl py-2.5 transition-all duration-300 ${
                confirmedFlash
                  ? 'bg-emerald-500 text-white'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              {confirmedFlash ? '✓ Mapping confirmed' : 'Confirm Mapping'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
