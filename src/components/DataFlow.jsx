import { useState } from 'react'

const LS_TRIGGER_HINT = 'qpai_trigger_hint_dismissed'

const STAGES = [
  {
    id: 'workday',
    label: 'Workday HCM',
    icon: '⬡',
    tooltip: 'Where all employee data lives. QuantapayAI checks Workday regularly to see if anything has changed — like a new hire, a salary update, or someone leaving.',
  },
  {
    id: 'sync',
    label: 'Sync Engine',
    icon: '⟳',
    tooltip: 'The part that keeps track of what was last checked. If something goes wrong mid-sync, it picks up exactly where it left off — nothing gets missed or double-counted.',
  },
  {
    id: 'normalize',
    label: 'Normalization Layer',
    icon: '≡',
    tooltip: 'Workday and QuantapayAI speak slightly different "languages." This layer translates the data into a standard format both systems understand — like converting a date from "July 1st 2025" to a consistent format every system can read.',
  },
  {
    id: 'trust',
    label: 'Trust Router',
    icon: '⬡',
    tooltip: 'Decides what happens next with each change. Safe, low-risk changes (like updating a job title) go through automatically. High-stakes changes (like a salary update or termination) get held for HR to review before anything is touched.',
  },
  {
    id: 'quantapay',
    label: 'QuantapayAI',
    icon: '◈',
    tooltip: 'The final destination. Approved changes land here and update payroll. If the same change is sent twice by mistake, the system recognises it and ignores the duplicate — no double entries.',
  },
]

const TRIGGERS = {
  'New Hire': {
    color: 'bg-emerald-500',
    textColor: 'text-emerald-700',
    bgLight: 'bg-emerald-50 border-emerald-200',
    employee: 'Sarah Chen',
    details: [
      { stage: 'workday', value: 'Sarah Chen joined Engineering, starting July 1 2025. Workday has her details — name, department, start date, and location.' },
      { stage: 'sync', value: 'QuantapayAI spotted the new record on its regular check. Nothing was missed — it knows exactly where it left off.' },
      { stage: 'normalize', value: "Sarah's details are translated into QuantapayAI's format — name, start date, and work country all standardised and ready to use." },
      { stage: 'trust', value: "Basic info (name, ID) goes through automatically — it's safe and easy to fix if wrong. Her start date and location need HR sign-off since they affect her first paycheck." },
      { stage: 'quantapay', value: "Sarah's profile is created. Her start date is sitting in the approval queue waiting for HR. If this somehow runs twice, the duplicate is automatically blocked." },
    ],
  },
  'Salary Change': {
    color: 'bg-amber-500',
    textColor: 'text-amber-700',
    bgLight: 'bg-amber-50 border-amber-200',
    employee: 'Marcus Lee',
    details: [
      { stage: 'workday', value: "Marcus Lee's salary was updated to $112,000, effective July 1 2025. The change is sitting in Workday waiting to be picked up." },
      { stage: 'sync', value: "QuantapayAI noticed the change on its next check. It flagged this as time-sensitive because the effective date falls within the current pay cycle." },
      { stage: 'normalize', value: "The salary is converted from the raw Workday format (\"$112,000.00 USD\") into clean numbers QuantapayAI can work with: 112000.00 in USD." },
      { stage: 'trust', value: "Salary changes always require HR approval — getting this wrong means someone is over or underpaid, which can have legal consequences in many countries." },
      { stage: 'quantapay', value: "The change is held in a queue. HR has been notified and needs to approve before the payroll deadline on Jun 25. Nothing is updated until they do." },
    ],
  },
  'Termination': {
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgLight: 'bg-red-50 border-red-200',
    employee: 'Jordan Park',
    details: [
      { stage: 'workday', value: "Jordan Park's last day is June 14 2025 — a voluntary resignation. Workday has the termination date and reason recorded." },
      { stage: 'sync', value: "QuantapayAI picked up the termination. Because it falls within the current pay period, it was immediately flagged as urgent — a clock is now ticking." },
      { stage: 'normalize', value: "The leaving date and reason are translated into QuantapayAI's format. This automatically kicks off the final pay calculation workflow." },
      { stage: 'trust', value: "Terminations always require HR approval — no exceptions. Final pay, any severance, and benefits cutoff are all on the line. This can never happen automatically." },
      { stage: 'quantapay', value: "The termination is queued for HR approval with a clear deadline. If no action is taken within 48 hours, it escalates to the HR Manager automatically." },
    ],
  },
}

function DesignChip() {
  const [open, setOpen] = useState(false)
  return (
    <span className="inline-flex flex-col gap-1">
      <button
        onClick={() => setOpen(!open)}
        className="info-pulse-target text-xs text-muted hover:text-primary transition-colors flex items-center gap-1 border border-gray-200 rounded-full px-2 py-0.5 self-start"
      >
        <span>ⓘ</span> Why does QuantapayAI check Workday on a schedule instead of getting instant alerts?
      </button>
      {open && (
        <span className="block text-xs text-muted bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 max-w-lg leading-relaxed">
          <table className="w-full text-xs border-collapse mt-1">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left pb-1.5 font-semibold text-gray-600 pr-4 w-40">Question</th>
                <th className="text-left pb-1.5 font-semibold text-gray-600">Answer</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr className="border-b border-gray-100">
                <td className="py-2.5 pr-4 font-medium text-dark align-top">Why polling?</td>
                <td className="py-2.5 align-top">Workday doesn't push data to us automatically. So we check Workday every 15 minutes and ask what changed. This is called polling. It works on every Workday tenant without any setup from the customer.</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-dark align-top">Does Workday support webhooks?</td>
                <td className="py-2.5 align-top">Yes — but only through a tool called Workday Studio, which requires a certified Workday developer on the customer's side to configure. It's not available on every tenant and varies by version. For customers who have it set up, it means near real-time updates instead of 15-minute polling. It's an upgrade, not the default.</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-3 pt-2.5 border-t border-gray-200 text-gray-500 leading-relaxed">
            BambooHR, HiBob, and Rippling support webhooks natively — they push data to us the moment something changes, with no polling needed.
          </p>
        </span>
      )}
    </span>
  )
}

export default function DataFlow({ onFirstTrigger }) {
  const [active, setActive] = useState(null)
  const [animating, setAnimating] = useState(false)
  const [activeStage, setActiveStage] = useState(-1)
  const [hoveredStage, setHoveredStage] = useState(null)
  const [triggerFiredOnce, setTriggerFiredOnce] = useState(false)

  // CHANGE 4 — trigger hint banner (first session only)
  const [showTriggerHint, setShowTriggerHint] = useState(
    () => !localStorage.getItem(LS_TRIGGER_HINT)
  )
  const dismissTriggerHint = () => {
    localStorage.setItem(LS_TRIGGER_HINT, '1')
    setShowTriggerHint(false)
  }

  const trigger = (name) => {
    if (animating) return
    if (!triggerFiredOnce && onFirstTrigger) {
      onFirstTrigger()
      setTriggerFiredOnce(true)
    }
    setActive(name)
    setAnimating(true)
    setActiveStage(0)

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
        <p className="text-sm text-muted mb-1">
          QuantapayAI checks Workday for changes on a regular schedule. Select a trigger event below to see how a change travels through the integration, step by step.
        </p>
        <p className="text-xs text-muted mb-2">
          ⓘ The check frequency (typically every 15–30 minutes) is configured per customer tenant and can be adjusted based on data volume and cost requirements.
        </p>
        <DesignChip />
      </div>

      {/* CHANGE 4 — first-visit trigger hint */}
      {showTriggerHint && (
        <div className="flex items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 -mt-2">
          <p className="text-xs text-amber-800 leading-relaxed">
            👇 <span className="font-semibold">Start here</span> — click <em>New Hire</em>, <em>Salary Change</em>, or <em>Termination</em> to watch the integration run in real time.
          </p>
          <button
            onClick={dismissTriggerHint}
            className="text-amber-400 hover:text-amber-600 transition-colors shrink-0 text-sm leading-none"
            aria-label="Dismiss hint"
          >
            ✕
          </button>
        </div>
      )}

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
      <div className="relative overflow-x-auto pb-2">
        <div className="flex items-center gap-0 min-w-[620px]">
          {STAGES.map((stage, i) => {
            const isActive     = activeStage === i && animating
            const isPast       = activeStage > i || (active && !animating && activeStage >= 0)
            const arrowLit     = activeStage > i || (active && !animating && activeStage >= 0)
            const arrowPulsing = activeStage === i && animating

            return (
              <div key={stage.id} className="flex items-center flex-1 min-w-0">

                {/* Stage box — fixed base height, expands on hover to show description */}
                <div
                  key={`${stage.id}-${active ?? 'none'}`}
                  className={`flex-1 min-w-0 rounded-xl border-2 select-none transition-colors duration-300 overflow-hidden ${
                    isActive
                      ? 'border-primary bg-purple-50'
                      : isPast
                      ? 'border-primary bg-purple-50/40'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  style={
                    isActive
                      ? { animation: 'box-glow-arrive 1s ease-out forwards' }
                      : isPast
                      ? { boxShadow: '0 0 6px 2px rgba(113,77,255,0.07)' }
                      : {}
                  }
                  onMouseEnter={() => setHoveredStage(i)}
                  onMouseLeave={() => setHoveredStage(null)}
                >
                  {/* Fixed label area — always visible, never moves */}
                  <div className="h-20 flex flex-col items-center justify-center gap-1 px-1">
                    <span className={`text-lg leading-none transition-colors duration-300 ${isActive ? 'text-primary' : isPast ? 'text-purple-400' : 'text-gray-300'}`}>
                      {stage.icon}
                    </span>
                    <span className={`text-[11px] font-semibold text-center leading-tight transition-colors duration-300 ${isActive ? 'text-primary' : 'text-dark'}`}>
                      {stage.label}
                    </span>
                  </div>
                  {/* Hover description — expands below the label */}
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${hoveredStage === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="border-t border-gray-100 mx-3 pt-2 pb-3">
                      <p className="text-[11px] text-muted leading-relaxed text-center">{stage.tooltip}</p>
                    </div>
                  </div>
                </div>

                {/* Arrow connector */}
                {i < STAGES.length - 1 && (
                  <div className="w-8 flex-shrink-0 relative flex items-center justify-center">
                    <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
                      <path
                        d="M0 6H20M20 6L14 1M20 6L14 11"
                        stroke={arrowLit ? '#714dff' : '#e5e7eb'}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ transition: 'stroke 0.3s' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none">
                      {arrowPulsing && (
                        <div
                          className="w-2 h-2 rounded-full bg-primary shrink-0"
                          style={{
                            boxShadow: '0 0 8px 3px rgba(113,77,255,0.55)',
                            animation: 'arrow-travel 0.55s linear forwards',
                          }}
                        />
                      )}
                    </div>
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
