import { useState } from 'react'

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
        className="text-xs text-muted hover:text-primary transition-colors flex items-center gap-1 border border-gray-200 rounded-full px-2 py-0.5 self-start"
      >
        <span>ⓘ</span> Why does QuantapayAI check Workday on a schedule instead of getting instant alerts?
      </button>
      {open && (
        <span className="block text-xs text-muted bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 max-w-lg leading-relaxed">
          There are three trigger paths for Workday. The table below shows all three — and why only one is a reliable baseline.
          <br /><br />
          <table className="w-full text-xs border-collapse mt-1">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left pb-1.5 font-semibold text-gray-600 pr-4">Approach</th>
                <th className="text-left pb-1.5 font-semibold text-gray-600 pr-4">How it works</th>
                <th className="text-left pb-1.5 font-semibold text-gray-600">Decision</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-dark align-top">RAAS Polling</td>
                <td className="py-2 pr-4 align-top">QuantapayAI calls Workday's API on a schedule (every 15–30 min) and pulls all records changed since the last check.</td>
                <td className="py-2 align-top"><span className="text-emerald-700 font-semibold">Selected — standard path.</span> Works on every Workday tenant with no customer configuration required.</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-dark align-top">EIB File Drop</td>
                <td className="py-2 pr-4 align-top">Customer configures Workday to export a file on a schedule. QuantapayAI ingests it.</td>
                <td className="py-2 align-top"><span className="text-amber-600 font-semibold">Fallback only.</span> Adds customer setup burden, file latency, and parsing fragility.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-dark align-top">Workday Studio Webhooks</td>
                <td className="py-2 pr-4 align-top">Workday supports event-driven integrations via Studio — enabling near real-time push notifications when records change.</td>
                <td className="py-2 align-top"><span className="text-blue-600 font-semibold">Enterprise enhancement only.</span> Requires a certified Workday developer on the customer's tenant. Not available universally — cannot be a reliable baseline.</td>
              </tr>
            </tbody>
          </table>
          <br />
          For other HR systems that <em>do</em> support webhooks natively (like BambooHR or Rippling), QuantapayAI uses event-driven flow — changes arrive in real time with no polling required.
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
        <p className="text-sm text-muted mb-1">
          QuantapayAI checks Workday for changes on a regular schedule. Select a trigger event below to see how a change travels through the integration, step by step.
        </p>
        <p className="text-xs text-muted mb-2">
          ⓘ The check frequency (typically every 15–30 minutes) is configured per customer tenant and can be adjusted based on data volume and cost requirements.
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
      <div className="relative overflow-x-auto pb-2">
        <div className="flex items-center gap-0 min-w-[700px]">
          {STAGES.map((stage, i) => {
            const isActive = activeStage === i
            const isPast = activeStage > i

            return (
              <div key={stage.id} className="flex items-center flex-1 min-w-0">
                <div
                  className={`flex-1 min-w-0 rounded-xl border-2 transition-all duration-500 cursor-pointer select-none ${
                    isActive
                      ? 'border-primary bg-purple-50 shadow-md shadow-primary/10'
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
                    {isPast && (
                      <div className="text-xs mt-1 text-purple-400">✓ processed</div>
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

      {/* Active stage detail — shown below the pipeline, never inside a box */}
      {active && activeStage >= 0 && activeStage < STAGES.length && (
        <div className={`rounded-xl border px-4 py-3 transition-all duration-300 ${currentData?.bgLight}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold ${currentData?.textColor}`}>{STAGES[activeStage].label}</span>
            {animating && <span className="text-xs text-gray-400 animate-pulse">processing…</span>}
          </div>
          <p className={`text-sm leading-relaxed ${currentData?.textColor}`}>
            {TRIGGERS[active].details[activeStage].value}
          </p>
        </div>
      )}

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
