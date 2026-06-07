import { useState } from 'react'

const SYNC_CARDS = [
  {
    id: 'normal',
    employee: 'Priya Nair',
    change: 'Department change - Engineering → Product',
    detail: 'Cost center updated. No payroll impact.',
    status: 'normal',
    badge: 'Clean',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    flagType: null,
    flagTitle: null,
    flagDetail: null,
    whyMatters: null,
  },
  {
    id: 'salary',
    employee: 'Marcus Lee',
    change: 'Salary update - $92,000 → $920,000',
    detail: 'Annual base compensation change, effective Jul 1 2025.',
    status: 'flagged',
    badge: 'Statistical outlier',
    badgeColor: 'bg-red-100 text-red-700',
    flagType: 'Statistical Outlier',
    flagTitle: 'This is 10x the previous salary - likely a data entry error',
    flagDetail: 'Marcus\'s salary jumped from $92,000 to $920,000. In QuantapayAI\'s data across similar roles and bands, a change this large has never been intentional - it\'s always been a typo (extra zero). The AI flagged it before it reached the approval queue.',
    whyMatters: 'If approved and paid out, this is a $828,000 overpayment in a single cycle. Recovering it requires legal action in most jurisdictions. One click on a warning dismissal prevents a catastrophic payroll error.',
  },
  {
    id: 'termination',
    employee: 'Jordan Park',
    change: 'Termination - effective Jan 15 2025',
    detail: 'Voluntary resignation. Last working day: Jan 14 2025.',
    status: 'flagged',
    badge: 'Temporal anomaly',
    badgeColor: 'bg-amber-100 text-amber-700',
    flagType: 'Temporal Anomaly',
    flagTitle: 'Retroactive termination - 78 days in the past',
    flagDetail: 'Today is April 3 2025. Jordan\'s termination date is Jan 15 - over 2 months ago. This means final pay, benefit cutoffs, and severance may need to be recalculated retroactively. This could have been a delayed HR entry or an error.',
    whyMatters: 'Processing a termination dated months in the past triggers an off-cycle payroll correction in most countries. In Germany and California it also affects statutory deadlines for final pay. HR needs to confirm this date is intentional before it goes anywhere.',
  },
]

function SyncCard({ card }) {
  const [expanded, setExpanded] = useState(false)
  const [dismissStep, setDismissStep] = useState(0)
  const [approved, setApproved] = useState(false)

  if (approved) {
    return (
      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 text-center">
        <p className="text-xs text-muted">✓ Warning dismissed - change sent to approval queue</p>
        <button onClick={() => { setApproved(false); setDismissStep(0); setExpanded(false) }} className="text-xs text-primary mt-1 hover:underline">Reset</button>
      </div>
    )
  }

  return (
    <div
      className={`border rounded-xl transition-all duration-200 ${
        card.status === 'normal'
          ? 'border-gray-200 bg-white'
          : expanded
          ? 'border-red-200 bg-red-50/20 cursor-pointer'
          : 'border-amber-200 bg-amber-50/10 cursor-pointer hover:border-amber-300'
      }`}
      onClick={() => card.status !== 'normal' && setExpanded(v => !v)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-dark">{card.employee}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${card.badgeColor}`}>{card.badge}</span>
            </div>
            <p className="text-xs text-muted">{card.change}</p>
            <p className="text-xs text-gray-400 mt-0.5">{card.detail}</p>
          </div>
          {card.status !== 'normal' && (
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-lg">⚠️</span>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded transition-colors ${expanded ? 'text-gray-400' : 'text-amber-600 bg-amber-50 border border-amber-200'}`}>
                {expanded ? '▲ close' : '▼ review'}
              </span>
            </div>
          )}
          {card.status === 'normal' && (
            <span className="text-lg shrink-0">✓</span>
          )}
        </div>

        {card.status !== 'normal' && !expanded && (
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <p className="text-xs font-semibold text-amber-800">{card.flagTitle}</p>
            <p className="text-xs text-amber-700 mt-0.5">Click to review before approving</p>
          </div>
        )}
      </div>

      {expanded && (
        <div className="border-t border-red-100 px-4 pb-4 pt-3 space-y-3" onClick={e => e.stopPropagation()}>
          <div>
            <p className="text-xs font-semibold text-dark mb-1">What was detected - {card.flagType}</p>
            <p className="text-xs text-gray-600 leading-relaxed">{card.flagDetail}</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
            <p className="text-xs font-semibold text-amber-800 mb-1">Why it matters</p>
            <p className="text-xs text-amber-700 leading-relaxed">{card.whyMatters}</p>
          </div>
          <div className="pt-1">
            {dismissStep === 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setDismissStep(1) }}
                className="text-xs border border-red-200 text-red-600 rounded-lg px-3 py-2 hover:bg-red-50 transition-colors"
              >
                Dismiss warning and approve
              </button>
            )}
            {dismissStep === 1 && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-3 space-y-2">
                <p className="text-xs font-semibold text-red-800">Are you sure? This warning exists for a reason.</p>
                <p className="text-xs text-red-700">Dismissing sends this change to the approval queue with the flag noted in the audit log.</p>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setApproved(true) }}
                    className="text-xs bg-red-600 text-white rounded-lg px-3 py-1.5 hover:bg-red-700 transition-colors"
                  >
                    Yes, I've reviewed it - approve anyway
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDismissStep(0) }}
                    className="text-xs border border-gray-200 text-muted rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Part2AnomalyDetection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-dark mb-1">Anomaly Detection</h2>
        <p className="text-sm text-muted mb-3">
          Normal validation checks that data is the right format. It doesn't check whether the data makes sense. AI fills that gap - scanning each change for statistical outliers, timing issues, and jurisdiction risks before it reaches an HR admin.
        </p>
        <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 max-w-xl">
          <span className="text-gray-400 text-xs mt-0.5 shrink-0">ⓘ</span>
          <p className="text-xs text-muted leading-relaxed">
            AI flags. It never blocks. The HR admin sees the warning and decides - a missed flag on a legitimate change is worse than an extra warning to review.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {SYNC_CARDS.map((card) => (
          <SyncCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}
