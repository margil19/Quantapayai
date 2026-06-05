import { useState } from 'react'

const STAGES = [
  {
    id: 'workday',
    label: 'Workday HCM',
    icon: '⬡',
    tooltip: 'Source of truth — RAAS polling detects changed worker records every 15 min using an As-Of-Date filter.',
  },
  {
    id: 'sync',
    label: 'Sync Engine',
    icon: '⟳',
    tooltip: 'Manages poll cursor per customer tenant. On timeout, retries from the same cursor — no data loss.',
  },
  {
    id: 'normalize',
    label: 'Normalization Layer',
    icon: '≡',
    tooltip: 'Maps Workday XML/JSON fields to QuantapayAI canonical schema. Handles API versions v35–v42+.',
  },
  {
    id: 'trust',
    label: 'Trust Router',
    icon: '⬡',
    tooltip: 'Classifies each change by reversibility, payroll consequence, and regulatory exposure — then routes to Direct Write, Queue, or Suggest.',
  },
  {
    id: 'quantapay',
    label: 'QuantapayAI',
    icon: '◈',
    tooltip: 'Writes are idempotent — keyed on Worker_ID + event_type + effective_date. 409 Conflict = safe retry.',
  },
]

const TRIGGERS = {
  'New Hire': {
    color: 'bg-emerald-500',
    textColor: 'text-emerald-700',
    bgLight: 'bg-emerald-50 border-emerald-200',
    employee: 'Sarah Chen',
    details: [
      { stage: 'workday', value: 'Worker_ID: WD-48291 · Legal Name: Sarah Chen · Dept: Engineering · Hire Date: Jul 1 2025' },
      { stage: 'sync', value: 'Poll cursor advanced. Last-sync: 2025-06-05T09:00Z → 2025-06-05T09:15Z. Change detected.' },
      { stage: 'normalize', value: 'Mapped to canonical schema: employee_external_id, legal_first_name, employment_start_date, work_country: US' },
      { stage: 'trust', value: 'Identity fields → Direct Write. Start date → Queue for Approval. Work location (US) → Queue for Approval.' },
      { stage: 'quantapay', value: 'Identity fields written. Start date queued. Idempotency key: WD-48291:new_hire:2025-07-01' },
    ],
  },
  'Salary Change': {
    color: 'bg-amber-500',
    textColor: 'text-amber-700',
    bgLight: 'bg-amber-50 border-amber-200',
    employee: 'Marcus Lee',
    details: [
      { stage: 'workday', value: 'Worker_ID: WD-31042 · Annual_Base_Salary: "$112,000.00 USD" · Effective: Jul 1 2025' },
      { stage: 'sync', value: 'Compensation change detected. Effective date is within current payroll cycle — flagged time-sensitive.' },
      { stage: 'normalize', value: 'Parsed to: annual_salary_amount: 112000.00 · currency: USD · effective_date: 2025-07-01' },
      { stage: 'trust', value: 'Salary change → Queue for Approval. Payroll consequence: CRITICAL. Reversibility: Low.' },
      { stage: 'quantapay', value: 'Staged for HR approval. Push notification sent. SLA: approve before payroll lock Jun 25.' },
    ],
  },
  'Termination': {
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgLight: 'bg-red-50 border-red-200',
    employee: 'Jordan Park',
    details: [
      { stage: 'workday', value: 'Worker_ID: WD-22918 · Termination_Date: Jun 15 2025 · Reason: VOLUNTARY · Last day: Jun 14 2025' },
      { stage: 'sync', value: 'Termination detected. Effective date within current payroll cycle. Auto-flagged: time-sensitive. Countdown started.' },
      { stage: 'normalize', value: 'Mapped: termination_date: 2025-06-15 · termination_reason: VOLUNTARY · triggers final pay workflow' },
      { stage: 'trust', value: 'Termination → Queue for Approval (always). Irreversible. Final pay, severance, statutory obligations.' },
      { stage: 'quantapay', value: 'Staged. HR notified with payroll lock deadline. Escalation to HR Manager if no action in 48hrs.' },
    ],
  },
}

function DesignChip() {
  const [open, setOpen] = useState(false)
  return (
    <span className="inline-flex items-center gap-1">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs text-muted hover:text-primary transition-colors flex items-center gap-1 border border-gray-200 rounded-full px-2 py-0.5"
      >
        <span>ⓘ</span> Why polling, not webhooks?
      </button>
      {open && (
        <span className="block mt-2 text-xs text-muted bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 max-w-md leading-relaxed">
          Workday does not support native outbound webhooks. RAAS polling is the Workday-native approach — no customer middleware, works across all tenants, and the 15-min polling window is acceptable for payroll workflows where same-second latency is never required. EIB file drops were rejected: they add customer config burden and file-parsing fragility.
        </span>
      )}
    </span>
  )
}

export default function DataFlow() {
  const [active, setActive] = useState(null)
  const [animating, setAnimating] = useState(false)
  const [activeStage, setActiveStage] = useState(-1)
  const [tooltip, setTooltip] = useState(null)

  const trigger = (name) => {
    if (animating) return
    setActive(name)
    setAnimating(true)
    setActiveStage(0)

    const data = TRIGGERS[name]
    let step = 0
    const interval = setInterval(() => {
      step++
      if (step >= STAGES.length) {
        clearInterval(interval)
        setAnimating(false)
        setActiveStage(STAGES.length - 1)
      } else {
        setActiveStage(step)
      }
    }, 600)
  }

  const currentData = active ? TRIGGERS[active] : null

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-dark mb-1">Data Flow</h2>
        <p className="text-sm text-muted mb-2">
          QuantapayAI polls Workday RAAS every 15 minutes. Select a trigger event to animate the data packet through each integration stage.
        </p>
        <DesignChip />
      </div>

      {/* Trigger buttons */}
      <div className="flex flex-wrap gap-3">
        {Object.keys(TRIGGERS).map((name) => (
          <button
            key={name}
            onClick={() => trigger(name)}
            disabled={animating}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150 ${
              active === name
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-dark border-gray-200 hover:border-primary hover:text-primary'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {name}
          </button>
        ))}
        {active && (
          <button
            onClick={() => { setActive(null); setActiveStage(-1); setAnimating(false) }}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-muted hover:text-dark transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Pipeline */}
      <div className="relative">
        <div className="flex items-stretch gap-0 overflow-x-auto pb-2">
          {STAGES.map((stage, i) => {
            const isActive = activeStage === i
            const isPast = activeStage > i
            const detail = active && TRIGGERS[active]?.details[i]

            return (
              <div key={stage.id} className="flex items-center flex-1 min-w-0">
                <div
                  className={`flex-1 min-w-0 rounded-xl border-2 transition-all duration-500 cursor-pointer select-none ${
                    isActive
                      ? 'border-primary bg-purple-50 shadow-md shadow-primary/10 scale-[1.03]'
                      : isPast
                      ? 'border-purple-200 bg-purple-50/40'
                      : 'border-gray-200 bg-white'
                  }`}
                  onMouseEnter={() => setTooltip(stage.id)}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <div className="p-4">
                    <div className={`text-xl mb-2 transition-colors ${isActive ? 'text-primary' : isPast ? 'text-purple-400' : 'text-gray-300'}`}>
                      {stage.icon}
                    </div>
                    <div className={`text-xs font-semibold mb-1 transition-colors ${isActive ? 'text-primary' : 'text-dark'}`}>
                      {stage.label}
                    </div>
                    {tooltip === stage.id && (
                      <div className="text-xs text-muted leading-relaxed mt-1 border-t border-gray-100 pt-2">
                        {stage.tooltip}
                      </div>
                    )}
                    {isActive && detail && (
                      <div className={`text-xs mt-2 leading-relaxed px-2 py-1.5 rounded-lg border ${currentData?.bgLight} ${currentData?.textColor} font-medium`}>
                        {detail.value}
                      </div>
                    )}
                    {isPast && !isActive && detail && (
                      <div className="text-xs mt-2 text-purple-400 leading-relaxed truncate">
                        ✓ processed
                      </div>
                    )}
                  </div>
                </div>
                {i < STAGES.length - 1 && (
                  <div className={`w-8 flex-shrink-0 flex items-center justify-center transition-colors duration-500 ${
                    activeStage > i ? 'text-primary' : 'text-gray-200'
                  }`}>
                    <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
                      <path d="M0 6H20M20 6L14 1M20 6L14 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Active event summary */}
      {active && activeStage === STAGES.length - 1 && (
        <div className={`rounded-xl border p-4 ${currentData?.bgLight}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${currentData?.color} text-white`}>
              {active}
            </span>
            <span className={`text-sm font-medium ${currentData?.textColor}`}>
              {currentData?.employee} — pipeline complete
            </span>
          </div>
          <div className="space-y-1">
            {currentData?.details.map((d, i) => (
              <div key={i} className="text-xs text-gray-600 flex gap-2">
                <span className="font-medium text-gray-400 w-24 shrink-0">{STAGES[i].label}</span>
                <span>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
